import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.altindagelektronik.com";
const CATEGORY = `${BASE}/el-telsizleri/1`;

const root = process.cwd();
const modelsOut = path.join(root, "src", "data", "quansheng-models.json");
const specsOut = path.join(root, "src", "data", "quansheng-model-specs.json");
const imageDir = path.join(root, "public", "radios", "quansheng", "models");

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
	"Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
};

function htmlToText(html) {
	return html
		.replace(/<\s*br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|td)>/gi, "\n")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&ccedil;/gi, "ç")
		.replace(/&Ccedil;/gi, "Ç")
		.replace(/&uuml;/gi, "ü")
		.replace(/&Uuml;/gi, "Ü")
		.replace(/&ouml;/gi, "ö")
		.replace(/&Ouml;/gi, "Ö")
		.replace(/&iacute;/gi, "i")
		.replace(/&Iacute;/gi, "İ")
		.replace(/&deg;/gi, "°")
		.replace(/\r/g, "")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/[ \t]{2,}/g, " ")
		.trim();
}

function normalizeUrl(url) {
	if (!url) return "";
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("/")) return `${BASE}${url}`;
	return `${BASE}/${url.replace(/^\.?\//, "")}`;
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function fixMojibake(value) {
	if (!value) return "";
	const v = String(value);
	if (!/[ÃÅÄ]/.test(v)) return v;
	try {
		return Buffer.from(v, "latin1").toString("utf8");
	} catch {
		return v;
	}
}

