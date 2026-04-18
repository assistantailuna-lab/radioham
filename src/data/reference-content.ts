import type { Lang } from "./guide";

type TextMap = Record<string, string>;

export type FaqItem = {
	id: string;
	question: string;
	answer: string;
};

export type FaqSource = {
	label: string;
	url: string;
};

const trFaqItems: FaqItem[] = [
	{ id: "faq-01", question: "Lisans olmadan amatör telsiz kullanabilir miyim?", answer: "Amatör bantlarda düzenli yayın için lisans gerekir. Dinleme daha esnek olabilir ama gönderim için yerel mevzuata uymalısın." },
	{ id: "faq-02", question: "PMR/CB ile amatör telsiz aynı şey mi?", answer: "Hayır. PMR/CB ayrı servislerdir; amatör telsiz lisanslı ve farklı kurallara bağlı bir servistir." },
	{ id: "faq-03", question: "Çağrı işareti vermek zorunlu mu?", answer: "Evet, amatör işletimde çağrı işareti kimliklendirme için temel kuraldır. Format ve sıklık ülkeye göre değişir." },
	{ id: "faq-04", question: "Başlangıçta hangi frekansları dinlemeliyim?", answer: "Önce yerel röle çıkışları ve simplex çağrı frekanslarını dinle. Rastgele liste yerine güncel yerel kaynak kullan." },
	{ id: "faq-05", question: "Röleyi duyuyorum ama neden açamıyorum?", answer: "Genellikle shift/offset/tone/TX frekansı hatasıdır. Röleyi duyman tek başına yeterli değildir." },
	{ id: "faq-06", question: "Tone doğru ama yine çalışmıyor, neden?", answer: "Tone değeri doğru olsa da tone modu kapalı olabilir veya CTCSS-DCS türü yanlış seçilmiş olabilir." },
	{ id: "faq-07", question: "Simplex ve röle farkı nedir?", answer: "Simplex aynı frekansta doğrudan iletişimdir. Rölede RX/TX farklıdır ve kapsama genelde artar." },
	{ id: "faq-08", question: "Shift, offset ve duplex farkı nedir?", answer: "Duplex RX/TX farklı çalışma tipidir. Shift yönü (+/-), offset fark miktarıdır." },
	{ id: "faq-09", question: "VHF mi UHF mi seçmeliyim?", answer: "Açık alanda VHF, şehir içinde UHF çoğu zaman daha iyi sonuç verir. Yerel altyapı ve kullanım yoğunluğu belirleyicidir." },
	{ id: "faq-10", question: "Her frekansta hışırtı neden var?", answer: "SQL düşük olabilir veya çevrede RF gürültüsü yüksek olabilir. Önce squelch ve ortamı test et." },
	{ id: "faq-11", question: "SQL kaç olmalı?", answer: "Tek doğru sayı yoktur. Gürültüyü kapatıp zayıf sinyali kaçırmayacak en düşük seviyeyi seç." },
	{ id: "faq-12", question: "Wide mi Narrow mı?", answer: "Kanal planına ve karşı istasyona uymalıdır. Yanlış seçimde ses bozuk veya kısık olur." },
	{ id: "faq-13", question: "TX gücü sürekli High olsun mu?", answer: "Genelde hayır. Önce düşük/orta güçle dene, gerekirse artır; pil ve ısıyı kontrol edersin." },
	{ id: "faq-14", question: "Dual Watch (TDR) açık kalmalı mı?", answer: "İki kanal takibinde faydalı, kritik tek kanal dinlemede dikkat dağıtıcı olabilir." },
	{ id: "faq-15", question: "VOX neden sorun çıkarır?", answer: "Ortam sesi yanlış tetikleyip istemsiz yayın açabilir. Başlangıçta kapalı kullanmak daha güvenlidir." },
	{ id: "faq-16", question: "BCL ne işe yarar?", answer: "Kanal meşgulse gönderimi engeller ve konuşan istasyonun üstüne çıkma riskini azaltır." },
	{ id: "faq-17", question: "STE / RP-STE menzili artırır mı?", answer: "Hayır. Bu ayarlar kuyruk sesini azaltır; menzile etkisi yoktur." },
	{ id: "faq-18", question: "Tarama neden konuşmaları kaçırıyor?", answer: "Cihaz kanallar arasında dolaştığı için kısa çağrıları atlayabilir. Kritik kanalda sabit dinleme daha güvenli olur." },
	{ id: "faq-19", question: "Anten takmadan kısa test yayını olur mu?", answer: "Önerilmez. Antensiz gönderim RF çıkış katına zarar verebilir; anten veya dummy load kullan." },
	{ id: "faq-20", question: "Stok anten kesin yetersiz mi?", answer: "Her zaman değil. Yakın mesafede yeterli olabilir, sorun olursa önce konum ve ayar sonra anten yükselt." },
	{ id: "faq-21", question: "Daha uzun anten her zaman iyi mi?", answer: "Her zaman değil. Doğru test, aynı noktada A/B karşılaştırmasıdır." },
	{ id: "faq-22", question: "SMA male/female nasıl ayırt edilir?", answer: "Merkez pin ve diş yapısını birlikte kontrol et. Zorlayarak takma." },
	{ id: "faq-23", question: "Adaptör zinciri neden kötü?", answer: "Her adaptör ek kayıp ve arıza noktasıdır. RF hattını kısa ve doğrudan tut." },
	{ id: "faq-24", question: "Araç içi parazit nasıl azaltılır?", answer: "Parazit kaynağını ayır, besleme/kablo güzergahını düzelt ve gerekiyorsa filtre kullan." },
	{ id: "faq-25", question: "Batarya ömrünü nasıl uzatırım?", answer: "Gereksiz yüksek güçten kaçın, ısıdan koru, uzun depolamada orta doluluk tercih et." },
	{ id: "faq-26", question: "İlk şarj mutlaka 8-12 saat mi olmalı?", answer: "Modern Li-ion pillerde bu eski alışkanlık çoğu zaman gerekli değildir. Üretici tavsiyesi esas alınmalıdır." },
	{ id: "faq-27", question: "Programlama kablosu COM portta görünmüyor, ne yapmalıyım?", answer: "Sürücü veya USB-serial çip uyumsuzluğu sık görülür. Farklı port/kablo dene ve doğru sürücüyü kur." },
	{ id: "faq-28", question: "CHIRP 'Radio did not respond' hatası neden olur?", answer: "Genellikle yanlış model seçimi, kablo/sürücü sorunu veya fiziksel temas probleminden olur." },
	{ id: "faq-29", question: "CHIRP mi CPS mi daha doğru?", answer: "CPS model özel ayarlarda güçlüdür, CHIRP çoklu cihaz yönetiminde pratiktir. Önce cihazdan okuma alıp yedekle." },
	{ id: "faq-30", question: "Firmware güncellemesi her zaman gerekli mi?", answer: "Hayır. Cihaz stabilse sadece ihtiyaç veya kritik düzeltme varsa güncellemek daha doğrudur." },
	{ id: "faq-31", question: "Yanlış firmware yüklersem ne olur?", answer: "Cihaz açılmama veya işlev kaybı yaşayabilir. Model-revizyon uyumu kesin doğrulanmalıdır." },
	{ id: "faq-32", question: "VFO mu hafıza kanalı mı kullanmalıyım?", answer: "VFO test için, hafıza günlük kullanım için daha uygundur. İkisini birlikte kullanmak en verimli yaklaşımdır." },
	{ id: "faq-33", question: "Kanal isimlerini nasıl standardize etmeliyim?", answer: "Kısa ve tutarlı format kullan: frekans + amaç + ton. Bu düzen sahada hata oranını düşürür." },
	{ id: "faq-34", question: "Cihazımda APRS desteğini nasıl doğrularım?", answer: "Sadece GPS varlığı yetmez. Teknik dökümanda APRS TX/RX, beacon ve APRS menü/CPS alanlarını ara." },
	{ id: "faq-35", question: "APRS frekansı neden bölgeye göre değişir?", answer: "Band planları bölgeseldir. Kuzey Amerika'da 144.390, Avrupa dahil Region 1'de 144.800 yaygındır." },
	{ id: "faq-36", question: "DMR için sadece cihaz almak yeterli mi?", answer: "Genelde hayır. Talkgroup, slot, color code, contact ve çoğu ağda Radio ID gerekir." },
	{ id: "faq-37", question: "DMR cihazım var ama neden ses yok?", answer: "Yanlış talkgroup/slot/color code veya kanal tipi (analog-dijital) hatası en sık sebeptir." },
	{ id: "faq-38", question: "Hotspot zorunlu mu?", answer: "Hayır. Yerel dijital röle varsa hotspot olmadan da çalışabilirsin." },
	{ id: "faq-39", question: "Aynı frekans neden her yerde kullanılamıyor?", answer: "Spektrum ulusal ve yerel planlarla koordine edilir. Bir yerde uygun olan kanal başka yerde çatışabilir." },
	{ id: "faq-40", question: "Düşük güçte röleye çıkmak mümkün mü?", answer: "Evet, çoğu zaman mümkündür. Anten ve konum doğruysa düşük güç yeterli olabilir." },
	{ id: "faq-41", question: "Konuşmanın başı neden kesiliyor?", answer: "PTT basar basmaz konuşmak ilk heceleri keser. Çok kısa bekleme ile başlamak gerekir." },
	{ id: "faq-42", question: "PTT bırakınca kuyruk sesi normal mi?", answer: "Çoğu analog rölede normaldir. STE/RP-STE bu sesi azaltabilir." },
	{ id: "faq-43", question: "Birdie nedir, cihaz bozuk mu demek?", answer: "Birdie cihaz içi sahte sinyal etkisidir. Her zaman arıza değildir ama belirli frekansları etkileyebilir." },
	{ id: "faq-44", question: "Airband neden AM kullanır?", answer: "Havacılık ses kanalları operasyonel ve tarihsel olarak AM standardına dayanır." },
	{ id: "faq-45", question: "Acil durumda tüm kurallar kalkar mı?", answer: "Can güvenliği önceliklidir ama bu sınırsız serbestlik anlamına gelmez. Yerel acil durum kuralları esas alınır." },
	{ id: "faq-46", question: "İnternetten bulduğum frekans listesini direkt kullanabilir miyim?", answer: "Önerilmez. Liste eski veya bölge dışı olabilir; yerel güncel kaynakla doğrula." },
		{ id: "faq-47", question: "İlk haftada neye odaklanmalıyım?", answer: "Dinleme, temel menüler, bir simplex ve bir röle profili. Günlük kısa not tutmak öğrenmeyi hızlandırır." },
	{ id: "faq-48", question: "Log tutmak gerçekten gerekli mi?", answer: "Evet. Hangi ayarın hangi sonuç verdiğini görürsün ve sorun giderme hızlanır." },
	{ id: "faq-49", question: "Fabrika ayarına ne zaman dönmeliyim?", answer: "Menüler çok karıştıysa ve kök nedeni bulamıyorsan reset iyi bir çıkıştır. Önce yedek al." },
	{ id: "faq-50", question: "İlk telsiz alırken en kritik 5 kontrol nedir?", answer: "Yasal uyum, programlama kolaylığı, batarya/aksesuar ekosistemi, anten uyumu ve yerel kullanım senaryosu." },
	{ id: "faq-51", question: "Amator telsiz acil durum iletisiminin zorunlu bir gorevi midir?", answer: "Genel kural olarak hayir; amator telsizciligin temel amaci teknik ogrenme ve haberlesme pratigi. Kendi yorumum: Acil durumda destek vermek degerlidir ama bunu bir uzmanlik alani gibi dusunup resmi kurum koordinasyonu olmadan hareket etmemek gerekir." },
	{ id: "faq-52", question: "Acil durum iletisimi icin hangi kurumlarla koordinasyon kurulmali?", answer: "AFAD basta olmak uzere yerel arama-kurtarma ekipleri, Kizilay ve belediye afet birimleriyle koordinasyon en dogru yaklasimdir. Pratik yorum: Kurumsal yapiya bagli calismak hem frekans karmasasini azaltir hem de verilen bilginin sahada ise yaramasini saglar." },
	{ id: "faq-53", question: "Acil durumda amatorden beklenen en kritik operasyonel davranis nedir?", answer: "Kisa, net ve dogrulanabilir bilgi vermek en kritik davranistir. Kendi yorumum: Panik aninda uzun konusmak yerine konum, olay tipi, kisi sayisi ve aciliyet sirasiyla raporlamak her zaman daha etkilidir." },
	{ id: "faq-54", question: "Acil durum frekansinda trafik disiplini nasil korunur?", answer: "Kanali gereksiz mesgul etmeden, once dinleyip sonra kisa gecislerle iletisim kurmak gerekir. Ek yorum: Gereksiz tekrarlar yerine bir net mesaj ve geri okuma duzeni ekiplerin hata payini ciddi azaltir." },
	{ id: "faq-55", question: "Acil durumlarda role mi simplex mi tercih edilmeli?", answer: "Saha kosuluna gore ikisi de kullanilabilir; role kapsama saglarken simplex yerel ve dogrudan koordine icin hizlidir. Kendi yorumum: En iyi sonuc icin planli birincil ve ikincil frekans seti onceden hazir olmak gerekir." },
	{ id: "faq-56", question: "Acil durumlara hazirlik icin ne tur pratik yapmaliyim?", answer: "Duzenli tatbikat, yedek enerji plani, hazir kanal profilleri ve temel mesaj formati pratigi yapilmalidir. Benim onerim: Ayda bir kisa saha denemesi yapmak, gercek bir afette ekiplerin birbirini anlama hizini ciddi sekilde artirir." },
];

