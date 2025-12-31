"use client";

import Link from "next/link";
import { css } from "../../styled-system/css";

export function Footer() {
	return (
		<footer className={css({ px: "6", py: "8", sm: { px: "12", py: "16" } })} style={{ backgroundColor: "rgb(229 231 235)" }}>
			<style jsx>{`
				footer {
					background-color: rgb(229 231 235);
				}
				@media (prefers-color-scheme: dark) {
					footer {
						background-color: rgb(31 41 55);
					}
				}
			`}</style>
			<div className={css({ width: "auto", sm: { width: "10/12" }, mx: "auto" })}>
				<h2 className={css({ fontSize: "xl", fontWeight: "bold" })}>Author</h2>
				<div className={css({ mt: "4", display: "flex", alignItems: "center" })}>
					<p className={css({ mr: "2" })}>kzhrk</p>
					<a
						href="https://twitter.com/kzhrk0430"
						className="twitter-follow-button"
						data-show-screen-name="true"
					>
						Follow @kzhrk0430
					</a>
				</div>
				<p className={css({ mt: "2" })}>
					フロントエンドエンジニア。ブラウザというアプリケーションを使い倒して全ての人類に等しく情報を伝えることを生きがいにしている。
				</p>
			</div>
			<p className={css({ mt: "16", fontSize: "sm", textAlign: "center" })}>
				&copy; 2014{" "}
				<Link className="link" href="/">
					kzhrk
				</Link>
			</p>
		</footer>
	);
}
