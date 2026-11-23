import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostSummary } from "@/types";
import { PostList } from "./PostList";

const onSelectTag = vi.fn<(tag: string) => void>();

vi.mock("@tanstack/react-router", () => ({
	Link: ({
		children,
		to,
		params,
		className,
	}: {
		children: React.ReactNode;
		to: string;
		params?: { _splat?: string };
		className?: string;
	}) => (
		<a href={to.replace("$", params?._splat ?? "")} className={className}>
			{children}
		</a>
	),
}));

function renderPostList(
	props: Partial<React.ComponentProps<typeof PostList>> = {},
) {
	return render(
		<PostList
			posts={mockPosts}
			tags={mockTags}
			selectedTag=""
			onSelectTag={onSelectTag}
			{...props}
		/>,
	);
}

const mockPosts: PostSummary[] = [
	{
		title: "技術記事1",
		date: "2024-05-05",
		tags: ["技術", "React"],
		path: "/2024/05/05/tech-post-1",
		slug: "2024/05/05/tech-post-1",
		formattedDate: "2024年5月5日",
	},
	{
		title: "投資記事",
		date: "2024-05-06",
		tags: ["投資"],
		path: "/2024/05/06/invest-post",
		slug: "2024/05/06/invest-post",
		formattedDate: "2024年5月6日",
	},
	{
		title: "技術記事2",
		date: "2024-05-07",
		tags: ["技術", "Vue"],
		path: "/2024/05/07/tech-post-2",
		slug: "2024/05/07/tech-post-2",
		formattedDate: "2024年5月7日",
	},
];

const mockTags = ["技術", "React", "Vue", "投資"];

describe("PostList", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("すべての記事が表示される", () => {
		renderPostList();

		expect(screen.getByText("技術記事1")).not.toBeNull();
		expect(screen.getByText("投資記事")).not.toBeNull();
		expect(screen.getByText("技術記事2")).not.toBeNull();
	});

	it("Allチップと各タグチップが表示される", () => {
		renderPostList();

		expect(screen.getByRole("button", { name: /All/ })).not.toBeNull();
		for (const t of mockTags) {
			expect(
				screen.getByRole("button", { name: new RegExp(t) }),
			).not.toBeNull();
		}
	});

	it("タグチップをクリックすると、そのタグが選択される", () => {
		renderPostList();

		fireEvent.click(screen.getByRole("button", { name: /技術/ }));

		expect(onSelectTag).toHaveBeenCalledTimes(1);
		expect(onSelectTag).toHaveBeenCalledWith("技術");
	});

	it("選択中のタグチップをクリックすると、選択が解除される", () => {
		renderPostList({ selectedTag: "技術" });

		fireEvent.click(screen.getByRole("button", { name: /技術/ }));

		expect(onSelectTag).toHaveBeenCalledWith("");
	});

	it("Allチップをクリックすると、選択が解除される", () => {
		renderPostList({ selectedTag: "技術" });

		fireEvent.click(screen.getByRole("button", { name: /All/ }));

		expect(onSelectTag).toHaveBeenCalledWith("");
	});

	it("選択中のタグを持つ記事だけが表示される", () => {
		renderPostList({ selectedTag: "投資" });

		expect(screen.getByText("投資記事")).not.toBeNull();
		expect(screen.queryByText("技術記事1")).toBeNull();
		expect(screen.queryByText("技術記事2")).toBeNull();
	});

	it("記事のリンクが正しいパスを持つ", () => {
		renderPostList();

		const link = screen.getByRole("link", { name: /技術記事1/ });
		expect(link.getAttribute("href")).toBe("/posts/2024/05/05/tech-post-1");
	});

	it("記事が日付の新しい順に並ぶ", () => {
		// frontmatter の date は Date として渡ってくる。曜日が異なる日付で並びを確認する
		const posts: PostSummary[] = [
			["1月25日", new Date("2026-01-25")],
			["11月7日", new Date("2026-11-07")],
			["1月1日", new Date("2026-01-01")],
			["8月19日", new Date("2026-08-19")],
			["文字列の日付", "2026-05-05"],
		].map(([title, date], i) => ({
			title: title as string,
			date,
			path: `/2026/post-${i}`,
			slug: `2026/post-${i}`,
			formattedDate: "",
		}));

		renderPostList({ posts, tags: [] });

		const titles = screen
			.getAllByRole("heading", { level: 3 })
			.map((h) => h.textContent);
		expect(titles).toEqual([
			"11月7日",
			"8月19日",
			"文字列の日付",
			"1月25日",
			"1月1日",
		]);
	});

	it("空の記事リストの場合はNo entriesが表示される", () => {
		renderPostList({ posts: [], tags: [] });

		expect(screen.getByText("No entries.")).not.toBeNull();
	});

	it("タグがない記事も表示される", () => {
		const postsWithoutTags: PostSummary[] = [
			{
				title: "タグなし記事",
				date: "2024-05-08",
				path: "/2024/05/08/no-tags",
				slug: "2024/05/08/no-tags",
				formattedDate: "2024年5月8日",
			},
		];

		renderPostList({ posts: postsWithoutTags, tags: [] });

		expect(screen.getByText("タグなし記事")).not.toBeNull();
	});
});
