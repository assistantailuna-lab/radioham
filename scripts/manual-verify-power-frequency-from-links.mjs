import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const tmpDir = path.join(root, "tmp");
const auditJsonPath = path.join(tmpDir, "power-frequency-link-audit.json");
const auditMdPath = path.join(tmpDir, "power-frequency-link-audit.md");
const TODAY = "2026-04-15";

if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

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
			// ignore invalid json
		}
	}
	return out.join(" ");
}

function extractSignalText(html) {
	return cleanText(
		[
			extractTitle(html),
			extractH1(html),
			extractMeta(html, "description"),
			extractMeta(html, "og:title"),
			extractMeta(html, "og:description"),
			extractProductJsonLd(html),
		].join(" ")
	);
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

function looksNonHtmlSource(url) {
	const u = String(url || "").toLowerCase();
	if (!u) return true;
	if (/\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u)) return true;
	if (u.includes("cdn.shopify.com")) return true;
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
			`https://radtel.com/products/${h}`,
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

function uniq(arr) {
	return [...new Set(arr)];
}

function extractFrequencyEvidence(text) {
	const t = String(text || "");
	const ranges = uniq(
		[...t.matchAll(/\b(\d{2,4}(?:\.\d+)?)\s*[-~]\s*(\d{2,4}(?:\.\d+)?)\s*mhz\b/gi)].map(
			(m) => `${m[1]}-${m[2]}MHz`
		)
	);
	const pmr = /\bpmr\s*446\b|\bpmr446\b/i.test(t) ? ["PMR446"] : [];
	const rxTx = [...t.matchAll(/\b(tx|rx)\s*[:=]\s*([^;,.|]{6,80})/gi)].map((m) => `${m[1].toUpperCase()}: ${m[2].trim()}`);
	return { ranges, pmr, rxTx };
}

function chooseFrequency(existing, evidence) {
	const old = String(existing || "");
	const candidates = [...evidence.pmr, ...evidence.ranges];
	if (evidence.rxTx.length >= 2) {
		const tx = evidence.rxTx.find((x) => x.startsWith("TX:"));
		const rx = evidence.rxTx.find((x) => x.startsWith("RX:"));
		if (tx && rx) return `${tx}; ${rx}`;
	}
	if (old.includes("TX:") || old.includes("RX:")) {
		// Eski veri TX/RX ayrimliysa, daha zayif tek satir adayla ezme.
		if (evidence.rxTx.length < 2) return old;
	}
	if (candidates.length >= 2) return candidates.join(" / ");
	if (candidates.length === 1) {
		// Eski veri birden cok aralik iceriyorsa tek aralikla daraltma.
		if ((old.match(/MHz/g) || []).length >= 2) return old;
		return candidates[0];
	}
	return existing || "Veri yok";
}

function extractPowerEvidence(text) {
	const t = String(text || "");
	const watts = uniq([...t.matchAll(/\b(\d{1,2}(?:\.\d+)?)\s*w\b/gi)].map((m) => Number(m[1]).toString()));
	const levelPatterns = uniq(
		[...t.matchAll(/\b(\d{1,2}(?:\.\d+)?)\s*w\s*\/\s*(\d{1,2}(?:\.\d+)?)\s*w(?:\s*\/\s*(\d{1,2}(?:\.\d+)?)\s*w)?/gi)].map((m) =>
			[m[1], m[2], m[3]].filter(Boolean).join(" / ") + "W"
		)
	);
	return { watts, levelPatterns };
}

function choosePower(existing, evidence) {
	const old = String(existing || "");
	if (evidence.levelPatterns.length > 0) return evidence.levelPatterns[0];
	if (evidence.watts.length === 1) return `${evidence.watts[0]}W`;
	if (evidence.watts.length > 1) {
		const nums = evidence.watts.map(Number).filter(Number.isFinite).sort((a, b) => b - a);
		const top = uniq(nums).slice(0, 3).map((n) => `${n}W`);
		return top.join(" / ");
	}
	// Eski veri kademeli gucse, tek degerle sadeleştirme yapma.
	if (old.includes("/")) return old;
	return existing || "Veri yok";
}

function takeSnippet(text, patterns) {
	const t = String(text || "");
	for (const rx of patterns) {
		const m = t.match(rx);
		if (m && m.index != null) return t.slice(Math.max(0, m.index - 70), Math.min(t.length, m.index + 180));
	}
	return t.slice(0, 180);
}

const audit = [];
let total = 0;
let updatedPower = 0;
let updatedFrequency = 0;
let fetched = 0;
let fetchMiss = 0;

for (const modelsFile of modelFiles) {
	const brand = modelsFile.replace("-models.json", "");
	const modelsPath = path.join(dataDir, modelsFile);
	const specsPath = path.join(dataDir, `${brand}-model-specs.json`);
	if (!fs.existsSync(specsPath)) continue;

	const models = JSON.parse(fs.readFileSync(modelsPath, "utf8"));
	const specs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
	const specMap = new Map(specs.map((s) => [String(s.model || "").toUpperCase(), s]));

	for (const model of models) {
		const key = String(model.model || "").toUpperCase();
		const existing = specMap.get(key);
		if (!existing) continue;

		let html = await fetchHtml(model.source);
		let finalSource = model.source || "";
		if (looksNonHtmlSource(model.source) || !extractSignalText(html)) {
			const candidates = buildFallbackUrls(brand, existing.handle || "");
			for (const url of candidates) {
				const tryHtml = await fetchHtml(url);
				const sig = extractSignalText(tryHtml);
				if (sig) {
					html = tryHtml;
					finalSource = url;
					break;
				}
			}
		}
		const signal = extractSignalText(html);
		if (signal) fetched += 1;
		else fetchMiss += 1;

		const freqEv = extractFrequencyEvidence(signal);
		const powerEv = extractPowerEvidence(signal);
		const oldFrequency = String(existing.frequency || "");
		const oldPower = String(existing.power || "");
		const frequency = chooseFrequency(oldFrequency, freqEv);
		const power = choosePower(oldPower, powerEv);

		if (frequency !== oldFrequency) updatedFrequency += 1;
		if (power !== oldPower) updatedPower += 1;
		total += 1;

		specMap.set(key, {
			...existing,
			frequency,
			power,
			updatedAt: TODAY,
		});

		audit.push({
			brand,
			model: model.model,
			source: finalSource,
			oldFrequency,
			newFrequency: frequency,
			oldPower,
			newPower: power,
			frequencyEvidence: takeSnippet(signal, [/\b\d{2,4}(?:\.\d+)?\s*[-~]\s*\d{2,4}(?:\.\d+)?\s*mhz\b/i, /\bpmr\s*446\b/i, /\btx\s*[:=]/i]),
			powerEvidence: takeSnippet(signal, [/\b\d{1,2}(?:\.\d+)?\s*w\b/i]),
			fetchOk: Boolean(signal),
		});
	}

	const out = models
		.map((m) => specMap.get(String(m.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Manual verified power/frequency: ${brand} (${out.length})`);
}

fs.writeFileSync(auditJsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");

const mdLines = [];
mdLines.push("# Power/Frequency Link Audit (2026-04-15)");
mdLines.push("");
mdLines.push(`- Total models: **${total}**`);
mdLines.push(`- Source fetched: **${fetched}**`);
mdLines.push(`- Source missing/blocked: **${fetchMiss}**`);
mdLines.push(`- Frequency updated: **${updatedFrequency}**`);
mdLines.push(`- Power updated: **${updatedPower}**`);
mdLines.push("");
mdLines.push("| Marka | Model | Kaynak | Eski Frekans | Yeni Frekans | Eski Guc | Yeni Guc |");
mdLines.push("|---|---|---|---|---|---|---|");
for (const row of audit) {
	const source = row.source ? `[link](${row.source})` : "-";
	mdLines.push(
		`| ${row.brand} | ${row.model} | ${source} | ${String(row.oldFrequency).replace(/\|/g, "/")} | ${String(row.newFrequency).replace(/\|/g, "/")} | ${String(row.oldPower).replace(/\|/g, "/")} | ${String(row.newPower).replace(/\|/g, "/")} |`
	);
}
fs.writeFileSync(auditMdPath, `${mdLines.join("\n")}\n`, "utf8");

console.log(
	`Done. total=${total} fetched=${fetched} missing=${fetchMiss} frequencyUpdated=${updatedFrequency} powerUpdated=${updatedPower} audit=${auditMdPath}`
);
