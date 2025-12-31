import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PostInfo } from "./PostInfo";

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
	}: { children: React.ReactNode; href: string }) => (
		<a href={href}>{children}</a>
	),
}));

describe("PostInfo", () => {
	describe("日付表示", () => {
		it("フォーマットされた日付が表示される", () => {
			render(
				<PostInfo
					date="2024-05-05"
					formattedDate="2024年5月5日"
					tags={["技術"]}
				/>,
			);

			expect(screen.getByText("2024年5月5日")).toBeInTheDocument();
		});

		it("time要素にdateTime属性が設定される（文字列の場合）", () => {
			render(
				<PostInfo date="2024-05-05" formattedDate="2024年5月5日" tags={[]} />,
			);

			const timeElement = screen.getByText("2024年5月5日");
			expect(timeElement).toHaveAttribute("datetime", "2024-05-05");
		});

		it("time要素にdateTime属性が設定される（Dateオブジェクトの場合）", () => {
			const dateObj = new Date("2024-05-05T00:00:00Z");
			render(
				<PostInfo date={dateObj} formattedDate="2024年5月5日" tags={[]} />,
			);

			const timeElement = screen.getByText("2024年5月5日");
			expect(timeElement).toHaveAttribute("datetime", "2024-05-05");
		});
	});

	describe("タグ表示", () => {
		it("タグがリンクとして表示される", () => {
			render(
				<PostInfo
					date="2024-05-05"
					formattedDate="2024年5月5日"
					tags={["技術", "React"]}
				/>,
			);

			expect(screen.getByRole("link", { name: "技術" })).toBeInTheDocument();
			expect(screen.getByRole("link", { name: "React" })).toBeInTheDocument();
		});

		it("タグリンクの href が正しい", () => {
			render(
				<PostInfo
					date="2024-05-05"
					formattedDate="2024年5月5日"
					tags={["技術"]}
				/>,
			);

			const tagLink = screen.getByRole("link", { name: "技術" });
			expect(tagLink).toHaveAttribute("href", "/?tag=技術");
		});

		it("タグが空配列の場合はリストが表示されない", () => {
			render(
				<PostInfo date="2024-05-05" formattedDate="2024年5月5日" tags={[]} />,
			);

			expect(screen.queryByRole("list")).not.toBeInTheDocument();
		});

		it("tagsがundefinedの場合はリストが表示されない", () => {
			render(
				<PostInfo date="2024-05-05" formattedDate="2024年5月5日" />,
			);

			expect(screen.queryByRole("list")).not.toBeInTheDocument();
		});

		it("複数のタグがすべて表示される", () => {
			const tags = ["技術", "React", "TypeScript", "Next.js"];
			render(
				<PostInfo date="2024-05-05" formattedDate="2024年5月5日" tags={tags} />,
			);

			const listItems = screen.getAllByRole("listitem");
			expect(listItems).toHaveLength(4);
		});
	});
});
