import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TweetButton } from "./TweetButton";

const props = {
	url: "https://blog.kzhrk.com/posts/2026/11/07/example",
	text: "記事 & タイトル",
};

describe("TweetButton", () => {
	afterEach(() => {
		delete window.twttr;
	});

	it("widgets.js が変換できるクラスとツイート用の URL を持つリンクを描画する", () => {
		render(<TweetButton {...props} />);

		const link = screen.getByRole("link", { name: "Tweet" });
		expect(link.classList.contains("twitter-share-button")).toBe(true);

		const href = new URL(link.getAttribute("href") ?? "");
		expect(href.origin + href.pathname).toBe(
			"https://twitter.com/intent/tweet",
		);
		expect(href.searchParams.get("url")).toBe(props.url);
		expect(href.searchParams.get("text")).toBe(props.text);
	});

	it("widgets.js が読み込み済みなら、リンクを含むラッパーを渡して変換を依頼する", () => {
		const load = vi.fn<(element?: HTMLElement) => void>();
		window.twttr = { widgets: { load } };

		render(<TweetButton {...props} />);

		expect(load).toHaveBeenCalledTimes(1);
		const wrapper = load.mock.calls[0][0];
		expect(wrapper?.querySelector("a.twitter-share-button")).not.toBeNull();
	});

	it("widgets.js が未読み込みでもエラーにならない", () => {
		expect(() => render(<TweetButton {...props} />)).not.toThrow();
	});

	it("同じ内容で再レンダーしても、変換済みのボタンを書き直さない", () => {
		const load = vi.fn<(element?: HTMLElement) => void>();
		window.twttr = { widgets: { load } };

		const { rerender, container } = render(<TweetButton {...props} />);
		// widgets.js がリンクを iframe に置き換えた状態を再現する
		const wrapper = container.firstElementChild as HTMLElement;
		wrapper.innerHTML = '<iframe title="X Post Button"></iframe>';

		rerender(<TweetButton {...props} />);

		expect(wrapper.querySelector("iframe")).not.toBeNull();
		expect(load).toHaveBeenCalledTimes(1);
	});

	it("記事が変わると、新しいリンクで変換を依頼し直す", () => {
		const load = vi.fn<(element?: HTMLElement) => void>();
		window.twttr = { widgets: { load } };

		const { rerender } = render(<TweetButton {...props} />);
		rerender(<TweetButton {...props} text="別の記事" />);

		expect(load).toHaveBeenCalledTimes(2);
		const link = screen.getByRole("link", { name: "Tweet" });
		expect(
			new URL(link.getAttribute("href") ?? "").searchParams.get("text"),
		).toBe("別の記事");
	});
});
