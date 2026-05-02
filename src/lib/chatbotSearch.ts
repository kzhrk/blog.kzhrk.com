import type { ChatbotCorpusEntry } from "./chatbotCorpus";

const PUNCTUATION_RE = /[、。!?「」『』,.?!()[\]【】〈〉《》"“”‘’:;…\-—~・]+/g;
const ASCII_TOKEN_RE = /^[a-z0-9_-]+$/i;
const STOP_TOKENS = new Set([
	"の",
	"は",
	"が",
	"を",
	"に",
	"で",
	"と",
	"へ",
	"も",
	"や",
	"か",
	"な",
	"だ",
	"です",
	"ます",
	"する",
	"した",
	"いる",
	"ある",
	"こと",
	"もの",
	"これ",
	"それ",
	"あれ",
	"どれ",
	"this",
	"that",
	"the",
	"a",
	"an",
	"is",
	"are",
	"was",
	"were",
]);

function splitByCharClass(segment: string): string[] {
	const parts: string[] = [];
	let buf = "";
	let kind: "alnum" | "other" | null = null;
	for (const char of segment) {
		const next: "alnum" | "other" = /[a-z0-9_-]/i.test(char)
			? "alnum"
			: "other";
		if (kind === null || kind === next) {
			buf += char;
			kind = next;
		} else {
			if (buf) parts.push(buf);
			buf = char;
			kind = next;
		}
	}
	if (buf) parts.push(buf);
	return parts;
}

export function tokenize(query: string): string[] {
	const cleaned = query.toLowerCase().replace(PUNCTUATION_RE, " ").trim();
	if (!cleaned) return [];

	const tokens = new Set<string>();
	for (const rawSegment of cleaned.split(/\s+/)) {
		if (!rawSegment) continue;

		for (const segment of splitByCharClass(rawSegment)) {
			if (!segment) continue;
			if (STOP_TOKENS.has(segment)) continue;

			if (ASCII_TOKEN_RE.test(segment)) {
				tokens.add(segment);
				continue;
			}

			if (segment.length <= 3) {
				tokens.add(segment);
				continue;
			}

			for (let i = 0; i <= segment.length - 2; i++) {
				const bigram = segment.slice(i, i + 2);
				if (!STOP_TOKENS.has(bigram)) tokens.add(bigram);
			}
		}
	}

	return [...tokens];
}

export interface ScoredEntry {
	entry: ChatbotCorpusEntry;
	score: number;
}

export function scorePosts(
	query: string,
	corpus: ChatbotCorpusEntry[],
): ScoredEntry[] {
	const tokens = tokenize(query);
	if (tokens.length === 0) return [];

	const scored: ScoredEntry[] = [];
	for (const entry of corpus) {
		const title = entry.title.toLowerCase();
		const description = entry.description.toLowerCase();
		const tags = entry.tags.map((t) => t.toLowerCase());
		const body = entry.body.toLowerCase();

		let score = 0;
		for (const token of tokens) {
			if (title.includes(token)) score += 3;
			if (description.includes(token)) score += 2;
			if (tags.some((t) => t.includes(token))) score += 2;
			if (body.includes(token)) score += 1;
		}

		if (score > 0) scored.push({ entry, score });
	}

	scored.sort((a, b) => b.score - a.score);
	return scored;
}

export function searchPosts(
	query: string,
	corpus: ChatbotCorpusEntry[],
	topN = 3,
): ChatbotCorpusEntry[] {
	return scorePosts(query, corpus)
		.slice(0, topN)
		.map((s) => s.entry);
}
