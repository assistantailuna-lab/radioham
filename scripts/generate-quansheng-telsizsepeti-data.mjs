import fs from "node:fs";
import path from "node:path";

const BASE = "https://www.telsizsepeti.com";
const CATEGORY_URL = `${BASE}/kategori/quansheng`;

const root = process.cwd();
const modelsOut = path.join(root, "src", "data", "quansheng-models.json");
const specsOut = path.join(root, "src", "data", "quansheng-model-specs.json");
const imageDir = path.join(root, "public", "radios", "quansheng", "models");

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
		.replace(/&#8217;/gi, "'")
		.replace(/&uuml;/gi, "ü")
		.replace(/&Uuml;/gi, "Ü")
		.replace(/&ouml;/gi, "ö")
		.replace(/&Ouml;/gi, "Ö")
		.replace(/&ccedil;/gi, "ç")
		.replace(/&Ccedil;/gi, "Ç")
		.replace(/&nbsp;/gi, " ");
}

function normalizeArtifacts(value) {
	return String(value || "")
		.replace(/Ãœ/g, "Ü")
		.replace(/Ã¼/g, "ü")
		.replace(/Ã–/g, "Ö")
		.replace(/Ã¶/g, "ö")
		.replace(/Ã‡/g, "Ç")
		.replace(/Ã§/g, "ç")
		.replace(/Ä°/g, "İ")
		.replace(/Ä±/g, "ı")
		.replace(/Åž/g, "Ş")
		.replace(/ÅŸ/g, "ş")
		.replace(/â‚º/g, "₺")
		.replace(/â€“/g, "-")
		.replace(/â€”/g, "-")
		.replace(/âˆ½/g, "~")
		.replace(/Â±/g, "±")
		.replace(/Â°C/g, "°C")
		.replace(/â‰¥/g, ">=")
		.replace(/â‰¤/g, "<=");
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
	)
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