function decodeEntities(value) {
	return String(value || "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&ccedil;/gi, "ç")
		.replace(/&Ccedil;/gi, "Ç")
		.replace(/&uuml;/gi, "ü")
		.replace(/&Uuml;/gi, "Ü")
		.replace(/&ouml;/gi, "ö")
		.replace(/&Ouml;/gi, "Ö")
		.replace(/&iacute;/gi, "i")
		.replace(/&Iacute;/gi, "İ")
		.replace(/&deg;/gi, "°");
}

async function fetchText(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed ${url} (${res.status})`);
	const buf = await res.arrayBuffer();
	let text = new TextDecoder("utf-8").decode(buf);
	if (text.includes("Ã") || text.includes("Ä°") || text.includes("ÅŸ")) {
		text = new TextDecoder("windows-1254").decode(buf);
	}
	return text;
}

function pick(text, patterns) {
	for (const p of patterns) {
		const m = text.match(p);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function inferMode(source) {
	const s = source.toLowerCase();
	if (s.includes("dmr") || s.includes("digital")) return "DMR";
	if (s.includes("pmr")) return "PMR";
	return "Analog";
}

function inferBands(source) {
	const s = source.toLowerCase();
	if (s.includes("vhf") && s.includes("uhf")) return "Dual Band";
	if (s.includes("uhf")) return "UHF";
	if (s.includes("vhf")) return "VHF";
	return "";
}

function extractModel(title) {
	const cleaned = title.toUpperCase();
	const patterns = [
		/\b(UV[\s-]?[A-Z0-9]+(?:\(\d+\))?)\b/,
		/\b(TK[\s-]?[A-Z0-9]+(?:\(\d+\))?)\b/,
		/\b(TG[\s-]?[A-Z0-9]+(?:\(\d+\))?)\b/,
		/\b(IP[\s-]?[A-Z0-9]+)\b/,
		/\b(MX[\s-]?[A-Z0-9]+)\b/,
		/\b(MP[\s-]?[A-Z0-9]+)\b/,
		/\b(MD[\s-]?[A-Z0-9]+)\b/,
		/\b(MAX[\s-]?[A-Z0-9]+)\b/,
	];
	for (const p of patterns) {
		const m = cleaned.match(p);
		if (m?.[1]) return m[1].replace(/\s+/g, "").replace(/--+/g, "-");
	}
	return "";
}

function parseCategoryProducts(html) {
	const items = [];
	const re =
		/<a href="([^"]+)" title="([^"]+)" class="d_block relative pp_wrap">[\s\S]*?<img src="([^"]+)"/gi;
	let m;
	while ((m = re.exec(html)) !== null) {
		items.push({
			link: normalizeUrl(m[1]),
			title: m[2].trim(),
			image: normalizeUrl(m[3]),
		});
	}
	return items;
}

function parseMaxPage(html) {
	const matches = [...html.matchAll(/el-telsizleri\/(\d+)\//gi)].map((m) => Number(m[1]));
	return Math.max(1, ...matches.filter(Number.isFinite));
}

function parseBrand(html) {
	const m = html.match(/<td>\s*Marka:\s*<\/td>\s*<td>\s*([^<]+)\s*<\/td>/i);
	return (m?.[1] || "").trim();
}

function parsePrice(html) {
	const m =
		html.match(/itemprop="price"\s+content="([^"]+)"/i) ||
		html.match(/product:price:amount"\s+content="([^"]+)"/i);
	if (!m?.[1]) return "";
	const num = Number(String(m[1]).replace(",", "."));
	if (!Number.isFinite(num)) return "";
	return `₺${num.toFixed(2)}`;
}

async function downloadImage(url, model) {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return "";
		const ext = url.toLowerCase().includes(".png") ? "png" : url.toLowerCase().includes(".webp") ? "webp" : "jpg";
		const fileName = `${slugify(model)}.${ext}`;
		const p = path.join(imageDir, fileName);
		fs.mkdirSync(imageDir, { recursive: true });
		fs.writeFileSync(p, new Uint8Array(await res.arrayBuffer()));
		return `/radios/quansheng/models/${fileName}`;
	} catch {
		return "";
	}
}

async function main() {
	const firstHtml = await fetchText(CATEGORY);
	const maxPage = parseMaxPage(firstHtml);

	const products = [];
	for (let page = 1; page <= maxPage; page += 1) {
		const html = page === 1 ? firstHtml : await fetchText(`${BASE}/el-telsizleri/${page}/`);
		for (const item of parseCategoryProducts(html)) {
			products.push(item);
		}
	}

	const models = [];
	const specs = [];
	const seenModel = new Set();

	for (const item of products) {
		const title = item.title || "";
		const low = title.toLowerCase();
		if (!low.includes("quansheng")) continue;
		if (low.includes("quesum")) continue;
		if (low.includes(" set ") || low.includes("2 li") || low.includes("4 l") || low.includes("10 l")) continue;

		let detailHtml = "";
		try {
			detailHtml = await fetchText(item.link);
		} catch {
			continue;
		}

		const brand = parseBrand(detailHtml).toLowerCase();
		if (brand && !brand.includes("quansheng")) continue;
		if (brand.includes("quesum")) continue;

		const productName =
			fixMojibake(
				decodeEntities((detailHtml.match(/<h2[^>]*class="color_dark[^"]*"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] || title).replace(/<[^>]+>/g, " ").trim()),
			);
		const model = extractModel(productName);
		if (!model || seenModel.has(model)) continue;

		const heroImage =
			normalizeUrl(detailHtml.match(/id="zoom_image"[^>]*src="([^"]+)"/i)?.[1] || "") ||
			normalizeUrl(item.image);
		const localImage = (await downloadImage(heroImage, model)) || heroImage;

		const text = htmlToText(detailHtml);
		const frequency = fixMojibake(
			pick(text, [
			/(?:Frekans|Frequency)[^\n:]*[:\-]\s*([^\n]+)/i,
			/((?:VHF|UHF)[^,\n]{0,40}(?:MHz|mhz))/i,
			/(\d{2,3}(?:\.\d+)?\s*-\s*\d{2,3}(?:\.\d+)?\s*MHz)/i,
			]),
		);
		const power = fixMojibake(
			pick(text, [/(?:Çıkış Gücü|Output Power|Kanal Gücü)[^\n:]*[:\-]\s*([^\n]+)/i, /(\d+(?:\.\d+)?\s*W(?:att)?)/i]),
		);
		const battery = fixMojibake(pick(text, [/(?:Batarya|Pil|Battery)[^\n:]*[:\-]\s*([^\n]+)/i, /(\d{3,5}\s*mAh)/i]));
		const channels = fixMojibake(
			pick(text, [/(?:Kanal(?: Numarası| Sayısı)?|Channel(?:s)?)[^\n:]*[:\-]\s*([^\n]+)/i, /(\d+\s*(?:Kanal|Channel))/i]),
		);
		const waterproof = fixMojibake(pick(text, [/(IP\d{2}[A-Z0-9]*)/i, /(?:Su Geçirmezlik|Waterproof)[^\n:]*[:\-]\s*([^\n]+)/i]));

		models.push({
			model,
			title: productName,
			image: localImage,
			source: item.link,
		});

		specs.push({
			model,
			title: productName,
			handle: item.link.replace(BASE, "").replace(/^\/|\/$/g, ""),
			bands: inferBands(`${productName} ${frequency}`),
			frequency: frequency || "",
			power: power || "",
			battery: battery || "",
			channels: channels || "",
			waterproof: waterproof || "",
			mode: inferMode(`${productName} ${text}`),
			priceUsd: parsePrice(detailHtml),
			updatedAt: "",
		});

		seenModel.add(model);
	}

	models.sort((a, b) => a.model.localeCompare(b.model, "en"));
	specs.sort((a, b) => a.model.localeCompare(b.model, "en"));

	fs.writeFileSync(modelsOut, `${JSON.stringify(models, null, 2)}\n`, "utf8");
	fs.writeFileSync(specsOut, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

	console.log(`Pages scanned: ${maxPage}`);
	console.log(`Quansheng models: ${models.length}`);
}

await main();
