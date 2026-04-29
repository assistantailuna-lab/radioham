export type Lang = "tr" | "en";

export type GuideSection = {
	id: string;
	number: number;
	title: string;
	items: string[];
};

export type GuideSubtopic = {
	lang: Lang;
	slug: string;
	legacySlugs: string[];
	code: string;
	sectionId: string;
	sectionNumber: number;
	sectionTitle: string;
	itemNumber: number;
	title: string;
	fullTitle: string;
};

export type GuideCategory = {
	id: string;
	title: string;
	description: string;
	sectionNumbers: number[];
};

export type GuideLocale = {
	siteTitle: string;
	siteDescription: string;
	homeTitle: string;
	homeDescription: string;
	homeHeroText: string;
	metrics: [string, string][];
	categoriesTitle: string;
	categoriesIntro: string;
	mapTitle: string;
	mapIntro: string;
	categoryCta: string;
	subTopicLabel: string;
	guideTitle: string;
	guideDescription: string;
	guideHeroTitle: string;
	guideHeroText: string;
	tocLabel: string;
	categoryPageTitle: string;
	categoryPageDescription: string;
	categoryPageHeroTitle: string;
	categoryPageHeroText: string;
	first7Title: string;
	first7Description: string;
	first7HeroTitle: string;
	first7HeroText: string;
	faqTitle: string;
	faqDescription: string;
	faqHeroTitle: string;
	faqHeroText: string;
	faqPlaceholder: string;
	glossaryTitle: string;
	glossaryDescription: string;
	glossaryHeroTitle: string;
	glossaryHeroText: string;
	glossaryPlaceholder: string;
	contactTitle: string;
	contactDescription: string;
	contactHeroTitle: string;
	contactHeroText: string;
	contactReachTitle: string;
	contactFormTitle: string;
	contactFormPlaceholders: {
		name: string;
		email: string;
		subject: string;
		message: string;
		submit: string;
	};
	categories: GuideCategory[];
	sections: GuideSection[];
};

const sectionIds = [
	"intro",
	"core-concepts",
	"legal-practical",
	"radio-types",
	"choosing-first-radio",
	"first-power-on",
	"understanding-menus",
	"first-listening",
	"first-speaking",
	"repeater-logic",
	"antennas",
	"programming-software",
	"troubleshooting",
	"operating-etiquette",
	"advanced-intro",
	"build-projects",
	"faq",
	"glossary",
	"first-7-days",
] as const;

