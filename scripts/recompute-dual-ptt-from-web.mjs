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
	if (!html) return "";
	return cleanText(html);
}

function norm(s) {
	return String(s || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, " ")
		.trim();
}

function hasPositive(text, patterns, negativeWindowPatterns) {
	const t = String(text || "");
	for (const rx of patterns) {
		const g = rx.global ? rx : new RegExp(rx.source, `${rx.flags}g`);
		const all = t.matchAll(g);
		for (const m of all) {
			const idx = m.index ?? -1;
			if (idx < 0) continue;
			const left = t.slice(Math.max(0, idx - 42), idx);
			const bad = negativeWindowPatterns.some((n) => n.test(left));
			if (!bad) return true;
		}
	}
	return false;
}

function classifyDualPtt(corpus) {
	const negative = [
		/\bno\b/i,
		/\bnot\b/i,
		/\bwithout\b/i,
		/\byok\b/i,
		/\bdegil\b/i,
		/\bdesteklemez\b/i,
	];

	const physicalPatterns = [
		/\bdual\s*ptt\b/gi,
		/\bdouble\s*ptt\b/gi,
		/\bindependent\s*ptt\b/gi,
		/\ba\/b\s*ptt\b/gi,
		/\bcift\s*ptt\b/gi,
	];

	const programmablePatterns = [
		/\bprogrammable\s*key\b/gi,
		/\bprogrammable\s*side\s*key\b/gi,
		/\bkey\s*assignment\b/gi,
		/\bcustom(?:izable)?\s*key\b/gi,
		/\bshortcut\s*key\b/gi,
		/\bpf1\b/gi,
		/\bpf2\b/gi,
		/\bside\s*key\b/gi,
		/\blong\s*press\s*key\b/gi,
		/\bshort\s*press\s*key\b/gi,
		/\btus\s*atanabilir\b/gi,
		/\byan\s*tus\s*atan/i,
	];

	if (hasPositive(corpus, physicalPatterns, negative)) return "Var";
	if (hasPositive(corpus, programmablePatterns, negative)) return "Duzenlenebilir";
	return "Yok";
}

function classifySideKeyProgrammable(corpus) {
	const negative = [/\bno\b/i, /\bnot\b/i, /\bwithout\b/i, /\byok\b/i, /\bdegil\b/i];
	const programmablePatterns = [
		/\bprogrammable\s*key\b/gi,
		/\bprogrammable\s*side\s*key\b/gi,
		/\bkey\s*assignment\b/gi,
		/\bcustom(?:izable)?\s*key\b/gi,
		/\bshortcut\s*key\b/gi,
		/\bpf1\b/gi,
		/\bpf2\b/gi,
		/\bside\s*key\b/gi,
		/\blong\s*press\s*key\b/gi,
		/\bshort\s*press\s*key\b/gi,
		/\btus\s*atanabilir\b/gi,
		/\byan\s*tus\s*atan/i,
	];
	return hasPositive(corpus, programmablePatterns, negative) ? "Var" : "Yok";
}

function buildQueries(brand, model) {
	return [
		`${brand} ${model} dual ptt`,
		`${brand} ${model} programmable key pf1 pf2`,
	];
}

let updatedRows = 0;

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

		const sourceHtml = await fetchHtml(m.source);
		const sourceText = cleanText(sourceHtml);

		const queries = buildQueries(brand, m.model);
		const snippets = [];
		for (const q of queries) {
			const txt = await fetchDuckDuckGoSnippets(q);
			snippets.push(txt);
		}

		const modelToken = norm(m.model);
		const combined = [sourceText, ...snippets]
			.join(" ")
			.split(/\s{2,}/)
			.filter(Boolean)
			.join(" ");

		const corpus = combined.includes(modelToken) ? combined : `${m.model} ${combined}`;

		const dualPtt = classifyDualPtt(corpus);
		const sideKeyProgrammable = classifySideKeyProgrammable(corpus);

		specMap.set(key, {
			...existing,
			dualPtt,
			sideKeyProgrammable,
			updatedAt: TODAY,
		});
		updatedRows += 1;
	}

	const out = models
		.map((m) => specMap.get(String(m.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Dual-PTT recalculated: ${brand} (${out.length})`);
}

console.log(`Done. rows=${updatedRows}`);
