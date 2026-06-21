"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatbotCorpusEntry } from "@/lib/chatbotCorpus";
import { renderChatbotMarkdown } from "@/lib/chatbotMarkdown";
import { buildInitialPrompts } from "@/lib/chatbotPrompt";
import { searchPosts } from "@/lib/chatbotSearch";
import {
	createSession,
	getAvailability,
	isLanguageModelSupported,
	streamPrompt,
} from "@/lib/promptApi";
import type { LanguageModelAvailability } from "@/types/prompt-api";

type Status =
	| { type: "idle" }
	| { type: "loading-context" }
	| { type: "unsupported" }
	| { type: "checking" }
	| { type: "needs-download" }
	| { type: "downloading"; progress: number }
	| { type: "ready" }
	| { type: "thinking" }
	| { type: "error"; message: string };

interface ChatMessage {
	id: string;
	role: "user" | "assistant";
	content: string;
	sources?: ChatbotCorpusEntry[];
}

const CONTEXT_URL = "/chatbot-context.json";

function generateId(): string {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function ChatBot() {
	const [open, setOpen] = useState(false);
	const [status, setStatus] = useState<Status>({ type: "idle" });
	const [corpus, setCorpus] = useState<ChatbotCorpusEntry[] | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const abortRef = useRef<AbortController | null>(null);
	const logRef = useRef<HTMLDivElement>(null);

	const initialize = useCallback(async () => {
		if (!isLanguageModelSupported()) {
			setStatus({ type: "unsupported" });
			return;
		}

		setStatus({ type: "loading-context" });
		try {
			const res = await fetch(CONTEXT_URL);
			if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
			const data = (await res.json()) as ChatbotCorpusEntry[];
			setCorpus(data);
		} catch (error) {
			setStatus({
				type: "error",
				message: `記事データの読み込みに失敗しました: ${(error as Error).message}`,
			});
			return;
		}

		setStatus({ type: "checking" });
		try {
			const availability: LanguageModelAvailability = await getAvailability();
			if (availability === "unavailable") {
				setStatus({ type: "unsupported" });
			} else if (availability === "available") {
				setStatus({ type: "ready" });
			} else {
				setStatus({ type: "needs-download" });
			}
		} catch (error) {
			setStatus({
				type: "error",
				message: `モデル状態の取得に失敗しました: ${(error as Error).message}`,
			});
		}
	}, []);

	useEffect(() => {
		if (open && status.type === "idle") {
			initialize();
		}
	}, [open, status.type, initialize]);

	useEffect(() => {
		if (logRef.current) {
			logRef.current.scrollTop = logRef.current.scrollHeight;
		}
	}, []);

	const startDownload = useCallback(async () => {
		setStatus({ type: "downloading", progress: 0 });
		try {
			const session = await createSession({
				initialPrompts: [
					{ role: "system", content: "ダウンロード確認用のセッションです。" },
				],
				onDownloadProgress: (loaded) => {
					setStatus({ type: "downloading", progress: loaded });
				},
			});
			session.destroy();
			setStatus({ type: "ready" });
		} catch (error) {
			setStatus({
				type: "error",
				message: `モデルの準備に失敗しました: ${(error as Error).message}`,
			});
		}
	}, []);

	const sendMessage = useCallback(async () => {
		const trimmed = input.trim();
		if (!trimmed || !corpus) return;

		const userMessage: ChatMessage = {
			id: generateId(),
			role: "user",
			content: trimmed,
		};
		const assistantMessage: ChatMessage = {
			id: generateId(),
			role: "assistant",
			content: "",
		};
		setMessages((prev) => [...prev, userMessage, assistantMessage]);
		setInput("");
		setStatus({ type: "thinking" });

		const controller = new AbortController();
		abortRef.current = controller;

		try {
			const related = searchPosts(trimmed, corpus, 3);
			setMessages((prev) =>
				prev.map((m) =>
					m.id === assistantMessage.id ? { ...m, sources: related } : m,
				),
			);
			const initialPrompts = buildInitialPrompts(corpus, related);
			const session = await createSession({
				initialPrompts,
				signal: controller.signal,
			});

			try {
				let acc = "";
				for await (const chunk of streamPrompt(
					session,
					trimmed,
					controller.signal,
				)) {
					acc += chunk;
					setMessages((prev) =>
						prev.map((m) =>
							m.id === assistantMessage.id ? { ...m, content: acc } : m,
						),
					);
				}
			} finally {
				session.destroy();
			}

			setStatus({ type: "ready" });
		} catch (error) {
			if (controller.signal.aborted) {
				setStatus({ type: "ready" });
				return;
			}
			setStatus({
				type: "error",
				message: `回答の生成に失敗しました: ${(error as Error).message}`,
			});
		} finally {
			abortRef.current = null;
		}
	}, [input, corpus]);

	const stopGeneration = useCallback(() => {
		abortRef.current?.abort();
	}, []);

	const isThinking = status.type === "thinking";
	const canSend =
		status.type === "ready" && input.trim().length > 0 && corpus !== null;

	return (
		<>
			<button
				type="button"
				className="chatbot-fab"
				aria-label={open ? "チャットを閉じる" : "チャットを開く"}
				aria-expanded={open}
				onClick={() => setOpen((v) => !v)}
			>
				{open ? "✕" : "💬"}
			</button>

			{open && (
				<div
					className="chatbot-panel"
					role="dialog"
					aria-label="ブログ チャットボット"
				>
					<header className="chatbot-panel__head">
						<div>
							<h2 className="chatbot-panel__title">Ask kzhrk's blog</h2>
							<p className="chatbot-panel__sub">
								Chrome の Prompt API でローカル動作 / 記事の内容を元に回答します
							</p>
						</div>
					</header>

					<div className="chatbot-panel__log" ref={logRef} aria-live="polite">
						{messages.length === 0 && (
							<p className="chatbot-panel__hint">
								例:「NISA についてどんな記事がありますか?」「Hugo から Nuxt
								に置き換えた理由は?」
							</p>
						)}
						{messages.map((m) => (
							<div key={m.id} className={`chatbot-msg chatbot-msg--${m.role}`}>
								<span className="chatbot-msg__role">
									{m.role === "user" ? "you" : "assistant"}
								</span>
								{m.role === "assistant" ? (
									m.content ? (
										<div
											className="chatbot-msg__body chatbot-md"
											// biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is generated from markdown
											dangerouslySetInnerHTML={{
												__html: renderChatbotMarkdown(m.content),
											}}
										/>
									) : (
										<p className="chatbot-msg__body">
											{isThinking ? "..." : ""}
										</p>
									)
								) : (
									<p className="chatbot-msg__body">{m.content}</p>
								)}
								{m.role === "assistant" &&
									m.sources &&
									m.sources.length > 0 && (
										<ul className="chatbot-sources" aria-label="参照記事">
											{m.sources.map((src) => (
												<li key={src.slug} className="chatbot-sources__item">
													<a
														href={`/posts${src.path}`}
														className="chatbot-sources__link"
														target="_blank"
														rel="noopener noreferrer"
													>
														<span className="chatbot-sources__title">
															{src.title}
														</span>
														<span className="chatbot-sources__date">
															{src.formattedDate}
														</span>
													</a>
												</li>
											))}
										</ul>
									)}
							</div>
						))}
					</div>

					<StatusBanner
						status={status}
						onDownload={startDownload}
						onStop={stopGeneration}
					/>

					<form
						className="chatbot-panel__form"
						onSubmit={(e) => {
							e.preventDefault();
							if (canSend) sendMessage();
						}}
					>
						<textarea
							className="chatbot-panel__input"
							placeholder="記事について質問してみる…"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => {
								if (e.nativeEvent.isComposing) return;
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									if (canSend) sendMessage();
								}
							}}
							disabled={status.type !== "ready"}
							rows={2}
						/>
						<button
							type="submit"
							className="chatbot-panel__send"
							disabled={!canSend}
						>
							送信
						</button>
					</form>
				</div>
			)}
		</>
	);
}