const trSections: GuideSection[] = [
	{ id: sectionIds[0], number: 1, title: "Giriş", items: ["1.1 Amatör telsizcilik nedir", "1.2 Bu hobi ne işe yarar", "1.3 Kimler neden başlar", "1.4 Bu rehber kimler için hazırlandı"] },
	{ id: sectionIds[1], number: 2, title: "En Temel Kavramlar", items: ["2.1 Frekans nedir", "2.2 VHF nedir, UHF nedir", "2.3 2 metre ve 70 santimetre ne demek", "2.4 Kanal nedir, hafıza kanalı nedir", "2.5 Watt neyi ifade eder", "2.6 Anten neden önemlidir", "2.7 Modülasyon nedir: FM, AM, dijital", "2.8 Squelch, CTCSS, DCS nedir"] },
	{ id: sectionIds[2], number: 3, title: "Yasal ve Pratik Çerçeve", items: ["3.1 Amatör telsizcilik neden lisanslıdır", "3.2 Hangi frekanslar neden serbest değildir", "3.3 Amatör bantlar nelerdir", "3.4 Band planı nedir", "3.5 Röle, simplex ve ortak kullanım kuralları", "3.6 Yeni başlayan biri nelere dikkat etmelidir"] },
	{ id: sectionIds[3], number: 4, title: "Telsiz Türleri", items: ["4.1 El telsizi", "4.2 Araç telsizi", "4.3 Sabit istasyon", "4.4 Analog telsiz", "4.5 Dijital telsiz", "4.6 DMR nedir, analogdan farkı nedir", "4.7 APRS nedir, normal konuşmadan farkı nedir"] },
	{ id: sectionIds[4], number: 5, title: "İlk Telsizi Seçmek", items: ["5.1 Yeni başlayan biri nasıl cihaz seçmeli", "5.2 Ucuz cihaz mı, dengeli cihaz mı", "5.3 Bluetooth gerekli mi", "5.4 GPS, APRS, spectrum analyzer gibi özellikler ne kadar gerekli", "5.5 Programlama kolaylığı neden önemli", "5.6 Anten girişi, batarya, aksesuar ekosistemi", "5.7 Gerçek ihtiyaç listesi çıkarma"] },
	{ id: sectionIds[5], number: 6, title: "Telsizi İlk Kez Açınca", items: ["6.1 Kutudan çıkan parçalar", "6.2 Anteni doğru takmak", "6.3 İlk şarj ve batarya kullanımı", "6.4 Ekrandaki temel simgeler", "6.5 Fabrika ayarlarını bozmadan ilk kontrol", "6.6 Hangi ayarlar ilk başta kapalı/açık olmalı"] },
	{ id: sectionIds[6], number: 7, title: "Menüleri Anlamak", items: ["7.1 SQL / squelch", "7.2 TX power", "7.3 Wide / Narrow", "7.4 BCL", "7.5 STE / RP-STE", "7.6 VOX", "7.7 Noise Reduction", "7.8 Scan", "7.9 Dual Watch / TDR", "7.10 Shift / Offset", "7.11 CTCSS / DCS", "7.12 Kanal adı ve hafıza kaydı"] },
	{ id: sectionIds[7], number: 8, title: "İlk Dinleme Deneyimi", items: ["8.1 Önce dinlemek neden önemli", "8.2 Röle nasıl dinlenir", "8.3 Simplex frekans nasıl dinlenir", "8.4 APRS frekansında neden veri sesi duyulur", "8.5 Airband neden AM’dir", "8.6 Gerçek sinyal ile iç gürültü nasıl ayırt edilir"] },
	{ id: sectionIds[8], number: 9, title: "İlk Konuşma Deneyimi", items: ["9.1 Simplex nedir", "9.2 İki telsiz aynı frekansta nasıl konuşturulur", "9.3 Dört telsiz aynı frekansta nasıl çalışır", "9.4 Röleye ilk çağrı nasıl yapılır", "9.5 Doğru kısa çağrı örnekleri", "9.6 Neden röleyi duyup açamayabilirsin"] },
	{ id: sectionIds[9], number: 10, title: "Röle Mantığını Öğrenmek", items: ["10.1 Röle nedir", "10.2 RX ve TX ne demek", "10.3 Offset nedir", "10.4 Shift yönü nasıl anlaşılır", "10.5 Tone neden gerekir", "10.6 Röle kaydından doğru ayar nasıl çıkarılır", "10.7 VHF ve UHF röle farkları", "10.8 Örneğin röle ekleme adımları"] },
	{ id: sectionIds[10], number: 11, title: "Antenler", items: ["11.1 Stok anten yeterli mi", "11.2 Daha uzun anten ne kazandırır", "11.3 Nagoya, Signal Stick, teleskopik ve taktik anten farkı", "11.4 Araç anteni ve ev anteni farkı", "11.5 Anten verimi ile güç farkı", "11.6 Anten seçerken konektör türleri", "11.7 SMA male / SMA female nasıl anlaşılır"] },
	{ id: sectionIds[11], number: 12, title: "Programlama ve Yazılım", items: ["12.1 Programlama kablosu nedir", "12.2 USB-C ile programlama", "12.3 CHIRP nedir", "12.4 CPS nedir", "12.5 Telefonda programlama uygulamaları", "12.6 Firmware güncellemesi yapmadan önce dikkat edilmesi gerekenler", "12.7 Yanlış firmware riskleri", "12.8 Yedek alma alışkanlığı"] },
	{ id: sectionIds[12], number: 13, title: "Kullanım Hataları ve Sorun Giderme", items: ["13.1 Hiçbir şey duymuyorum", "13.2 Her frekansta hışırtı geliyor", "13.3 Röleyi duyuyorum ama gönderemiyorum", "13.4 Tone doğru ama yine açmıyor", "13.5 Aynı frekansta iki cihaz neden konuşmuyor", "13.6 Neden motor/helikopter gibi ses duyuyorum", "13.7 Cihaz içi birdie nedir", "13.8 Anten mi sorun, ayar mı sorun"] },
	{ id: sectionIds[13], number: 14, title: "Kullanım Adabı", items: ["14.1 Telsizde konuşma disiplini", "14.2 Aynı anda konuşmamak", "14.3 Çağrı verirken kısa ve net olmak", "14.4 Röleleri gereksiz meşgul etmemek", "14.5 Başkalarının üstüne çıkmamak", "14.6 Yeni başlayan biri nasıl dinleyip öğrenmeli"] },
	{ id: sectionIds[14], number: 15, title: "İleri Seviye Konulara Giriş", items: ["15.1 APRS’e giriş", "15.2 DMR’ye giriş", "15.3 Hotspot nedir", "15.4 Digi ve iGate nedir", "15.5 GPS’li telsizler", "15.6 Telsiz + telefon uygulaması sistemleri", "15.7 Sunucu ile entegrasyon fikirleri", "15.8 Ölçüm cihazları: TinySA, VNA, dummy load"] },
	{ id: sectionIds[15], number: 16, title: "Kendi Projelerini Yapmak", items: ["16.1 Dinleme istasyonu kurmak", "16.2 Ubuntu sunucu ile kayıt/log sistemi", "16.3 ESP32 ile telsiz otomasyonu", "16.4 Anten deneme projeleri", "16.5 RX-only preamp ve filtre mantığı", "16.6 Taşınabilir saha çantası hazırlamak"] },
	{ id: sectionIds[17], number: 18, title: "Mini Terimler Sözlüğü", items: ["APRS", "BCL", "Beacon", "CHIRP", "CTCSS", "DCS", "DMR", "Duplex", "FM", "GPS", "Hotspot", "Offset", "Repeater", "Simplex", "SQL", "STE", "TDR", "UHF", "VHF", "VOX"] },
	{ id: sectionIds[18], number: 19, title: "İlk 7 Günlük Başlangıç Planı", items: ["19.1 1. gün: cihazı tanı", "19.2 2. gün: menüleri öğren", "19.3 3. gün: ilk kurulum sekmesini çalış", "19.4 4. gün: simplex ve röle ayarlarını uygula", "19.5 5. gün: anten denemesi yap", "19.6 6. gün: çağrı pratiği yap", "19.7 7. gün: log tut ve not çıkar"] },
];

