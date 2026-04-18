import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const base = site?.toString().replace(/\/$/, "") ?? "";
	const sitemap = base ? `Sitemap: ${base}/sitemap.xml` : "Sitemap: /sitemap.xml";
	const host = base ? `Host: ${base.replace(/^https?:\/\//, "")}` : "";
	const body = [`User-agent: *`, `Allow: /`, host, sitemap].filter(Boolean).join("\n");

	return new Response(body, {
		headers: { "Content-Type": "text/plain; charset=utf-8" },
	});
};
