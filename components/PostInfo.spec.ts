import { type VueWrapper, shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Target from "./PostInfo.vue";

describe("components/PostInfo.vue", () => {
	let wrapper: VueWrapper;

	beforeEach(() => {
		wrapper = shallowMount(Target, {
			props: {
				tags: [],
				date: "2020-10-10",
			},
		});
	});
	describe("表示", () => {
		it("日付がフォーマットされていること", async () => {
			await wrapper.setProps({
				date: "2020-01-01",
			});
			expect(wrapper.find("time").text()).toBe("2020年1月1日");
		});
	});
});
