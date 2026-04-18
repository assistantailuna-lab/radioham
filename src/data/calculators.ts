export type CalculatorCategoryKey = "rf-anten" | "power-electric" | "operations" | "digital" | "satellite";

export type CalculatorField = {
	id: string;
	label: string;
	unit?: string;
	type?: "number" | "text" | "select" | "date" | "datetime-local";
	step?: number;
	min?: number;
	value?: string | number;
	placeholder?: string;
	options?: Array<{ value: string; label: string }>;
};

export type CalculatorItem = {
	slug: string;
	title: string;
	description: string;
	category: CalculatorCategoryKey;
	formula: string;
	fields: CalculatorField[];
	note?: string;
};

export const calculatorCategories: Array<{ key: CalculatorCategoryKey; title: string; description: string }> = [
	{
		key: "rf-anten",
		title: "RF / Anten Tarafı",
		description: "Anten, besleme hattı, kazanç ve kapsama odaklı temel RF hesapları.",
	},
	{
		key: "power-electric",
		title: "G?? ve Elektrik Taraf?",
		description: "Ak?m, gerilim, kablo, sigorta, ak? ve enerji dengesi hesaplari.",
	},
	{
		key: "operations",
		title: "??letme ve Kullan?m Taraf?",
		description: "Gercek kullan?m senaryosu ve sahadaki pratik etki tahminleri.",
	},
	{
		key: "digital",
		title: "Dijital / Frekans Planlama Taraf?",
		description: "Kanal plani, offset, beacon, doppler ve lokasy?n tabanli araclar.",
	},
	{
		key: "satellite",
		title: "Uydu ve Yayinim Taraf?",
		description: "Uydu ge?i?i, gri hat, MUF/LUF ve HF uyg?nl?k rehberleri.",
	},
];

