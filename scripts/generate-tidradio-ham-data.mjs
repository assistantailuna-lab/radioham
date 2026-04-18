import fs from "node:fs";
import path from "node:path";

const BASE = "https://tidradio.com";
const COLLECTION_URL = `${BASE}/collections/ham`;

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const modelsPath = path.join(dataDir, "tid-models.json");
const specsPath = path.join(dataDir, "tid-model-specs.json");

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7",
};

function loadJsonSafe(filePath, fallback) {
	try {
		return JSON.parse(fs.readFileSync(filePath, "utf8"));
	} catch {
		return fallback;
	}
}

function decodeEntities(value) {
	return String(value || "")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">");
}

function stripHtml(html) {
	return decodeEntities(
		String(html || "")
			.replace(/<script[\s\S]*?<\/script>/gi, " ")
			.replace(/<style[\s\S]*?<\/style>/gi, " ")
			.replace(/<br\s*\/?>/gi, " ")
			.replace(/<\/(p|li|div|h1|h2|h3|h4|h5|h6|tr|td|span|strong)>/gi, " ")
			.replace(/<[^>]+>/g, " "),
	)
		.replace(/\s+/g, " ")
		.trim();
}

function normalizeUrl(url) {
	if (!url) return "";
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("//")) return `https:${url}`;
	if (url.startsWith("/")) return `${BASE}${url}`;
	return `${BASE}/${url.replace(/^\.?\//, "")}`;
}

function getModelFromTitle(title) {
	const t = String(title || "");
	if (/TD-H3\s*PLUS/i.test(t)) return "TD-H3 Plus";
	const m = t.match(/\bTD-[A-Z0-9]+(?:-[A-Z0-9]+)?\b/i);
	return m ? m[0].toUpperCase() : "";
}

function inferBands(text) {
	const s = String(text || "").toLowerCase();
	if (s.includes("8-band") || s.includes("8 band")) return "8 Band";
	if (s.includes("dual band") || (s.includes("vhf") && s.includes("uhf"))) return "Dual Band";
	if (s.includes("tri band") || s.includes("tri-band")) return "Tri Band";
	if (s.includes("uhf")) return "UHF";
	if (s.includes("vhf")) return "VHF";
	return "";
}

function inferMode(text) {
	const s = String(text || "").toLowerCase();
	if (s.includes("dmr") || s.includes("digital")) return "DMR";
	return "Analog";
}

function unique(values) {
	return [...new Set(values.filter(Boolean))];
}

function extractFrequency(text) {
	const matches = [...String(text).matchAll(/\b\d{2,4}(?:\.\d+)?\s*-\s*\d{2,4}(?:\.\d+)?\s*MHz\b/gi)].map((m) => m[0].replace(/\s+/g, ""));
	return unique(matches).join(", ");
}

function extractPower(text) {
	const nums = [...String(text).matchAll(/\b(\d+(?:\.\d+)?)\s*W\b/gi)]
		.map((m) => Number(m[1]))
		.filter((n) => Number.isFinite(n));
	if (!nums.length) return "";
	return `${Math.max(...nums)}W`;
}

function extractBattery(text) {
	const nums = [...String(text).matchAll(/\b(\d{3,5})\s*mAh\b/gi)]
		.map((m) => Number(m[1]))
		.filter((n) => Number.isFinite(n));
	if (!nums.length) return "";
	return `${Math.max(...nums)}mAh`;
}

function extractChannels(text) {
	const nums = [...String(text).matchAll(/\b(\d{2,4})\s*channels?\b/gi)]
		.map((m) => Number(m[1]))
		.filter((n) => Number.isFinite(n));
	if (!nums.length) return "";
	return `${Math.max(...nums)} kanal`;
}

function extractWaterproof(text) {
	return String(text).match(/\bIP\d{2}[A-Z0-9]*\b/i)?.[0].toUpperCase() || "";
}

async function fetchText(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
	return new TextDecoder("utf-8").decode(await res.arrayBuffer());
}

async function fetchJson(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) throw new Error(`Fetch failed: ${url} (${res.status})`);
	return res.json();
}

