import type { Metadata } from "next";
import Image from "next/image";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { css } from "@/styled-system/css";

export const metadata: Metadata = {
	title: `相互リンク | ${SITE_NAME}`,
	description: "相互リンク募集中です。リンク一覧もこちらからご覧いただけます。",
	alternates: {
		canonical: `${SITE_URL}/links`,
	},
};

interface LinkItem {
	name: string;
	url: string;
	banner: string;
	description: string;
}

const links: LinkItem[] = [
	// 相互リンク先をここに追加
	// {
	// 	name: "サイト名",
	// 	url: "https://example.com",
	// 	banner: "/images/banners/example.png",
	// 	description: "サイトの説明",
	// },
];

export default function LinksPage() {
	return (
		<section className={css({ px: "5", py: "12" })}>
			<h1 className={css({ mb: "8", fontSize: "3xl", fontWeight: "bold" })}>
				相互リンク
			</h1>

			<div className={css({ mb: "12" })}>
				<h2 className={css({ mb: "4", fontSize: "xl", fontWeight: "bold" })}>
					相互リンク募集中
				</h2>
				<p className={css({ mb: "4", lineHeight: "1.8" })}>
					当ブログでは相互リンクを募集しています。
					リンクをご希望の方は、下記のバナーをお使いください。
				</p>

				<div
					className={css({
						p: "4",
						bg: "gray.100",
						borderRadius: "md",
						mb: "4",
					})}
				>
					<p className={css({ mb: "2", fontWeight: "bold" })}>当ブログのバナー</p>
					<div
						className={css({
							display: "inline-block",
							border: "1px solid",
							borderColor: "gray.300",
						})}
					>
						<Image
							src="/images/banner.png"
							alt={SITE_NAME}
							width={200}
							height={40}
						/>
					</div>
					<p className={css({ mt: "2", fontSize: "sm", color: "gray.600" })}>
						サイズ: 200px × 40px
					</p>
				</div>

				<div className={css({ p: "4", bg: "gray.50", borderRadius: "md" })}>
					<p className={css({ mb: "2", fontWeight: "bold" })}>リンク情報</p>
					<ul className={css({ fontSize: "sm", lineHeight: "2" })}>
						<li>
							<span className={css({ fontWeight: "medium" })}>サイト名:</span>{" "}
							{SITE_NAME}
						</li>
						<li>
							<span className={css({ fontWeight: "medium" })}>URL:</span>{" "}
							<a href={SITE_URL} className="link">
								{SITE_URL}
							</a>
						</li>
						<li>
							<span className={css({ fontWeight: "medium" })}>バナーURL:</span>{" "}
							<code className={css({ fontSize: "xs", bg: "gray.200", p: "1" })}>
								{SITE_URL}/images/banner.png
							</code>
						</li>
					</ul>
				</div>
			</div>

			<div>
				<h2 className={css({ mb: "4", fontSize: "xl", fontWeight: "bold" })}>
					リンク一覧
				</h2>
				{links.length > 0 ? (
					<ul className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
						{links.map((link) => (
							<li
								key={link.url}
								className={css({
									display: "flex",
									gap: "4",
									alignItems: "center",
									p: "4",
									border: "1px solid",
									borderColor: "gray.200",
									borderRadius: "md",
								})}
							>
								<a
									href={link.url}
									target="_blank"
									rel="noopener noreferrer"
									className={css({
										display: "block",
										border: "1px solid",
										borderColor: "gray.300",
										flexShrink: "0",
									})}
								>
									<Image
										src={link.banner}
										alt={link.name}
										width={200}
										height={40}
									/>
								</a>
								<div>
									<a
										href={link.url}
										target="_blank"
										rel="noopener noreferrer"
										className="link"
									>
										{link.name}
									</a>
									<p className={css({ mt: "1", fontSize: "sm", color: "gray.600" })}>
										{link.description}
									</p>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p className={css({ color: "gray.500" })}>
						現在、相互リンクはありません。
					</p>
				)}
			</div>
		</section>
	);
}