const enFaqItems: FaqItem[] = [
	{ id: "faq-01", question: "Can I transmit on amateur bands without a license?", answer: "Regular transmitting on amateur bands requires a license. Listening may be flexible, transmitting is regulated." },
	{ id: "faq-02", question: "Are PMR/CB and amateur radio the same?", answer: "No. They are different services with different rules and limits." },
	{ id: "faq-03", question: "Is callsign identification mandatory?", answer: "Yes, callsign identification is a core operating requirement in amateur service." },
	{ id: "faq-04", question: "What frequencies should a beginner monitor first?", answer: "Start with local repeater outputs and known simplex channels from current local sources." },
	{ id: "faq-05", question: "Why can I hear a repeater but cannot access it?", answer: "Most often wrong shift, offset, tone, or TX frequency." },
	{ id: "faq-06", question: "Tone value is correct but it still fails. Why?", answer: "Tone mode/type can still be wrong even if value looks correct." },
	{ id: "faq-07", question: "Simplex vs repeater: what is the difference?", answer: "Simplex is direct same-frequency communication. Repeater uses split TX/RX and extends coverage." },
	{ id: "faq-08", question: "What is shift/offset/duplex difference?", answer: "Duplex is split RX/TX operation. Shift is direction, offset is amount." },
	{ id: "faq-09", question: "Should I choose VHF or UHF?", answer: "VHF often favors open terrain, UHF often favors dense urban environments." },
	{ id: "faq-10", question: "Why do I hear static almost everywhere?", answer: "Low squelch or noisy RF environment are common causes." },
	{ id: "faq-11", question: "What squelch level should I use?", answer: "No universal number. Use the lowest setting that closes noise but keeps weak usable signals." },
	{ id: "faq-12", question: "Wide or Narrow?", answer: "Match channel plan and counterpart settings; mismatch causes poor audio." },
	{ id: "faq-13", question: "Should TX power stay High?", answer: "Usually no. Start low/medium and raise only if needed." },
	{ id: "faq-14", question: "Should Dual Watch (TDR) remain on?", answer: "Useful for two-channel monitoring, but can hurt focus for critical single-channel listening." },
	{ id: "faq-15", question: "Why can VOX be problematic?", answer: "Ambient noise can trigger unwanted transmit. Keep off initially." },
	{ id: "faq-16", question: "What does BCL do?", answer: "It blocks transmit when channel is busy." },
	{ id: "faq-17", question: "Does STE / RP-STE improve range?", answer: "No. It only reduces tail noise." },
	{ id: "faq-18", question: "Why does scan miss traffic?", answer: "Scanning hops channels and can miss short calls." },
	{ id: "faq-19", question: "Can I transmit briefly without antenna?", answer: "Not recommended. Use antenna or dummy load." },
	{ id: "faq-20", question: "Is the stock antenna always bad?", answer: "Not always. It may be sufficient for short range and strong local coverage." },
	{ id: "faq-21", question: "Is a longer antenna always better?", answer: "Not always. Compare antennas at the same location." },
	{ id: "faq-22", question: "How do I identify SMA male/female correctly?", answer: "Check center pin and thread pattern together; never force connectors." },
	{ id: "faq-23", question: "Why avoid long adapter chains?", answer: "Each adapter adds loss and another failure point." },
	{ id: "faq-24", question: "How do I reduce in-vehicle interference?", answer: "Isolate source, improve wiring and routing, and add filtering if needed." },
	{ id: "faq-25", question: "How do I improve battery life?", answer: "Avoid unnecessary high power, reduce heat exposure, and store at moderate charge." },
	{ id: "faq-26", question: "Do I need a mandatory 8-12 hour first charge?", answer: "Usually no for modern Li-ion packs. Follow the manufacturer guidance." },
	{ id: "faq-27", question: "Programming cable does not show as COM port. What should I do?", answer: "Driver mismatch and poor USB-serial chip quality are common causes. Recheck driver and port." },
	{ id: "faq-28", question: "Why does CHIRP show 'Radio did not respond'?", answer: "Common causes are wrong model selection, cable/driver issues, or poor physical connection." },
	{ id: "faq-29", question: "CHIRP or CPS: which should I use?", answer: "CPS is strong for model-specific settings, CHIRP is practical for multi-radio workflows. Always read and back up first." },
	{ id: "faq-30", question: "Is firmware update always required?", answer: "No. Update when you need a fix or feature, not just because a new version exists." },
	{ id: "faq-31", question: "What if I flash wrong firmware?", answer: "You can lose functions or fail to boot. Verify exact model and revision compatibility first." },
	{ id: "faq-32", question: "VFO or memory channels for daily operation?", answer: "Use VFO for testing, memory channels for repeatable daily use." },
	{ id: "faq-33", question: "How should I standardize channel names?", answer: "Use concise consistent format: frequency + purpose + tone hint." },
	{ id: "faq-34", question: "How do I verify APRS support on my radio?", answer: "GPS alone is not enough. Check official specs for APRS TX/RX, beacon, and APRS menu/CPS support." },
	{ id: "faq-35", question: "Why does APRS frequency change by region?", answer: "Band plans are regional. 144.390 is common in North America, 144.800 in IARU Region 1." },
	{ id: "faq-36", question: "Is buying a DMR radio enough to start DMR?", answer: "Usually no. You need correct talkgroup, slot, color code, contacts, and often Radio ID." },
	{ id: "faq-37", question: "Why is my DMR radio silent?", answer: "Wrong talkgroup/slot/color code or analog-vs-digital channel mismatch are common reasons." },
	{ id: "faq-38", question: "Is a hotspot mandatory?", answer: "No. If local digital repeaters exist, hotspot is optional." },
	{ id: "faq-39", question: "Why can’t one frequency be used everywhere?", answer: "Spectrum is regionally and nationally coordinated. Valid channels differ by location." },
	{ id: "faq-40", question: "Can I access repeaters with low power?", answer: "Often yes, with good antenna placement and correct configuration." },
	{ id: "faq-41", question: "Why is the beginning of my audio clipped?", answer: "Speaking immediately after PTT can clip first syllables. Pause briefly before talking." },
	{ id: "faq-42", question: "Is tail noise after PTT release normal?", answer: "Often normal on analog repeater paths. STE/RP-STE may reduce it." },
	{ id: "faq-43", question: "What is a birdie? Is my radio broken?", answer: "A birdie is an internal spurious response. It does not always mean hardware failure." },
	{ id: "faq-44", question: "Why does airband use AM?", answer: "Aviation voice channels are standardized on AM for operational/historical reasons." },
	{ id: "faq-45", question: "Do all normal rules disappear in emergencies?", answer: "Life safety gets priority, but operation is still governed by national emergency provisions." },
	{ id: "faq-46", question: "Can I use random online frequency lists directly?", answer: "Risky. Lists may be outdated or wrong for your region; always verify locally." },
	{ id: "faq-47", question: "What should I focus on in the first week?", answer: "Listening, core menus, one simplex profile, one repeater profile, and daily notes." },
	{ id: "faq-48", question: "Is an operating log really useful?", answer: "Yes. Logs make troubleshooting and repeatable setup much easier." },
	{ id: "faq-49", question: "When should I reset to factory defaults?", answer: "When settings are heavily mixed and root cause is unclear. Back up first." },
	{ id: "faq-50", question: "Top 5 checks before buying a first radio?", answer: "Legal band compliance, programming workflow, battery/accessory ecosystem, antenna compatibility, and local use fit." },
];

