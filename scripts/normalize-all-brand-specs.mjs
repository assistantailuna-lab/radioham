import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const TODAY = "2026-04-14";

const brands = fs
  .readdirSync(dataDir)
  .filter((f) => f.endsWith("-model-specs.json") && f !== "baofeng-model-specs.json")
  .map((f) => f.replace("-model-specs.json", ""))
  .sort();

function deMojibake(input) {
  const s = String(input ?? "");
  if (!/[ÃâÄÅ�]/.test(s)) return s;
  const fixed = Buffer.from(s, "latin1").toString("utf8");
  const badCount = (v) => (v.match(/[ÃâÄÅ�]/g) || []).length;
  return badCount(fixed) <= badCount(s) ? fixed : s;
}

function cleanText(input) {
  return deMojibake(input)
    .replace(/[–—]/g, "-")
    .replace(/∽/g, "~")
    .replace(/\s+/g, " ")
    .trim();
}

function extractRanges(text) {
  const ranges = [...text.matchAll(/\b\d{2,4}(?:\.\d+)?\s*[-~]\s*\d{2,4}(?:\.\d+)?\s*MHz\b/gi)]
    .map((m) => m[0].replace(/\s+/g, ""));
  const uniq = [...new Set(ranges)];
  if (/PMR\s*446|PMR446/i.test(text)) uniq.unshift("PMR446");
  return [...new Set(uniq)];
}

function normalizeFrequency(raw, title, handle) {
  const text = cleanText(`${raw || ""} ${title || ""} ${handle || ""}`);
  const ranges = extractRanges(text);
  if (ranges.length) return ranges.slice(0, 8).join(" / ");
  if (/PMR\s*446|PMR446/i.test(text)) return "PMR446";
  return "Resmi veri yok";
}

function normalizePower(raw, title, mode) {
  const text = cleanText(`${raw || ""} ${title || ""}`);
  const watts = [...text.matchAll(/\b\d{1,2}(?:\.\d+)?\s*W\b/gi)].map((m) => m[0].replace(/\s+/g, ""));
  const uniq = [...new Set(watts)];
  if (uniq.length === 1) return uniq[0];
  if (uniq.length > 1) return uniq.join(" / ");
  if (/high\/low|high-low/i.test(text)) return "High/Low";
  if (mode === "PMR") return "0.5W";
  return "Resmi veri yok";
}

function normalizeBattery(raw, title) {
  const text = cleanText(`${raw || ""} ${title || ""}`);
  const values = [...text.matchAll(/\b(\d{3,5})\s*mAh\b/gi)].map((m) => Number(m[1]));
  const uniq = [...new Set(values)].filter(Number.isFinite).sort((a, b) => a - b);
  if (uniq.length === 1) return `${uniq[0]}mAh`;
  if (uniq.length > 1) return uniq.map((n) => `${n}mAh`).join(" / ");
  return "Resmi veri yok";
}

function normalizeChannels(raw, title) {
  const text = cleanText(`${raw || ""} ${title || ""}`);
  const m = text.match(/\b(\d{1,4})\s*(kanal|channel|channels|ch)\b/i);
  if (m) return m[1];
  const pure = cleanText(raw || "");
  if (/^\d{1,4}$/.test(pure)) return pure;
  return "Resmi veri yok";
}

function inferMode(raw, title, frequency, bands, handle) {
  const text = cleanText(`${raw || ""} ${title || ""} ${frequency || ""} ${bands || ""} ${handle || ""}`).toLowerCase();
  if (text.includes("dmr")) return "DMR";
  if (text.includes("pmr") || text.includes("pmr446")) return "PMR";
  if (text.includes("poc")) return "PoC";
  if (text.includes("digital")) return "Digital";
  return "Analog";
}

function normalizeBands(raw, title, frequency) {
  const text = cleanText(`${raw || ""} ${title || ""} ${frequency || ""}`).toLowerCase();
  if (text.includes("8 band")) return "8 Band";
  if (text.includes("6 band")) return "6 Band";
  if (text.includes("tri")) return "Tri Band";
  if (text.includes("dual") || (text.includes("vhf") && text.includes("uhf"))) return "Dual Band";
  if (text.includes("pmr")) return "PMR";
  if (text.includes("uhf")) return "UHF";
  if (text.includes("vhf")) return "VHF";
  return "Resmi veri yok";
}

function normalizeWaterproof(raw) {
  const text = cleanText(raw || "");
  const ip = text.match(/\bIP\s?(\d{2}[A-Z0-9]*)\b/i)?.[0];
  return ip ? ip.replace(/\s+/g, "").toUpperCase() : "Resmi IP derecesi yok";
}

function sourceToHandle(source, fallback) {
  if (!source) return fallback || "";
  try {
    const url = new URL(source);
    return decodeURIComponent(url.pathname.replace(/^\/+/, "")) || fallback || "";
  } catch {
    return fallback || "";
  }
}

for (const brand of brands) {
  const modelsPath = path.join(dataDir, `${brand}-models.json`);
  const specsPath = path.join(dataDir, `${brand}-model-specs.json`);
  if (!fs.existsSync(modelsPath) || !fs.existsSync(specsPath)) continue;

  const models = JSON.parse(fs.readFileSync(modelsPath, "utf8"));
  const specs = JSON.parse(fs.readFileSync(specsPath, "utf8"));
  const specMap = new Map(specs.map((s) => [String(s.model), s]));

  const out = models.map((m) => {
    const existing = specMap.get(String(m.model)) || {};
    const title = cleanText(existing.title || m.title || "");
    const handle = cleanText(existing.handle || sourceToHandle(m.source, ""));
    const frequency = normalizeFrequency(existing.frequency, title, handle);
    const bands = normalizeBands(existing.bands, title, frequency);
    const mode = inferMode(existing.mode, title, frequency, bands, handle);

    return {
      model: cleanText(m.model || existing.model || ""),
      title,
      handle,
      bands,
      frequency,
      power: normalizePower(existing.power, title, mode),
      battery: normalizeBattery(existing.battery, title),
      channels: normalizeChannels(existing.channels, title),
      waterproof: normalizeWaterproof(existing.waterproof),
      mode,
      priceUsd: cleanText(existing.priceUsd || ""),
      updatedAt: TODAY,
    };
  });

  fs.writeFileSync(specsPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
  console.log(`Normalized ${brand}: ${out.length} rows`);
}

