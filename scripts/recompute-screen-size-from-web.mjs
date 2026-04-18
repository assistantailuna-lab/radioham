import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const TODAY = "2026-04-15";

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

const modelFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith("-models.json")).sort();

function cleanText(html) {
	return String(html || "")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
		.replace(/<br\s*\/?>/gi, " ")
		.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|td|span|strong|section|a)>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/\s+/g, " ")
		.trim();
}

async function fetchHtml(url) {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return "";
		const buf = await res.arrayBuffer();
		return new TextDecoder("utf-8").decode(buf);
	} catch {
		return "";
	}
}

async function fetchDuckDuckGoSnippets(query) {
	const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
	const html = await fetchHtml(url);
	return cleanText(html);
}

function normalizeExisting(v) {
	const t = String(v || "").trim();
	if (!t || /^veri yok$/i.test(t)) return "";
	if (/ekran yok/i.test(t)) return "Ekran yok";

	const m = t
		.replace(/inÃ§/gi, "inch")
		.replace(/inç/gi, "inch")
		.match(/(\d(?:\.\d{1,2})?)\s*(?:inch|in|\")/i);
	if (!m) return t;
	return `${Number(m[1]).toString()} inch`;
}

function extractScreenCandidates(text) {
	const t = String(text || "");
	const out = [];

	const patterns = [
		/(\d(?:\.\d{1,2})?)\s*(?:inch|inç|in|")\s*(?:lcd|tft|ips|display|screen|ekran)/gi,
		/(?:lcd|tft|ips|display|screen|ekran)\s*(?:size|boyut(?:u)?|ekran(?:i)?)?\s*[:=]?\s*(\d(?:\.\d{1,2})?)\s*(?:inch|inç|in|")/gi,
	];
	for (const rx of patterns) {
		for (const m of t.matchAll(rx)) {
			const n = Number(m[1]);
			if (Number.isFinite(n) && n >= 0.8 && n <= 8) out.push(Number(n.toFixed(2)));
		}
	}

	return out;
}

function looksScreenless(text, mode) {
	const t = String(text || "").toLowerCase();
	if (/\bekransiz\b|\bekran yok\b|\bno screen\b|\bscreenless\b/.test(t)) return true;
	if (/pmr446|pmr/i.test(String(mode || "")) && /\b16 kanal\b|\b16 channel\b/.test(t)) return true;
	return false;
}

function pickBestValue(values) {
	if (!values.length) return "";
	const counts = new Map();
	for (const v of values) counts.set(v, (counts.get(v) || 0) + 1);
	const sorted = [...counts.entries()].sort((a, b) => {
		if (b[1] !== a[1]) return b[1] - a[1];
		return b[0] - a[0];
	});
	return `${sorted[0][0].toString()} inch`;
}

function buildQueries(brand, model) {
	return [
		`${brand} ${model} screen size`,
		`${brand} ${model} display size`,
		`${brand} ${model} lcd size`,
	];
}

let updatedRows = 0;
let foundFromWeb = 0;
let screenlessCount = 0;

for (const modelsFile of modelFiles) {
	const brand = modelsFile.replace("-models.json", "");
	const modelsPath = path.join(dataDir, modelsFile);
	const specsPath = path.join(dataDir, `${brand}-model-specs.json`);
	if (!fs.existsSync(specsPath)) continue;

	const models = JSON.parse(fs.readFileSync(modelsPath, "utf8"));
	const specs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
	const specMap = new Map(specs.map((s) => [String(s.model || "").toUpperCase(), s]));

	for (const m of models) {
		const key = String(m.model || "").toUpperCase();
		const existing = specMap.get(key);
		if (!existing) continue;

		const normalizedExisting = normalizeExisting(existing.screenSize);
		if (normalizedExisting && normalizedExisting !== "Ekran yok") {
			specMap.set(key, {
				...existing,
				screenSize: normalizedExisting,
				updatedAt: TODAY,
			});
			updatedRows += 1;
			continue;
		}

		const sourceHtml = await fetchHtml(m.source);
		const sourceText = cleanText(sourceHtml);
		const snippets = [];
		for (const q of buildQueries(brand, m.model)) {
			snippets.push(await fetchDuckDuckGoSnippets(q));
		}
		const corpus = `${m.model} ${existing.title || ""} ${sourceText} ${snippets.join(" ")}`;

		let screenSize = "";
		if (normalizedExisting === "Ekran yok" || looksScreenless(corpus, existing.mode)) {
			screenSize = "Ekran yok";
			screenlessCount += 1;
		} else {
			const vals = extractScreenCandidates(corpus);
			screenSize = pickBestValue(vals) || "Veri yok";
			if (screenSize !== "Veri yok") foundFromWeb += 1;
		}

		specMap.set(key, {
			...existing,
			screenSize,
			updatedAt: TODAY,
		});
		updatedRows += 1;
	}

	const out = models
		.map((model) => specMap.get(String(model.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Screen-size recalculated: ${brand} (${out.length})`);
}

console.log(`Done. rows=${updatedRows}, foundFromWeb=${foundFromWeb}, screenless=${screenlessCount}`);
