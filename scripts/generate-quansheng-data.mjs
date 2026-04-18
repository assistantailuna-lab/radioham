import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const outModelsPath = path.join(root, "src", "data", "quansheng-models.json");
const outSpecsPath = path.join(root, "src", "data", "quansheng-model-specs.json");
const imageDir = path.join(root, "public", "radios", "quansheng", "models");

const BASE = "https://quanshengshop.com";

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

function slugify(value) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function modelFromTitle(title) {
	const m = title.match(/\b((?:UV|TG|TK|MP|MX|IP|M)\-?[A-Z0-9]+(?:\(\d+\))?)\b/i);
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
		"antenna",
		"speaker",
		"programing cable",
		"programming cable",
		"headset",
		"holster",
		"holder",
		"pouch",
		"adapter",
		"display",
		"cover",
		"screws",
	];
	return accessoryKeywords.some((k) => lower.includes(k));
}

function inferBands(source) {
	const s = source.toLowerCase();
	if (s.includes("tri-band") || s.includes("tri band")) return "Tri Band";
	if (s.includes("dual-band") || s.includes("dual band") || (s.includes("vhf") && s.includes("uhf"))) return "Dual Band";
	if (s.includes("uhf")) return "UHF";
	if (s.includes("vhf")) return "VHF";
	return "";
}

function inferMode(source) {
	const s = source.toLowerCase();
	if (s.includes("dmr")) return "DMR";
	if (s.includes("digital")) return "Digital";
	if (s.includes("analog")) return "Analog";
	if (s.includes("pmr")) return "PMR";
	if (s.includes("frs")) return "FRS";
	return "";
}

function pick(text, patterns) {
	for (const pattern of patterns) {
		const m = text.match(pattern);
		if (m?.[1]) return m[1].trim().replace(/\s+/g, " ");
	}
	return "";
}

function cleanField(value) {
	return value.replace(/^[:\-–\s]+/, "").replace(/\s{2,}/g, " ").replace(/^[,.;]+|[,.;]+$/g, "").trim();
}

function normalizeUrl(url) {
	if (!url) return "";
	if (url.startsWith("//")) return `https:${url}`;
	if (url.startsWith("http://") || url.startsWith("https://")) return url;
	if (url.startsWith("/")) return `${BASE}${url}`;
	return `${BASE}/${url}`;
}

async function fetchText(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`Fetch failed ${url} (${res.status})`);
	return await res.text();
}

async function fetchProductLinks() {
	const links = new Set();
	for (let page = 1; page <= 3; page += 1) {
		const html = await fetchText(`${BASE}/products/?page=${page}`);
		const matches = [...html.matchAll(/href="(\/products\/[^"?#]+)"/gi)].map((m) => m[1]);
		for (const link of matches) {
			if (link === "/products/") continue;
			links.add(link);
		}
	}
	return [...links].sort((a, b) => a.localeCompare(b, "en"));
}

async function build() {
	fs.mkdirSync(imageDir, { recursive: true });

	const links = await fetchProductLinks();
	const models = [];
	const specs = [];
	const seenModel = new Set();

	for (const link of links) {
		const url = `${BASE}${link}`;
		let html = "";
		try {
			html = await fetchText(url);
		} catch {
			continue;
		}

		const title = (html.match(/<meta property="og:title" content="([^"]+)"/i)?.[1] || html.match(/<title>([^<]+)<\/title>/i)?.[1] || "")
			.trim();
		if (!title || isAccessory(title)) continue;

		const model = modelFromTitle(title) || title.toUpperCase().slice(0, 24).trim();
		if (!model || seenModel.has(model)) continue;

		const image = normalizeUrl(html.match(/<meta property="og:image" content="([^"]+)"/i)?.[1] || "");
		if (!image) continue;

		const ext = image.toLowerCase().includes(".png") ? "png" : image.toLowerCase().includes(".webp") ? "webp" : "jpg";
		const fileName = `${slugify(model)}.${ext}`;
		const localImagePath = path.join(imageDir, fileName);
		if (!fs.existsSync(localImagePath)) {
			try {
				const imgRes = await fetch(image);
				if (imgRes.ok) {
					const arr = new Uint8Array(await imgRes.arrayBuffer());
					fs.writeFileSync(localImagePath, arr);
				}
			} catch {
				// skip image download failure
			}
		}

		const text = htmlToText(html);
		const frequency = cleanField(
			pick(text, [
				/Frequency Range\s*[:：-]\s*([^\n]+)/i,
				/Frequency\s*[:：-]\s*([^\n]+)/i,
				/Frequency Classification\s*[:：-]\s*([^\n]+)/i,
			]),
		);
		const power = cleanField(
			pick(text, [/Output Power\s*[:：-]\s*([^\n]+)/i, /Power\s*[:：-]\s*([^\n]+)/i, /(\d+\s*W(?:\s*\/\s*\d+\s*W)?)/i]),
		);
		const battery = cleanField(pick(text, [/Battery(?: Capacity)?\s*[:：-]\s*([^\n]+)/i, /(Battery[^,\n]{0,50}mAh[^\n]*)/i]));
		const channels = cleanField(pick(text, [/Channels?\s*[:：-]\s*([^\n]+)/i, /(\d+\s*CH(?:annels?)?)/i]));
		const waterproof = cleanField(pick(text, [/(IP\d{2}[A-Z0-9]*)/i, /Waterproof\s*[:：-]\s*([^\n]+)/i]));
		const price = cleanField(html.match(/product:price:amount" content="([^"]+)"/i)?.[1] || "");
		const priceUsd = Number.isFinite(Number(price)) && Number(price) > 0 ? `$${Number(price).toFixed(2)}` : "";

		models.push({
			model,
			title,
			image: `/radios/quansheng/models/${fileName}`,
			source: image,
		});

		specs.push({
			model,
			title,
			handle: link.replace("/products/", ""),
			bands: inferBands(`${title} ${frequency}`),
			frequency,
			power,
			battery,
			channels,
			waterproof,
			mode: inferMode(`${title} ${text}`),
			priceUsd,
			updatedAt: "",
		});

		seenModel.add(model);
	}

	models.sort((a, b) => a.model.localeCompare(b.model, "en"));
	specs.sort((a, b) => a.model.localeCompare(b.model, "en"));

	fs.writeFileSync(outModelsPath, `${JSON.stringify(models, null, 2)}\n`, "utf8");
	fs.writeFileSync(outSpecsPath, `${JSON.stringify(specs, null, 2)}\n`, "utf8");

	console.log(`Quansheng models: ${models.length}`);
	console.log(`Wrote: ${outModelsPath}`);
	console.log(`Wrote: ${outSpecsPath}`);
}

await build();