const enSections: GuideSection[] = [
	{ id: sectionIds[0], number: 1, title: "Introduction", items: ["1.1 What is amateur radio", "1.2 What is this hobby used for", "1.3 Who starts and why", "1.4 Who is this guide for"] },
	{ id: sectionIds[1], number: 2, title: "Core Concepts", items: ["2.1 What is frequency", "2.2 What are VHF and UHF", "2.3 What do 2 meters and 70 centimeters mean", "2.4 What is a channel and memory channel", "2.5 What does watt mean", "2.6 Why is the antenna important", "2.7 What is modulation: FM, AM, digital", "2.8 What are Squelch, CTCSS, DCS"] },
	{ id: sectionIds[2], number: 3, title: "Legal and Practical Framework", items: ["3.1 Why is amateur radio licensed", "3.2 Why are some frequencies not free to use", "3.3 What are amateur bands", "3.4 What is a band plan", "3.5 Repeater, simplex, and shared-use rules", "3.6 What should a beginner pay attention to"] },
	{ id: sectionIds[3], number: 4, title: "Radio Types", items: ["4.1 Handheld radio", "4.2 Mobile radio", "4.3 Base station", "4.4 Analog radio", "4.5 Digital radio", "4.6 What is DMR and how is it different from analog", "4.7 What is APRS and how is it different from voice communication"] },
	{ id: sectionIds[4], number: 5, title: "Choosing the First Radio", items: ["5.1 How should a beginner choose a device", "5.2 Budget device or balanced device", "5.3 Is Bluetooth necessary", "5.4 How necessary are features like GPS, APRS, spectrum analyzer", "5.5 Why does programming ease matter", "5.6 Antenna port, battery, and accessory ecosystem", "5.7 Creating a real needs list"] },
	{ id: sectionIds[5], number: 6, title: "When You First Power On", items: ["6.1 What comes in the box", "6.2 Mounting the antenna correctly", "6.3 First charge and battery usage", "6.4 Basic symbols on the screen", "6.5 Initial checks without breaking factory defaults", "6.6 Which settings should start on/off"] },
	{ id: sectionIds[6], number: 7, title: "Understanding Menus", items: ["7.1 SQL / squelch", "7.2 TX power", "7.3 Wide / Narrow", "7.4 BCL", "7.5 STE / RP-STE", "7.6 VOX", "7.7 Noise Reduction", "7.8 Scan", "7.9 Dual Watch / TDR", "7.10 Shift / Offset", "7.11 CTCSS / DCS", "7.12 Channel name and memory save"] },
	{ id: sectionIds[7], number: 8, title: "First Listening Experience", items: ["8.1 Why listening first is important", "8.2 How to monitor a repeater", "8.3 How to monitor a simplex frequency", "8.4 Why data sound is heard on APRS frequency", "8.5 Why airband uses AM", "8.6 Distinguishing real signal from internal noise"] },
	{ id: sectionIds[8], number: 9, title: "First Speaking Experience", items: ["9.1 What is simplex", "9.2 How two radios talk on the same frequency", "9.3 How four radios operate on the same frequency", "9.4 First call through a repeater", "9.5 Correct short call examples", "9.6 Why you may hear the repeater but fail to open it"] },
	{ id: sectionIds[9], number: 10, title: "Learning Repeater Logic", items: ["10.1 What is a repeater", "10.2 What do RX and TX mean", "10.3 What is offset", "10.4 How to identify shift direction", "10.5 Why tone is required", "10.6 Getting proper settings from a repeater listing", "10.7 VHF vs UHF repeater differences", "10.8 Adding repeaters with examples"] },
	{ id: sectionIds[10], number: 11, title: "Antennas", items: ["11.1 Is the stock antenna enough", "11.2 What does a longer antenna improve", "11.3 Differences between Nagoya, Signal Stick, telescopic, and tactical antennas", "11.4 Mobile antenna vs home antenna", "11.5 Antenna efficiency versus transmit power", "11.6 Connector types when selecting an antenna", "11.7 How to tell SMA male and SMA female"] },
	{ id: sectionIds[11], number: 12, title: "Programming and Software", items: ["12.1 What is a programming cable", "12.2 Programming via USB-C", "12.3 What is CHIRP", "12.4 What is CPS", "12.5 Mobile programming apps", "12.6 Precautions before firmware update", "12.7 Risks of wrong firmware", "12.8 Backup habit"] },
	{ id: sectionIds[12], number: 13, title: "Common Mistakes and Troubleshooting", items: ["13.1 I cannot hear anything", "13.2 I hear static on every frequency", "13.3 I hear the repeater but cannot transmit", "13.4 Tone seems right but still not opening", "13.5 Why two devices cannot talk on the same frequency", "13.6 Why I hear engine/helicopter-like sounds", "13.7 What is an internal birdie", "13.8 Is it antenna issue or configuration issue"] },
	{ id: sectionIds[13], number: 14, title: "Operating Etiquette", items: ["14.1 On-air discipline", "14.2 Avoid transmitting over others", "14.3 Keep calls short and clear", "14.4 Do not occupy repeaters unnecessarily", "14.5 Do not step on other operators", "14.6 How beginners should listen and learn"] },
	{ id: sectionIds[14], number: 15, title: "Intro to Advanced Topics", items: ["15.1 Intro to APRS", "15.2 Intro to DMR", "15.3 What is a hotspot", "15.4 What are digi and iGate", "15.5 GPS-enabled radios", "15.6 Radio + mobile app systems", "15.7 Server integration ideas", "15.8 Measurement tools: TinySA, VNA, dummy load"] },
	{ id: sectionIds[15], number: 16, title: "Build Your Own Projects", items: ["16.1 Build a listening station", "16.2 Ubuntu server log/recording system", "16.3 Radio automation with ESP32", "16.4 Antenna test projects", "16.5 RX-only preamp and filter basics", "16.6 Building a portable field kit"] },
	{ id: sectionIds[17], number: 18, title: "Mini Glossary", items: ["APRS", "BCL", "Beacon", "CHIRP", "CTCSS", "DCS", "DMR", "Duplex", "FM", "GPS", "Hotspot", "Offset", "Repeater", "Simplex", "SQL", "STE", "TDR", "UHF", "VHF", "VOX"] },
	{ id: sectionIds[18], number: 19, title: "First 7-Day Starter Plan", items: ["19.1 Day 1: get to know your device", "19.2 Day 2: learn menus", "19.3 Day 3: work through the First Setup tab", "19.4 Day 4: apply simplex and repeater settings", "19.5 Day 5: test antenna options", "19.6 Day 6: practice calling", "19.7 Day 7: keep a log and notes"] },
];

