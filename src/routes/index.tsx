import {
	createFileRoute,
	useHydrated,
	useNavigate,
} from "@tanstack/react-router";
import { PostList } from "@/components/PostList";
import { SITE_URL } from "@/lib/constants";
import { fetchPostIndex } from "@/lib/posts.functions";

interface HomeSearch {
	tag?: string;
}

export const Route = createFileRoute("/")({
	// search params は JSON として解釈されるため、`?tag=2024` のような値は数値になる。
	// タグは常に文字列として扱う。
	validateSearch: (search: Record<string, unknown>): HomeSearch => {
		const { tag } = search;
		if (tag === undefined || tag === null || tag === "") return {};
		return { tag: String(tag) };
	},
	loader: () => fetchPostIndex(),
	head: () => ({
		links: [{ rel: "canonical", href: SITE_URL }],
	}),
	component: HomePage,
});

function HomePage() {
	const { posts, tags } = Route.useLoaderData();
	const { tag } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	// プリレンダリングした index.html は絞り込みなしの一覧を持つ。
	// `/?tag=…` を直接開いたときにハイドレーションが不一致にならないよう、
	// 絞り込みはハイドレーション後に適用する。
	const hydrated = useHydrated();

	return (
		<PostList
			posts={posts}
			tags={tags}
			selectedTag={hydrated ? (tag ?? "") : ""}
			onSelectTag={(next) => navigate({ search: next ? { tag: next } : {} })}
		/>
	);
}
