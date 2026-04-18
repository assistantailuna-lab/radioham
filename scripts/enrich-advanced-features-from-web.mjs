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
		.replace(/<\/(p|div|li|h1|h2|h3|h4|h5|h6|tr|td|span|strong|section)>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&quot;/gi, '"')
		.replace(/&#39;/gi, "'")
		.replace(/&ouml;/gi, "ö")
		.replace(/&uuml;/gi, "ü")
		.replace(/&ccedil;/gi, "ç")
		.replace(/&iacute;/gi, "i")
		.replace(/\s+/g, " ")
		.trim();
}

function extractMetaByName(html, name) {
	const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"));
	return m ? cleanText(m[1]) : "";
}

function extractTitle(html) {
	const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
	return m ? cleanText(m[1]) : "";
}

function extractH1(html) {
	const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
	return m ? cleanText(m[1]) : "";
}

function extractProductJsonLd(html) {
	const chunks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
	const out = [];
	for (const chunk of chunks) {
		try {
			const obj = JSON.parse(chunk);
			const list = Array.isArray(obj) ? obj : [obj];
			for (const node of list) {
				const type = String(node?.["@type"] || "").toLowerCase();
				if (type.includes("product")) {
					out.push(cleanText(node.name || ""));
					out.push(cleanText(node.description || ""));
				}
			}
		} catch {
			// ignore invalid json-ld
		}
	}
	return out.filter(Boolean).join(" ");
}

function extractSignalText(html, model, title) {
	const parts = [];
	parts.push(cleanText(model));
	parts.push(cleanText(title));
	parts.push(extractTitle(html));
	parts.push(extractH1(html));
	parts.push(extractMetaByName(html, "description"));
	parts.push(extractMetaByName(html, "og:title"));
	parts.push(extractMetaByName(html, "og:description"));
	parts.push(extractProductJsonLd(html));

	// Sadece ana urun icerigi olabilecek bolumlerden sinyal al.
	const focusedChunks = [
		...html.matchAll(/<(?:table|ul|div)[^>]*(?:product|spec|ozellik|feature|description|accordion|tabs?)[^>]*>([\s\S]{0,12000}?)<\/(?:table|ul|div)>/gi),
	].map((m) => cleanText(m[1]));
	parts.push(focusedChunks.join(" "));

	return cleanText(parts.join(" "));
}

function yesNoByRegex(text, patterns) {
	return patterns.some((rx) => rx.test(text)) ? "Var" : "Yok";
}

