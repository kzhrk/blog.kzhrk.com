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

type Role = "source" | "destination";

const FIELD_WEIGHT = { title: 3, description: 2, tags: 2, body: 1 };
const ROLE_WEIGHT = 6;
// 英数字の語句と、その直後の助詞。「Next.js 15 (App Router) に」のような補足の括弧は読み飛ばす
const ROLE_RE = /([a-z0-9][a-z0-9 ._-]*?)\s*(?:\([^)]*\)\s*)?(から|へ|に)/g;

/**
 * 「A から B に移行した」の A と B を取り出す。
 * 単語の一致だけでは移行元と移行先を区別できないため、助詞から役割を判定する。
 * 対象は英数字の語句だけで、数字だけの語（バージョン番号など）は除く。
 */
export function extractRoles(text: string): Map<string, Set<Role>> {
	const roles = new Map<string, Set<Role>>();
	for (const match of text.toLowerCase().matchAll(ROLE_RE)) {
		const role: Role = match[2] === "から" ? "source" : "destination";
		for (const term of match[1].split(/[^a-z0-9_]+/)) {
			if (!term || /^\d+$/.test(term)) continue;
			const found = roles.get(term) ?? new Set<Role>();
			found.add(role);
			roles.set(term, found);
		}
	}
	return roles;
}

interface IndexedEntry {
	entry: ChatbotCorpusEntry;
	title: string;
	description: string;
	tags: string[];
	body: string;
	roles: Map<string, Set<Role>>;
}

function indexEntry(entry: ChatbotCorpusEntry): IndexedEntry {
	return {
		entry,
		title: entry.title.toLowerCase(),
		description: entry.description.toLowerCase(),
		tags: entry.tags.map((t) => t.toLowerCase()),
		body: entry.body.toLowerCase(),
		roles: extractRoles(`${entry.title}\n${entry.description}`),
	};
}

function fieldScore(doc: IndexedEntry, token: string): number {
	let score = 0;
	if (doc.title.includes(token)) score += FIELD_WEIGHT.title;
	if (doc.description.includes(token)) score += FIELD_WEIGHT.description;
	if (doc.tags.some((t) => t.includes(token))) score += FIELD_WEIGHT.tags;
	if (doc.body.includes(token)) score += FIELD_WEIGHT.body;
	return score;
}

/**
 * 同じ役割で登場していれば加点し、逆の役割でしか登場していなければ減点する。
 * 「Next.js に移行した話」で「Next.js から移行した」記事が上に来るのを防ぐ。
 */
function roleScore(
	queryRoles: Set<Role> | undefined,
	docRoles: Set<Role> | undefined,
): number {
	if (!queryRoles || !docRoles) return 0;
	for (const role of queryRoles) {
		if (docRoles.has(role)) return ROLE_WEIGHT;
	}
	return -ROLE_WEIGHT;
}

export function scorePosts(
	query: string,
	corpus: ChatbotCorpusEntry[],
): ScoredEntry[] {
	const tokens = tokenize(query);
	if (tokens.length === 0) return [];

	const docs = corpus.map(indexEntry);
	const queryRoles = extractRoles(query);

	// 多くの記事に出てくる語（「ブログ」「移行」など）ほど重みを下げる
	const weighted = tokens.map((token) => {
		const scores = docs.map((doc) => fieldScore(doc, token));
		const matched = scores.filter((score) => score > 0).length;
		const idf = matched === 0 ? 0 : Math.log(1 + docs.length / matched);
		return { token, scores, idf };
	});

	const scored: ScoredEntry[] = [];
	docs.forEach((doc, index) => {
		let score = 0;
		let matched = false;
		for (const { token, scores, idf } of weighted) {
			if (scores[index] === 0) continue;
			matched = true;
			score +=
				idf *
				(scores[index] +
					roleScore(queryRoles.get(token), doc.roles.get(token)));
		}
		if (matched) scored.push({ entry: doc.entry, score });
	});

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
