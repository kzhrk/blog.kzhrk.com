import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostSummary } from "@/types";
import { PostList } from "./PostList";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
	useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		className,
	}: {
		children: React.ReactNode;
		href: string;
		className?: string;
	}) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

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
		render(<PostList posts={mockPosts} tags={mockTags} />);

		expect(screen.getByText("技術記事1")).not.toBeNull();
		expect(screen.getByText("投資記事")).not.toBeNull();
		expect(screen.getByText("技術記事2")).not.toBeNull();
	});

	it("Allチップと各タグチップが表示される", () => {
		render(<PostList posts={mockPosts} tags={mockTags} />);

		expect(screen.getByRole("button", { name: /All/ })).not.toBeNull();
		for (const t of mockTags) {
			expect(
				screen.getByRole("button", { name: new RegExp(t) }),
			).not.toBeNull();
		}
	});

	it("タグチップをクリックするとURLが更新される", () => {
		render(<PostList posts={mockPosts} tags={mockTags} />);

		const chip = screen.getByRole("button", { name: /技術/ });
		fireEvent.click(chip);

		expect(mockPush).toHaveBeenCalledTimes(1);
		const calledUrl = mockPush.mock.calls[0][0] as string;
		expect(calledUrl.startsWith("/?")).toBe(true);
		const params = new URLSearchParams(calledUrl.replace("/?", ""));
		expect(params.get("tag")).toBe("技術");
	});

	it("Allチップをクリックするとクエリが空のURLになる", () => {
		render(<PostList posts={mockPosts} tags={mockTags} />);

		const all = screen.getByRole("button", { name: /All/ });
		fireEvent.click(all);

		expect(mockPush).toHaveBeenCalledWith("/");
	});

	it("記事のリンクが正しいパスを持つ", () => {
		render(<PostList posts={mockPosts} tags={mockTags} />);

		const link = screen.getByRole("link", { name: /技術記事1/ });
		expect(link.getAttribute("href")).toBe("/posts/2024/05/05/tech-post-1");
	});

	it("空の記事リストの場合はNo entriesが表示される", () => {
		render(<PostList posts={[]} tags={[]} />);

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

		render(<PostList posts={postsWithoutTags} tags={[]} />);

		expect(screen.getByText("タグなし記事")).not.toBeNull();
	});
});