function StatusBanner({
	status,
	onDownload,
	onStop,
}: {
	status: Status;
	onDownload: () => void;
	onStop: () => void;
}) {
	switch (status.type) {
		case "idle":
		case "ready":
			return null;
		case "loading-context":
			return (
				<div className="chatbot-banner">記事データを読み込んでいます…</div>
			);
		case "unsupported":
			return (
				<div className="chatbot-banner chatbot-banner--warn">
					このブラウザでは Prompt API が利用できません。Chrome 138 以降 (
					デスクトップ) でお試しください。
				</div>
			);
		case "checking":
			return (
				<div className="chatbot-banner">モデルの状態を確認しています…</div>
			);
		case "needs-download":
			return (
				<div className="chatbot-banner">
					モデル (Gemini Nano) のダウンロードが必要です。
					<button
						type="button"
						className="chatbot-banner__action"
						onClick={onDownload}
					>
						ダウンロード開始
					</button>
				</div>
			);
		case "downloading": {
			const pct = Math.round(status.progress * 100);
			return (
				<div className="chatbot-banner">モデルをダウンロード中… {pct}%</div>
			);
		}
		case "thinking":
			return (
				<div className="chatbot-banner">
					回答を生成しています…
					<button
						type="button"
						className="chatbot-banner__action"
						onClick={onStop}
					>
						停止
					</button>
				</div>
			);
		case "error":
			return (
				<div className="chatbot-banner chatbot-banner--error">
					{status.message}
				</div>
			);
	}
}
