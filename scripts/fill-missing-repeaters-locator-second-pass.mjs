import fs from 'node:fs';

const HARITA_PATH = 'tmp/amatortelsizcilik-harita.html';
const DATA_PATH = 'src/data/tr-repeaters.ts';
const REPORT_PATH = 'tmp/harita-locator-second-pass.json';

const trMap = {
  'Ç':'C','Ğ':'G','İ':'I','I':'I','Ö':'O','Ş':'S','Ü':'U',
  'ç':'C','ğ':'G','ı':'I','i':'I','ö':'O','ş':'S','ü':'U'
};
const normalizeText = (v) => String(v ?? '')
  .replace(/[ÇĞİIÖŞÜçğıiöşü]/g, (ch) => trMap[ch] ?? ch)
  .toUpperCase()
  .replace(/[^A-Z0-9]+/g, ' ')
  .trim();

const stop = new Set(['DAGI','DAG','TEPE','TEPESI','TP','MEVKII','MEVKI','MERKEZI','MERKEZ','SEHIR','KY','KOYU','MH','MAH']);
const tokens = (v) => normalizeText(v).split(/\s+/).filter(Boolean).filter((t) => !stop.has(t));
const jaccard = (a,b) => {
  if (!a.length && !b.length) return 1;
  if (!a.length || !b.length) return 0;
  const A = new Set(a); const B = new Set(b);
  let i=0; for (const t of A) if (B.has(t)) i++;
  const u = new Set([...A,...B]).size;
  return u ? i/u : 0;
};