function parseCollectionHandles(html) {
	const gridStart = html.indexOf('id="product-grid"');
	if (gridStart < 0) return [];
	const afterGrid = html.slice(gridStart);
	const gridEnd = afterGrid.indexOf("</ul>");
	const gridHtml = gridEnd > 0 ? afterGrid.slice(0, gridEnd) : afterGrid;
	const matches = [...gridHtml.matchAll(/href="\/products\/([a-z0-9-]+)"/gi)].map((m) => m[1]);
	return unique(matches);
}

function loadGlobalModelSet() {
	const files = fs.readdirSync(dataDir).filter((f) => f.endsWith("-models.json"));
	const out = new Set();
	for (const file of files) {
		const items = loadJsonSafe(path.join(dataDir, file), []);
		for (const item of items) {
			if (item?.model) out.add(String(item.model).toUpperCase());
		}
	}
	return out;
}

async function main() {
	const existingModels = loadJsonSafe(modelsPath, []);
	const existingSpecs = loadJsonSafe(specsPath, []);
	const existingTidModelSet = new Set(existingModels.map((x) => String(x.model || "").toUpperCase()));
	const globalModelSet = loadGlobalModelSet();

	const collectionHtml = await fetchText(COLLECTION_URL);
	const handles = parseCollectionHandles(collectionHtml);
	if (!handles.length) throw new Error("No products found in TID ham collection.");

	const incomingModels = [];
	const incomingSpecs = [];
	let skippedByGlobalDuplicate = 0;

	for (const handle of handles) {
		const product = await fetchJson(`${BASE}/products/${handle}.js`);
		const title = String(product?.title || "").trim();
		const model = getModelFromTitle(title);
		if (!model) continue;

		const upperModel = model.toUpperCase();
		const isNewToTid = !existingTidModelSet.has(upperModel);
		if (isNewToTid && globalModelSet.has(upperModel)) {
			skippedByGlobalDuplicate += 1;
			continue;
		}

		const tags = Array.isArray(product?.tags) ? product.tags.join(" ") : "";
		const descriptionText = stripHtml(product?.description || "");
		const rawDescription = String(product?.description || "");
		const sourceText = `${title} ${tags} ${descriptionText} ${rawDescription}`;

		const price = Number(product?.price_min ?? product?.price);
		const priceUsd = Number.isFinite(price) ? `$${(price / 100).toFixed(2)}` : "";

		const image = normalizeUrl(product?.featured_image || product?.images?.[0] || "");
		const source = `${BASE}/products/${handle}`;
		const frequency = extractFrequency(sourceText);
		const powerFromTitle = extractPower(title);

		incomingModels.push({
			model,
			title,
			image,
			source,
		});

		incomingSpecs.push({
			model,
			title,
			handle: `products/${handle}`,
			bands: inferBands(sourceText),
			frequency,
			power: powerFromTitle || extractPower(sourceText),
			battery: extractBattery(sourceText),
			channels: extractChannels(sourceText),
			waterproof: extractWaterproof(sourceText),
			mode: inferMode(sourceText),
			priceUsd,
			updatedAt: "",
		});
	}

	const modelMap = new Map(existingModels.map((item) => [String(item.model || "").toUpperCase(), item]));
	for (const item of incomingModels) {
		modelMap.set(String(item.model).toUpperCase(), item);
	}
	const nextModels = [...modelMap.values()].sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	const specMap = new Map(existingSpecs.map((item) => [String(item.model || "").toUpperCase(), item]));
	for (const item of incomingSpecs) {
		specMap.set(String(item.model).toUpperCase(), item);
	}
	const nextSpecs = [...specMap.values()].sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(modelsPath, `${JSON.stringify(nextModels, null, 2)}\n`, "utf8");
	fs.writeFileSync(specsPath, `${JSON.stringify(nextSpecs, null, 2)}\n`, "utf8");

	const addedOrUpdated = incomingModels.length;
	console.log(`Ham handles found: ${handles.length}`);
	console.log(`TID models added/updated: ${addedOrUpdated}`);
	console.log(`Skipped by global duplicate rule: ${skippedByGlobalDuplicate}`);
	console.log(`Final TID model count: ${nextModels.length}`);
}

await main();