function slugify(value) {
	return value
		.toLowerCase()
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

function modelFromTitle(title) {
	const up = title.toUpperCase();
	const patterns = [
		/\b(UV[\s-]?K\d+(?:\(\d+\))?)\b/,
		/\b(TK[\s-]?\d+(?:\(\d+\))?)\b/,
		/\b(TG[\s-]?[A-Z]?\d+(?:\(\d+\))?)\b/,
	];
	for (const p of patterns) {
		const m = up.match(p);
		if (m?.[1]) {
			return m[1].replace(/\s+/g, "").replace(/--+/g, "-");
		}
	}
	return "";
}

function variantSuffixFromTitle(title) {
	const up = title.toUpperCase();
	const suffixes = [];
	if (/\b2500\s*MAH\b/.test(up)) suffixes.push("2500MAH");
	if (/\b1400\s*MAH\b/.test(up)) suffixes.push("1400MAH");
	if (/\bM[İI]N[İI]\s*KONG\b/.test(up)) suffixes.push("MINIKONG");
	return suffixes.join("-");
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
	if (s.includes("uhf")) return "UHF";
	if (s.includes("vhf")) return "VHF";
	return "";
}

function pick(text, patterns) {
	for (const p of patterns) {
		const m = text.match(p);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function parsePrice(html) {
	const m = html.match(/<div class="product-price-new">\s*<span>([^<]+)<\/span>/i);
	return cleanText(m?.[1] || "").replace(/â‚º/g, "₺");
}

function escapeRegExp(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractFieldByLabels(text, labels, stops) {
	for (const label of labels) {
		const stopPattern = stops.map((s) => escapeRegExp(s)).join("|");
		const re = new RegExp(`${escapeRegExp(label)}\\s*[:\\-]\\s*([\\s\\S]{1,140}?)(?=\\s*(?:${stopPattern})\\s*[:\\-]|$)`, "i");
		const m = text.match(re);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function parseProductBlocks(html) {
	const chunks = html.split(/<div class="showcase-page-product"[^>]*>/gi).slice(1);
	const items = [];
	const seen = new Set();

	for (const block of chunks) {
		const link =
			block.match(/<a[^>]+href="(\/urun\/[^"]+)"[^>]*title="[^"]+"/i)?.[1] ||
			block.match(/<a[^>]+href="(\/urun\/[^"]+)"/i)?.[1] ||
			"";
		const title = cleanText(
			block.match(/<a[^>]+href="\/urun\/[^"]+"[^>]*title="([^"]+)"/i)?.[1] ||
				block.match(/<img[^>]+alt="([^"]+)"/i)?.[1] ||
				"",
		);
		const image = block.match(/<img[^>]+src="([^"]+)"/i)?.[1] || "";
		if (!link || !title) continue;
		const absLink = normalizeUrl(link);
		if (seen.has(absLink)) continue;
		seen.add(absLink);
		items.push({
			link: absLink,
			title,
			image: normalizeUrl(image),
		});
	}

	return items;
}

async function fetchText(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed ${url} (${res.status})`);
	const buf = await res.arrayBuffer();
	return new TextDecoder("utf-8").decode(buf);
}

async function downloadImage(url, model) {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return "";
		const ext = url.toLowerCase().includes(".png") ? "png" : url.toLowerCase().includes(".webp") ? "webp" : "jpg";
		const fileName = `${slugify(model)}.${ext}`;
		const out = path.join(imageDir, fileName);
		fs.mkdirSync(imageDir, { recursive: true });
		fs.writeFileSync(out, new Uint8Array(await res.arrayBuffer()));
		return `/radios/quansheng/models/${fileName}`;
	} catch {
		return "";
	}
}

async function main() {
	const categoryHtml = await fetchText(CATEGORY_URL);
	const products = parseProductBlocks(categoryHtml);

	const models = [];
	const specs = [];
	const seenModel = new Set();

	for (const product of products) {
		let detailHtml = "";
		try {
			detailHtml = await fetchText(product.link);
		} catch {
			continue;
		}

		const brand = cleanText(detailHtml.match(/<div class="product-list-title">Marka<\/div>[\s\S]*?<a[^>]*>([^<]+)<\/a>/i)?.[1] || "");
		if (brand && !brand.toLowerCase().includes("quansheng")) continue;

		const title = cleanText(detailHtml.match(/<h1 class="section-title">([\s\S]*?)<\/h1>/i)?.[1] || product.title);
		const baseModel = modelFromTitle(title);
		if (!baseModel) continue;

		const variant = variantSuffixFromTitle(title);
		const model = variant ? `${baseModel}-${variant}` : baseModel;
		if (seenModel.has(model)) continue;

		const detailInfoHtml =
			detailHtml.match(/data-tab-content="1">\s*<div class="product-detail">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="product-detail-tab-row"/i)?.[1] ||
			detailHtml.match(/<div class="product-detail">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div class="product-detail-tab-row"/i)?.[1] ||
			"";
		const pageText = htmlToText(detailInfoHtml || detailHtml);
		const compactText = normalizeArtifacts(pageText.replace(/\s+/g, " ").trim());
		const stops = [
			"Frekans",
			"Frekans Aralığı",
			"Bant",
			"Çıkış Gücü",
			"Cikis Gucu",
			"Güç İletimi",
			"Guc Iletimi",
			"Kanal",
			"Kanal Hafızası",
			"Kanal Hafizasi",
			"Sinyal Kanalı",
			"Sinyal Kanali",
			"Batarya",
			"Pil",
			"Ekran",
			"Şarj",
			"Sarj",
			"Teknik",
			"Kutu",
			"Etiketler",
			"Taksit",
			"Ses Gücü",
			"Ses Gucu",
			"Ağırlık",
			"Agirlik",
			"Boyut",
		];
		const frequency =
			extractFieldByLabels(compactText, ["Frekans Aralığı", "Frekans Araligi", "Frekans", "Bant"], stops) ||
			pick(compactText, [/(\d{2,3}(?:\.\d+)?\s*-\s*\d{2,3}(?:\.\d+)?\s*MHz)/i, /((?:VHF|UHF)[^,]{0,80}(?:MHz|mhz))/i]);
		const power =
			extractFieldByLabels(compactText, ["Çıkış Gücü", "Cikis Gucu", "Output Power", "Güç İletimi", "Guc Iletimi"], stops) ||
			pick(compactText, [/(\d+(?:\.\d+)?\s*W)\b/i]);
		const battery =
			extractFieldByLabels(compactText, ["Batarya", "Pil", "Battery", "Pil Kapasitesi"], stops) ||
			pick(compactText, [/(\d{3,5}\s*mAh)/i]);
		const channels =
			extractFieldByLabels(compactText, ["Sinyal Kanalı", "Sinyal Kanali", "Kanal Hafızası", "Kanal Hafizasi", "Kanal Sayısı", "Kanal Sayisi"], stops) ||
			pick(compactText, [/(\d+\s*(?:Kanal|Channel))/i]);
		const waterproof = pick(compactText, [/(IP\d{2}[A-Z0-9]*)/i, /(?:Su Geçirmezlik|Waterproof)\s*[:\-]\s*([^\n]+)/i]);

		const heroImage = normalizeUrl(
			detailHtml.match(/<meta\s+property=['"]og:image['"]\s+content=['"]([^'"]+)['"]/i)?.[1] ||
				product.image,
		);
		const localImage = (await downloadImage(heroImage, model)) || heroImage;
		const priceTl = normalizeArtifacts(parsePrice(detailHtml));

		models.push({
			model,
			title: normalizeArtifacts(title),
			image: localImage,
			source: product.link,
		});

		specs.push({
			model,
			title: normalizeArtifacts(title),
			handle: product.link.replace(BASE, "").replace(/^\/|\/$/g, ""),
			bands: inferBands(`${title} ${frequency}`),
			frequency: normalizeArtifacts(frequency || ""),
			power: normalizeArtifacts(power || ""),
			battery: normalizeArtifacts(battery || ""),
			channels: normalizeArtifacts(channels || ""),
			waterproof: normalizeArtifacts(waterproof || ""),
			mode: inferMode(`${title} ${pageText}`),
			priceUsd: priceTl,
			updatedAt: "",
		});

		seenModel.add(model);
	}

	models.sort((a, b) => a.model.localeCompare(b.model, "en"));
	specs.sort((a, b) => a.model.localeCompare(b.model, "en"));

	fs.writeFileSync(modelsOut, `${JSON.stringify(models, null, 2)}\n`, "utf8");
	fs.writeFileSync(specsOut, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

	console.log(`Category products parsed: ${products.length}`);
	console.log(`Quansheng models written: ${models.length}`);
}

await main();
