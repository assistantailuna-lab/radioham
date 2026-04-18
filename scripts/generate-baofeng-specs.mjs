import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const productsPath = path.join(root, "temp-baofeng-products.json");
const modelsPath = path.join(root, "src", "data", "baofeng-models.json");
const outPath = path.join(root, "src", "data", "baofeng-model-specs.json");

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
		if (match?.[1]) {
			return match[1].trim().replace(/\s+/g, " ");
		}
	}
	return "";
}

function cleanField(value) {
	return value
		.replace(/^[:\-–\s]+/, "")
		.replace(/\s{2,}/g, " ")
		replace(/^[,.;]+|[,.;]+$/g, "")
		.trim();
}

function inferBands({ tags, text, title }) {
	const source = `${tags.join(" ")} ${title} ${text}`.toLowerCase();
	if (source.includes("tri band") || source.includes("tri-band")) return "Tri Band";
	if (source.includes("quad band") || source.includes("quad-band")) return "Quad Band";
	if (source.includes("dual band") || source.includes("dual-band")) return "Dual Band";
	if (source.includes("uhf") && source.includes("vhf")) return "Dual Band";
	if (source.includes("uhf")) return "UHF";
	if (source.includes("vhf")) return "VHF";
	return "";
}

function inferDigital({ tags, text, title }) {
	const source = `${tags.join(" ")} ${title} ${text}`.toLowerCase();
	if (/\bdmr\b/.test(source)) return "DMR";
	if (/\bdigital\b/.test(source)) return "Digital";
	if (/\banalog\b/.test(source)) return "Analog";
	return "";
}

const productsRaw = stripBom(fs.readFileSync(productsPath, "utf8"));
const modelsRaw = stripBom(fs.readFileSync(modelsPath, "utf8"));

const products = JSON.parse(productsRaw).products ?? [];
const models = JSON.parse(modelsRaw);

const imageToProduct = new Map();
for (const product of products) {
	for (const image of product.images ?? []) {
		if (image?.src) imageToProduct.set(image.src, product);
	}
}

const specs = [];

for (const model of models) {
	const product = imageToProduct.get(model.source);
	if (!product) continue;

	const text = htmlToText(product.body_html || "");
	const tags = Array.isArray(product.tags) ? product.tags : [];
	const variantPrices = (product.variants ?? [])
		.map((v) => Number.parseFloat(v.price))
		.filter((n) => Number.isFinite(n));
	const minPriceRaw = variantPrices.length > 0 ? Math.min(...variantPrices) : NaN;
	const minPrice = Number.isFinite(minPriceRaw) && minPriceRaw >= 5 && minPriceRaw <= 500 ? minPriceRaw.toFixed(2) : "";

	const frequency = cleanField(
		pick(text, [
			/Frequency Range\s*[:：-]\s*([^\n]+)/i,
			/Operating Frequency\s*[:：-]\s*([^\n]+)/i,
			/Frequency\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const power = cleanField(
		pick(text, [
			/Output Power\s*[:：-]\s*([^\n]+)/i,
			/Power Output\s*[:：-]\s*([^\n]+)/i,
			/Transmit Power\s*[:：-]\s*([^\n]+)/i,
			/Tx Power\s*[:：-]\s*([^\n]+)/i,
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
			/Channel No\.?\s*[:：-]\s*([^\n]+)/i,
			/Channels?\s*[:：-]\s*([^\n]+)/i,
		]),
	);
	const waterproof = cleanField(
		pick(text, [
			/(IP\d{2}[A-Z0-9]*)/i,
			/Waterproof\s*[:：-]\s*([^\n]+)/i,
		]),
	);

	const specsEntry = {
		model: model.model,
		title: product.title,
		handle: product.handle,
		url: `https://www.baofengradio.com/products/${product.handle}`,
		bands: inferBands({ tags, text, title: product.title }),
		frequency: frequency || "",
		power: power || "",
		battery: battery || "",
		channels: channels || "",
		waterproof: waterproof || "",
		mode: inferDigital({ tags, text, title: product.title }),
		priceUsd: minPrice ? `$${minPrice}` : "",
		updatedAt: product.updated_at || "",
	};

	specs.push(specsEntry);
}

specs.sort((a, b) => a.model.localeCompare(b.model, "en"));

fs.writeFileSync(outPath, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

const withSpecs = specs.filter(
	(s) => s.frequency || s.power || s.battery || s.channels || s.waterproof || s.mode || s.bands,
).length;

console.log(`Wrote ${specs.length} records to ${outPath}`);
console.log(`Records with at least one technical field: ${withSpecs}`);