const trCategories: GuideCategory[] = [
	{ id: "baslangic", title: "Başlangıç Temeli", description: "Sıfırdan başlayanlar için ilk kavramlar, yasal çerçeve ve telsiz türleri.", sectionNumbers: [1, 2, 3, 4] },
	{ id: "cihaz-kurulum", title: "Cihaz ve Kurulum", description: "İlk cihaz seçimi, ilk açılış ve menü ayar mantığının oturması.", sectionNumbers: [5, 6, 7, 8] },
	{ id: "iletisim-pratigi", title: "İletişim Pratiği", description: "Dinleme, ilk çağrı, röle mantığı ve saha kullanım adabı.", sectionNumbers: [9, 10, 11, 14] },
	{ id: "teknik-yazilim", title: "Teknik ve Yazılım", description: "Programlama, hata giderme ve ileri seviye entegrasyon yaklaşımı.", sectionNumbers: [12, 13, 15] },
	{ id: "projeler-kaynaklar", title: "Projeler ve Kaynaklar", description: "Kendi projelerin, terimler ve 7 günlük hızlı başlangıç planı.", sectionNumbers: [16, 18, 19] },
];

const enCategories: GuideCategory[] = [
	{ id: "foundations", title: "Beginner Foundations", description: "First concepts, legal context, and radio types for complete beginners.", sectionNumbers: [1, 2, 3, 4] },
	{ id: "device-setup", title: "Device and Setup", description: "First radio selection, initial power-on, and menu logic.", sectionNumbers: [5, 6, 7, 8] },
	{ id: "communication-practice", title: "Communication Practice", description: "Listening, first calls, repeater basics, and on-air etiquette.", sectionNumbers: [9, 10, 11, 14] },
	{ id: "technical-software", title: "Technical and Software", description: "Programming, troubleshooting, and advanced integration topics.", sectionNumbers: [12, 13, 15] },
	{ id: "projects-resources", title: "Projects and Resources", description: "DIY projects, glossary, and the 7-day quick start plan.", sectionNumbers: [16, 18, 19] },
];

