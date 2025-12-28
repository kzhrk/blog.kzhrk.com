import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	env: {
		SITE_URL: "https://blog.kzhrk.com",
	},
};

export default nextConfig;
