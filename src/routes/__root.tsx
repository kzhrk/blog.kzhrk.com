/// <reference types="vite/client" />
import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ChatBot } from "@/components/ChatBot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import { ErrorPage } from "@/pages/ErrorPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import "highlight.js/styles/github-dark.css";
import "@/styles/globals.css";

const GTM_ID = "GTM-5WPKT2H7";
const OGP_IMAGE = `${SITE_URL}/images/ogp.png`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: SITE_NAME },
			{ name: "description", content: SITE_DESCRIPTION },
			{ property: "og:title", content: SITE_NAME },
			{ property: "og:description", content: SITE_DESCRIPTION },
			{ property: "og:url", content: `${SITE_URL}/` },
			{ property: "og:site_name", content: SITE_NAME },
			{ property: "og:type", content: "website" },
			{ property: "og:image", content: OGP_IMAGE },
			{ name: "twitter:card", content: "summary_large_image" },
			{ name: "twitter:title", content: SITE_NAME },
			{ name: "twitter:image", content: OGP_IMAGE },
		],
		links: [
			{ rel: "icon", href: "/favicon.png" },
			{ rel: "shortcut icon", href: "/favicon.png" },
			{ rel: "preconnect", href: "https://www.googletagmanager.com" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Noto+Sans+JP:wght@400;500;600;700&display=swap",
			},
		],
		scripts: [
			{
				children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
			},
			{ src: "https://platform.twitter.com/widgets.js", async: true },
		],
	}),
	shellComponent: RootDocument,
	component: Outlet,
	notFoundComponent: NotFoundPage,
	errorComponent: ErrorPage,
});

function RootDocument({ children }: { children: ReactNode }) {
	return (
		<html lang="ja">
			<head>
				<HeadContent />
			</head>
			<body>
				<noscript>
					<iframe
						src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
						title="GTM"
					/>
				</noscript>
				<Header />
				{children}
				<Footer />
				{/* <Outlet /> の外に置くことで、クライアント遷移をまたいで会話と開閉状態を保つ */}
				<ChatBot />
				<Scripts />
			</body>
		</html>
	);
}