const parseFreq = (raw) => {
  const s = String(raw ?? '').trim().replace(',', '.');
  if (!s) return null;
  let m = s.match(/(\d{3}\.\d{1,4})/);
  if (m) return Number(m[1]);
  const compact = s.replace(/[^\d.]/g,'');
  if (!compact) return null;
  if ((compact.match(/\./g) ?? []).length > 1) {
    const head = compact.slice(0, compact.indexOf('.') + 1);
    const tail = compact.slice(compact.indexOf('.') + 1).replace(/\./g, '');
    const n = Number(head + tail);
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(compact);
  return Number.isFinite(n) ? n : null;
};

const cityAliasMap = new Map([
  ['BALIESIR','BALIKESIR'],
  ['ELEZIG','ELAZIG'],
  ['K MARAS','KAHRAMANMARAS'],
  ['KMARAS','KAHRAMANMARAS'],
  ['KONY','KONYA'],
  ['SANLI URFA','SANLIURFA'],
  ['KOCAELI IZMIT','KOCAELI'],
  ['BALIKESIR EDREMIT','BALIKESIR'],
  ['IZMIR MENEMEN','IZMIR'],
  ['OSMANIYE KADIRLI','OSMANIYE'],
  ['KONY EREGLI','KONYA'],
  ['AFYON','AFYON'],
]);

const canonicalCity = (raw) => {
  const n = normalizeText(raw);
  if (cityAliasMap.has(n)) return cityAliasMap.get(n);
  if (n.includes('/')) {
    const left = normalizeText(n.split('/')[0]);
    if (cityAliasMap.has(left)) return cityAliasMap.get(left);
    return left;
  }
  if (n.includes(' ')) {
    const first = n.split(' ')[0];
    if (cityAliasMap.has(first)) return cityAliasMap.get(first);
  }
  return n;
};

const bandKey = (band, kanal='') => {
  const b = normalizeText(band);
  const c = normalizeText(kanal);
  const z = `${b} ${c}`;
  if (z.includes('CROSS')) return 'CROSS';
  if (z.includes('APRS')) return 'APRS';
  if (z.includes('ECHO')) return 'ECHO';
  if (z.includes('UHF')) return 'UHF';
  if (z.includes('VHF')) return 'VHF';
  return b;
};

const isMissing = (locator) => {
  const n = normalizeText(locator);
  if (!n) return true;
  if (/X{2,}/.test(n)) return true;
  return false;
};

const html = fs.readFileSync(HARITA_PATH, 'utf8');
const markerRegex = /let\s+popupContent\s*=\s*`([\s\S]*?)`;[\s\S]*?L\.marker\s*\(\s*\[\s*([\-\d.]+)\s*,\s*([\-\d.]+)\s*\]\s*,\s*\{\s*icon:\s*icons\['([^']+)'\]\s*\}/g;
const markers = [];
let mm;
while ((mm = markerRegex.exec(html)) !== null) {
  const popup = mm[1] ?? '';
  const city = canonicalCity((popup.match(/<h3[^>]*>([^<]+)<\/h3>/i) || [])[1] || '');
  const place = String((popup.match(/<p[^>]*>([^<]*)<\/p>/i) || [])[1] || '').trim();
  const band = bandKey(mm[4]);
  const role = (popup.match(/href=\"\/role\/(\d+)\"/i) || [])[1] || '';
  const freqs = [...popup.matchAll(/(\d{3}\.\d{1,4})\s*MHz/g)].map((x) => Number(x[1])).filter(Number.isFinite);
  markers.push({
    city,
    band,
    place,
    placeNorm: normalizeText(place),
    placeTokens: tokens(place),
    lat: Number(mm[2]),
    lon: Number(mm[3]),
    freqs,
    role,
  });
}

const byCityBand = new Map();
for (const mk of markers) {
  const k = `${mk.city}|${mk.band}`;
  if (!byCityBand.has(k)) byCityBand.set(k, []);
  byCityBand.get(k).push(mk);
}

const source = fs.readFileSync(DATA_PATH, 'utf8');
const arrMatch = source.match(/export const trRepeaters: TrRepeater\[] = (\[[\s\S]*\]);/);
if (!arrMatch) throw new Error('trRepeaters array not found');
const rows = JSON.parse(arrMatch[1]);

const updates = [];
const skipped = [];

for (const row of rows) {
  if (!isMissing(row.locator)) continue;

  const citySet = new Set([
    canonicalCity(row.anaIl),
    canonicalCity(row.il),
    canonicalCity(String(row.il || '').split('/')[0]),
    canonicalCity(String(row.anaIl || '').split('/')[0]),
  ].filter(Boolean));

  const bKey = bandKey(row.band, row.kanal);
  const pool = [];
  for (const c of citySet) {
    const key = `${c}|${bKey}`;
    for (const mk of byCityBand.get(key) ?? []) pool.push(mk);
  }

  if (!pool.length) {
    skipped.push({ id: row.id, il: row.il, band: row.band, reason: 'no_candidate' });
    continue;
  }

  const rowFreq = parseFreq(row.frekans);
  const rowPlaceTokens = tokens(row.yeri);
  const rowPlaceNorm = normalizeText(row.yeri);
  const thanks = normalizeText(row.tesekkurler).replace(/\s+/g, '');

  const scored = pool.map((mk) => {
    let score = 0;

    const placeSim = jaccard(rowPlaceTokens, mk.placeTokens);
    score += placeSim * 1.6;
    if (rowPlaceNorm && mk.placeNorm && (mk.placeNorm.includes(rowPlaceNorm) || rowPlaceNorm.includes(mk.placeNorm))) {
      score += 0.5;
    }

    let freqBoost = 0;
    let minDiff = Infinity;
    if (rowFreq !== null && mk.freqs.length) {
      for (const f of mk.freqs) {
        const d = Math.abs(f - rowFreq);
        if (d < minDiff) minDiff = d;
      }
      if (minDiff <= 0.0009) freqBoost = 2.2;
      else if (minDiff <= 0.02) freqBoost = 1.8;
      else if (minDiff <= 0.06) freqBoost = 1.2;
      else if (minDiff <= 0.15) freqBoost = 0.6;
    }
    score += freqBoost;

    if (thanks && mk.placeNorm) {
      const tag = thanks.replace(/[^A-Z0-9]/g, '');
      if (tag && mk.placeNorm.replace(/\s+/g, '').includes(tag)) score += 1.2;
      const short = tag.replace(/-L$|-R$/, '');
      if (short && mk.placeNorm.replace(/\s+/g, '').includes(short)) score += 0.8;
    }

    return { mk, score, minDiff };
  }).sort((a,b) => b.score - a.score);

  const best = scored[0];
  const second = scored[1];

  let accept = false;
  if (best.score >= 2.1) accept = true;
  else if (best.score >= 1.6 && (!second || best.score - second.score >= 0.35)) accept = true;
  else if (pool.length === 1 && best.score >= 0.6) accept = true;

  if (!accept) {
    skipped.push({
      id: row.id,
      il: row.il,
      band: row.band,
      reason: 'low_conf',
      best: {
        place: best.mk.place,
        role: best.mk.role,
        lat: best.mk.lat,
        lon: best.mk.lon,
        score: Number(best.score.toFixed(3)),
        minDiff: Number.isFinite(best.minDiff) ? Number(best.minDiff.toFixed(4)) : null,
      },
    });
    continue;
  }

  const locator = `${best.mk.lat.toFixed(6)} ${best.mk.lon.toFixed(6)}`;
  updates.push({
    id: row.id,
    il: row.il,
    band: row.band,
    yeri: row.yeri,
    frekans: row.frekans,
    oldLocator: row.locator,
    newLocator: locator,
    role: best.mk.role,
    place: best.mk.place,
    score: Number(best.score.toFixed(3)),
    minDiff: Number.isFinite(best.minDiff) ? Number(best.minDiff.toFixed(4)) : null,
  });
}

if (updates.length) {
  const map = new Map(updates.map((u) => [String(u.id), u.newLocator]));
  const out = source.replace(/(\{\s*"id"\s*:\s*(\d+),[\s\S]*?"locator"\s*:\s*")([^"]*)("[\s\S]*?\})/g, (full, p1, id, oldLoc, p4) => {
    const v = map.get(String(id));
    if (!v) return full;
    return `${p1}${v}${p4}`;
  });
  fs.writeFileSync(DATA_PATH, out, 'utf8');
}

fs.writeFileSync(REPORT_PATH, JSON.stringify({ updated: updates.length, skipped: skipped.length, updates, skipped }, null, 2), 'utf8');
console.log(JSON.stringify({ updated: updates.length, skipped: skipped.length }, null, 2));