export const guideData: Record<Lang, GuideLocale> = {
	tr: {
		siteTitle: "RadioHam",
		siteDescription: "Amatör telsizcilik için başlangıç ve gelişim rehberi.",
		homeTitle: "Amatör Telsizciliğe Yeni Başlayanlar İçin Rehber",
		homeDescription: "Amatör telsizciliğe yeni başlayanlar için adım adım rehber, kategori düzeni ve temel kavramlar.",
		homeHeroText: "Menü ve kategori yapısı baştan sona tutarlı olacak şekilde planlandı. Tüm başlıklar tek bir bilgi mimarisi altında düzenli, takip edilebilir ve güncellenebilir olarak hazırlandı.",
		metrics: [["19", "Ana Bölüm"], ["130+", "Alt Başlık"], ["5", "Ana Kategori"], ["1", "Net Öğrenme Akışı"]],
		categoriesTitle: "Kategori Mimarisi",
		categoriesIntro: "Rehber 5 ana kategoriye bölündü. Böylece hem yeni başlayan hem teknik derinlik arayan kullanıcı kaybolmadan doğru bölüme ulaşır.",
		mapTitle: "Bölüm Haritası",
		mapIntro: "Aşağıdaki bölüm haritası, tüm 19 başlığı tek ekranda görmenizi sağlar. Ayrıntılı akış için Rehber sayfasına geçin.",
		categoryCta: "Kategoriye Git",
		subTopicLabel: "alt konu",
		guideTitle: "Rehber | Amatör Telsizciliğe Yeni Başlayanlar",
		guideDescription: "Amatör telsizcilik rehberinin 19 bölümlük düzenli içerik akışı.",
		guideHeroTitle: "Rehber Akışı",
		guideHeroText: "Bu sayfa, tüm bölümleri düzenli bir bilgi akışıyla verir: önce temel, sonra cihaz ve menü, ardından pratik kullanım, son olarak ileri seviye ve projeler.",
		tocLabel: "İçindekiler",
		categoryPageTitle: "Kategoriler | Amatör Telsizcilik Rehberi",
		categoryPageDescription: "Rehberin kategori düzeni ve her kategoride yer alan bölümler.",
		categoryPageHeroTitle: "Kategoriler",
		categoryPageHeroText: "Tüm içerik, konu bütünlüğü bozulmadan 5 ana kategoriye ayrıldı. Her kategori kendi içinde başlangıçtan ileri seviyeye doğru ilerler.",
		first7Title: "İlk 7 Gün | Amatör Telsizcilik Başlangıç Planı",
		first7Description: "İlk 7 günlük adım adım başlangıç planı.",
		first7HeroTitle: "İlk 7 Günlük Başlangıç Planı",
		first7HeroText: "İlk hafta için düzenli rutin: cihazı tanı, menüleri öğren, ilk kurulum sekmesindeki simplex/röle adımlarını uygula, anten test et ve çağrı pratiği yap.",
		faqTitle: "SSS | Amatör Telsizcilik Rehberi",
		faqDescription: "Sık sorulan sorular bölümü.",
		faqHeroTitle: "Sık Sorulan Sorular",
		faqHeroText: "Yeni başlayanların en çok sorduğu sorular tek bir yerde toplandı.",
		faqPlaceholder: "Bu başlık için yanıt, ilgili mevzuat ve teknik dokümanlarla birlikte güncellenir.",
		glossaryTitle: "Sözlük | Amatör Telsizcilik Rehberi",
		glossaryDescription: "Mini terimler sözlüğü.",
		glossaryHeroTitle: "Mini Terimler Sözlüğü",
		glossaryHeroText: "Rehber boyunca geçen teknik kelimeleri hızlı bulmak için sade bir referans listesi.",
		glossaryPlaceholder: "Bu terimin açıklaması kaynakça temelli sözlük güncellemelerinde genişletilir.",
		contactTitle: "İletişim | RadioHam",
		contactDescription: "İletişim ve geri bildirim sayfası.",
		contactHeroTitle: "İletişim",
		contactHeroText: "Rehberle ilgili soru, düzeltme ve içerik önerileri için bu sayfa üzerinden iletişim süreci hazırlandı.",
		contactReachTitle: "Ekibe Ulaşın",
		contactFormTitle: "Hızlı Mesaj",
		contactFormPlaceholders: { name: "Ad Soyad", email: "E-posta Adresi", subject: "Konu", message: "Mesajınız", submit: "Mesaj Gönder" },
		categories: trCategories,
		sections: trSections,
	},
	en: {
		siteTitle: "RadioHam Guide",
		siteDescription: "A practical starter-to-advanced guide for amateur radio.",
		homeTitle: "Beginner’s Guide to Amateur Radio",
		homeDescription: "Step-by-step amateur radio guide for beginners with structured categories and core concepts.",
		homeHeroText: "The menu and category system is designed for continuity from start to finish. Every topic is organized under one information architecture that is easy to follow and update.",
		metrics: [["19", "Main Sections"], ["130+", "Subtopics"], ["5", "Core Categories"], ["1", "Clear Learning Flow"]],
		categoriesTitle: "Category Architecture",
		categoriesIntro: "The guide is divided into 5 core categories so both beginners and technical users can navigate without losing context.",
		mapTitle: "Section Map",
		mapIntro: "This map lets you see all 19 sections at once. For full sequencing, open the Guide page.",
		categoryCta: "Open Category",
		subTopicLabel: "subtopics",
		guideTitle: "Guide | Beginner’s Amateur Radio",
		guideDescription: "Structured 19-section learning flow for amateur radio.",
		guideHeroTitle: "Guide Flow",
		guideHeroText: "This page provides all sections in a coherent order: fundamentals first, then device and menus, communication practice, and finally advanced topics and projects.",
		tocLabel: "Contents",
		categoryPageTitle: "Categories | Amateur Radio Guide",
		categoryPageDescription: "Category structure and included sections.",
		categoryPageHeroTitle: "Categories",
		categoryPageHeroText: "All content is grouped into five major categories while preserving topic continuity from beginner to advanced.",
		first7Title: "First 7 Days | Amateur Radio Starter Plan",
		first7Description: "A practical day-by-day 7-day startup plan.",
		first7HeroTitle: "First 7-Day Starter Plan",
		first7HeroText: "A weekly routine: learn the device, menus, then apply simplex/repeater steps from the First Setup tab, followed by antenna tests and call practice.",
		faqTitle: "FAQ | Amateur Radio Guide",
		faqDescription: "Frequently asked questions.",
		faqHeroTitle: "Frequently Asked Questions",
		faqHeroText: "Most common beginner questions collected in one place.",
		faqPlaceholder: "This answer is updated against regulations and technical references.",
		glossaryTitle: "Glossary | Amateur Radio Guide",
		glossaryDescription: "Mini glossary of core terms.",
		glossaryHeroTitle: "Mini Glossary",
		glossaryHeroText: "A quick reference list for technical terms used throughout the guide.",
		glossaryPlaceholder: "This term definition is extended in reference-based glossary updates.",
		contactTitle: "Contact | RadioHam Guide",
		contactDescription: "Contact and feedback page.",
		contactHeroTitle: "Contact",
		contactHeroText: "Use this page for questions, corrections, and content suggestions related to the guide.",
		contactReachTitle: "Reach the Team",
		contactFormTitle: "Quick Message",
		contactFormPlaceholders: { name: "Full Name", email: "Email Address", subject: "Subject", message: "Your Message", submit: "Send Message" },
		categories: enCategories,
		sections: enSections,
	},
};

