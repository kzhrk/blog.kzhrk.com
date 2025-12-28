import type { OpenNextConfig } from "@opennextjs/cloudflare";

const config: OpenNextConfig = {
	default: {
		override: {
			wrapper: "cloudflare-node",
			converter: "edge",
			proxyExternalRequest: "fetch",
			incrementalCache: () =>
				import(
					"@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache"
				).then((m) => m.default),
			tagCache: () =>
				import(
					"@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache"
				).then((m) => m.default),
			queue: "direct",
		},
	},
	edgeExternals: ["node:crypto"],
	middleware: {
		external: true,
		override: {
			wrapper: "cloudflare-edge",
			converter: "edge",
			proxyExternalRequest: "fetch",
			incrementalCache: () =>
				import(
					"@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache"
				).then((m) => m.default),
			tagCache: () =>
				import(
					"@opennextjs/cloudflare/overrides/tag-cache/kv-next-tag-cache"
				).then((m) => m.default),
			queue: "direct",
		},
	},
};

export default config;
