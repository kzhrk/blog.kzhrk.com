import { useEffect, useMemo, useRef } from "react";
import styles from "./TweetButton.module.css";

interface TweetButtonProps {
	url: string;
	text: string;
}

declare global {
	interface Window {
		twttr?: {
			widgets?: {
				load: (element?: HTMLElement) => void;
			};
		};
	}
}

function escapeAttribute(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

export function TweetButton({ url, text }: TweetButtonProps) {
	const tweetUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
	const rootRef = useRef<HTMLDivElement | null>(null);

	// widgets.js は twitter-share-button クラスを持つリンクを iframe に置き換える。
	// React が管理する要素を置き換えられると DOM と食い違うため、リンクは HTML 文字列として
	// 埋め込み、React の管理対象はラッパーの div だけにする。
	//
	// React は dangerouslySetInnerHTML のオブジェクトが変わると innerHTML を書き直す。
	// 再レンダーのたびに変換済みのボタンが消えないよう、内容が同じ間は同じオブジェクトを渡す。
	const innerHtml = useMemo(
		() => ({
			__html: `<a class="twitter-share-button" href="${escapeAttribute(tweetUrl)}">Tweet</a>`,
		}),
		[tweetUrl],
	);

	useEffect(() => {
		// widgets.js の読み込みが済んでいれば、このラッパーの中を変換する。
		// まだ読み込まれていない場合は、読み込み完了時に widgets.js が文書全体を変換する。
		if (rootRef.current !== null) {
			window.twttr?.widgets?.load(rootRef.current);
		}
	}, [innerHtml]);

	return (
		<div
			ref={rootRef}
			className={styles.root}
			// widgets.js がハイドレーションより先にリンクを置き換えることがある
			suppressHydrationWarning
			dangerouslySetInnerHTML={innerHtml}
		/>
	);
}
