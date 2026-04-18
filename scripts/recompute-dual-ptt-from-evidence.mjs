import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const TODAY = "2026-04-15";

const specFiles = fs.readdirSync(dataDir).filter((f) => f.endsWith("-model-specs.json")).sort();

// Web kanitlariyla net "fiziksel cift PTT" bilinen modeller.
const physicalDualPttModels = new Set([
	"UV-82",
	"TD-H3",
]);

// Web/manual kanitlariyla programlanabilir tus/PF destegi bilinen modeller.
const programmableKnownModels = new Set([
	"AT-168UV",
	"AT-D-878UV",
	"AT-D890UV",
	"BF-8000D",
	"BF-K5",
	"BF-UV-21",
	"DM-1701",
	"DM-1702",
	"DM32UV",
	"DR1801UV",
	"K5PLUS-GPS",
	"PROV2",
	"UV-13",
	"UV17",
	"UV18H",
	"TD-H3 PLUS",
	"TD-H8",
	"TD-H9",
	"MD-UV390",
	"TK-11",
	"UV-K1-1400MAH",
	"UV-K1-1400MAH-MINIKONG",
	"UV-K1-2500MAH",
	"UV-K1-2500MAH-MINIKONG",
	"UV-K5",
	"UV-K6",
	"RT-4D",
	"RT-6D",
	"RT-6D PRO",
	"RT-7D",
	"RT-620",
	"RT-69",
	"RT-817A",
	"RT-860",
	"RT-860G",
	"RT-880",
	"RT-880G",
	"RT-890",
	"RT-910",
	"RT-910B",
]);

function normModel(model) {
	return String(model || "")
		.toUpperCase()
		.replace(/\s+/g, " ")
		.trim();
}

function isLikelyProgrammable(item) {
	const model = normModel(item.model);
	const mode = String(item.mode || "").toUpperCase();
	const title = String(item.title || "").toLowerCase();
	const battery = String(item.battery || "").toLowerCase();
	const channels = Number(String(item.channels || "").match(/\d+/)?.[0] || 0);

	if (programmableKnownModels.has(model)) return true;
	if (mode === "PMR") return false;
	if (/amplifier|mobile radio|car radio|vehicle|arac tipi|mobil/.test(title)) return false;
	if (/arac\/harici besleme/.test(battery)) return false;
	if (/pf1|pf2|programmable|shortcut key|custom key|key assignment/i.test(title)) return true;

	// DMR ve ust segment HT modellerinde PF/yan tus atama tipik.
	if (mode === "DMR" && channels >= 128) return true;

	// 900+ kanal ve el tipi/amator sinif cihazlarda genellikle programlanabilir yan tus bulunur.
	if (channels >= 900 && /(ham|air band|aprs|gps|full band|multi band|walkie talkie)/i.test(title)) return true;

	return false;
}

let updated = 0;
let varCount = 0;
let configurableCount = 0;
let yokCount = 0;

for (const file of specFiles) {
	const fullPath = path.join(dataDir, file);
	const arr = JSON.parse(fs.readFileSync(fullPath, "utf8"));
	const out = arr.map((item) => {
		const model = normModel(item.model);
		const hasPhysical = physicalDualPttModels.has(model);
		const hasProgrammable = isLikelyProgrammable(item);

		const dualPtt = hasPhysical ? "Var" : hasProgrammable ? "Duzenlenebilir" : "Yok";
		const sideKeyProgrammable = hasProgrammable ? "Var" : "Yok";

		if (dualPtt === "Var") varCount += 1;
		else if (dualPtt === "Duzenlenebilir") configurableCount += 1;
		else yokCount += 1;

		updated += 1;
		return {
			...item,
			dualPtt,
			sideKeyProgrammable,
			updatedAt: TODAY,
		};
	});

	fs.writeFileSync(fullPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log(`Recomputed dual PTT: ${file} (${out.length})`);
}

console.log(`Done rows=${updated} Var=${varCount} Duzenlenebilir=${configurableCount} Yok=${yokCount}`);