export const getGuideData = (lang: Lang) => guideData[lang];

export const getSectionsByNumbers = (lang: Lang, numbers: number[]) =>
	guideData[lang].sections.filter((section) => numbers.includes(section.number));

const legacySlugify = (value: string) =>
	value
		.toLocaleLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);

const fixMojibake = (text: string) => {
	const replacements: Array<[string, string]> = [
		["Ã¼", "ü"],
		["Ãœ", "Ü"],
		["Ã¶", "ö"],
		["Ã–", "Ö"],
		["Ã§", "ç"],
		["Ã‡", "Ç"],
		["Ä±", "ı"],
		["Ä°", "İ"],
		["ÅŸ", "ş"],
		["Åž", "Ş"],
		["ÄŸ", "ğ"],
		["Äž", "Ğ"],
		["â€™", "'"],
		["â€˜", "'"],
		["â€œ", "\""],
		["â€", "\""],
		["â€“", "-"],
		["â€”", "-"],
	];
	return replacements.reduce((current, [bad, good]) => current.split(bad).join(good), text);
};

const canonicalSlugify = (value: string) =>
	fixMojibake(value)
		.toLocaleLowerCase("tr-TR")
		.replace(/[ç]/g, "c")
		.replace(/[ğ]/g, "g")
		.replace(/[ı]/g, "i")
		.replace(/[ö]/g, "o")
		.replace(/[ş]/g, "s")
		.replace(/[ü]/g, "u")
		.replace(/[â]/g, "a")
		.replace(/[î]/g, "i")
		.replace(/[û]/g, "u")
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);

