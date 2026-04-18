import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productsPath = path.join(root, "temp-radtel-products.json");
const outModelsPath = path.join(root, "src", "data", "radtel-models.json");
const outSpecsPath = path.join(root, "src", "data", "radtel-model-specs.json");
const imageDir = path.join(root, "public", "radios", "radtel", "models");

function stripBom(value) {
	return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function htmlToText(html) {
	return html
		.replace(/<\s*br\s*\/?>/gi, "\n")
		.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr)>/gi, "\n")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&lt;/gi, "<")
		.replace(/&gt;/gi, ">")
		.replace(/\r/g, "")
		.replace(/[ \t]+\n/g, "\n")
		.replace(/\n{3,}/g, "\n\n")
		.replace(/[ \t]{2,}/g, " ")
		.trim();
}

function pick(text, patterns) {
	for (const pattern of patterns) {
		const match = text.match(pattern);
		if (match?.[1]) return match[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function cleanField(value) {
	return value.replace(/^[:\-–\s]+/, "").replace(/\s{2,}/g, " ").replace(/^[,.;]+|[,.;]+$/g, "").trim();
}

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function modelFromTitle(title) {
	const m = title.match(/\b((?:RT|RM|RB|RL|RA|RD|RP|P|GMRS)[-\s]?\d{1,4}[A-Z]?(?:\s?PRO(?:\s?MAX)?)?)\b/i);
	if (!m) return "";
	return m[1].toUpperCase().replace(/\s+/g, " ").trim();
}

function isAccessory(title) {
	const lower = title.toLowerCase();
	const accessoryKeywords = [
		"battery",
		"charger",
		"cable",
		"mic",
		"microphone",
		"earpiece",
		"earphone",
		"belt clip",
		"belt clips",
		"antenna",
		"speaker",
		"programming cable",
		"sim card",
		"renew fee",
		"adapter",
		"headset",
		"handsfree",
		"knife",
		"holster",
		"holder",
		"pouch",
		"adapter",
		"display",
		"side cover",
		"screws",
		"replacement",
		"renew",
	];
	return accessoryKeywords.some((k) => lower.includes(k));
}

function looksLikeRadio(title) {
	const lower = title.toLowerCase();
	if (isAccessory(title)) return false;
	return (
		lower.includes("radio") ||
		lower.includes("walkie") ||
		lower.includes("dmr") ||
		lower.includes("gmrs") ||
		/\b(rt|rm|rb|ra|rd|rp|rl|p)[-\s]?\d/i.test(title)
	);
}

function inferBands({ title, text }) {
	const source = `${title} ${text}`.toLowerCase();
	if (source.includes("tri band") || source.includes("tri-band")) return "Tri Band";
	if (source.includes("dual band") || source.includes("dual-band") || (source.includes("vhf") && source.includes("uhf"))) return "Dual Band";
	if (source.includes("uhf")) return "UHF";
	if (source.includes("vhf")) return "VHF";
	return "";
}

function inferMode({ title, text }) {
	const source = `${title} ${text}`.toLowerCase();
	if (source.includes("dmr")) return "DMR";
	if (source.includes("digital")) return "Digital";
	if (source.includes("analog")) return "Analog";
	if (source.includes("gmrs")) return "GMRS";
	return "";
}

function extFromUrl(url) {
	try {
		const pathname = new URL(url).pathname.toLowerCase();
		if (pathname.endsWith(".png")) return "png";
		if (pathname.endsWith(".webp")) return "webp";
		if (pathname.endsWith(".jpeg")) return "jpeg";
		return "jpg";
	} catch {
		return "jpg";
	}
}

const raw = stripBom(fs.readFileSync(productsPath, "utf8"));
const products = JSON.parse(raw).products ?? [];

const candidates = products.filter((p) => looksLikeRadio(p.title || ""));

const dedup = new Map();
for (const p of candidates) {
	const model = modelFromTitle(p.title || "");
	if (!model) continue;
	if (!dedup.has(model)) {
		dedup.set(model, p);
		continue;
	}
	const prev = dedup.get(model);
	const prevTextLen = htmlToText(prev.body_html || "").length;
	const curTextLen = htmlToText(p.body_html || "").length;
	if (curTextLen > prevTextLen) dedup.set(model, p);
}

fs.mkdirSync(imageDir, { recursive: true });

const models = [];
const specs = [];

for (const [model, p] of [...dedup.entries()].sort((a, b) => a[0].localeCompare(b[0], "en"))) {
	const imageUrl = p.images?.[0]?.src || "";
	if (!imageUrl) continue;
	const ext = extFromUrl(imageUrl);
	const fileName = `${slugify(model)}.${ext}`;
	const imagePath = path.join(imageDir, fileName);
	if (!fs.existsSync(imagePath)) {
		const res = await fetch(imageUrl);
		if (res.ok) {
			const arr = new Uint8Array(await res.arrayBuffer());
			fs.writeFileSync(imagePath, arr);
		}
	}

	const text = htmlToText(p.body_html || "");
	const frequency = cleanField(
		pick(text, [
			/Frequency Range\s*[:：-]\s*([^\n]+)/i,
			/Frequency range\s*[:：-]\s*([^\n]+)/i,
			/Frequency\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const power = cleanField(
		pick(text, [
			/Output Power\s*[:：-]\s*([^\n]+)/i,
			/Power\s*[:：-]\s*([^\n]+)/i,
			/RF Power\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const battery = cleanField(
		pick(text, [
			/Battery(?: Capacity)?\s*[:：-]\s*([^\n]+)/i,
			/Battery\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const channels = cleanField(
		pick(text, [
			/Channel Capacity\s*[:：-]\s*([^\n]+)/i,
			/Channels?\s*[:：-]\s*([^\n]+)/i,
			/CH\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const waterproof = cleanField(
		pick(text, [
			/(IP\d{2}[A-Z0-9]*)/i,
			/Waterproof\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const variantPrices = (p.variants ?? [])
		.map((v) => Number.parseFloat(v.price))
		.filter((n) => Number.isFinite(n));
	const minPriceRaw = variantPrices.length > 0 ? Math.min(...variantPrices) : NaN;
	const priceUsd = Number.isFinite(minPriceRaw) && minPriceRaw >= 5 && minPriceRaw <= 2000 ? `$${minPriceRaw.toFixed(2)}` : "";

	models.push({
		model,
		title: p.title,
		image: `/radios/radtel/models/${fileName}`,
		source: imageUrl,
	});

	specs.push({
		model,
		title: p.title,
		handle: p.handle,
		bands: inferBands({ title: p.title, text }),
		frequency,
		power,
		battery,
		channels,
		waterproof,
		mode: inferMode({ title: p.title, text }),
		priceUsd,
		updatedAt: p.updated_at || "",
	});
}

fs.writeFileSync(outModelsPath, `${JSON.stringify(models, null, 2)}\n`, "utf8");
fs.writeFileSync(outSpecsPath, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

console.log(`Radtel models: ${models.length}`);
console.log(`Wrote: ${outModelsPath}`);
console.log(`Wrote: ${outSpecsPath}`);
