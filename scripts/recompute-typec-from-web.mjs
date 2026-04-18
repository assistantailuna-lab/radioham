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
const tmpDir = path.join(root, "tmp");
const auditPath = path.join(tmpDir, "typec-audit.json");
const auditMdPath = path.join(tmpDir, "typec-audit.md");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

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

function extractTitle(html) {
	const m = String(html || "").match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	return m ? cleanText(m[1]) : "";
}

function extractH1(html) {
	const m = String(html || "").match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
	return m ? cleanText(m[1]) : "";
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
			// ignore invalid json-ld
		}
	}
	return out.join(" ");
}

function extractSignalText(html) {
	const parts = [
		extractTitle(html),
		extractH1(html),
		extractMeta(html, "description"),
		extractMeta(html, "og:title"),
		extractMeta(html, "og:description"),
		extractProductJsonLd(html),
	];
	return cleanText(parts.join(" "));
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

async function fetchDuckDuckGoResults(query) {
	const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
	const html = await fetchHtml(url);
	if (!html) return [];
	const results = [];
	const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	for (const m of html.matchAll(re)) {
		const href = m[1] || "";
		const title = cleanText(m[2] || "");
		if (!href) continue;
		const from = Math.max(0, (m.index ?? 0) - 200);
		const to = Math.min(html.length, (m.index ?? 0) + 1400);
		const neighborhood = html.slice(from, to);
		const sm = neighborhood.match(/<[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|div|span)>/i);
		const snippet = cleanText(sm?.[1] || "");
		results.push({ href, title, snippet });
		if (results.length >= 5) break;
	}
	return results;
}

function hasTypeC(text) {
	return /\btype\s*[- ]?\s*c\b|\busb\s*[- ]?\s*c\b|\busbc\b|\busb type c\b|\btype c port\b|\btype c charging\b|\btype-c charging\b|\btype-c battery\b|\bcharged via type-?c\b|\bcharge via usb-?c\b/i.test(
		String(text || "")
	);
}

function hasTypeCNearCharging(text) {
	return /\b(type\s*[- ]?\s*c|usb\s*[- ]?\s*c|usbc)\b[\s\S]{0,48}\b(charge|charging|battery|port|sarj|şarj)\b|\b(charge|charging|battery|port|sarj|şarj)\b[\s\S]{0,48}\b(type\s*[- ]?\s*c|usb\s*[- ]?\s*c|usbc)\b/i.test(
		String(text || "")
	);
}

function hasNonTypeCChargingOnly(text) {
	const t = String(text || "");
	const mentionsMicro = /\bmicro\s*[- ]?\s*usb\b/i.test(t);
	const mentionsDc = /\bdc\s*barrel\b|\bbarrel\b|\bdc jack\b|\bdesk\s*charger\b|\bcharging base\b|\bcharging dock\b/i.test(t);
	return mentionsMicro || mentionsDc;
}

function norm(s) {
	return String(s || "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "");
}

function modelMentioned(text, brand, model) {
	const nt = norm(text);
	const nm = norm(model);
	if (nm && nt.includes(nm)) return true;
	const nb = norm(brand);
	if (nb && nm && nt.includes(nb) && nt.includes(nm.slice(0, Math.min(nm.length, 5)))) return true;
	return false;
}

function buildFallbackUrls(brand, handle) {
	const h = String(handle || "").replace(/^\/+/, "");
	if (!h) return [];
	if (brand === "radtel") {
		return [
			`https://www.radtels.com/products/${h}`,
			`https://radtels.com/products/${h}`,
			`https://www.radtels.com/${h}`,
		];
	}
	if (h.startsWith("products/")) {
		return [
			`https://tidradio.com/${h}`,
			`https://www.tidradio.com/${h}`,
			`https://www.baofengradio.com/${h}`,
		];
	}
	return [];
}

function addEvidence(list, kind, sourceUrl, snippet) {
	list.push({
		kind,
		sourceUrl: sourceUrl || "",
		snippet: String(snippet || "").slice(0, 260),
	});
}

let updated = 0;
let yes = 0;
let no = 0;
const audits = [];

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

		const hints = `${m.model || ""} ${m.title || ""} ${m.source || ""} ${existing.title || ""} ${existing.handle || ""}`;
		const evidences = [];

		if (hasTypeC(hints)) {
			addEvidence(evidences, "hints", m.source || "", hints);
		}

		const candidateUrls = [...new Set([m.source, ...buildFallbackUrls(brand, existing.handle || "")].filter(Boolean))];
		for (const url of candidateUrls) {
			const html = await fetchHtml(url);
			if (!html) continue;
			const signal = extractSignalText(html);
			if (!signal) continue;
			if (hasTypeC(signal) && (modelMentioned(signal, brand, m.model) || modelMentioned(hints, brand, m.model))) {
				addEvidence(evidences, "source-page", url, signal);
				break;
			}
			if (hasTypeCNearCharging(signal) && modelMentioned(signal, brand, m.model)) {
				addEvidence(evidences, "source-page-charge", url, signal);
				break;
			}
		}

		if (evidences.length === 0) {
			const q = `${brand} ${m.model} type-c usb-c charging`;
			const searchRows = await fetchDuckDuckGoResults(q);
			for (const row of searchRows) {
				const searchText = `${row.title} ${row.snippet}`;
				if (hasTypeC(searchText) && modelMentioned(searchText, brand, m.model)) {
					addEvidence(evidences, "search-snippet", row.href, searchText);
					break;
				}
			}
		}

		let typeC = "Yok";
		if (evidences.length > 0) typeC = "Var";
		else if (hasNonTypeCChargingOnly(hints)) typeC = "Yok";

		if (typeC === "Var") yes += 1;
		else no += 1;
		updated += 1;

		specMap.set(key, {
			...existing,
			typeC,
			updatedAt: TODAY,
		});

		audits.push({
			brand,
			model: m.model,
			typeC,
			source: m.source || "",
			evidenceCount: evidences.length,
			evidences,
		});
	}

	const out = models
		.map((x) => specMap.get(String(x.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Type-C updated: ${brand} (${out.length})`);
}

fs.writeFileSync(auditPath, `${JSON.stringify(audits, null, 2)}\n`, "utf8");

const md = [];
md.push("# Type-C Link Audit (2026-04-15)");
md.push("");
md.push(`- Total: **${audits.length}**`);
md.push(`- Var: **${yes}**`);
md.push(`- Yok: **${no}**`);
md.push("");
md.push("| Marka | Model | Type-C | Kanit |");
md.push("|---|---|---|---|");
for (const row of audits) {
	const ev = row.evidences?.[0];
	const proof = ev ? `[${ev.kind}](${ev.sourceUrl || row.source || ""})` : "-";
	md.push(`| ${row.brand} | ${row.model} | ${row.typeC} | ${proof} |`);
}
fs.writeFileSync(auditMdPath, `${md.join("\n")}\n`, "utf8");
console.log(`Done. rows=${updated} typeCYes=${yes} typeCNo=${no}`);
