import type { APIRoute } from "astro";
import { calculators } from "../data/calculators";

const routes = [
	"/",
	"/rehber",
	"/kategoriler",
	"/frekanslar",
	"/frekanslar/turkiye-role-frekanslari",
	"/frekanslar/genel-frekans-bilgileri",
	"/dunya-haritasi",
	"/solar-aktivite",
	"/hesaplamalar",
	"/telsiz-kiyaslama",
	"/lisans-sorulari",
	"/lisans-sorulari/isletme",
	"/lisans-sorulari/teknik",
	"/lisans-sorulari/duzenlemeler",
	"/ilk-kurulum",
	"/ilk-7-gun",
	"/sss",
	"/sozluk",
	"/sozluk/fonetik-alfabe",
	"/sozluk/q-kodlar",
	"/sozluk/cagri-isareti-ornekleri",
	"/sozluk/temel-terimler",
	"/contact-us",
	"/kaynakca",
	"/kullanim-kosullari",
	"/gizlilik-politikasi",
	...calculators.map((item) => `/hesaplamalar/${item.slug}`),
];

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