const numberedItemRegex = /^(\d+)\.(\d+)\s+(.+)$/;

export const listSubtopics = (lang: Lang): GuideSubtopic[] => {
	const sections = guideData[lang].sections;
	const subtopics: GuideSubtopic[] = [];

	for (const section of sections) {
		section.items.forEach((rawItem, index) => {
			const trimmed = rawItem.trim();
			const match = trimmed.match(numberedItemRegex);
			const itemNumber = match ? Number(match[2]) : index + 1;
			const title = match ? match[3] : trimmed;
			const code = `${section.number}.${itemNumber}`;
			const slug = `${section.number}-${itemNumber}-${canonicalSlugify(title)}`;
			const fixedTitle = fixMojibake(title);
			const legacySlug = `${section.number}-${itemNumber}-${legacySlugify(fixedTitle)}`;
			const shouldExposeLegacy = fixedTitle !== title;

			subtopics.push({
				lang,
				slug,
				legacySlugs: shouldExposeLegacy && legacySlug !== slug ? [legacySlug] : [],
				code,
				sectionId: section.id,
				sectionNumber: section.number,
				sectionTitle: section.title,
				itemNumber,
				title,
				fullTitle: `${code} ${title}`,
			});
		});
	}

	return subtopics;
};

export const getSubtopicsBySection = (lang: Lang, sectionId: string) =>
	listSubtopics(lang).filter((item) => item.sectionId === sectionId);

export const findSubtopicBySlug = (lang: Lang, slug: string) =>
	listSubtopics(lang).find((item) => item.slug === slug);