export const calculators: CalculatorItem[] = [
	{
		slug: "swr-yansiyan-guc",
		title: "SWR'den Yans?yan G?? Hesaplama",
		description: "SWR ve ileri g??e g?re yans?yan g??, return loss ve mismatch loss hesaplar.",
		category: "rf-anten",
		formula: "swr-reflected",
		fields: [
			{ id: "swr", label: "SWR", type: "number", step: 0.01, min: 1, value: 1.5 },
			{ id: "fwdW", label: "?leri G??", unit: "W", type: "number", step: 0.1, min: 0.1, value: 50 },
		],
	},
	{
		slug: "return-loss-swr-donusumu",
		title: "Return Loss <-> SWR Dönüşümü",
		description: "SWR'den return loss veya return loss'tan SWR dönüşümü yapar.",
		category: "rf-anten",
		formula: "returnloss-swr",
		fields: [
			{
				id: "mode",
				label: "D?n???m Y?n?",
				type: "select",
				value: "swr-to-rl",
				options: [
					{ value: "swr-to-rl", label: "SWR -> Return Loss" },
					{ value: "rl-to-swr", label: "Return Loss -> SWR" },
				],
			},
			{ id: "swr", label: "SWR", type: "number", step: 0.01, min: 1, value: 1.5 },
			{ id: "rl", label: "Return Loss", unit: "dB", type: "number", step: 0.01, min: 0, value: 14 },
		],
		note: "Se?ili moda g?re ilgili alandan d?n???m yapilir.",
	},
	{
		slug: "anten-kazanci-dbi-dbd",
		title: "Anten Kazancı Dönüşümü: dBi <-> dBd",
		description: "Anten kazancini dBi ve dBd referanslari aras?nda ?evirir.",
		category: "rf-anten",
		formula: "dbi-dbd",
		fields: [
			{
				id: "mode",
				label: "D?n???m Y?n?",
				type: "select",
				value: "dbi-to-dbd",
				options: [
					{ value: "dbi-to-dbd", label: "dBi -> dBd" },
					{ value: "dbd-to-dbi", label: "dBd -> dBi" },
				],
			},
			{ id: "dbi", label: "dBi", type: "number", step: 0.01, value: 5.15 },
			{ id: "dbd", label: "dBd", type: "number", step: 0.01, value: 3 },
		],
		note: "Se?ili moda g?re ilgili alandan d?n???m yapilir.",
	},
	{
		slug: "serbest-uzay-yol-kaybi-fspl",
		title: "Serbest Uzay Yol Kaybi (FSPL)",
		description: "Frekans ve mesafeye g?re FSPL hesaplar.",
		category: "rf-anten",
		formula: "fspl",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 0.1, value: 433 },
			{ id: "distanceKm", label: "Mesafe", unit: "km", type: "number", step: 0.1, min: 0.01, value: 15 },
		],
	},
	{
		slug: "link-budget-hesaplama",
		title: "Link Budget Hesaplama",
		description: "FSPL dahil toplam link b?t?esi, al?c? seviyesini ve margin'i verir.",
		category: "rf-anten",
		formula: "link-budget",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 0.1, value: 433 },
			{ id: "distanceKm", label: "Mesafe", unit: "km", type: "number", step: 0.1, min: 0.01, value: 15 },
			{ id: "txW", label: "TX G??u", unit: "W", type: "number", step: 0.1, min: 0.01, value: 25 },
			{ id: "txGain", label: "TX Anten Kazanc?", unit: "dBi", type: "number", step: 0.1, value: 3 },
			{ id: "rxGain", label: "RX Anten Kazanc?", unit: "dBi", type: "number", step: 0.1, value: 0 },
			{ id: "lineLoss", label: "Hat Kayb?", unit: "dB", type: "number", step: 0.1, min: 0, value: 1.5 },
			{ id: "extraLoss", label: "Ek Kayıplar", unit: "dB", type: "number", step: 0.1, min: 0, value: 2 },
			{ id: "rxSens", label: "Al?c? Hassasiyeti", unit: "dBm", type: "number", step: 0.1, value: -118 },
		],
	},
	{
		slug: "fresnel-bolgesi-hesaplama",
		title: "Fresnel Bölgesi Hesaplama",
		description: "n. Fresnel bölgesi yarıçapını ve %60 temizlik için hedef açıklığı hesaplar.",
		category: "rf-anten",
		formula: "fresnel",
		fields: [
			{ id: "d1Km", label: "Birinci Nokta Uzakligi", unit: "km", type: "number", step: 0.1, min: 0.01, value: 5 },
			{ id: "d2Km", label: "?kinci Nokta Uzakligi", unit: "km", type: "number", step: 0.1, min: 0.01, value: 5 },
			{ id: "freqGHz", label: "Frekans", unit: "GHz", type: "number", step: 0.01, min: 0.01, value: 0.433 },
			{ id: "zone", label: "Fresnel Zon No", type: "number", step: 1, min: 1, value: 1 },
		],
	},
	{
		slug: "radyo-ufku-gorus-hatti",
		title: "Radyo Ufku / Görüş Hattı Mesafesi",
		description: "?ki anten y?ksekligine g?re teorik LOS menzilini hesaplar.",
		category: "rf-anten",
		formula: "radio-horizon",
		fields: [
			{ id: "h1", label: "?stasy?n 1 Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.1, value: 12 },
			{ id: "h2", label: "?stasy?n 2 Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.1, value: 1.5 },
			{ id: "k", label: "K-Faktor", type: "number", step: 0.01, min: 0.5, value: 1.33 },
		],
	},
	{
		slug: "repeater-kapsama-tahmini",
		title: "Repeater Kapsama Tahmini",
		description: "R?le y?ksekligi, hedef y?ksekligi ve çevre faktörüne g?re kapsama tahmini verir.",
		category: "rf-anten",
		formula: "repeater-coverage",
		fields: [
			{ id: "repeaterH", label: "R?le Anten Y?ksekligi", unit: "m", type: "number", step: 1, min: 1, value: 120 },
			{ id: "userH", label: "Kullanici Anten Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.5 },
			{ id: "envFactor", label: "?evre Faktoru", type: "number", step: 0.05, min: 0.3, value: 0.75 },
		],
		note: "?evre fakt?runde kirsal icin 0.9, banliyo 0.75, yogun sehir 0.6 yakla??k alinabilir.",
	},
	{
		slug: "dipol-kol-uzunlugu",
		title: "Dipol Kol Uzunluğu",
		description: "Frekansa g?re her bir dipol kolunun kesim uzunlu?unu hesaplar.",
		category: "rf-anten",
		formula: "dipole-arm",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "ceyrek-yarim-bes-sekiz-dalga-boyu",
		title: "1/4, 1/2, 5/8 Dalga Anten Boyu",
		description: "Ayn? frekans icin ?eyrek, yar?m ve be?-sekiz dalga fiziki boylarını verir.",
		category: "rf-anten",
		formula: "wave-fractions",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 433.5 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "frekans-dalga-boyu-donusumu",
		title: "Frekans <-> Dalga Boyu Dönüşümü",
		description: "Frekans ve dalga boyunu iki y?nlu ?evirir; h?z fakt?ru ile fiziksel ortam d?zeltmesi yapar.",
		category: "rf-anten",
		formula: "freq-wavelength",
		fields: [
			{
				id: "mode",
				label: "D?n???m Y?n?",
				type: "select",
				value: "freq-to-wave",
				options: [
					{ value: "freq-to-wave", label: "Frekans -> Dalga Boyu" },
					{ value: "wave-to-freq", label: "Dalga Boyu -> Frekans" },
				],
			},
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 433.5 },
			{ id: "wavelengthM", label: "Dalga Boyu", unit: "m", type: "number", step: 0.001, min: 0.001, value: 0.692 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.1, value: 1 },
		],
		note: "Serbest uzay icin h?z fakt?runu 1 birakin. Koaks gibi ortamlarda VF de?eri dusurulmelidir.",
	},
	{
		slug: "erp-eirp-hesabi",
		title: "ERP / EIRP Hesabı",
		description: "Verici g??u, hat kayb? ve anten kazancindan ERP/EIRP ??k???n? hesaplar.",
		category: "rf-anten",
		formula: "erp-eirp",
		fields: [
			{ id: "txW", label: "Verici ??k?? G??u", unit: "W", type: "number", step: 0.01, min: 0.001, value: 5 },
			{ id: "lineLossDb", label: "Toplam Hat Kayb?", unit: "dB", type: "number", step: 0.01, min: 0, value: 1.2 },
			{ id: "antGainDbi", label: "Anten Kazanc?", unit: "dBi", type: "number", step: 0.01, value: 2.15 },
		],
		note: "ERP = EIRP - 2.15 dB (yar?m dalga dipol referansi).",
	},
	{
		slug: "j-pole-olcu-hesabi",
		title: "J-Pole Olcu Hesab?",
		description: "J-Pole icin uzun eleman, k?sa eleman ve feedpoint y?ksekligi tahmini verir.",
		category: "rf-anten",
		formula: "j-pole",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "ground-plane-radyal-boylari",
		title: "Ground Plane Radyal Boylari",
		description: "Ground plane anten icin dikey eleman ve radyal boyu tahmini yapar.",
		category: "rf-anten",
		formula: "ground-plane",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.5, value: 0.95 },
			{ id: "radialAngle", label: "Radyal Acisi", unit: "deg", type: "number", step: 1, min: 0, value: 45 },
		],
	},
	{
		slug: "yagi-eleman-aralik-hesabi",
		title: "Yagi Eleman Yakla??k Boylari ve Araliklari",
		description: "3 elemanli temel Yagi icin reflektor, surulen eleman, direktor ve aralik tahmini verir.",
		category: "rf-anten",
		formula: "yagi-3el",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "H?z Faktoru", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "koaksiyel-vf-fiziksel-uzunluk",
		title: "Koaksiyel VF D?zeltmeli Fiziksel Uzunluk",
		description: "Elektriksel dalga oran?na g?re VF d?zeltmeli fiziksel koaks uzunlu?unu hesaplar.",
		category: "rf-anten",
		formula: "coax-physical",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{
				id: "fraction",
				label: "Elektriksel Uzunluk",
				type: "select",
				value: "0.25",
				options: [
					{ value: "0.25", label: "1/4 lambda" },
					{ value: "0.5", label: "1/2 lambda" },
					{ value: "0.75", label: "3/4 lambda" },
					{ value: "1", label: "1 lambda" },
				],
			},
			{ id: "vf", label: "Velocity Factor", type: "number", step: 0.01, min: 0.5, value: 0.66 },
		],
	},
	{
		slug: "anten-koaks-kablo-planlayici",
		title: "Anten Koaks Kablo Planlayici",
		description: "Verici g??u, frekans ve uzunlu?a g?re koaks kayb?, antene ulasan g?? ve uygun kablo kalinligi ?nerisi verir.",
		category: "rf-anten",
		formula: "anten-coax",
		fields: [
			{
				id: "mode",
				label: "Hesap Modu",
				type: "select",
				value: "impact",
				options: [
					{ value: "impact", label: "Mevcut kabloyla etkiyi goster" },
					{ value: "maxlen", label: "Bu kabloyla en fazla kac metre?" },
					{ value: "recommend", label: "Hedefe g?re kablo oner" },
				],
			},
			{ id: "txW", label: "Cihaz ??k?? G??u", unit: "W", type: "number", step: 0.1, min: 0.1, value: 10 },
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 1, value: 433 },
			{ id: "lenM", label: "Kablo Uzunlugu (biliniyorsa)", unit: "m", type: "number", step: 0.1, min: 0.1, value: 20 },
			{
				id: "cablePick",
				label: "Kablo Tipi",
				type: "select",
				value: "RG58",
				options: [
					{ value: "AUTO", label: "Otomatik (?nerilen sec)" },
					{ value: "RG58", label: "RG-58 (~5 mm)" },
					{ value: "H155", label: "H155 (~5.4 mm)" },
					{ value: "LMR240", label: "LMR-240 (~6.1 mm)" },
					{ value: "RG213", label: "RG-213 (~10.3 mm)" },
					{ value: "LMR400", label: "LMR-400 (~10.3 mm)" },
					{ value: "HELIA12", label: "1/2 in Heliax (~13.9 mm)" },
					{ value: "MANUAL", label: "Manuel kayip de?eri" },
				],
			},
			{ id: "manualLoss100", label: "Manuel Kayip (100m)", unit: "dB", type: "number", step: 0.01, min: 0, value: 6.7 },
			{ id: "manualDiam", label: "Manuel Cap", unit: "mm", type: "number", step: 0.1, min: 1, value: 8 },
			{ id: "targetLossDb", label: "Hedef Maks Kablo Kaybi (istege bagli)", unit: "dB", type: "number", step: 0.1, min: 0.1, value: 1.5 },
			{ id: "minPwrPct", label: "Min Anten G??u (istege bagli)", unit: "%", type: "number", step: 1, min: 10, value: 80 },
		],
		note: "Bilmediginiz alanlari bos birakabilirsiniz. Varsayilanlar: 10W, 433MHz, 20m, hedef 1.5dB kayip ve %80 g??.",
	},
	{
		slug: "stub-boyu-hesabi",
		title: "Stub Boyu Hesab?",
		description: "Acik veya k?sa devre stub icin ?eyrek/yar?m dalga fiziksel uzunluk hesaplar.",
		category: "rf-anten",
		formula: "stub-length",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{
				id: "fraction",
				label: "Stub Tipi",
				type: "select",
				value: "quarter",
				options: [
					{ value: "quarter", label: "1/4 dalga stub" },
					{ value: "half", label: "1/2 dalga stub" },
				],
			},
			{
				id: "termination",
				label: "Uclama",
				type: "select",
				value: "open",
				options: [
					{ value: "open", label: "Acik devre" },
					{ value: "short", label: "Kisa devre" },
				],
			},
			{ id: "vf", label: "Velocity Factor", type: "number", step: 0.01, min: 0.5, value: 0.66 },
		],
	},
	{
		slug: "empedans-donusum-orani",
		title: "Empedans D?n???m Orani",
		description: "?ki empedans aras? d?n???m orani ve gerekli sarim orani tahmini verir.",
		category: "rf-anten",
		formula: "impedance-ratio",
		fields: [
			{ id: "zin", label: "Giris Empedansi", unit: "ohm", type: "number", step: 0.1, min: 1, value: 50 },
			{ id: "zout", label: "??k?? Empedansi", unit: "ohm", type: "number", step: 0.1, min: 1, value: 200 },
		],
	},
	{
		slug: "balun-unun-donusum-orani",
		title: "Balun / Unun D?n???m Orani",
		description: "Primer-sekonder sarim sayisina g?re gerilim ve empedans oranlarini hesaplar.",
		category: "rf-anten",
		formula: "balun-ratio",
		fields: [
			{ id: "np", label: "Primer Sarim", type: "number", step: 1, min: 1, value: 2 },
			{ id: "ns", label: "Sekonder Sarim", type: "number", step: 1, min: 1, value: 4 },
		],
	},

	{
		slug: "watt-volt-amper-hesabi",
		title: "Ak?m ?eki?i: Watt <-> Volt <-> Amper",
		description: "W, V ve A de?erlerinden ikisini girerek ???nc?yu hesaplar.",
		category: "power-electric",
		formula: "pva",
		fields: [
			{ id: "w", label: "G??", unit: "W", type: "number", step: 0.1, value: 60 },
			{ id: "v", label: "Voltaj", unit: "V", type: "number", step: 0.1, value: 13.8 },
			{ id: "a", label: "Ak?m", unit: "A", type: "number", step: 0.01, value: 4.35 },
		],
		note: "En az iki alan dolu oldugunda hesaplama yapilir.",
	},
	{
		slug: "sigorta-degeri-onerisi",
		title: "Sigorta Degeri ?nerisi",
		description: "S?rekli ak?m ve emniyet carpaniyla standart sigorta de?eri ?nerir.",
		category: "power-electric",
		formula: "fuse",
		fields: [
			{ id: "current", label: "S?rekli Ak?m", unit: "A", type: "number", step: 0.1, min: 0.1, value: 12 },
			{ id: "factor", label: "Emniyet Carpani", type: "number", step: 0.05, min: 1, value: 1.25 },
		],
	},
	{
		slug: "kablo-kesiti-onerisi",
		title: "Kablo Kesiti ?nerisi",
		description: "Ak?m, hat uzunlu?u ve izinli d???me g?re minimum bak?r kesit ?nerir.",
		category: "power-electric",
		formula: "cable-section",
		fields: [
			{ id: "voltage", label: "Sistem Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Ak?m", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Y?n Hat Uzunlugu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "dropPct", label: "?zinli Voltaj D???m?", unit: "%", type: "number", step: 0.1, min: 0.1, value: 3 },
		],
	},
	{
		slug: "voltaj-dusumu-hesaplama",
		title: "Voltaj D???m? Hesaplama",
		description: "Bakir kablo kesiti, uzunluk ve ak?ma g?re voltaj d???m?nu hesaplar.",
		category: "power-electric",
		formula: "voltage-drop",
		fields: [
			{ id: "voltage", label: "Sistem Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Ak?m", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Y?n Hat Uzunlugu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "area", label: "Kablo Kesiti", unit: "mm^2", type: "number", step: 0.1, min: 0.1, value: 4 },
		],
	},
	{
		slug: "dc-hat-kaybi-hesaplama",
		title: "DC Hat Kayb? Hesaplama",
		description: "Hat direnci, g?? kayb? ve iletim verimini hesaplar.",
		category: "power-electric",
		formula: "dc-line-loss",
		fields: [
			{ id: "voltage", label: "Sistem Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Ak?m", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Y?n Hat Uzunlugu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "area", label: "Kablo Kesiti", unit: "mm^2", type: "number", step: 0.1, min: 0.1, value: 4 },
		],
	},
	{
		slug: "batarya-kapasite-planlama",
		title: "Batarya Kapasite Planlama",
		description: "Yuk g??u ve hedef s?reye g?re gereken Ah kapasitesini hesaplar.",
		category: "power-electric",
		formula: "battery-plan",
		fields: [
			{ id: "loadW", label: "Ortalama Yuk", unit: "W", type: "number", step: 1, min: 1, value: 45 },
			{ id: "hours", label: "Hedef S?re", unit: "saat", type: "number", step: 0.1, min: 0.1, value: 8 },
			{ id: "voltage", label: "Sistem Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 12 },
			{ id: "dod", label: "Maks. Deşarj", unit: "%", type: "number", step: 1, min: 10, value: 70 },
			{ id: "eff", label: "Sistem Verimi", unit: "%", type: "number", step: 1, min: 10, value: 90 },
		],
	},
	{
		slug: "sarj-suresi-tahmini",
		title: "?arj S?resi Tahmini",
		description: "Ak? kapasitesi, ?arj ak?mi ve verime g?re ?arj s?resini tahmin eder.",
		category: "power-electric",
		formula: "charge-time",
		fields: [
			{ id: "ah", label: "Ak? Kapasitesi", unit: "Ah", type: "number", step: 0.1, min: 0.1, value: 60 },
			{ id: "soc", label: "Doldurulacak Kisim", unit: "%", type: "number", step: 1, min: 1, value: 50 },
			{ id: "current", label: "?arj Ak?mi", unit: "A", type: "number", step: 0.1, min: 0.1, value: 8 },
			{ id: "eff", label: "?arj Verimi", unit: "%", type: "number", step: 1, min: 10, value: 85 },
		],
	},
	{
		slug: "duty-cycle-ortalama-tuketim",
		title: "Duty Cycle'a G?re Ortalama T?ketim",
		description: "TX/RX/Bekleme oranlarina g?re ortalama ak?m ve g??u hesaplar.",
		category: "power-electric",
		formula: "duty-average",
		fields: [
			{ id: "voltage", label: "Sistem Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "txA", label: "TX Ak?mi", unit: "A", type: "number", step: 0.01, min: 0, value: 12 },
			{ id: "rxA", label: "RX Ak?mi", unit: "A", type: "number", step: 0.01, min: 0, value: 1.2 },
			{ id: "idleA", label: "Bekleme Ak?mi", unit: "A", type: "number", step: 0.01, min: 0, value: 0.2 },
			{ id: "txPct", label: "TX Orani", unit: "%", type: "number", step: 1, min: 0, value: 10 },
			{ id: "rxPct", label: "RX Orani", unit: "%", type: "number", step: 1, min: 0, value: 30 },
		],
	},
	{
		slug: "gunes-paneli-aku-gunluk-enerji-dengesi",
		title: "G?ne? Paneli + Ak? G?nl?k Enerji Dengesi",
		description: "G?nl?k panel uretimi ile tuketimi kar??la?t?r?r, net artı/eksi enerji verir.",
		category: "power-electric",
		formula: "solar-balance",
		fields: [
			{ id: "panelW", label: "Panel G??u", unit: "W", type: "number", step: 1, min: 1, value: 200 },
			{ id: "sunHours", label: "Esde?er G?ne? S?resi", unit: "saat", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "eff", label: "Sistem Verimi", unit: "%", type: "number", step: 1, min: 10, value: 80 },
			{ id: "dailyLoadWh", label: "G?nl?k T?ketim", unit: "Wh", type: "number", step: 1, min: 1, value: 650 },
			{ id: "batteryV", label: "Ak? Voltaji", unit: "V", type: "number", step: 0.1, min: 1, value: 12 },
		],
	},
	{
		slug: "regulator-inverter-verim-kaybi",
		title: "Reg?lat?r / Inverter Verim Kayb? Hesab?",
		description: "Yuk g??unden giriş g??u ve kayip g??u hesaplar.",
		category: "power-electric",
		formula: "efficiency-loss",
		fields: [
			{ id: "loadW", label: "??k?? Yuk G??u", unit: "W", type: "number", step: 1, min: 1, value: 300 },
			{ id: "eff", label: "Verim", unit: "%", type: "number", step: 1, min: 10, value: 88 },
		],
	},

	{
		slug: "konusma-orani-calisma-suresi",
		title: "Konu?ma Oran?na G?re Tahmini ?al??ma S?resi",
		description: "Konu?ma/dinleme oran?na g?re HT runtime tahmini yapar.",
		category: "operations",
		formula: "talk-runtime",
		fields: [
			{ id: "ah", label: "Ak? Kapasitesi", unit: "Ah", type: "number", step: 0.1, min: 0.1, value: 7.5 },
			{ id: "usable", label: "Kullanilabilir Kapasite", unit: "%", type: "number", step: 1, min: 1, value: 85 },
			{ id: "txA", label: "TX Ak?mi", unit: "A", type: "number", step: 0.01, min: 0, value: 1.8 },
			{ id: "rxA", label: "RX Ak?mi", unit: "A", type: "number", step: 0.01, min: 0, value: 0.35 },
			{ id: "talkPct", label: "Konu?ma Orani", unit: "%", type: "number", step: 1, min: 0, value: 15 },
		],
	},
	{
		slug: "el-telsizi-menzil-tahmini",
		title: "El Telsizi Menzil Tahmini",
		description: "Y?kseklik, g?? ve ?evre fakt?rune g?re elde tasinan telsiz menzil tahmini.",
		category: "operations",
		formula: "ht-range",
		fields: [
			{ id: "txW", label: "TX G??u", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "h1", label: "?stasy?n 1 Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.7 },
			{ id: "h2", label: "?stasy?n 2 Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.7 },
			{ id: "envFactor", label: "?evre Faktoru", type: "number", step: 0.05, min: 0.3, value: 0.7 },
		],
	},
	{
		slug: "mobil-telsiz-menzil-tahmini",
		title: "Mobil Telsiz Menzil Tahmini",
		description: "Arac ustu senaryo icin LOS tabanli menzil tahmini.",
		category: "operations",
		formula: "mobile-range",
		fields: [
			{ id: "txW", label: "TX G??u", unit: "W", type: "number", step: 0.1, min: 0.1, value: 50 },
			{ id: "h1", label: "Mobil Anten Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 2.2 },
			{ id: "h2", label: "Hedef Anten Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 2.2 },
			{ id: "envFactor", label: "?evre Faktoru", type: "number", step: 0.05, min: 0.3, value: 0.8 },
		],
	},
	{
		slug: "roleye-erisim-tahmini",
		title: "R?leye Eri?im Tahmini",
		description: "Gonderim b?t?esinden r?leye ulasilabilecek teorik mesafeyi hesaplar.",
		category: "operations",
		formula: "repeater-access",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 0.1, value: 145.6 },
			{ id: "txW", label: "TX G??u", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "txGain", label: "TX Anten Kazanc?", unit: "dBi", type: "number", step: 0.1, value: 2 },
			{ id: "rxGain", label: "R?le Anten Kazanc?", unit: "dBi", type: "number", step: 0.1, value: 6 },
			{ id: "loss", label: "Toplam Ek Kayip", unit: "dB", type: "number", step: 0.1, min: 0, value: 4 },
			{ id: "rxSens", label: "R?le Al?c? Hassasiyeti", unit: "dBm", type: "number", step: 0.1, value: -118 },
			{ id: "margin", label: "Hedef Fade Margin", unit: "dB", type: "number", step: 0.1, min: 0, value: 10 },
		],
	},
	{
		slug: "yukseklik-artisi-kapsama-etkisi",
		title: "Y?kseklik Artisinin Kapsama Etkisi",
		description: "Anten y?ksekligi artisi ile LOS menzil degisimini kar??la?t?r?r.",
		category: "operations",
		formula: "height-coverage",
		fields: [
			{ id: "oldH", label: "Eski Anten Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 6 },
			{ id: "newH", label: "Yeni Anten Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 18 },
			{ id: "otherH", label: "Karsi ?stasy?n Y?ksekligi", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.5 },
		],
	},
	{
		slug: "qrp-vs-yuksek-guc-karsilastirma",
		title: "QRP vs Y?ksek G?? Kar??la?t?rma Tablosu",
		description: "?ki g?? seviyesi aras?nda dB farki, S-unit farki ve alan g??u etkisini kar??la?t?r?r.",
		category: "operations",
		formula: "qrp-vs-high",
		fields: [
			{ id: "lowW", label: "QRP G??u", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "highW", label: "Y?ksek G??", unit: "W", type: "number", step: 0.1, min: 0.1, value: 100 },
		],
	},
	{
		slug: "s-unit-guc-farki-hesabi",
		title: "S-Unit Yakla??k G?? Farki Hesab?",
		description: "dB farkindan yakla??k S-unit degisimini hesaplar (1 S ~ 6 dB).",
		category: "operations",
		formula: "s-unit",
		fields: [
			{ id: "dbDiff", label: "dB Farki", unit: "dB", type: "number", step: 0.1, value: 12 },
		],
	},
	{
		slug: "db-artisi-pratik-etkisi",
		title: "dB Artisinin Pratik Etkisi",
		description: "dB kazancinin g?? orani, gerilim orani ve teorik mesafe katsayisina etkisini verir.",
		category: "operations",
		formula: "db-effect",
		fields: [
			{ id: "db", label: "dB Artisi", unit: "dB", type: "number", step: 0.1, value: 3 },
		],
	},

	{
		slug: "kanal-araligi-hesaplama",
		title: "Kanal Araligi Hesaplama",
		description: "Ba?lang?? ve bitis frekansi aras?nda kanal araligini hesaplar.",
		category: "digital",
		formula: "channel-spacing",
		fields: [
			{ id: "startMHz", label: "Ba?lang?? Frekansi", unit: "MHz", type: "number", step: 0.001, value: 145.5 },
			{ id: "endMHz", label: "Bitis Frekansi", unit: "MHz", type: "number", step: 0.001, value: 145.8 },
			{ id: "channels", label: "Kanal Sayisi", type: "number", step: 1, min: 2, value: 13 },
		],
	},
	{
		slug: "offset-hesaplama",
		title: "Offset Hesaplama",
		description: "R?le RX frekansindan (T?rkiye pratigi) TX frekansini ve offset y?n?nu hesaplar.",
		category: "digital",
		formula: "offset",
		fields: [
			{ id: "rxMHz", label: "R?le RX Frekansi", unit: "MHz", type: "number", step: 0.001, value: 145.6 },
			{
				id: "preset",
				label: "Bant / Preset",
				type: "select",
				value: "vhf-tr",
				options: [
					{ value: "vhf-tr", label: "VHF (TR tipik: -0.600 MHz)" },
					{ value: "uhf-tr", label: "UHF (TR tipik: -7.600 MHz)" },
					{ value: "custom", label: "?zel offset" },
				],
			},
			{
				id: "direction",
				label: "Offset Y?n? (?zel modda)",
				type: "select",
				value: "minus",
				options: [
					{ value: "minus", label: "- (TX asagida)" },
					{ value: "plus", label: "+ (TX yukarida)" },
				],
			},
			{ id: "customKHz", label: "?zel Offset", unit: "kHz", type: "number", step: 1, min: 0, value: 600 },
		],
		note: "T?rkiye'de ?o?u r?lede VHF icin -0.600 MHz, UHF icin -7.600 MHz kullanilir; istisnalar olabilir.",
	},
	{
		slug: "duplex-split-hesaplama",
		title: "Duplex Split Hesaplama",
		description: "Verilen split ve y?ne g?re TX veya RX frekansini hesaplar.",
		category: "digital",
		formula: "duplex-split",
		fields: [
			{ id: "rxMHz", label: "RX Frekansi", unit: "MHz", type: "number", step: 0.001, value: 145.6 },
			{ id: "splitKHz", label: "Split", unit: "kHz", type: "number", step: 1, min: 0, value: 600 },
			{
				id: "direction",
				label: "Y?n",
				type: "select",
				value: "minus",
				options: [
					{ value: "minus", label: "- (TX asagida)" },
					{ value: "plus", label: "+ (TX yukarida)" },
				],
			},
		],
	},
	{
		slug: "ctcss-dcs-rehber-araci",
		title: "CTCSS / DCS Rehber Araci",
		description: "Ton/kod ve encode-decode secimine g?re h?zli programlama ?zetini verir.",
		category: "digital",
		formula: "ctcss-dcs",
		fields: [
			{
				id: "mode",
				label: "Mod",
				type: "select",
				value: "ctcss",
				options: [
					{ value: "ctcss", label: "CTCSS" },
					{ value: "dcs", label: "DCS" },
				],
			},
			{ id: "code", label: "Ton / Kod", type: "text", value: "88.5" },
			{
				id: "direction",
				label: "Uygulama",
				type: "select",
				value: "tx-only",
				options: [
					{ value: "tx-only", label: "Sadece TX" },
					{ value: "tx-rx", label: "TX + RX" },
				],
			},
		],
	},
	{
		slug: "aprs-beacon-aralik-onerisi",
		title: "APRS Beacon Aralik ?nerisi",
		description: "H?z, hareket tipi ve enerji tercihiyle beacon aralik ?nerisi verir.",
		category: "digital",
		formula: "aprs-interval",
		fields: [
			{ id: "speed", label: "Ortalama H?z", unit: "km/h", type: "number", step: 1, min: 0, value: 45 },
			{
				id: "profile",
				label: "Kullan?m Profili",
				type: "select",
				value: "mobile",
				options: [
					{ value: "static", label: "Sabit ?stasy?n" },
					{ value: "portable", label: "Yavas Hareket" },
					{ value: "mobile", label: "Mobil" },
				],
			},
			{
				id: "powerMode",
				label: "Enerji Onceligi",
				type: "select",
				value: "balanced",
				options: [
					{ value: "max-saving", label: "Maks Tasarruf" },
					{ value: "balanced", label: "Dengeli" },
					{ value: "tracking", label: "Takip Oncelikli" },
				],
			},
		],
	},
	{
		slug: "doppler-duzeltme-tahmini",
		title: "Doppler D?zeltme Tahmini",
		description: "LEO uydu ge?i?lerinde yaklasma/uzaklasma icin frekans kaymasi tahmini.",
		category: "digital",
		formula: "doppler",
		fields: [
			{ id: "freqMHz", label: "?al??ma Frekansi", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.8 },
			{ id: "speedKms", label: "Bagil H?z", unit: "km/s", type: "number", step: 0.1, min: 0.1, value: 7.5 },
		],
	},
	{
		slug: "grid-locator-cevirici",
		title: "Grid Locator ?evirici",
		description: "Enlem-boylamdan Maidenhead grid uretir veya grid'den merkez koordinat cikarir.",
		category: "digital",
		formula: "grid-converter",
		fields: [
			{
				id: "mode",
				label: "D?n???m Y?n?",
				type: "select",
				value: "latlon-to-grid",
				options: [
					{ value: "latlon-to-grid", label: "Lat/Lon -> Grid" },
					{ value: "grid-to-latlon", label: "Grid -> Lat/Lon" },
				],
			},
			{ id: "lat", label: "Enlem", type: "number", step: 0.0001, value: 41.0082 },
			{ id: "lon", label: "Boylam", type: "number", step: 0.0001, value: 28.9784 },
			{ id: "grid", label: "Grid", type: "text", value: "KN40aa" },
		],
		note: "Mod secerek her iki y?ne ceviri yapabilirsiniz.",
	},
	{
		slug: "bearing-distance-hesabi",
		title: "?ki Lokasy?n Aras? Bearing / Distance",
		description: "?ki koordinat aras? b?y?k cember mesafesi ve ilk rota acisini hesaplar.",
		category: "digital",
		formula: "bearing-distance",
		fields: [
			{ id: "lat1", label: "Nokta 1 Enlem", type: "number", step: 0.0001, value: 41.0082 },
			{ id: "lon1", label: "Nokta 1 Boylam", type: "number", step: 0.0001, value: 28.9784 },
			{ id: "lat2", label: "Nokta 2 Enlem", type: "number", step: 0.0001, value: 39.9208 },
			{ id: "lon2", label: "Nokta 2 Boylam", type: "number", step: 0.0001, value: 32.8541 },
		],
	},

	{
		slug: "uydu-gecis-gorunurluk-suresi",
		title: "Uydu Gecis Y?ksekligine G?re Gorunurluk S?resi",
		description: "Maksimum elevasy?na g?re LEO ge?i? g?r?n?rl?k s?resini yakla??k tahmin eder.",
		category: "satellite",
		formula: "sat-visibility",
		fields: [
			{ id: "maxEl", label: "Maksimum Elevasy?n", unit: "deg", type: "number", step: 1, min: 1, value: 55 },
			{ id: "period", label: "Orbital Periyot", unit: "dk", type: "number", step: 0.1, min: 10, value: 95 },
		],
	},
	{
		slug: "gunes-aktivitesine-gore-hf-band",
		title: "G?ne? Aktivitesine G?re HF Band Uygunlu?u Rehberi",
		description: "SFI ve Kp indeksine g?re uygun HF bandlarini rehber niteliginde listeler.",
		category: "satellite",
		formula: "hf-solar-guide",
		fields: [
			{ id: "sfi", label: "Solar Flux Index (SFI)", type: "number", step: 1, min: 50, value: 120 },
			{ id: "kp", label: "Kp", type: "number", step: 0.1, min: 0, value: 2.5 },
			{
				id: "period",
				label: "Gun Donemi",
				type: "select",
				value: "day",
				options: [
					{ value: "day", label: "Gunduz" },
					{ value: "night", label: "Gece" },
				],
			},
		],
	},
	{
		slug: "muf-luf-temel-arac",
		title: "MUF / LUF Temel Aciklamali Arac",
		description: "foF2 de?erinden MUF tahmini yapar, gurultu seviyesine g?re LUF yaklasimi verir.",
		category: "satellite",
		formula: "muf-luf",
		fields: [
			{ id: "fof2", label: "foF2", unit: "MHz", type: "number", step: 0.1, min: 1, value: 6.5 },
			{ id: "noise", label: "Gurultu Seviyesi (1-5)", type: "number", step: 1, min: 1, value: 3 },
			{ id: "pathFactor", label: "Yol Faktoru", type: "number", step: 0.1, min: 1, value: 3 },
		],
	},
	{
		slug: "greyline-hesaplama",
		title: "Gri Hat (Greyline) Hesaplama",
		description: "Verilen lokasy?nda secilen tarih/saatte g?ne? elevasy?n?na g?re greyline durumunu hesaplar.",
		category: "satellite",
		formula: "greyline",
		fields: [
			{ id: "lat", label: "Enlem", type: "number", step: 0.0001, value: 41.0082 },
			{ id: "lon", label: "Boylam", type: "number", step: 0.0001, value: 28.9784 },
			{ id: "datetime", label: "Tarih/Saat (UTC)", type: "datetime-local", value: "2026-04-18T12:00" },
		],
	},
	{
		slug: "gun-dogumu-gun-batimi-band-onerisi",
		title: "Gun Do?umu / Gun Bat?m? Bazli Band ?nerisi",
		description: "Konuma g?re gun do?umu-bat?m? saatlerini ve zaman dilimine g?re band ?nerilerini verir.",
		category: "satellite",
		formula: "sun-band",
		fields: [
			{ id: "lat", label: "Enlem", type: "number", step: 0.0001, value: 41.0082 },
			{ id: "lon", label: "Boylam", type: "number", step: 0.0001, value: 28.9784 },
			{ id: "date", label: "Tarih (UTC)", type: "date", value: "2026-04-18" },
		],
	},
];

export const calculatorBySlug = new Map(calculators.map((item) => [item.slug, item]));

