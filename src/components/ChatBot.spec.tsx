import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChatBot } from "./ChatBot";

describe("ChatBot", () => {
	it("初期状態ではフローティングボタンのみ表示される", () => {
		render(<ChatBot />);
		expect(
			screen.getByRole("button", { name: /チャットを開く/ }),
		).toBeDefined();
		expect(screen.queryByRole("dialog")).toBeNull();
	});

	it("ボタンクリックでパネルが開く", async () => {
		const user = (await import("@testing-library/dom")).fireEvent;
		render(<ChatBot />);

		const button = screen.getByRole("button", { name: /チャットを開く/ });
		user.click(button);

		expect(screen.getByRole("dialog")).toBeDefined();
	});

	it("Prompt API 非対応ブラウザでは案内が表示される", async () => {
		const user = (await import("@testing-library/dom")).fireEvent;
		const fetchMock = vi.fn(() =>
			Promise.resolve({
				ok: true,
				json: () => Promise.resolve([]),
			} as Response),
		);
		vi.stubGlobal("fetch", fetchMock);

		render(<ChatBot />);
		const button = screen.getByRole("button", { name: /チャットを開く/ });
		user.click(button);

		const banner = await screen.findByText(/Prompt API が利用できません/);
		expect(banner).toBeDefined();

		vi.unstubAllGlobals();
	});
});
