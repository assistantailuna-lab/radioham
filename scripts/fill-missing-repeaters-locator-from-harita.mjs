import fs from "node:fs";

const HARITA_PATH = "tmp/amatortelsizcilik-harita.html";
const DATA_PATH = "src/data/tr-repeaters.ts";
const REPORT_JSON = "tmp/harita-locator-sync-report.json";
const REPORT_MD = "tmp/harita-locator-sync-report.md";

const trMap = {
  "Ç":"C","Ğ":"G","İ":"I","I":"I","Ö":"O","Ş":"S","Ü":"U",
  "ç":"C","ğ":"G","ı":"I","i":"I","ö":"O","ş":"S","ü":"U",
};

const normalizeText = (value) =>
  String(value ?? "")
    .replace(/[ÇĞİIÖŞÜçğıiöşü]/g, (ch) => trMap[ch] ?? ch)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();

const tokenize = (value) =>
  normalizeText(value)
    .split(/\s+/)
    .filter(Boolean)
    .filter((t) => !new Set(["DAGI","DAG","TEPE","TP","MERKEZI","SEHIR","MAH","MH","MT","MEVKI","MEVKII","YAYINDA"]).has(t));

const jaccard = (aTokens, bTokens) => {
  if (aTokens.length === 0 && bTokens.length === 0) return 1;
  if (aTokens.length === 0 || bTokens.length === 0) return 0;
  const a = new Set(aTokens);
  const b = new Set(bTokens);
  let inter = 0;
  for (const t of a) if (b.has(t)) inter += 1;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 0;
};

const bandKey = (rawBand, rawChannel = "") => {
  const b = normalizeText(rawBand);
  const c = normalizeText(rawChannel);
  const combined = `${b} ${c}`;
  if (combined.includes("CROSS")) return "CROSS";
  if (combined.includes("APRS")) return "APRS";
  if (combined.includes("ECHO")) return "ECHO";
  if (combined.includes("UHF")) return "UHF";
  if (combined.includes("VHF")) return "VHF";
  return b || "";
};

const isMissingLocator = (locator) => {
  const v = String(locator ?? "").trim();
  if (!v) return true;
  const u = normalizeText(v);
  if (!u) return true;
  if (/X{2,}/.test(u)) return true;
  if (u === "KOXXXX" || u === "KMXXXX") return true;
  return false;
};

const cityVariants = (row) => {
  const variants = new Set();
  const ana = normalizeText(row.anaIl);
  const il = normalizeText(row.il);
  if (ana) variants.add(ana);
  if (il) variants.add(il.split(" ")[0]);
  if (il.includes("/")) variants.add(il.split("/")[0].trim());
  if (ana === "AFYON") variants.add("AFYONKARAHISAR");
  if (ana === "URFA") variants.add("SANLIURFA");
  if (ana === "KAHRAMANMARAS") variants.add("MARA\u015e");
  return [...variants].map(normalizeText).filter(Boolean);
};