function extractScreenSize(text, existing, mode) {
	if (existing && String(existing).trim()) {
		const normalized = String(existing)
			.replace(/inÃ§/gi, "inch")
			.replace(/Web kaynaginda net ekran boyutu bulunamadi/gi, "Veri yok")
			.trim();
		return normalized;
	}

	const t = String(text || "");
	const explicitNone = [
		/ekrans[iı]z/i,
		/ekran yok/i,
		/no screen/i,
		/screenless/i,
		/display:?\s*none/i,
	].some((rx) => rx.test(t));
	if (explicitNone) return "Ekran yok";

	const patterns = [
		/(\d(?:\.\d{1,2})?)\s*(?:inç|inch|in)\s*(?:ekran|lcd|tft|display)/gi,
		/(?:ekran|lcd|tft|display)\s*(?:boyutu|size)?\s*(\d(?:\.\d{1,2})?)\s*(?:inç|inch|in)/gi,
		/(\d(?:\.\d{1,2})?)\s*(?:"|”|''|in)\s*(?:lcd|tft|display|ekran)/gi,
	];

	const values = [];
	for (const rx of patterns) {
		for (const m of t.matchAll(rx)) {
			const num = Number(m[1]);
			if (Number.isFinite(num) && num >= 0.8 && num <= 8) values.push(num);
		}
	}
	if (values.length) return `${Math.max(...values)} inch`;

	if (/pmr446|pmr/i.test(String(mode || ""))) return "Ekran yok";
	return "Veri yok";
}

function finalizeDualPtt(existing, detectedDualPtt, detectedSideKey, textLower) {
	if (detectedDualPtt !== "Yok") return detectedDualPtt;
	if (detectedSideKey === "Var") return "Duzenlenebilir";

	const model = String(existing?.model || "").toUpperCase();
	const mode = String(existing?.mode || "").toUpperCase();
	const battery = String(existing?.battery || "").toLowerCase();
	const channelsText = String(existing?.channels || "");
	const ch = Number((channelsText.match(/\d{1,5}/) || [""])[0] || 0);

	const modelLikelyProgrammable = /UV-|\bK5\b|\bK6\b|\bH3\b|\bH8\b|\bH9\b|MD-UV|AT-D-878|DM-170|DR180|RT-6D|RT-7D|RT-79|RT-88|RT-89|RT-90|RT-91|RT-95/.test(model);
	const likelyBySpecs = mode !== "PMR" && ch >= 128 && !battery.includes("arac/harici");
	const likelyByText = textLower.includes("side key") || textLower.includes("shortcut key") || textLower.includes("pf1") || textLower.includes("pf2");

	if (modelLikelyProgrammable || likelyBySpecs || likelyByText) return "Duzenlenebilir";
	return "Yok";
}

async function fetchPage(url) {
	try {
		const res = await fetch(url, { headers });
		if (!res.ok) return "";
		const buf = await res.arrayBuffer();
		return new TextDecoder("utf-8").decode(buf);
	} catch {
		return "";
	}
}

function enrichAdvanced(existing, combinedText) {
	const text = String(combinedText || "");
	const textLower = text.toLowerCase();

	const bluetooth = yesNoByRegex(text, [
		/\bbluetooth\b/i,
		/\bblue\s*tooth\b/i,
		/\bbt\s*program/i,
		/\bapp\s+program/i,
	]);

	const gps = yesNoByRegex(text, [/\bgps\b/i, /\bgnss\b/i, /\bbeidou\b/i]);
	const aprs = yesNoByRegex(text, [/\baprs\b/i, /automatic packet reporting system/i]);
	const sms = yesNoByRegex(text, [/\bsms\b/i, /\btext message\b/i, /\bmessage call\b/i, /\bmessage send\b/i]);

	const dualPtt = yesNoByRegex(text, [
		/\bdual\s*ptt\b/i,
		/\bdouble\s*ptt\b/i,
		/\bcift\s*ptt\b/i,
		/\biki\s*ptt\b/i,
		/\ba\/b\s*ptt\b/i,
		/\bindependent\s*ptt\b/i,
	]);

	const sideKeyProgrammable = yesNoByRegex(text, [
		/\bprogrammable key\b/i,
		/\bprogrammable side key\b/i,
		/\bprogram key\b/i,
		/\bpf1?\b/i,
		/\bpf2\b/i,
		/\bside key\b/i,
		/\bshortcut key\b/i,
		/\bcustom(?:izable)? key\b/i,
		/\bkey assignment\b/i,
		/\bkey customize\b/i,
		/\blong press key\b/i,
		/\bshort press key\b/i,
		/\byan\s*tus\s*atan/i,
		/\btus\s*atanabilir/i,
		/\byan\s*tus\s*(?:program|ozel)/i,
		/\bcustom key\b/i,
	]);

	const dualPttFinal = finalizeDualPtt(existing, dualPtt, sideKeyProgrammable, textLower);

	return {
		bluetooth,
		gps,
		aprs,
		sms,
		dualPtt: dualPttFinal,
		sideKeyProgrammable,
		screenSize: extractScreenSize(text, existing.screenSize, existing.mode),
	};
}

let total = 0;

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

		const html = await fetchPage(m.source);
		const signalText = extractSignalText(html, m.model || "", existing.title || m.title || "");
		const combined = `${existing.title || ""} ${m.title || ""} ${m.model || ""} ${signalText}`;

		const adv = enrichAdvanced(existing, combined);
		specMap.set(key, {
			...existing,
			...adv,
			updatedAt: TODAY,
		});
		total += 1;
	}

	const out = models
		.map((m) => specMap.get(String(m.model || "").toUpperCase()))
		.filter(Boolean)
		.sort((a, b) => String(a.model || "").localeCompare(String(b.model || ""), "tr"));

	fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Enriched ${brand}: ${out.length}`);
}

console.log(`Done. Updated records: ${total}`);
