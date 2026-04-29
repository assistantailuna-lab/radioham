import type { APIRoute } from "astro";
import { calculators } from "../data/calculators";
import { listSubtopics } from "../data/guide";
import { sdrRoutes } from "../data/sdr-routes";

const sdrEnabled = String(import.meta.env.PUBLIC_ENABLE_SDR ?? "false").toLowerCase() === "true";
const staticPageModules = import.meta.glob("/src/pages/**/*.astro");
const toCanonicalPath = (route: string) => {
	if (!route || route === "/") return "/";
	return route.endsWith("/") ? route : `${route}/`;
};

const staticRoutes = Object.keys(staticPageModules)
	.map((modulePath) =>
		modulePath
			.replace("/src/pages", "")
			.replace(/\/index\.astro$/, "/")
			.replace(/\.astro$/, "")
	)
	.filter((route) => route !== "")
	.filter((route) => !route.includes("["))
	.map((route) => toCanonicalPath(route))
	.filter((route) => route !== "/kategoriler")
	.filter((route) => (sdrEnabled ? true : !(route === "/sdr" || route.startsWith("/sdr/"))));

const dynamicRoutes = [
	...calculators.map((item) => toCanonicalPath(`/hesaplamalar/${item.slug}`)),
	...listSubtopics("tr").map((item) => toCanonicalPath(`/konu/${item.slug}`)),
	...(sdrEnabled ? sdrRoutes.map((route) => toCanonicalPath(route)) : []),
];

const routes = Array.from(new Set([...staticRoutes, ...dynamicRoutes])).sort((a, b) => a.localeCompare(b));

export const GET: APIRoute = ({ site }) => {
	const base = site?.toString().replace(/\/$/, "") ?? "";
	const urls = routes
		.map((route) => {
			const loc = base ? `${base}${route}` : route;
			return `<url><loc>${loc}</loc></url>`;
		})
		.join("");
	const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

	return new Response(body, {
		headers: { "Content-Type": "application/xml; charset=utf-8" },
	});
};