const html = fs.readFileSync(HARITA_PATH, "utf8");
const markerRegex = /let\s+popupContent\s*=\s*`([\s\S]*?)`;[\s\S]*?L\.marker\s*\(\s*\[\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*\]\s*,\s*\{\s*icon:\s*icons\['([^']+)'\]\s*\}/g;
const markers = [];
let m;
while ((m = markerRegex.exec(html)) !== null) {
  const popup = m[1] ?? "";
  const lat = Number(m[2]);
  const lon = Number(m[3]);
  const band = bandKey(m[4]);
  const cityMatch = popup.match(/<h3[^>]*>([^<]+)<\/h3>/i);
  const placeMatch = popup.match(/<p[^>]*>([^<]*)<\/p>/i);
  const roleMatch = popup.match(/href=\"\/role\/(\d+)\"/i);
  const city = normalizeText(cityMatch?.[1] ?? "");
  const place = String(placeMatch?.[1] ?? "").trim();
  if (!city || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
  markers.push({
    city,
    place,
    placeNorm: normalizeText(place),
    placeTokens: tokenize(place),
    band,
    lat,
    lon,
    roleId: roleMatch?.[1] ?? "",
  });
}

const markerGroups = new Map();
for (const mk of markers) {
  const key = `${mk.city}|${mk.band}`;
  if (!markerGroups.has(key)) markerGroups.set(key, []);
  markerGroups.get(key).push(mk);
}

const source = fs.readFileSync(DATA_PATH, "utf8");
const arrayMatch = source.match(/export const trRepeaters: TrRepeater\[] = (\[[\s\S]*\]);/);
if (!arrayMatch) throw new Error("trRepeaters array not found");
const repeaters = JSON.parse(arrayMatch[1]);

const updates = [];
const unresolved = [];

for (const row of repeaters) {
  if (!isMissingLocator(row.locator)) continue;

  const bKey = bandKey(row.band, row.kanal);
  if (!bKey) {
    unresolved.push({ id: row.id, reason: "band yok", il: row.il, band: row.band, yeri: row.yeri });
    continue;
  }

  const rowPlace = String(row.yeri ?? "").trim();
  const rowTokens = tokenize(rowPlace);
  const rowPlaceNorm = normalizeText(rowPlace);

  const cands = [];
  for (const city of cityVariants(row)) {
    const list = markerGroups.get(`${city}|${bKey}`) ?? [];
    for (const cand of list) cands.push(cand);
  }

  if (cands.length === 0) {
    unresolved.push({ id: row.id, reason: "aday yok", il: row.il, band: row.band, yeri: row.yeri });
    continue;
  }

  const scored = cands.map((cand) => {
    let score = jaccard(rowTokens, cand.placeTokens);
    if (rowPlaceNorm && cand.placeNorm) {
      if (rowPlaceNorm === cand.placeNorm) score += 1;
      if (cand.placeNorm.includes(rowPlaceNorm) || rowPlaceNorm.includes(cand.placeNorm)) score += 0.35;
    }
    return { cand, score };
  }).sort((a, b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  let accept = false;
  if (!rowPlaceNorm && cands.length === 1) accept = true;
  else if (best.score >= 1) accept = true;
  else if (best.score >= 0.55) accept = true;
  else if (best.score >= 0.35 && (!second || best.score - second.score >= 0.2)) accept = true;
  else if (cands.length === 1 && best.score >= 0.2) accept = true;

  if (!accept) {
    unresolved.push({
      id: row.id,
      reason: "dusuk guven",
      il: row.il,
      band: row.band,
      yeri: row.yeri,
      bestCandidate: {
        city: best.cand.city,
        place: best.cand.place,
        band: best.cand.band,
        lat: best.cand.lat,
        lon: best.cand.lon,
        score: Number(best.score.toFixed(3)),
      },
    });
    continue;
  }

  const locator = `${best.cand.lat.toFixed(6)} ${best.cand.lon.toFixed(6)}`;
  updates.push({
    id: row.id,
    il: row.il,
    band: row.band,
    yeri: row.yeri,
    oldLocator: row.locator,
    newLocator: locator,
    matchedCity: best.cand.city,
    matchedPlace: best.cand.place,
    roleId: best.cand.roleId,
    score: Number(best.score.toFixed(3)),
  });
}

if (updates.length > 0) {
  const byId = new Map(updates.map((u) => [String(u.id), u.newLocator]));
  const updatedSource = source.replace(/(\{\s*"id"\s*:\s*(\d+),[\s\S]*?"locator"\s*:\s*")([^"]*)("[\s\S]*?\})/g, (full, p1, id, oldLoc, p4) => {
    const repl = byId.get(String(id));
    if (!repl) return full;
    return `${p1}${repl}${p4}`;
  });
  fs.writeFileSync(DATA_PATH, updatedSource, "utf8");
}

const report = {
  sourceMarkers: markers.length,
  totalRepeaters: repeaters.length,
  missingBefore: repeaters.filter((r) => isMissingLocator(r.locator)).length,
  updatedCount: updates.length,
  unresolvedCount: unresolved.length,
  updated: updates,
  unresolved,
};

fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2), "utf8");

const lines = [];
lines.push(`# Harita Locator Senkron Raporu`);
lines.push(``);
lines.push(`- Kaynak marker sayısı: ${report.sourceMarkers}`);
lines.push(`- Bizde konumu eksik kayıt sayısı (önce): ${report.missingBefore}`);
lines.push(`- Güncellenen kayıt: ${report.updatedCount}`);
lines.push(`- Eşleşmeyen kayıt: ${report.unresolvedCount}`);
lines.push(``);
lines.push(`## Güncellenenler`);
for (const u of updates.slice(0, 120)) {
  lines.push(`- #${u.id} | ${u.il} | ${u.band} | ${u.yeri || "-"} -> ${u.newLocator} (kaynak: ${u.matchedPlace || "-"}, role/${u.roleId || "?"}, skor ${u.score})`);
}
if (updates.length > 120) {
  lines.push(`- ... ${updates.length - 120} kayıt daha (JSON raporda).`);
}
lines.push(``);
lines.push(`## Eşleşmeyen İlk 80 Kayıt`);
for (const u of unresolved.slice(0, 80)) {
  lines.push(`- #${u.id} | ${u.il} | ${u.band} | ${u.yeri || "-"} | neden: ${u.reason}`);
}

fs.writeFileSync(REPORT_MD, lines.join("\n"), "utf8");

console.log(JSON.stringify({ updated: updates.length, unresolved: unresolved.length }, null, 2));
