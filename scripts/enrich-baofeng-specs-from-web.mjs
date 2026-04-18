import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const modelsPath = path.join(root, "src", "data", "baofeng-models.json");
const specsPath = path.join(root, "src", "data", "baofeng-model-specs.json");

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

const models = JSON.parse(fs.readFileSync(modelsPath, "utf8"));
const specs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
const specMap = new Map(specs.map((s) => [String(s.model).toUpperCase(), s]));

function cleanText(s) {
	return String(s || "")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|td|span|strong)>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/\s+/g, " ")
		.trim();
}

function uniq(arr) {
	return [...new Set(arr.filter(Boolean))];
}

function pickFrequency(text) {
	const r1 = [...text.matchAll(/\b\d{2,4}(?:\.\d+)?\s*[-~]\s*\d{2,4}(?:\.\d+)?\s*MHz\b/gi)].map((m) => m[0].replace(/\s+/g, ""));
	if (/PMR446/i.test(text)) r1.push("PMR446");
	return uniq(r1).slice(0, 6).join(", ");
}

function pickPower(text) {
	const w = [...text.matchAll(/\b\d{1,2}(?:\.\d+)?\s*W\b/gi)].map((m) => m[0].replace(/\s+/g, ""));
	const duo = text.match(/\b(\d{1,2}\s*W\s*\/\s*\d{1,2}\s*W)\b/i)?.[1] || "";
	if (duo) return duo.replace(/\s+/g, "");
	if (!w.length) return "";
	const nums = w.map((x) => Number(x.replace(/[^\d.]/g, ""))).filter(Number.isFinite);
	if (!nums.length) return "";
	const max = Math.max(...nums);
	const min = Math.min(...nums);
	return max === min ? `${max}W` : `${max}W / ${min}W`;
}

function pickBattery(text) {
	const all = [...text.matchAll(/\b(\d{3,5})\s*mAh\b/gi)].map((m) => Number(m[1]));
	if (!all.length) return "";
	return `${Math.max(...all)}mAh`;
}

function pickChannels(text) {
	const m = text.match(/\b(\d{1,4})\s*(kanal|channel|channels|groups)\b/i);
	return m ? `${m[1]}` : "";
}

function pickIp(text) {
	return text.match(/\bIP\s?(\d{2}[A-Z0-9]*)\b/i)?.[0].replace(/\s+/g, "").toUpperCase() || "";
}

function pickBands(text) {
	const s = text.toLowerCase();
	if (s.includes("multi band") || s.includes("multi-band") || s.includes("6 band")) return "Multi Band";
	if (s.includes("tri band") || s.includes("tri-band")) return "Tri Band";
	if (s.includes("dual band") || (s.includes("vhf") && s.includes("uhf"))) return "Dual Band";
	if (s.includes("vhf")) return "VHF";
	if (s.includes("uhf")) return "UHF";
	return "";
}

function pickMode(text) {
	const s = text.toLowerCase();
	if (s.includes("dmr")) return "DMR";
	if (s.includes("pmr")) return "PMR";
	if (s.includes("digital")) return "Digital";
	if (s.includes("analog")) return "Analog";
	return "";
}

async function fetchText(url) {
	const res = await fetch(url, { headers });
	if (!res.ok) return "";
	return new TextDecoder("utf-8").decode(await res.arrayBuffer());
}

function merge(existing, parsed) {
	return {
		...existing,
		bands: existing.bands || parsed.bands,
		frequency: existing.frequency || parsed.frequency,
		power: existing.power || parsed.power,
		battery: existing.battery || parsed.battery,
		channels: existing.channels || parsed.channels,
		waterproof: existing.waterproof || parsed.waterproof,
		mode: existing.mode || parsed.mode,
		updatedAt: "2026-04-14",
	};
}

for (const m of models) {
	const key = String(m.model).toUpperCase();
	const current = specMap.get(key);
	if (!current) continue;

	const texts = [];
	if (m.source) {
		const html = await fetchText(m.source);
		if (html) texts.push(cleanText(html));
	}
	if (current.handle?.startsWith("products/")) {
		const official = `https://www.baofengradio.com/${current.handle}`;
		const html = await fetchText(official);
		if (html) texts.push(cleanText(html));
	}

	const joined = texts.join(" ");
	if (!joined) continue;

	const parsed = {
		bands: pickBands(joined),
		frequency: pickFrequency(joined),
		power: pickPower(joined),
		battery: pickBattery(joined),
		channels: pickChannels(joined),
		waterproof: pickIp(joined),
		mode: pickMode(joined),
	};

	specMap.set(key, merge(current, parsed));
}

const out = models
	.map((m) => specMap.get(String(m.model).toUpperCase()))
	.filter(Boolean)
	.sort((a, b) => String(a.model).localeCompare(String(b.model), "tr"));

fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
console.log(`Updated ${out.length} Baofeng records from live web sources.`);
