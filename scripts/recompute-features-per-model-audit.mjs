import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const outDir = path.join(root, "tmp");
const outAuditPath = path.join(outDir, "model-feature-audit.json");
const TODAY = "2026-04-15";

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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
		.replace(/&#x27;/gi, "'")
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

async function fetchDuckDuckGoResults(query) {
	const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
	const html = await fetchHtml(url);
	if (!html) return [];

	const results = [];
	const reLink = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	for (const m of html.matchAll(reLink)) {
		const href = m[1] || "";
		const title = cleanText(m[2] || "");
		if (!href || !title) continue;
		const from = Math.max(0, (m.index ?? 0) - 200);
		const to = Math.min(html.length, (m.index ?? 0) + 1400);
		const neighborhood = html.slice(from, to);
		const sm = neighborhood.match(/<[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|div|span)>/i);
		const snippet = cleanText(sm?.[1] || "");
		results.push({ href, title, snippet });
		if (results.length >= 4) break;
	}
	return results;
}

function hasPositive(text, patterns, negativeWindowPatterns) {
	const t = String(text || "");
	for (const rx of patterns) {
		const g = rx.global ? rx : new RegExp(rx.source, `${rx.flags}g`);
		for (const m of t.matchAll(g)) {
			const idx = m.index ?? -1;
			if (idx < 0) continue;
			const left = t.slice(Math.max(0, idx - 48), idx);
			if (negativeWindowPatterns.some((n) => n.test(left))) continue;
			return true;
		}
	}
	return false;
}

function classifyDualPtt(corpus) {
	const negative = [/\bno\b/i, /\bnot\b/i, /\bwithout\b/i, /\byok\b/i, /\bdegil\b/i, /\bunsupported\b/i];
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

function hasProgrammableKey(corpus) {
	const negative = [/\bno\b/i, /\bnot\b/i, /\bwithout\b/i, /\byok\b/i, /\bdegil\b/i];
	const patterns = [
		/\bprogrammable\s*key\b/gi,
		/\bprogrammable\s*side\s*key\b/gi,
		/\bkey\s*assignment\b/gi,
		/\bcustom(?:izable)?\s*key\b/gi,
		/\bshortcut\s*key\b/gi,
		/\bpf1\b/gi,
		/\bpf2\b/gi,
		/\bside\s*key\b/gi,
	];
	return hasPositive(corpus, patterns, negative) ? "Var" : "Yok";
}

function extractScreenSize(corpus) {
	const t = String(corpus || "");
	if (/\bekransiz\b|\bekran yok\b|\bno screen\b|\bscreenless\b/i.test(t)) return "Ekran yok";

	const vals = [];
	const patterns = [
		/(\d(?:\.\d{1,2})?)\s*(?:-|–|—)?\s*(?:inch|inç|in|")\s*(?:lcd|tft|ips|display|screen|ekran)/gi,
		/(?:lcd|tft|ips|display|screen|ekran)\s*(?:size|boyut(?:u)?)?\s*[:=]?\s*(\d(?:\.\d{1,2})?)\s*(?:-|–|—)?\s*(?:inch|inç|in|")/gi,
	];
	for (const rx of patterns) {
		for (const m of t.matchAll(rx)) {
			const n = Number(m[1]);
			if (Number.isFinite(n) && n >= 0.8 && n <= 8) vals.push(Number(n.toFixed(2)));
		}
	}
	if (!vals.length) return "Veri yok";

	const counts = new Map();
	for (const v of vals) counts.set(v, (counts.get(v) || 0) + 1);
	const best = [...counts.entries()].sort((a, b) => (b[1] - a[1]) || (b[0] - a[0]))[0]?.[0];
	return best ? `${best.toString()} inch` : "Veri yok";
}

function shortEvidence(text, model) {
	const t = String(text || "");
	const idx = t.toLowerCase().indexOf(String(model || "").toLowerCase());
	if (idx < 0) return t.slice(0, 240);
	return t.slice(Math.max(0, idx - 80), idx + 180);
}

const audit = [];
let rows = 0;

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

		const qDual = `${brand} ${m.model} dual ptt programmable key`;
		const qScreen = `${brand} ${m.model} screen size display`;
		const [dualResults, screenResults] = await Promise.all([
			fetchDuckDuckGoResults(qDual),
			fetchDuckDuckGoResults(qScreen),
		]);

		const snippetCorpus = [...dualResults, ...screenResults].map((r) => `${r.title} ${r.snippet}`).join(" ");
		const corpus = `${m.model} ${existing.title || ""} ${sourceText} ${snippetCorpus}`;

		const dualPtt = classifyDualPtt(corpus);
		const sideKeyProgrammable = hasProgrammableKey(corpus);
		const screenSize = extractScreenSize(corpus);

		specMap.set(key, {
			...existing,
			dualPtt,
			sideKeyProgrammable,
			screenSize,
			updatedAt: TODAY,
		});

		audit.push({
			brand,
			model: m.model,
			dualPtt,
			screenSize,
			source: m.source || "",
			evidence: {
				sourceSnippet: shortEvidence(sourceText, m.model),
				dualSearch: dualResults.map((r) => ({ url: r.href, snippet: r.snippet.slice(0, 220) })),
				screenSearch: screenResults.map((r) => ({ url: r.href, snippet: r.snippet.slice(0, 220) })),
			},
		});
		rows += 1;
	}

	const out = models
		.map((x) => specMap.get(String(x.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));
	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Per-model updated: ${brand} (${out.length})`);
}

fs.writeFileSync(outAuditPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");
console.log(`Done. rows=${rows}. audit=${outAuditPath}`);