const trGlossary: TextMap = {
	APRS: "Automatic Packet Reporting System. Konum, kısa mesaj ve telemetriyi paket veri olarak taşır.",
	BCL: "Busy Channel Lockout. Kanal meşgulse gönderimi engeller.",
	Beacon: "Belirli aralıklarla otomatik kimlik/konum verisi yayan sinyal.",
	CHIRP: "Birçok cihazı programlamak için kullanılan açık kaynak yazılım.",
	CTCSS: "Sürekli alt-ton kodlama sistemi. Erişim kontrolü sağlar, gizlilik sağlamaz.",
	DCS: "Dijital kodlu susturma sistemi.",
	DMR: "12.5 kHz kanalda 2-slot TDMA kullanan dijital standart.",
	Duplex: "RX ve TX frekanslarının farklı olduğu çalışma.",
	FM: "VHF/UHF ses iletişiminde yaygın analog modülasyon.",
	GPS: "Konum verisi üreten uydu tabanlı sistem.",
	Hotspot: "Dijital telsizi internet tabanlı ağa bağlayan kişisel geçit.",
	Offset: "Röle giriş/çıkış frekans farkı.",
	Repeater: "Bir frekansta alıp diğerinde tekrar yayın yapan röle.",
	Simplex: "Aynı frekansta doğrudan iletişim.",
	SQL: "Squelch eşiği, gürültü kapısını yönetir.",
	STE: "Kuyruk sesini azaltma ayarı.",
	TDR: "Çift kanal izleme özelliği.",
	UHF: "Genel olarak 300-3000 MHz aralığı.",
	VHF: "Genel olarak 30-300 MHz aralığı.",
	VOX: "Ses ile PTT'siz otomatik gönderim.",
};

