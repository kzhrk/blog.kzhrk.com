import type {
	LanguageModelAvailability,
	LanguageModelCreateOptions,
	LanguageModelSession,
	LanguageModelStatic,
} from "@/types/prompt-api";

function getLanguageModel(): LanguageModelStatic | null {
	if (typeof window === "undefined") return null;
	return window.LanguageModel ?? null;
}

export function isLanguageModelSupported(): boolean {
	return getLanguageModel() !== null;
}

export async function getAvailability(): Promise<LanguageModelAvailability> {
	const model = getLanguageModel();
	if (!model) return "unavailable";
	return model.availability({
		expectedInputs: [{ type: "text", languages: ["ja", "en"] }],
		expectedOutputs: [{ type: "text", languages: ["ja"] }],
	});
}

export interface CreateSessionOptions extends LanguageModelCreateOptions {
	onDownloadProgress?: (loaded: number) => void;
}

export async function createSession(
	options: CreateSessionOptions = {},
): Promise<LanguageModelSession> {
	const model = getLanguageModel();
	if (!model) {
		throw new Error("Prompt API is not supported in this browser.");
	}

	const { onDownloadProgress, monitor, ...rest } = options;

	return model.create({
		...rest,
		expectedInputs: rest.expectedInputs ?? [
			{ type: "text", languages: ["ja", "en"] },
		],
		expectedOutputs: rest.expectedOutputs ?? [
			{ type: "text", languages: ["ja"] },
		],
		monitor: (m) => {
			monitor?.(m);
			if (onDownloadProgress) {
				m.addEventListener("downloadprogress", (event) => {
					onDownloadProgress(event.loaded);
				});
			}
		},
	});
}

export async function* streamPrompt(
	session: LanguageModelSession,
	input: string,
	signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
	const stream = session.promptStreaming(input, { signal });
	const reader = stream.getReader();
	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) return;
			if (value) yield value;
		}
	} finally {
		reader.releaseLock();
	}
}
