import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.telsizsepeti.com";
const CATEGORY = `${BASE}/kategori/el-telsizleri`;

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const publicDir = path.join(root, "public", "radios");

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
};

function decodeEntities(value) {
	return String(value || "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&#8217;/gi, "'");
}

function fixMojibake(value) {
	if (!value) return "";
	let out = String(value);
	for (let i = 0; i < 2; i += 1) {
		if (!/[ÃÄÅâ]/.test(out)) break;
		try {
			out = Buffer.from(out, "latin1").toString("utf8");
		} catch {
			break;
		}
	}
	return out;
}

function normalizeArtifacts(value) {
	return String(value || "")
		.replace(/â‚º/g, "₺")
		.replace(/â€“/g, "–")
		.replace(/â€”/g, "—")
		.replace(/âˆ½/g, "∽")
		.replace(/Â±/g, "±")
		.replace(/Â°/g, "°")
		.replace(/â‰¥/g, ">=")
		.replace(/â‰¤/g, "<=");
}

function cleanText(value) {
	return normalizeArtifacts(fixMojibake(decodeEntities(String(value || "").replace(/<[^>]+>/g, " "))))
		.replace(/\s+/g, " ")
		.trim();
}

function htmlToText(html) {
	return cleanText(
		html
			.replace(/<script[\s\S]*?<\/script>/gi, " ")
			.replace(/<style[\s\S]*?<\/style>/gi, " ")
			.replace(/<\s*br\s*\/?>/gi, "\n")
			.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|td|span|strong)>/gi, "\n")
			.replace(/<[^>]+>/g, " "),
	);
}

function slugify(value) {
	return String(value || "")
		.toLowerCase()
		.replace(/ı/g, "i")
		.replace(/ğ/g, "g")
		.replace(/ü/g, "u")
		.replace(/ş/g, "s")
		.replace(/ö/g, "o")
		.replace(/ç/g, "c")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function normalizeUrl(url) {
	if (!url) return "";
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("//")) return `https:${url}`;
	if (url.startsWith("/")) return `${BASE}${url}`;
	return `${BASE}/${url.replace(/^\.?\//, "")}`;
}

