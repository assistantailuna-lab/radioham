import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const TODAY = "2026-04-17";
const auditPath = path.join(root, "tmp", "radtel-battery-recheck-audit.json");
const auditMdPath = path.join(root, "tmp", "radtel-battery-recheck-audit.md");

const headers = {
	"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
};

if (!fs.existsSync(path.join(root, "tmp"))) fs.mkdirSync(path.join(root, "tmp"), { recursive: true });

const models = JSON.parse(fs.readFileSync(path.join(dataDir, "radtel-models.json"), "utf8"));
const specs = JSON.parse(fs.readFileSync(path.join(dataDir, "radtel-model-specs.json"), "utf8"));
const specByModel = new Map(specs.map((s) => [String(s.model || "").toUpperCase(), s]));

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

function extractMeta(html, key) {
	const rx = new RegExp(`<meta[^>]+(?:name|property)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i");
	const m = String(html || "").match(rx);
	return m ? cleanText(m[1]) : "";
}

function extractProductJsonLd(html) {
	const chunks = [...String(html || "").matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
	const out = [];
	for (const chunk of chunks) {
		try {
			const obj = JSON.parse(chunk);
			const list = Array.isArray(obj) ? obj : [obj];
			for (const node of list) {
				const t = String(node?.["@type"] || "").toLowerCase();
				if (t.includes("product")) {
					out.push(cleanText(node.name || ""));
					out.push(cleanText(node.description || ""));
				}
			}
		} catch {
			// ignore invalid json
		}
	}
	return out.join(" ");
}

function extractSignal(html) {
	const title = (String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
	const h1 = (String(html || "").match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || "");
	return cleanText([title, h1, extractMeta(html, "description"), extractMeta(html, "og:description"), extractProductJsonLd(html)].join(" "));
}

async function fetchHtml(url) {
	try {
		const r = await fetch(url, { headers });
		if (!r.ok) return "";
		const b = await r.arrayBuffer();
		return new TextDecoder("utf-8").decode(b);
	} catch {
		return "";
	}
}

function isLikelyHtml(url) {
	const u = String(url || "").toLowerCase();
	if (!u) return false;
	if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u)) return false;
	return true;
}

function fallbackUrls(handle) {
	const h = String(handle || "").replace(/^\/+/, "");
	if (!h) return [];
	if (h.startsWith("urun/")) return [`https://www.telsizsepeti.com/${h}`];
	return [
		`https://www.radtels.com/products/${h}`,
		`https://radtels.com/products/${h}`,
		`https://www.radtels.com/${h}`,
	];
}

function parseBattery(text, titleText) {
	const t = `${text} ${titleText}`;
	const caps = [...t.matchAll(/\b(\d{3,5})\s*mAh\b/gi)]
		.map((m) => Number(m[1]))
		.filter((n) => Number.isFinite(n) && n >= 500 && n <= 7000);
	const uniq = [...new Set(caps)].sort((a, b) => b - a);

	const noBattery = /\bmobile radio\b|\bcar radio\b|\bvehicle\b|\bamplifier\b|arac\/harici besleme/i.test(t) && uniq.length === 0;
	if (noBattery) return "Arac/harici besleme (batarya yok)";
	if (uniq.length === 0) return "";
	if (uniq.length === 1) return `${uniq[0]}mAh`;
	return uniq.slice(0, 2).map((n) => `${n}mAh`).join(" / ");
}

function evidenceSnippet(text) {
	const t = String(text || "");
	const m = t.match(/\b\d{3,5}\s*mAh\b/i);
	if (!m || m.index == null) return t.slice(0, 200);
	return t.slice(Math.max(0, m.index - 80), Math.min(t.length, m.index + 220));
}

const audit = [];
let changed = 0;
let fetched = 0;
let missed = 0;

for (const m of models) {
	const key = String(m.model || "").toUpperCase();
	const old = specByModel.get(key);
	if (!old) continue;

	const urls = [];
	if (isLikelyHtml(m.source)) urls.push(m.source);
	urls.push(...fallbackUrls(old.handle || ""));
	const uniqueUrls = [...new Set(urls.filter(Boolean))];

	let signal = "";
	let usedUrl = "";
	for (const u of uniqueUrls) {
		const html = await fetchHtml(u);
		const s = extractSignal(html);
		if (s) {
			signal = s;
			usedUrl = u;
			break;
		}
	}
	if (signal) fetched += 1;
	else missed += 1;

	const parsed = parseBattery(signal, `${m.title || ""} ${old.title || ""}`);
	const nextBattery = parsed || String(old.battery || "");

	if (nextBattery !== String(old.battery || "")) changed += 1;

	specByModel.set(key, {
		...old,
		battery: nextBattery,
		updatedAt: TODAY,
	});

	audit.push({
		model: m.model,
		oldBattery: old.battery || "",
		newBattery: nextBattery,
		changed: nextBattery !== (old.battery || ""),
		source: usedUrl || m.source || "",
		evidence: evidenceSnippet(signal),
	});
}

const out = models
	.map((m) => specByModel.get(String(m.model || "").toUpperCase()))
	.filter(Boolean)
	.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

fs.writeFileSync(path.join(dataDir, "radtel-model-specs.json"), `${JSON.stringify(out, null, 2)}\n`, "utf8");
fs.writeFileSync(auditPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");

const md = [];
md.push("# Radtel Battery Recheck Audit (2026-04-17)");
md.push("");
md.push(`- Total: **${audit.length}**`);
md.push(`- Source fetched: **${fetched}**`);
md.push(`- Source missed: **${missed}**`);
md.push(`- Battery changed: **${changed}**`);
md.push("");
md.push("| Model | Eski | Yeni | Kaynak |");
md.push("|---|---|---|---|");
for (const r of audit) {
	md.push(`| ${r.model} | ${String(r.oldBattery).replace(/\|/g, "/")} | ${String(r.newBattery).replace(/\|/g, "/")} | ${r.source ? `[link](${r.source})` : "-"} |`);
}
fs.writeFileSync(auditMdPath, `${md.join("\n")}\n`, "utf8");

console.log(`Done. models=${audit.length} fetched=${fetched} missed=${missed} changed=${changed}`);
