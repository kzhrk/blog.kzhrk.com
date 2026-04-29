export type LanguageModelAvailability =
	| "unavailable"
	| "downloadable"
	| "downloading"
	| "available";

export interface LanguageModelMessage {
	role: "system" | "user" | "assistant";
	content: string;
}

export interface LanguageModelMonitor extends EventTarget {
	addEventListener(
		type: "downloadprogress",
		listener: (event: { loaded: number }) => void,
	): void;
}

export interface LanguageModelCreateOptions {
	initialPrompts?: LanguageModelMessage[];
	monitor?: (monitor: LanguageModelMonitor) => void;
	signal?: AbortSignal;
	temperature?: number;
	topK?: number;
	expectedInputs?: Array<{ type: string; languages?: string[] }>;
	expectedOutputs?: Array<{ type: string; languages?: string[] }>;
}

export interface LanguageModelPromptOptions {
	signal?: AbortSignal;
}

export interface LanguageModelSession {
	prompt(input: string, options?: LanguageModelPromptOptions): Promise<string>;
	promptStreaming(
		input: string,
		options?: LanguageModelPromptOptions,
	): ReadableStream<string>;
	clone(): Promise<LanguageModelSession>;
	destroy(): void;
	readonly inputUsage: number;
	readonly inputQuota: number;
}

export interface LanguageModelStatic {
	availability(options?: {
		expectedInputs?: Array<{ type: string; languages?: string[] }>;
		expectedOutputs?: Array<{ type: string; languages?: string[] }>;
	}): Promise<LanguageModelAvailability>;
	create(options?: LanguageModelCreateOptions): Promise<LanguageModelSession>;
}

declare global {
	interface Window {
		LanguageModel?: LanguageModelStatic;
	}
}