async function fetchText(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed ${url} (${res.status})`);
	return new TextDecoder("utf-8").decode(await res.arrayBuffer());
}

function parseListProducts(html) {
	const chunks = html.split(/<div class="showcase-page-product"[^>]*>/gi).slice(1);
	const out = [];
	const seen = new Set();
	for (const chunk of chunks) {
		const link = chunk.match(/<a[^>]+href="(\/urun\/[^"]+)"/i)?.[1] || "";
		const title =
			cleanText(chunk.match(/<a[^>]+href="\/urun\/[^"]+"[^>]*title="([^"]+)"/i)?.[1] || "") ||
			cleanText(chunk.match(/<img[^>]+alt="([^"]+)"/i)?.[1] || "");
		const image = normalizeUrl(chunk.match(/<img[^>]+src="([^"]+)"/i)?.[1] || "");
		if (!link || !title) continue;
		const abs = normalizeUrl(link);
		if (seen.has(abs)) continue;
		seen.add(abs);
		out.push({ link: abs, title, image });
	}
	return out;
}

function parseBrand(detailHtml, titleFallback) {
	const fromMarka = cleanText(detailHtml.match(/<div class="product-list-title">Marka<\/div>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i)?.[1] || "");
	if (fromMarka) return fromMarka;
	return cleanText(titleFallback.split(" ")[0] || "Diger");
}

function inferMode(source) {
	const s = source.toLowerCase();
	if (s.includes("dmr") || s.includes("digital")) return "DMR";
	if (s.includes("pmr")) return "PMR";
	return "Analog";
}

function inferBands(source) {
	const s = source.toLowerCase();
	if (s.includes("dual band") || (s.includes("vhf") && s.includes("uhf"))) return "Dual Band";
	if (s.includes("tri band") || s.includes("tri-band")) return "Tri Band";
	if (s.includes("uhf")) return "UHF";
	if (s.includes("vhf")) return "VHF";
	return "";
}

function escapeRegExp(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFieldByLabels(text, labels, stops) {
	for (const label of labels) {
		const stopPattern = stops.map((s) => escapeRegExp(s)).join("|");
		const re = new RegExp(`${escapeRegExp(label)}\\s*[:\\-]\\s*([\\s\\S]{1,150}?)(?=\\s*(?:${stopPattern})\\s*[:\\-]|$)`, "i");
		const m = text.match(re);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function pick(text, patterns) {
	for (const pattern of patterns) {
		const m = text.match(pattern);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function parsePrice(detailHtml) {
	const p = cleanText(detailHtml.match(/<div class="product-price-new">\s*<span>([^<]+)<\/span>/i)?.[1] || "");
	return normalizeArtifacts(p);
}

function parseModel(title, brand) {
	const t = title.toUpperCase();
	const b = brand.toUpperCase();
	const scrub = t
		.replace(new RegExp(`\\b${escapeRegExp(b)}\\b`, "g"), " ")
		.replace(/\b\(.*?RENK.*?\)/gi, " ")
		.replace(/\bADET.*?\)/gi, " ")
		.replace(/\s+/g, " ")
		.trim();
	const candidates = [...scrub.matchAll(/\b([A-Z]{1,5}[ -]?[A-Z0-9]{1,6}(?:[-/][A-Z0-9]{1,6})?(?:\(\d+\))?)\b/g)].map((m) => m[1]);
	const filtered = candidates
		.map((v) => v.replace(/\s+/g, "").replace(/--+/g, "-"))
		.filter((v) => /\d/.test(v))
		.filter((v) => !["TL", "PMR", "GPS", "PRO", "MINI", "FULL", "PACK"].includes(v));
	if (filtered.length) return filtered.sort((a, b2) => b2.length - a.length)[0];
	return scrub.split(" ").slice(0, 2).join("-").replace(/[^A-Z0-9-]/g, "").slice(0, 24) || "MODEL";
}

function variantSuffix(title) {
	const t = title.toUpperCase();
	const out = [];
	if (/\b2500\s*MAH\b/.test(t)) out.push("2500MAH");
	if (/\b1400\s*MAH\b/.test(t)) out.push("1400MAH");
	if (/\bM[İI]N[İI]\s*KONG\b/.test(t)) out.push("MINIKONG");
	return out.join("-");
}

async function downloadImage(url, brandSlug, model) {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return "";
		const ext = url.toLowerCase().includes(".png") ? "png" : url.toLowerCase().includes(".webp") ? "webp" : "jpg";
		const fileName = `${slugify(model)}.${ext}`;
		const dir = path.join(publicDir, brandSlug, "models");
		fs.mkdirSync(dir, { recursive: true });
		const filePath = path.join(dir, fileName);
		fs.writeFileSync(filePath, new Uint8Array(await res.arrayBuffer()));
		return `/radios/${brandSlug}/models/${fileName}`;
	} catch {
		return "";
	}
}

function loadJsonSafe(filePath, fallback) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return fallback;
	}
}

async function main() {
	const existingModelFiles = fs
		.readdirSync(dataDir)
		.filter((f) => f.endsWith("-models.json") && !f.startsWith("temp-"));
	const globalSeenModels = new Set();
	for (const file of existingModelFiles) {
		const arr = loadJsonSafe(path.join(dataDir, file), []);
		for (const item of arr) {
			if (item?.model) globalSeenModels.add(String(item.model).toUpperCase());
		}
	}

	const links = new Map();
	for (let page = 1; page <= 30; page += 1) {
		const url = page === 1 ? CATEGORY : `${CATEGORY}?tp=${page}`;
		let html = "";
		try {
			html = await fetchText(url);
		} catch {
			break;
		}
		const list = parseListProducts(html);
		if (list.length === 0) break;
		for (const p of list) {
			links.set(p.link, p);
		}
	}

	const byBrand = new Map();
	let addedCount = 0;

	for (const item of links.values()) {
		let detail = "";
		try {
			detail = await fetchText(item.link);
		} catch {
			continue;
		}

		const title = cleanText(detail.match(/<h1 class="section-title">([\s\S]*?)<\/h1>/i)?.[1] || item.title);
		const brand = parseBrand(detail, title);
		const brandSlug = slugify(brand) || "diger";

		const baseModel = parseModel(title, brand);
		const suffix = variantSuffix(title);
		const model = suffix ? `${baseModel}-${suffix}` : baseModel;
		const modelKey = model.toUpperCase();
		if (globalSeenModels.has(modelKey)) continue;

		const infoHtml =
			detail.match(/data-tab-content="1">\s*<div class="product-detail">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="product-detail-tab-row"/i)?.[1] ||
			detail.match(/<div class="product-detail">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="product-detail-tab-row"/i)?.[1] ||
			"";
		const text = htmlToText(infoHtml || detail).replace(/\s+/g, " ").trim();
		const stops = [
			"Frekans",
			"Bant",
			"Çıkış Gücü",
			"Cikis Gucu",
			"Güç İletimi",
			"Kanal",
			"Kanal Hafızası",
			"Kanal Hafizasi",
			"Sinyal Kanalı",
			"Batarya",
			"Pil",
			"Ekran",
			"Şarj",
			"Sarj",
			"Ağırlık",
			"Agirlik",
			"Boyut",
			"Teknik",
			"Kutu",
			"Etiketler",
			"Taksit",
		];

		const frequency =
			extractFieldByLabels(text, ["Frekans Aralığı", "Frekans Araligi", "Frekans", "Bant"], stops) ||
			pick(text, [/(\d{2,4}(?:\.\d+)?\s*[~-]\s*\d{2,4}(?:\.\d+)?\s*MHz)/i, /((?:VHF|UHF)[^,]{0,80}(?:MHz|mhz))/i]);
		const power =
			extractFieldByLabels(text, ["Çıkış Gücü", "Cikis Gucu", "Output Power", "Güç İletimi", "Guc Iletimi"], stops) ||
			pick(text, [/(\d+(?:\.\d+)?\s*W)\b/i]);
		const battery =
			extractFieldByLabels(text, ["Batarya", "Pil Kapasitesi", "Pil", "Battery"], stops) ||
			pick(text, [/(\d{3,5}\s*mAh)/i]);
		const channels =
			extractFieldByLabels(text, ["Sinyal Kanalı", "Sinyal Kanali", "Kanal Hafızası", "Kanal Hafizasi", "Kanal Sayısı", "Kanal Sayisi"], stops) ||
			pick(text, [/(\d+\s*(?:Kanal|Channel))/i]);
		const waterproof = pick(text, [/(IP\d{2}[A-Z0-9]*)/i, /(?:Su Geçirmezlik|Waterproof)\s*[:\-]\s*([^\n]+)/i]);

		const hero = normalizeUrl(detail.match(/<meta\s+property=['"]og:image['"]\s+content=['"]([^'"]+)['"]/i)?.[1] || item.image);
		const localImage = (await downloadImage(hero, brandSlug, model)) || hero;
		const priceTl = parsePrice(detail);

		if (!byBrand.has(brandSlug)) byBrand.set(brandSlug, { brand, models: [], specs: [] });
		const bucket = byBrand.get(brandSlug);
		bucket.models.push({
			model,
			title,
			image: localImage,
			source: item.link,
		});
		bucket.specs.push({
			model,
			title,
			handle: item.link.replace(BASE, "").replace(/^\/|\/$/g, ""),
			bands: inferBands(`${title} ${frequency}`),
			frequency: normalizeArtifacts(frequency || ""),
			power: normalizeArtifacts(power || ""),
			battery: normalizeArtifacts(battery || ""),
			channels: normalizeArtifacts(channels || ""),
			waterproof: normalizeArtifacts(waterproof || ""),
			mode: inferMode(`${title} ${text}`),
			priceUsd: priceTl,
			updatedAt: "",
		});

		globalSeenModels.add(modelKey);
		addedCount += 1;
	}

	const written = [];
	for (const [brandSlug, bucket] of byBrand.entries()) {
		const modelsPath = path.join(dataDir, `${brandSlug}-models.json`);
		const specsPath = path.join(dataDir, `${brandSlug}-model-specs.json`);
		const existingModels = loadJsonSafe(modelsPath, []);
		const existingSpecs = loadJsonSafe(specsPath, []);
		const existingModelSet = new Set(existingModels.map((x) => String(x.model || "").toUpperCase()));

		for (const m of bucket.models) {
			if (!existingModelSet.has(String(m.model).toUpperCase())) {
				existingModels.push(m);
				existingModelSet.add(String(m.model).toUpperCase());
			}
		}

		const specByModel = new Map(existingSpecs.map((x) => [String(x.model || "").toUpperCase(), x]));
		for (const s of bucket.specs) {
			const key = String(s.model).toUpperCase();
			if (!specByModel.has(key)) {
				existingSpecs.push(s);
				specByModel.set(key, s);
			}
		}

		existingModels.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));
		existingSpecs.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

		fs.writeFileSync(modelsPath, `${JSON.stringify(existingModels, null, 2)}\n`, "utf8");
		fs.writeFileSync(specsPath, `${JSON.stringify(existingSpecs, null, 2)}\n`, "utf8");
		written.push({ brand: bucket.brand, brandSlug, models: existingModels.length });
	}

	console.log(`Total product links scanned: ${links.size}`);
	console.log(`New unique models added: ${addedCount}`);
	console.log(`Brands updated: ${written.length}`);
	for (const w of written.sort((a, b) => a.brand.localeCompare(b.brand, "tr"))) {
		console.log(` - ${w.brand} (${w.brandSlug}): ${w.models}`);
	}
}

await main();
