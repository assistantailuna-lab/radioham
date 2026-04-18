import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const tmpDir = path.join(root, "tmp");
const auditJsonPath = path.join(tmpDir, "bluetooth-battery-link-audit.json");
const auditMdPath = path.join(tmpDir, "bluetooth-battery-link-audit.md");
const TODAY = "2026-04-17";

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
			// ignore
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

async function fetchDuckDuckGoResults(query) {
	const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
	const html = await fetchHtml(url);
	if (!html) return [];
	const rows = [];
	const re = /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
	for (const m of html.matchAll(re)) {
		const href = m[1] || "";
		const title = cleanText(m[2] || "");
		const from = Math.max(0, (m.index ?? 0) - 200);
		const to = Math.min(html.length, (m.index ?? 0) + 1400);
		const neighborhood = html.slice(from, to);
		const sm = neighborhood.match(/<[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/(?:a|div|span)>/i);
		const snippet = cleanText(sm?.[1] || "");
		if (!href) continue;
		rows.push({ href, title, snippet });
		if (rows.length >= 5) break;
	}
	return rows;
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

function hasBluetoothPositive(text) {
	return /\bbluetooth\b|\bblue tooth\b|\bbt\b|\bapp programming\b|\bwireless programming\b/i.test(String(text || ""));
}

function hasBluetoothNegative(text) {
	return /\bno bluetooth\b|\bwithout bluetooth\b|\bbluetooth yok\b|\bnot support bluetooth\b/i.test(String(text || ""));
}

function decideBluetooth(brand, model, hints, sourceSignals, searchSignals) {
	const allHints = String(hints || "");
	if (hasBluetoothNegative(allHints)) return { value: "Yok", reason: "hints-negative" };
	if (hasBluetoothPositive(allHints)) return { value: "Var", reason: "hints-positive" };

	for (const s of sourceSignals) {
		if (!modelMentioned(s.text, brand, model)) continue;
		if (hasBluetoothNegative(s.text)) return { value: "Yok", reason: "source-negative", sourceUrl: s.url };
		if (hasBluetoothPositive(s.text)) return { value: "Var", reason: "source-positive", sourceUrl: s.url };
	}
	for (const s of searchSignals) {
		const t = `${s.title} ${s.snippet}`;
		if (!modelMentioned(t, brand, model)) continue;
		if (hasBluetoothNegative(t)) return { value: "Yok", reason: "search-negative", sourceUrl: s.url };
		if (hasBluetoothPositive(t)) return { value: "Var", reason: "search-positive", sourceUrl: s.url };
	}
	return { value: "Yok", reason: "no-evidence" };
}

function parseBatteryCandidates(text) {
	const t = String(text || "");
	const caps = [...t.matchAll(/\b(\d{3,5})\s*mAh\b/gi)]
		.map((m) => Number(m[1]))
		.filter((n) => Number.isFinite(n) && n >= 500 && n <= 7000);
	const uniqueCaps = [...new Set(caps)].sort((a, b) => b - a);

	const noBattery = /\b(no battery|without battery|external power|vehicle power|car power)\b|arac\/harici besleme/i.test(t);
	return { uniqueCaps, noBattery };
}

function decideBattery(existingBattery, hints, sourceSignals, searchSignals) {
	// Batarya icin once urun sayfasi metni; arama snippet'leri aksesuar/noise uretebilir.
	const useSearchFallback = sourceSignals.length === 0;
	const allTexts = [
		String(hints || ""),
		...sourceSignals.map((s) => s.text),
		...(useSearchFallback ? searchSignals.map((s) => `${s.title} ${s.snippet}`) : []),
	];
	const merged = allTexts.join(" ");
	const cand = parseBatteryCandidates(merged);
	if (cand.noBattery) return { value: "Arac/harici besleme (batarya yok)", reason: "no-battery" };
	if (cand.uniqueCaps.length === 1) return { value: `${cand.uniqueCaps[0]}mAh`, reason: "single-cap" };
	if (cand.uniqueCaps.length > 1) {
		const top = cand.uniqueCaps.slice(0, 3).map((n) => `${n}mAh`);
		return { value: top.join(" / "), reason: "multi-cap" };
	}
	return { value: existingBattery || "Veri yok", reason: "keep-existing" };
}

const audit = [];
let total = 0;
let fetched = 0;
let fetchMiss = 0;
let updatedBluetooth = 0;
let updatedBattery = 0;

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

		const sourceSignals = [];
		const candidateUrls = [...new Set([m.source, ...buildFallbackUrls(brand, existing.handle || "")].filter(Boolean))];
		for (const url of candidateUrls) {
			const html = await fetchHtml(url);
			const signal = extractSignalText(html);
			if (!signal) continue;
			sourceSignals.push({ url, text: signal });
			break; // ilk dolu ürün sinyali yeterli
		}
		if (sourceSignals.length > 0) fetched += 1;
		else fetchMiss += 1;

		const [q1, q2] = await Promise.all([
			fetchDuckDuckGoResults(`${brand} ${m.model} bluetooth`),
			fetchDuckDuckGoResults(`${brand} ${m.model} battery mAh`),
		]);
		const searchSignals = [...q1, ...q2].map((x) => ({ url: x.href, title: x.title, snippet: x.snippet }));

		const btDecision = decideBluetooth(brand, m.model, hints, sourceSignals, searchSignals);
		const batDecision = decideBattery(String(existing.battery || ""), hints, sourceSignals, searchSignals);

		const oldBluetooth = String(existing.bluetooth || "");
		const oldBattery = String(existing.battery || "");
		if (oldBluetooth !== btDecision.value) updatedBluetooth += 1;
		if (oldBattery !== batDecision.value) updatedBattery += 1;
		total += 1;

		specMap.set(key, {
			...existing,
			bluetooth: btDecision.value,
			battery: batDecision.value,
			updatedAt: TODAY,
		});

		audit.push({
			brand,
			model: m.model,
			source: m.source || "",
			oldBluetooth,
			newBluetooth: btDecision.value,
			bluetoothReason: btDecision.reason,
			bluetoothEvidenceUrl: btDecision.sourceUrl || sourceSignals[0]?.url || "",
			oldBattery,
			newBattery: batDecision.value,
			batteryReason: batDecision.reason,
			sourceFetched: sourceSignals.length > 0,
		});
	}

	const out = models
		.map((x) => specMap.get(String(x.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));
	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Manual verified bluetooth+battery: ${brand} (${out.length})`);
}

fs.writeFileSync(auditJsonPath, `${JSON.stringify(audit, null, 2)}\n`, "utf8");

const md = [];
md.push("# Bluetooth/Battery Link Audit (2026-04-17)");
md.push("");
md.push(`- Total models: **${total}**`);
md.push(`- Source fetched: **${fetched}**`);
md.push(`- Source missing: **${fetchMiss}**`);
md.push(`- Bluetooth updated: **${updatedBluetooth}**`);
md.push(`- Battery updated: **${updatedBattery}**`);
md.push("");
md.push("| Marka | Model | Kaynak | Bluetooth (eski=>yeni) | Batarya (eski=>yeni) |");
md.push("|---|---|---|---|---|");
for (const row of audit) {
	const link = row.bluetoothEvidenceUrl || row.source;
	const source = link ? `[link](${link})` : "-";
	md.push(
		`| ${row.brand} | ${row.model} | ${source} | ${row.oldBluetooth} => ${row.newBluetooth} | ${String(row.oldBattery).replace(/\|/g, "/")} => ${String(row.newBattery).replace(/\|/g, "/")} |`
	);
}
fs.writeFileSync(auditMdPath, `${md.join("\n")}\n`, "utf8");

console.log(
	`Done. total=${total} fetched=${fetched} missing=${fetchMiss} bluetoothUpdated=${updatedBluetooth} batteryUpdated=${updatedBattery} audit=${auditMdPath}`
);