const enGlossary: TextMap = {
	APRS: "Automatic Packet Reporting System for position/status/telemetry packet exchange.",
	BCL: "Busy Channel Lockout, prevents transmit on an occupied channel.",
	Beacon: "Automatic periodic transmission for ID, position, or telemetry.",
	CHIRP: "Open-source software used to program many radios.",
	CTCSS: "Continuous Tone-Coded Squelch System for access filtering, not privacy.",
	DCS: "Digital-Coded Squelch for access filtering.",
	DMR: "Digital Mobile Radio standard using 12.5 kHz channels and 2-slot TDMA.",
	Duplex: "Operation with different receive and transmit frequencies.",
	FM: "Common analog voice modulation on VHF/UHF amateur channels.",
	GPS: "Satellite-based positioning system.",
	Hotspot: "Personal gateway linking digital radio to internet voice networks.",
	Offset: "Frequency difference between repeater output and input.",
	Repeater: "Station that receives on one frequency and retransmits on another.",
	Simplex: "Direct same-frequency radio-to-radio communication.",
	SQL: "Squelch threshold control.",
	STE: "Squelch Tail Elimination setting.",
	TDR: "Dual Watch feature.",
	UHF: "Ultra High Frequency, generally 300-3000 MHz.",
	VHF: "Very High Frequency, generally 30-300 MHz.",
	VOX: "Voice Operated Transmit.",
};

