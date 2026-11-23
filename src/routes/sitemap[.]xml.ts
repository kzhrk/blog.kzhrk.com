import { createFileRoute } from "@tanstack/react-router";
import { format } from "date-fns";
import { SITE_URL } from "@/lib/constants";
import { getAllPosts } from "@/lib/posts";

interface SitemapEntry {
	loc: string;
	lastmod: Date;
	changefreq: "weekly" | "monthly";
	priority: number;
}

function toXml(entries: SitemapEntry[]): string {
	const urls = entries
		.map(
			(entry) => `<url>
<loc>${entry.loc}</loc>
<lastmod>${format(entry.lastmod, "yyyy-MM-dd")}</lastmod>
<changefreq>${entry.changefreq}</changefreq>
<priority>${entry.priority}</priority>
</url>`,
		)
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET: async () => {
				const posts = await getAllPosts();

				const xml = toXml([
					{
						loc: SITE_URL,
						lastmod: new Date(),
						changefreq: "weekly",
						priority: 1,
					},
					...posts.map((post): SitemapEntry => ({
						loc: `${SITE_URL}/posts${post.path}`,
						lastmod: new Date(post.date),
						changefreq: "monthly",
						priority: 0.8,
					})),
				]);

				return new Response(xml, {
					headers: { "Content-Type": "application/xml" },
				});
			},
		},
	},
});
