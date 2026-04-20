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
		title: "Güç ve Elektrik Tarafı",
		description: "Akım, gerilim, kablo, sigorta, akü ve enerji dengesi hesapları.",
	},
	{
		key: "operations",
		title: "İşletme ve Kullanım Tarafı",
		description: "Gerçek kullanım senaryosu ve sahadaki pratik etki tahminleri.",
	},
	{
		key: "digital",
		title: "Dijital / Frekans Planlama Tarafı",
		description: "Kanal planı, offset, beacon, doppler ve lokasyon tabanlı araçlar.",
	},
	{
		key: "satellite",
		title: "Uydu ve Yayınım Tarafı",
		description: "Uydu geçişi, gri hat, MUF/LUF ve HF uygunluk rehberleri.",
	},
];

export const calculators: CalculatorItem[] = [
	{
		slug: "swr-yansiyan-guc",
		title: "SWR'den Yansıyan Güç Hesaplama",
		description: "SWR ve ileri güce göre yansıyan güç, return loss ve mismatch loss hesaplar.",
		category: "rf-anten",
		formula: "swr-reflected",
		fields: [
			{ id: "swr", label: "SWR", type: "number", step: 0.01, min: 1, value: 1.5 },
			{ id: "fwdW", label: "İleri Güç", unit: "W", type: "number", step: 0.1, min: 0.1, value: 50 },
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
				label: "Dönüşüm Yönü",
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
		note: "Seçili moda göre ilgili alandan dönüşüm yapılır.",
	},
	{
		slug: "anten-kazanci-dbi-dbd",
		title: "Anten Kazancı Dönüşümü: dBi <-> dBd",
		description: "Anten kazancını dBi ve dBd referansları arasında çevirir.",
		category: "rf-anten",
		formula: "dbi-dbd",
		fields: [
			{
				id: "mode",
				label: "Dönüşüm Yönü",
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
		note: "Seçili moda göre ilgili alandan dönüşüm yapılır.",
	},
	{
		slug: "serbest-uzay-yol-kaybi-fspl",
		title: "Serbest Uzay Yol Kaybı (FSPL)",
		description: "Frekans ve mesafeye göre FSPL hesaplar.",
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
		description: "FSPL dahil toplam link bütçesi, alıcı seviyesini ve margin'i verir.",
		category: "rf-anten",
		formula: "link-budget",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 0.1, value: 433 },
			{ id: "distanceKm", label: "Mesafe", unit: "km", type: "number", step: 0.1, min: 0.01, value: 15 },
			{ id: "txW", label: "TX Gücü", unit: "W", type: "number", step: 0.1, min: 0.01, value: 25 },
			{ id: "txGain", label: "TX Anten Kazancı", unit: "dBi", type: "number", step: 0.1, value: 3 },
			{ id: "rxGain", label: "RX Anten Kazancı", unit: "dBi", type: "number", step: 0.1, value: 0 },
			{ id: "lineLoss", label: "Hat Kaybı", unit: "dB", type: "number", step: 0.1, min: 0, value: 1.5 },
			{ id: "extraLoss", label: "Ek Kayıplar", unit: "dB", type: "number", step: 0.1, min: 0, value: 2 },
			{ id: "rxSens", label: "Alıcı Hassasiyeti", unit: "dBm", type: "number", step: 0.1, value: -118 },
		],
	},
	{
		slug: "fresnel-bolgesi-hesaplama",
		title: "Fresnel Bölgesi Hesaplama",
		description: "n. Fresnel bölgesi yarıçapını ve %60 temizlik için hedef açıklığı hesaplar.",
		category: "rf-anten",
		formula: "fresnel",
		fields: [
			{ id: "d1Km", label: "Birinci Nokta Uzaklığı", unit: "km", type: "number", step: 0.1, min: 0.01, value: 5 },
			{ id: "d2Km", label: "İkinci Nokta Uzaklığı", unit: "km", type: "number", step: 0.1, min: 0.01, value: 5 },
			{ id: "freqGHz", label: "Frekans", unit: "GHz", type: "number", step: 0.01, min: 0.01, value: 0.433 },
			{ id: "zone", label: "Fresnel Zon No", type: "number", step: 1, min: 1, value: 1 },
		],
	},
	{
		slug: "radyo-ufku-gorus-hatti",
		title: "Radyo Ufku / Görüş Hattı Mesafesi",
		description: "İki anten yüksekliğine göre teorik LOS menzilini hesaplar.",
		category: "rf-anten",
		formula: "radio-horizon",
		fields: [
			{ id: "h1", label: "İstasyon 1 Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.1, value: 12 },
			{ id: "h2", label: "İstasyon 2 Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.1, value: 1.5 },
			{ id: "k", label: "K-Faktör", type: "number", step: 0.01, min: 0.5, value: 1.33 },
		],
	},
	{
		slug: "repeater-kapsama-tahmini",
		title: "Repeater Kapsama Tahmini",
		description: "Röle yüksekliği, hedef yüksekliği ve çevre faktörüne göre kapsama tahmini verir.",
		category: "rf-anten",
		formula: "repeater-coverage",
		fields: [
			{ id: "repeaterH", label: "Röle Anten Yüksekliği", unit: "m", type: "number", step: 1, min: 1, value: 120 },
			{ id: "userH", label: "Kullanıcı Anten Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.5 },
			{ id: "envFactor", label: "Çevre Faktörü", type: "number", step: 0.05, min: 0.3, value: 0.75 },
		],
		note: "Çevre faktöründe kırsal için 0.9, banliyö 0.75, yoğun şehir 0.6 yaklaşık alınabilir.",
	},
	{
		slug: "dipol-kol-uzunlugu",
		title: "Dipol Kol Uzunluğu",
		description: "Frekansa göre her bir dipol kolunun kesim uzunluğunu hesaplar.",
		category: "rf-anten",
		formula: "dipole-arm",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "ceyrek-yarim-bes-sekiz-dalga-boyu",
		title: "1/4, 1/2, 5/8 Dalga Anten Boyu",
		description: "Aynı frekans için çeyrek, yarım ve beş-sekiz dalga fiziki boylarını verir.",
		category: "rf-anten",
		formula: "wave-fractions",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 433.5 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "frekans-dalga-boyu-donusumu",
		title: "Frekans <-> Dalga Boyu Dönüşümü",
		description: "Frekans ve dalga boyunu iki yönlü çevirir; hız faktörü ile fiziksel ortam düzeltmesi yapar.",
		category: "rf-anten",
		formula: "freq-wavelength",
		fields: [
			{
				id: "mode",
				label: "Dönüşüm Yönü",
				type: "select",
				value: "freq-to-wave",
				options: [
					{ value: "freq-to-wave", label: "Frekans -> Dalga Boyu" },
					{ value: "wave-to-freq", label: "Dalga Boyu -> Frekans" },
				],
			},
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 433.5 },
			{ id: "wavelengthM", label: "Dalga Boyu", unit: "m", type: "number", step: 0.001, min: 0.001, value: 0.692 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.1, value: 1 },
		],
		note: "Serbest uzay için hız faktörünü 1 bırakın. Koaks gibi ortamlarda VF değeri düşürülmelidir.",
	},
	{
		slug: "erp-eirp-hesabi",
		title: "ERP / EIRP Hesabı",
		description: "Verici gücü, hat kaybı ve anten kazancından ERP/EIRP çıkışını hesaplar.",
		category: "rf-anten",
		formula: "erp-eirp",
		fields: [
			{ id: "txW", label: "Verici Çıkış Gücü", unit: "W", type: "number", step: 0.01, min: 0.001, value: 5 },
			{ id: "lineLossDb", label: "Toplam Hat Kaybı", unit: "dB", type: "number", step: 0.01, min: 0, value: 1.2 },
			{ id: "antGainDbi", label: "Anten Kazancı", unit: "dBi", type: "number", step: 0.01, value: 2.15 },
		],
		note: "ERP = EIRP - 2.15 dB (yarım dalga dipol referansı).",
	},
	{
		slug: "j-pole-olcu-hesabi",
		title: "J-Pole Ölçü Hesabı",
		description: "J-Pole için uzun eleman, kısa eleman ve feedpoint yüksekliği tahmini verir.",
		category: "rf-anten",
		formula: "j-pole",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "ground-plane-radyal-boylari",
		title: "Ground Plane Radyal Boyları",
		description: "Ground plane anten için dikey eleman ve radyal boyu tahmini yapar.",
		category: "rf-anten",
		formula: "ground-plane",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.5, value: 0.95 },
			{ id: "radialAngle", label: "Radyal Açısı", unit: "deg", type: "number", step: 1, min: 0, value: 45 },
		],
	},
	{
		slug: "yagi-eleman-aralik-hesabi",
		title: "Yagi Eleman Yaklaşık Boyları ve Aralıkları",
		description: "3 elemanlı temel Yagi için reflektör, sürülen eleman, direktör ve aralık tahmini verir.",
		category: "rf-anten",
		formula: "yagi-3el",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.5 },
			{ id: "vf", label: "Hız Faktörü", type: "number", step: 0.01, min: 0.5, value: 0.95 },
		],
	},
	{
		slug: "koaksiyel-vf-fiziksel-uzunluk",
		title: "Koaksiyel VF Düzeltmeli Fiziksel Uzunluk",
		description: "Elektriksel dalga oranına göre VF düzeltmeli fiziksel koaks uzunluğunu hesaplar.",
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
		title: "Anten Koaks Kablo Planlayıcı",
		description: "Verici gücü, frekans ve uzunluğa göre koaks kaybı, antene ulaşan güç ve uygun kablo kalınlığı önerisi verir.",
		category: "rf-anten",
		formula: "anten-coax",
		fields: [
			{
				id: "mode",
				label: "Hesap Modu",
				type: "select",
				value: "impact",
				options: [
					{ value: "impact", label: "Mevcut kabloyla etkiyi göster" },
					{ value: "maxlen", label: "Bu kabloyla en fazla kaç metre?" },
					{ value: "recommend", label: "Hedefe göre kablo öner" },
				],
			},
			{ id: "txW", label: "Cihaz Çıkış Gücü", unit: "W", type: "number", step: 0.1, min: 0.1, value: 10 },
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 1, value: 433 },
			{ id: "lenM", label: "Kablo Uzunluğu (biliniyorsa)", unit: "m", type: "number", step: 0.1, min: 0.1, value: 20 },
			{
				id: "cablePick",
				label: "Kablo Tipi",
				type: "select",
				value: "RG58",
				options: [
					{ value: "AUTO", label: "Otomatik (önerilen seç)" },
					{ value: "RG58", label: "RG-58 (~5 mm)" },
					{ value: "H155", label: "H155 (~5.4 mm)" },
					{ value: "LMR240", label: "LMR-240 (~6.1 mm)" },
					{ value: "RG213", label: "RG-213 (~10.3 mm)" },
					{ value: "LMR400", label: "LMR-400 (~10.3 mm)" },
					{ value: "HELIA12", label: "1/2 in Heliax (~13.9 mm)" },
					{ value: "MANUAL", label: "Manuel kayıp değeri" },
				],
			},
			{ id: "manualLoss100", label: "Manuel Kayıp (100m)", unit: "dB", type: "number", step: 0.01, min: 0, value: 6.7 },
			{ id: "manualDiam", label: "Manuel Çap", unit: "mm", type: "number", step: 0.1, min: 1, value: 8 },
			{ id: "targetLossDb", label: "Hedef Maks Kablo Kaybı (isteğe bağlı)", unit: "dB", type: "number", step: 0.1, min: 0.1, value: 1.5 },
			{ id: "minPwrPct", label: "Min Anten Gücü (isteğe bağlı)", unit: "%", type: "number", step: 1, min: 10, value: 80 },
		],
		note: "Bilmediğiniz alanları boş bırakabilirsiniz. Varsayılanlar: 10W, 433MHz, 20m, hedef 1.5dB kayıp ve %80 güç.",
	},
	{
		slug: "stub-boyu-hesabi",
		title: "Stub Boyu Hesabı",
		description: "Açık veya kısa devre stub için çeyrek/yarım dalga fiziksel uzunluk hesaplar.",
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
				label: "Uçlama",
				type: "select",
				value: "open",
				options: [
					{ value: "open", label: "Açık devre" },
					{ value: "short", label: "Kısa devre" },
				],
			},
			{ id: "vf", label: "Velocity Factor", type: "number", step: 0.01, min: 0.5, value: 0.66 },
		],
	},
	{
		slug: "empedans-donusum-orani",
		title: "Empedans Dönüşüm Oranı",
		description: "İki empedans arası dönüşüm oranı ve gerekli sarım oranı tahmini verir.",
		category: "rf-anten",
		formula: "impedance-ratio",
		fields: [
			{ id: "zin", label: "Giriş Empedansı", unit: "ohm", type: "number", step: 0.1, min: 1, value: 50 },
			{ id: "zout", label: "Çıkış Empedansı", unit: "ohm", type: "number", step: 0.1, min: 1, value: 200 },
		],
	},
	{
		slug: "balun-unun-donusum-orani",
		title: "Balun / Unun Dönüşüm Oranı",
		description: "Primer-sekonder sarım sayısına göre gerilim ve empedans oranlarını hesaplar.",
		category: "rf-anten",
		formula: "balun-ratio",
		fields: [
			{ id: "np", label: "Primer Sarım", type: "number", step: 1, min: 1, value: 2 },
			{ id: "ns", label: "Sekonder Sarım", type: "number", step: 1, min: 1, value: 4 },
		],
	},

	{
		slug: "watt-volt-amper-hesabi",
		title: "Akım Çekişi: Watt <-> Volt <-> Amper",
		description: "W, V ve A değerlerinden ikisini girerek üçüncüyü hesaplar.",
		category: "power-electric",
		formula: "pva",
		fields: [
			{ id: "w", label: "Güç", unit: "W", type: "number", step: 0.1, value: 60 },
			{ id: "v", label: "Voltaj", unit: "V", type: "number", step: 0.1, value: 13.8 },
			{ id: "a", label: "Akım", unit: "A", type: "number", step: 0.01, value: 4.35 },
		],
		note: "En az iki alan dolu olduğunda hesaplama yapılır.",
	},
	{
		slug: "sigorta-degeri-onerisi",
		title: "Sigorta Değeri Önerisi",
		description: "Sürekli akım ve emniyet çarpanıyla standart sigorta değeri önerir.",
		category: "power-electric",
		formula: "fuse",
		fields: [
			{ id: "current", label: "Sürekli Akım", unit: "A", type: "number", step: 0.1, min: 0.1, value: 12 },
			{ id: "factor", label: "Emniyet Çarpanı", type: "number", step: 0.05, min: 1, value: 1.25 },
		],
	},
	{
		slug: "kablo-kesiti-onerisi",
		title: "Kablo Kesiti Önerisi",
		description: "Akım, hat uzunluğu ve izinli düşüme göre minimum bakır kesit önerir.",
		category: "power-electric",
		formula: "cable-section",
		fields: [
			{ id: "voltage", label: "Sistem Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Akım", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Yön Hat Uzunluğu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "dropPct", label: "İzinli Voltaj Düşümü", unit: "%", type: "number", step: 0.1, min: 0.1, value: 3 },
		],
	},
	{
		slug: "voltaj-dusumu-hesaplama",
		title: "Voltaj Düşümü Hesaplama",
		description: "Bakır kablo kesiti, uzunluk ve akıma göre voltaj düşümünü hesaplar.",
		category: "power-electric",
		formula: "voltage-drop",
		fields: [
			{ id: "voltage", label: "Sistem Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Akım", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Yön Hat Uzunluğu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "area", label: "Kablo Kesiti", unit: "mm^2", type: "number", step: 0.1, min: 0.1, value: 4 },
		],
	},
	{
		slug: "dc-hat-kaybi-hesaplama",
		title: "DC Hat Kaybı Hesaplama",
		description: "Hat direnci, güç kaybı ve iletim verimini hesaplar.",
		category: "power-electric",
		formula: "dc-line-loss",
		fields: [
			{ id: "voltage", label: "Sistem Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "current", label: "Akım", unit: "A", type: "number", step: 0.1, min: 0.1, value: 20 },
			{ id: "length", label: "Tek Yön Hat Uzunluğu", unit: "m", type: "number", step: 0.1, min: 0.1, value: 4 },
			{ id: "area", label: "Kablo Kesiti", unit: "mm^2", type: "number", step: 0.1, min: 0.1, value: 4 },
		],
	},
	{
		slug: "batarya-kapasite-planlama",
		title: "Batarya Kapasite Planlama",
		description: "Yük gücü ve hedef süreye göre gereken Ah kapasitesini hesaplar.",
		category: "power-electric",
		formula: "battery-plan",
		fields: [
			{ id: "loadW", label: "Ortalama Yük", unit: "W", type: "number", step: 1, min: 1, value: 45 },
			{ id: "hours", label: "Hedef Süre", unit: "saat", type: "number", step: 0.1, min: 0.1, value: 8 },
			{ id: "voltage", label: "Sistem Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 12 },
			{ id: "dod", label: "Maks. Deşarj", unit: "%", type: "number", step: 1, min: 10, value: 70 },
			{ id: "eff", label: "Sistem Verimi", unit: "%", type: "number", step: 1, min: 10, value: 90 },
		],
	},
	{
		slug: "sarj-suresi-tahmini",
		title: "Şarj Süresi Tahmini",
		description: "Akü kapasitesi, şarj akımı ve verime göre şarj süresini tahmin eder.",
		category: "power-electric",
		formula: "charge-time",
		fields: [
			{ id: "ah", label: "Akü Kapasitesi", unit: "Ah", type: "number", step: 0.1, min: 0.1, value: 60 },
			{ id: "soc", label: "Doldurulacak Kısım", unit: "%", type: "number", step: 1, min: 1, value: 50 },
			{ id: "current", label: "Şarj Akımı", unit: "A", type: "number", step: 0.1, min: 0.1, value: 8 },
			{ id: "eff", label: "Şarj Verimi", unit: "%", type: "number", step: 1, min: 10, value: 85 },
		],
	},
	{
		slug: "duty-cycle-ortalama-tuketim",
		title: "Duty Cycle'a Göre Ortalama Tüketim",
		description: "TX/RX/Bekleme oranlarına göre ortalama akım ve gücü hesaplar.",
		category: "power-electric",
		formula: "duty-average",
		fields: [
			{ id: "voltage", label: "Sistem Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 13.8 },
			{ id: "txA", label: "TX Akımı", unit: "A", type: "number", step: 0.01, min: 0, value: 12 },
			{ id: "rxA", label: "RX Akımı", unit: "A", type: "number", step: 0.01, min: 0, value: 1.2 },
			{ id: "idleA", label: "Bekleme Akımı", unit: "A", type: "number", step: 0.01, min: 0, value: 0.2 },
			{ id: "txPct", label: "TX Oranı", unit: "%", type: "number", step: 1, min: 0, value: 10 },
			{ id: "rxPct", label: "RX Oranı", unit: "%", type: "number", step: 1, min: 0, value: 30 },
		],
	},
	{
		slug: "gunes-paneli-aku-gunluk-enerji-dengesi",
		title: "Güneş Paneli + Akü Günlük Enerji Dengesi",
		description: "Günlük panel üretimi ile tüketimi karşılaştırır, net artı/eksi enerji verir.",
		category: "power-electric",
		formula: "solar-balance",
		fields: [
			{ id: "panelW", label: "Panel Gücü", unit: "W", type: "number", step: 1, min: 1, value: 200 },
			{ id: "sunHours", label: "Eşdeğer Güneş Süresi", unit: "saat", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "eff", label: "Sistem Verimi", unit: "%", type: "number", step: 1, min: 10, value: 80 },
			{ id: "dailyLoadWh", label: "Günlük Tüketim", unit: "Wh", type: "number", step: 1, min: 1, value: 650 },
			{ id: "batteryV", label: "Akü Voltajı", unit: "V", type: "number", step: 0.1, min: 1, value: 12 },
		],
	},
	{
		slug: "regulator-inverter-verim-kaybi",
		title: "Regülatör / Inverter Verim Kaybı Hesabı",
		description: "Yük gücünden giriş gücü ve kayıp gücü hesaplar.",
		category: "power-electric",
		formula: "efficiency-loss",
		fields: [
			{ id: "loadW", label: "Çıkış Yük Gücü", unit: "W", type: "number", step: 1, min: 1, value: 300 },
			{ id: "eff", label: "Verim", unit: "%", type: "number", step: 1, min: 10, value: 88 },
		],
	},

	{
		slug: "konusma-orani-calisma-suresi",
		title: "Konuşma Oranına Göre Tahmini Çalışma Süresi",
		description: "Konuşma/dinleme oranına göre HT runtime tahmini yapar.",
		category: "operations",
		formula: "talk-runtime",
		fields: [
			{ id: "ah", label: "Akü Kapasitesi", unit: "Ah", type: "number", step: 0.1, min: 0.1, value: 7.5 },
			{ id: "usable", label: "Kullanılabilir Kapasite", unit: "%", type: "number", step: 1, min: 1, value: 85 },
			{ id: "txA", label: "TX Akımı", unit: "A", type: "number", step: 0.01, min: 0, value: 1.8 },
			{ id: "rxA", label: "RX Akımı", unit: "A", type: "number", step: 0.01, min: 0, value: 0.35 },
			{ id: "talkPct", label: "Konuşma Oranı", unit: "%", type: "number", step: 1, min: 0, value: 15 },
		],
	},
	{
		slug: "el-telsizi-menzil-tahmini",
		title: "El Telsizi Menzil Tahmini",
		description: "Yükseklik, güç ve çevre faktörüne göre elde taşınan telsiz menzil tahmini.",
		category: "operations",
		formula: "ht-range",
		fields: [
			{ id: "txW", label: "TX Gücü", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "h1", label: "İstasyon 1 Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.7 },
			{ id: "h2", label: "İstasyon 2 Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.7 },
			{ id: "envFactor", label: "Çevre Faktörü", type: "number", step: 0.05, min: 0.3, value: 0.7 },
		],
	},
	{
		slug: "mobil-telsiz-menzil-tahmini",
		title: "Mobil Telsiz Menzil Tahmini",
		description: "Araç üstü senaryo için LOS tabanlı menzil tahmini.",
		category: "operations",
		formula: "mobile-range",
		fields: [
			{ id: "txW", label: "TX Gücü", unit: "W", type: "number", step: 0.1, min: 0.1, value: 50 },
			{ id: "h1", label: "Mobil Anten Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 2.2 },
			{ id: "h2", label: "Hedef Anten Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 2.2 },
			{ id: "envFactor", label: "Çevre Faktörü", type: "number", step: 0.05, min: 0.3, value: 0.8 },
		],
	},
	{
		slug: "roleye-erisim-tahmini",
		title: "Röleye Erişim Tahmini",
		description: "Gönderim bütçesinden röleye ulaşılabilecek teorik mesafeyi hesaplar.",
		category: "operations",
		formula: "repeater-access",
		fields: [
			{ id: "freqMHz", label: "Frekans", unit: "MHz", type: "number", step: 0.1, min: 0.1, value: 145.6 },
			{ id: "txW", label: "TX Gücü", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "txGain", label: "TX Anten Kazancı", unit: "dBi", type: "number", step: 0.1, value: 2 },
			{ id: "rxGain", label: "Röle Anten Kazancı", unit: "dBi", type: "number", step: 0.1, value: 6 },
			{ id: "loss", label: "Toplam Ek Kayıp", unit: "dB", type: "number", step: 0.1, min: 0, value: 4 },
			{ id: "rxSens", label: "Röle Alıcı Hassasiyeti", unit: "dBm", type: "number", step: 0.1, value: -118 },
			{ id: "margin", label: "Hedef Fade Margin", unit: "dB", type: "number", step: 0.1, min: 0, value: 10 },
		],
	},
	{
		slug: "yukseklik-artisi-kapsama-etkisi",
		title: "Yükseklik Artışının Kapsama Etkisi",
		description: "Anten yüksekliği artışı ile LOS menzil değişimini karşılaştırır.",
		category: "operations",
		formula: "height-coverage",
		fields: [
			{ id: "oldH", label: "Eski Anten Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 6 },
			{ id: "newH", label: "Yeni Anten Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 18 },
			{ id: "otherH", label: "Karşı İstasyon Yüksekliği", unit: "m", type: "number", step: 0.1, min: 0.5, value: 1.5 },
		],
	},
	{
		slug: "qrp-vs-yuksek-guc-karsilastirma",
		title: "QRP vs Yüksek Güç Karşılaştırma Tablosu",
		description: "İki güç seviyesi arasında dB farkı, S-unit farkı ve alan gücü etkisini karşılaştırır.",
		category: "operations",
		formula: "qrp-vs-high",
		fields: [
			{ id: "lowW", label: "QRP Gücü", unit: "W", type: "number", step: 0.1, min: 0.1, value: 5 },
			{ id: "highW", label: "Yüksek Güç", unit: "W", type: "number", step: 0.1, min: 0.1, value: 100 },
		],
	},
	{
		slug: "s-unit-guc-farki-hesabi",
		title: "S-Unit Yaklaşık Güç Farkı Hesabı",
		description: "dB farkından yaklaşık S-unit değişimini hesaplar (1 S ~ 6 dB).",
		category: "operations",
		formula: "s-unit",
		fields: [
			{ id: "dbDiff", label: "dB Farkı", unit: "dB", type: "number", step: 0.1, value: 12 },
		],
	},
	{
		slug: "db-artisi-pratik-etkisi",
		title: "dB Artışının Pratik Etkisi",
		description: "dB kazancının güç oranı, gerilim oranı ve teorik mesafe katsayısına etkisini verir.",
		category: "operations",
		formula: "db-effect",
		fields: [
			{ id: "db", label: "dB Artışı", unit: "dB", type: "number", step: 0.1, value: 3 },
		],
	},

	{
		slug: "kanal-araligi-hesaplama",
		title: "Kanal Aralığı Hesaplama",
		description: "Başlangıç ve bitiş frekansı arasında kanal aralığını hesaplar.",
		category: "digital",
		formula: "channel-spacing",
		fields: [
			{ id: "startMHz", label: "Başlangıç Frekansı", unit: "MHz", type: "number", step: 0.001, value: 145.5 },
			{ id: "endMHz", label: "Bitiş Frekansı", unit: "MHz", type: "number", step: 0.001, value: 145.8 },
			{ id: "channels", label: "Kanal Sayısı", type: "number", step: 1, min: 2, value: 13 },
		],
	},
	{
		slug: "offset-hesaplama",
		title: "Offset Hesaplama",
		description: "Röle RX frekansından (Türkiye pratiği) TX frekansını ve offset yönünü hesaplar.",
		category: "digital",
		formula: "offset",
		fields: [
			{ id: "rxMHz", label: "Röle RX Frekansı", unit: "MHz", type: "number", step: 0.001, value: 145.6 },
			{
				id: "preset",
				label: "Bant / Preset",
				type: "select",
				value: "vhf-tr",
				options: [
					{ value: "vhf-tr", label: "VHF (TR tipik: -0.600 MHz)" },
					{ value: "uhf-tr", label: "UHF (TR tipik: -7.600 MHz)" },
					{ value: "custom", label: "Özel offset" },
				],
			},
			{
				id: "direction",
				label: "Offset Yönü (özel modda)",
				type: "select",
				value: "minus",
				options: [
					{ value: "minus", label: "- (TX aşağıda)" },
					{ value: "plus", label: "+ (TX yukarıda)" },
				],
			},
			{ id: "customKHz", label: "Özel Offset", unit: "kHz", type: "number", step: 1, min: 0, value: 600 },
		],
		note: "Türkiye'de çoğu rölede VHF için -0.600 MHz, UHF için -7.600 MHz kullanılır; istisnalar olabilir.",
	},
	{
		slug: "duplex-split-hesaplama",
		title: "Duplex Split Hesaplama",
		description: "Verilen split ve yöne göre TX veya RX frekansını hesaplar.",
		category: "digital",
		formula: "duplex-split",
		fields: [
			{ id: "rxMHz", label: "RX Frekansı", unit: "MHz", type: "number", step: 0.001, value: 145.6 },
			{ id: "splitKHz", label: "Split", unit: "kHz", type: "number", step: 1, min: 0, value: 600 },
			{
				id: "direction",
				label: "Yön",
				type: "select",
				value: "minus",
				options: [
					{ value: "minus", label: "- (TX aşağıda)" },
					{ value: "plus", label: "+ (TX yukarıda)" },
				],
			},
		],
	},
	{
		slug: "ctcss-dcs-rehber-araci",
		title: "CTCSS / DCS Rehber Aracı",
		description: "Ton/kod ve encode-decode seçimine göre hızlı programlama özetini verir.",
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
		title: "APRS Beacon Aralık Önerisi",
		description: "Hız, hareket tipi ve enerji tercihiyle beacon aralık önerisi verir.",
		category: "digital",
		formula: "aprs-interval",
		fields: [
			{ id: "speed", label: "Ortalama Hız", unit: "km/h", type: "number", step: 1, min: 0, value: 45 },
			{
				id: "profile",
				label: "Kullanım Profili",
				type: "select",
				value: "mobile",
				options: [
					{ value: "static", label: "Sabit İstasyon" },
					{ value: "portable", label: "Yavaş Hareket" },
					{ value: "mobile", label: "Mobil" },
				],
			},
			{
				id: "powerMode",
				label: "Enerji Önceliği",
				type: "select",
				value: "balanced",
				options: [
					{ value: "max-saving", label: "Maks Tasarruf" },
					{ value: "balanced", label: "Dengeli" },
					{ value: "tracking", label: "Takip Öncelikli" },
				],
			},
		],
	},
	{
		slug: "doppler-duzeltme-tahmini",
		title: "Doppler Düzeltme Tahmini",
		description: "LEO uydu geçişlerinde yaklaşma/uzaklaşma için frekans kayması tahmini.",
		category: "digital",
		formula: "doppler",
		fields: [
			{ id: "freqMHz", label: "Çalışma Frekansı", unit: "MHz", type: "number", step: 0.001, min: 0.1, value: 145.8 },
			{ id: "speedKms", label: "Bağıl Hız", unit: "km/s", type: "number", step: 0.1, min: 0.1, value: 7.5 },
		],
	},
	{
		slug: "grid-locator-cevirici",
		title: "Grid Locator Çevirici",
		description: "Enlem-boylamdan Maidenhead grid üretir veya grid'den merkez koordinat çıkarır.",
		category: "digital",
		formula: "grid-converter",
		fields: [
			{
				id: "mode",
				label: "Dönüşüm Yönü",
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
		note: "Mod seçerek her iki yöne çeviri yapabilirsiniz.",
	},
	{
		slug: "bearing-distance-hesabi",
		title: "İki Lokasyon Arası Bearing / Distance",
		description: "İki koordinat arası büyük çember mesafesi ve ilk rota açısını hesaplar.",
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
		title: "Uydu Geçiş Yüksekliğine Göre Görünürlük Süresi",
		description: "Maksimum elevasyona göre LEO geçiş görünürlük süresini yaklaşık tahmin eder.",
		category: "satellite",
		formula: "sat-visibility",
		fields: [
			{ id: "maxEl", label: "Maksimum Elevasyon", unit: "deg", type: "number", step: 1, min: 1, value: 55 },
			{ id: "period", label: "Orbital Periyot", unit: "dk", type: "number", step: 0.1, min: 10, value: 95 },
		],
	},
	{
		slug: "gunes-aktivitesine-gore-hf-band",
		title: "Güneş Aktivitesine Göre HF Band Uygunluğu Rehberi",
		description: "SFI ve Kp indeksine göre uygun HF bandlarını rehber niteliğinde listeler.",
		category: "satellite",
		formula: "hf-solar-guide",
		fields: [
			{ id: "sfi", label: "Solar Flux Index (SFI)", type: "number", step: 1, min: 50, value: 120 },
			{ id: "kp", label: "Kp", type: "number", step: 0.1, min: 0, value: 2.5 },
			{
				id: "period",
				label: "Gün Dönemi",
				type: "select",
				value: "day",
				options: [
					{ value: "day", label: "Gündüz" },
					{ value: "night", label: "Gece" },
				],
			},
		],
	},
	{
		slug: "muf-luf-temel-arac",
		title: "MUF / LUF Temel Açıklamalı Araç",
		description: "foF2 değerinden MUF tahmini yapar, gürültü seviyesine göre LUF yaklaşımı verir.",
		category: "satellite",
		formula: "muf-luf",
		fields: [
			{ id: "fof2", label: "foF2", unit: "MHz", type: "number", step: 0.1, min: 1, value: 6.5 },
			{ id: "noise", label: "Gürültü Seviyesi (1-5)", type: "number", step: 1, min: 1, value: 3 },
			{ id: "pathFactor", label: "Yol Faktörü", type: "number", step: 0.1, min: 1, value: 3 },
		],
	},
	{
		slug: "greyline-hesaplama",
		title: "Gri Hat (Greyline) Hesaplama",
		description: "Verilen lokasyonda seçilen tarih/saatte güneş elevasyonuna göre greyline durumunu hesaplar.",
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
		title: "Gün Doğumu / Gün Batımı Bazlı Band Önerisi",
		description: "Konuma göre gün doğumu-batımı saatlerini ve zaman dilimine göre band önerilerini verir.",
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