const faqSourcesTr: FaqSource[] = [
	{ label: "FCC 47 CFR Part 97", url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97" },
	{ label: "Ofcom Amateur Radio Licence", url: "https://www.ofcom.org.uk/spectrum/radio-equipment/amateur-radio-licence/" },
	{ label: "CEPT Recommendation T/R 61-01", url: "https://docdb.cept.org/download/3321" },
	{ label: "IARU Region 1 VHF Bandplan", url: "https://www.iaru-r1.org/wiki/VHF" },
	{ label: "ETSI TS 102 361-2 (DMR)", url: "https://www.etsi.org/deliver/etsi_ts/102300_102399/10236102/02.05.01_60/ts_10236102v020501p.pdf" },
	{ label: "APRS Voice Alert Notes", url: "https://www.aprs.org/VoiceAlert3.html" },
	{ label: "RepeaterBook Repeater Wiki", url: "https://www.repeaterbook.com/wiki/doku.php?id=repeater" },
		{ label: "CHIRP issue sample: cable/COM failures", url: "https://chirpmyradio.com/issues/8937" },
	{ label: "Amatortelsizcilik.com.tr SSS", url: "https://amatortelsizcilik.com.tr/sik-sorulan-sorular#acil-durum-iletisimi" },
];

const faqSourcesEn: FaqSource[] = [...faqSourcesTr];

export const getFaqItems = (lang: Lang): FaqItem[] => (lang === "tr" ? trFaqItems : enFaqItems);

export const getFaqSources = (lang: Lang): FaqSource[] => (lang === "tr" ? faqSourcesTr : faqSourcesEn);

export const getFaqAnswers = (lang: Lang): TextMap => {
	const map: TextMap = {};
	for (const item of getFaqItems(lang)) {
		map[item.question] = item.answer;
	}
	return map;
};

export const getGlossaryDefinitions = (lang: Lang): TextMap => (lang === "tr" ? trGlossary : enGlossary);




