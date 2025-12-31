import type { Metadata } from "next";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { css } from "../../styled-system/css";
import "highlight.js/styles/github-dark.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "blog.kzhrk.com",
	description: "kzhrk のブログ。プログラミングとか料理とか映像作品とか。",
	openGraph: {
		title: "blog.kzhrk.com",
		description: "kzhrk のブログ。プログラミングとか料理とか映像作品とか。",
		url: "https://blog.kzhrk.com/",
		siteName: "blog.kzhrk.com",
		type: "website",
		images: [
			{
				url: "https://blog.kzhrk.com/images/ogp.png",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "blog.kzhrk.com",
		images: ["https://blog.kzhrk.com/images/ogp.png"],
	},
	icons: {
		icon: "/favicon.png",
		shortcut: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<head>
				<link rel="preconnect" href="https://www.googletagmanager.com" />
				<Script id="gtm" strategy="afterInteractive">
					{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
					new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
					j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
					'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
					})(window,document,'script','dataLayer','GTM-5WPKT2H7');`}
				</Script>
				<Script
					src="https://platform.twitter.com/widgets.js"
					strategy="lazyOnload"
				/>
			</head>
			<body>
				<noscript>
					<iframe
						src="https://www.googletagmanager.com/ns.html?id=GTM-5WPKT2H7"
						height="0"
						width="0"
						style={{ display: "none", visibility: "hidden" }}
						title="GTM"
					/>
				</noscript>
				<Header />
				<main className={css({ width: "auto", sm: { width: "10/12" }, mx: "auto" })}>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
