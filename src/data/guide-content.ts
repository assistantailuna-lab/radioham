import type { Lang } from "./guide";

export type SectionDetail = {
	summary: string;
	keyPoints: string[];
	commonMistakes: string[];
	actionSteps: string[];
};

type SectionDetailMap = Record<string, SectionDetail>;

const tr: SectionDetailMap = {
	intro: {
		summary:
			"Amatör telsizcilik, ticari amaç olmadan teknik öğrenme, haberleşme disiplini ve acil durum iletişimi için yapılan lisanslı bir radyo faaliyetidir.",
		keyPoints: [
			"Faaliyet, ulusal mevzuat ve amatör bant planına uygun yürütülmelidir.",
			"Hobi yalnız konuşmadan ibaret değildir; anten, ölçüm, dijital modlar ve ağ bilgisi de içerir.",
			"Yeni başlayan için en doğru başlangıç, önce dinleme ve not alma alışkanlığıdır.",
		],
		commonMistakes: [
			"Amatör telsizi lisanssız PMR/CB cihazlarıyla aynı sınıfta sanmak.",
			"Temel prosedürü öğrenmeden hemen yayına çıkmak.",
		],
		actionSteps: ["Önce mevzuatı ve bant planını oku.", "İlk günlerden itibaren kısa dinleme günlüğü tut."],
	},
	"core-concepts": {
		summary:
			"Frekans, kanal, güç ve anten verimi gibi temel kavramlar doğru oturduğunda hem cihaz seçimi hem de sahadaki performans hızla iyileşir.",
		keyPoints: [
			"VHF ve UHF farklı yayılım davranışı gösterir; aynı ayar her ortamda aynı sonucu vermez.",
			"2 m ve 70 cm bantları başlangıçta en sık kullanılan amatör bantlardır.",
			"CTCSS/DCS erişim kontrolüdür; gizlilik sağlamaz.",
		],
		commonMistakes: ["Sadece watt artırarak kapsama sorununun çözüleceğini düşünmek.", "Squelch seviyesini gereğinden fazla yükseltmek."],
		actionSteps: ["Aynı noktada anten karşılaştırması yap.", "CSQ, CTCSS ve DCS farkını aynı kanalda test et."],
	},
	"legal-practical": {
		summary:
			"Yasal sınırlar ve pratik bant planı disiplini, güvenli ve uyumlu amatör işletimin temelidir.",
		keyPoints: [
			"Lisans sınıfı, izinli bantlar, güç ve emisyon koşullarını belirler.",
			"Bant planı kullanıcılar arası koordinasyon sağlar ve girişimi azaltır.",
			"Röle ve kanal bilgileri daima güncel, yerel ve resmi kaynaklardan doğrulanmalıdır.",
		],
		commonMistakes: ["Başka ülke frekans listesini doğrudan uygulamak.", "Lisans sınıfı sınırlarını göz ardı etmek."],
		actionSteps: ["Hafıza kanallarına kaynak ve tarih notu ekle.", "Deneme kanalları ile günlük kullanım kanallarını ayır."],
	},
	"radio-types": {
		summary:
			"El telsizi, araç telsizi ve sabit istasyon farklı ihtiyaçlara cevap verir; taşınabilirlik ve performans arasında doğal bir denge vardır.",
		keyPoints: [
			"El telsizi pratiktir ancak anten ve batarya sınırları nedeniyle kapsama sınırlı olabilir.",
			"Araç ve sabit kurulumlar, harici anten ve kararlı besleme ile daha tutarlı sonuç verir.",
			"Dijital modlar ek özellik sunar fakat profil, ağ ve konuşma grubu yönetimi ister.",
		],
		commonMistakes: ["El telsizinden baz istasyon düzeyi performans beklemek.", "Dijital moda temel yapı taşlarını öğrenmeden geçmek."],
		actionSteps: ["Kullanımı ev/araç/saha olarak ayır.", "Analog ve dijital kanallarda isimlendirmeyi standartlaştır."],
	},
	"choosing-first-radio": {
		summary:
			"İlk telsiz seçimi, kağıt üzerindeki en yüksek teknik değerden çok kullanım senaryosu ve kurulum kolaylığına göre yapılmalıdır.",
		keyPoints: [
			"Programlama desteği, sürücü uyumu ve aksesuar bulunabilirliği uzun vadede kritiktir.",
			"Bluetooth, GPS, APRS gibi özellikler ancak net bir kullanım hedefi varsa değer üretir.",
			"Batarya ve anten ekosistemi, cihaz ömrü boyunca maliyet ve konforu belirler.",
		],
		commonMistakes: ["Sadece popülerliğe veya ham güç değerine bakarak cihaz almak.", "Kablo/yazılım desteğini sonradan düşünmek."],
		actionSteps: ["Zorunlu ve opsiyonel ihtiyaç listesini yaz.", "Satın almadan önce yazılım-kablo uyumunu doğrula."],
	},
	"first-power-on": {
		summary:
			"İlk açılışta amaç, cihazı güvenli biçimde tanımak ve temel menüleri kontrollü şekilde ayarlamaktır.",
		keyPoints: [
			"Anten cihaz kapalıyken, diş zorlanmadan takılmalıdır.",
			"İlk kullanımda düşük TX gücü ve sade bir alım profili daha güvenlidir.",
			"Yapılan her menü değişikliği kaydedilirse geri dönüş kolaylaşır.",
		],
		commonMistakes: ["Anten takılı değilken yayın denemek.", "Aynı anda çok sayıda menüyü değiştirmek."],
		actionSteps: ["Başlangıç ayarlarının bir yedeğini al.", "Her adımda tek parametre değiştirip sonucu kontrol et."],
	},
	"understanding-menus": {
		summary:
			"Menü ayarları birbirini etkiler; özellikle SQL, tone, duplex ve offset uyumu iletişim başarısını doğrudan belirler.",
		keyPoints: [
			"SQL, sinyal eşiğini belirler ve boş kanaldaki gürültüyü kapatır.",
			"BCL, dolu kanalda yanlışlıkla gönderime çıkmayı engeller.",
			"STE/RP-STE kuyruk sesini azaltır; menzil artırmaz.",
		],
		commonMistakes: ["Offset doğruyken shift yönünü ters bırakmak.", "Wide/Narrow ayarını karşı istasyonla uyumsuz kullanmak."],
		actionSteps: ["Menüleri alım, gönderim ve tarama olarak gruplandır.", "Tekrarlı kullanım için kanal şablonu oluştur."],
	},
	"first-listening": {
		summary:
			"Dinleme aşaması, çevredeki RF ortamını anlamanın en hızlı yoludur ve hatalı çağrıları ciddi ölçüde azaltır.",
		keyPoints: [
			"Önce dinlemek, kanalın ritmini ve kullanım dilini anlamanı sağlar.",
			"APRS kanalında duyulan veri sesi normaldir; bu bir paket iletimidir.",
			"Airband haberleşmesi VHF havacılık bandında AM moduyla yapılır.",
		],
		commonMistakes: ["Kanalı gözlemlemeden doğrudan çağrıya geçmek.", "İç gürültüyü gerçek trafik sanmak."],
		actionSteps: ["Her gün kısa, düzenli dinleme seansı yap.", "Duyduğun röle ve ton bilgilerini log defterine yaz."],
	},
	"first-speaking": {
		summary:
			"İlk konuşma denemelerinde kısa, net ve prosedüre uygun çağrı yapmak başarı oranını belirgin artırır.",
		keyPoints: [
			"Simplex iletişimde tüm cihazlar aynı frekansta dinler ve gönderir.",
			"Röleyi duymak yeterli değildir; TX frekansı, shift ve tone da doğru olmalıdır.",
			"Kısa çağrı formatı kanalı verimli ve anlaşılır tutar.",
		],
		commonMistakes: ["Uzun ve dağınık giriş cümleleri kurmak.", "PTT basar basmaz konuşup ilk kelimeyi kaybetmek."],
		actionSteps: ["Kısa çağrı şablonuyla pratik yap.", "PTT sonrası yaklaşık 1 saniye bekleyip konuşmaya başla."],
	},
	"repeater-logic": {
		summary:
			"Röle mantığı, RX/TX ayrımı, doğru shift yönü, offset değeri ve erişim tonunun birlikte doğru ayarlanmasına dayanır.",
		keyPoints: [
			"Dinlenen frekans röle çıkışı, gönderilen frekans röle girişidir.",
			"Shift işareti ve offset değeri birlikte doğru olmalıdır.",
			"Birçok röle CTCSS veya DCS erişim tonu ister.",
		],
		commonMistakes: ["Çıkış frekansında gönderim denemek.", "Tone değerini girip tone modunu kapalı bırakmak."],
		actionSteps: ["Röle kaydını RX/TX/shift/offset/tone olarak parçala.", "Önce dinle, sonra kısa ve kontrollü test çağrısı yap."],
	},
	antennas: {
		summary:
			"Anten kalitesi ve yerleşimi, çoğu durumda yalnızca güç artırmaktan daha büyük gerçek performans kazancı sağlar.",
		keyPoints: [
			"Yükseklik, çevresel engeller ve doğru eşleşme anten performansını belirler.",
			"SMA tiplerinin fiziksel uyumu mutlaka kontrol edilmelidir.",
			"Uzun adaptör zincirleri kayıp ve temas problemi oluşturabilir.",
		],
		commonMistakes: ["Uyumsuz konnektörü zorlayarak takmak.", "Görünüşe bakıp anten performansını kesin kabul etmek."],
		actionSteps: ["Aynı koşulda anten A/B testi yap.", "Sahada karışmaması için konnektörleri etiketle."],
	},
	"programming-software": {
		summary:
			"Sağlam bir programlama akışı, doğru kablo-sürücü eşleşmesi, model uyumlu yazılım ve düzenli yedekleme ile kurulur.",
		keyPoints: [
			"CHIRP, kanal ve tone yönetiminde standart ve hızlı bir düzen sağlar.",
			"Üretici CPS yazılımı çoğu zaman model/firmware ailesine özeldir.",
			"Firmware güncellemesinden önce tam yedek almak zorunludur.",
		],
		commonMistakes: ["Modelle uyumsuz firmware yüklemek.", "Tek bir codeplug dosyasıyla çalışıp sürüm takibi yapmamak."],
		actionSteps: ["Yedekleri tarih-sürüm formatıyla sakla.", "Sahaya çıkmadan önce okuma-yazma döngüsünü test et."],
	},
	troubleshooting: {
		summary:
			"Sorun giderme, rastgele menü değiştirmek yerine sabit bir sıra ile yapılmalıdır: RF yolu, kanal ayarı, sonra yazılım/firmware.",
		keyPoints: [
			"Röleyi duyup açamama sorunu çoğunlukla tone/offset/duplex uyumsuzluğudur.",
			"Sürekli hışırtı genelde squelch seviyesi veya yerel RF gürültüsü kaynaklıdır.",
			"Birdie, cihaz içi istenmeyen karışım/sahte sinyal etkisi olabilir.",
		],
		commonMistakes: ["Aynı anda birden fazla değişkeni değiştirmek.", "RF kontrolü yapmadan firmware'i suçlamak."],
		actionSteps: ["Tek değişkenli test tablosu uygula.", "Bilinen sağlam bir profil ile yan yana karşılaştırma yap."],
	},
	"operating-etiquette": {
		summary:
			"Telsiz adabı, teknik bilgi kadar önemlidir; kısa, net ve sıralı iletişim tüm kullanıcıların verimini artırır.",
		keyPoints: [
			"Dinle-konuş disiplini, çakışmayı ve yanlış anlaşılmayı azaltır.",
			"Röleler ortak altyapıdır; gereksiz uzun konuşma kapasiteyi düşürür.",
			"Yeni başlayanlar yerel trafiği dinleyerek doğru üslubu daha hızlı öğrenir.",
		],
		commonMistakes: ["Belirsiz ve uzun konuşma yapmak.", "Aktif görüşmenin üzerine girmek."],
		actionSteps: ["Kısa çağrı kalıbı belirle.", "Gönderimden önce kanalı birkaç saniye dinle."],
	},
	"advanced-intro": {
		summary:
			"İleri seviye konular, amatör telsizi ses iletişiminden veri ve ağ katmanına taşıyarak daha güçlü bir sistem kurmanı sağlar.",
		keyPoints: [
			"DMR, 12.5 kHz taşıyıcıda iki zaman dilimli (2-slot TDMA) çalışır.",
			"APRS, konum ve kısa veriyi paket tabanlı iletir.",
			"Hotspot, digi ve iGate rollerini ayırmak ağ tasarımını sadeleştirir.",
		],
		commonMistakes: ["Temel analog pratiği oturmadan dijitale hızlı geçmek.", "Yerel kullanım kurallarıyla uyumsuz ağ profili kullanmak."],
		actionSteps: ["Önce tek bir dijital akışta ustalaş.", "Kuruluma geçmeden önce ağ topolojisini çiz."],
	},
	"build-projects": {
		summary:
			"Kendi projelerini kurmak, teorik bilgiyi kalıcı beceriye çevirir ve sahada daha öngörülebilir sonuçlar almanı sağlar.",
		keyPoints: [
			"Sunucu tabanlı log/kayıt sistemi teşhis ve geriye dönük analizde çok faydalıdır.",
			"ESP32 otomasyonu tekrarlı işleri güvenilir hale getirir.",
			"tinySA, VNA ve dummy load gibi ölçüm araçları kör ayarı azaltır.",
		],
		commonMistakes: ["Ölçüm yapmadan optimizasyon denemek.", "Taşınabilir kitte enerji planını ihmal etmek."],
		actionSteps: ["Her proje için ölçülebilir hedef belirle.", "Saha çantası için kontrol listesi oluştur."],
	},
	faq: {
		summary:
			"SSS bölümü, başlangıçta en çok karıştırılan cihaz seçimi, bant tercihi ve özellik önceliği konularını netleştirir.",
		keyPoints: [
			"Tek bir 'en iyi ilk telsiz' yoktur; doğru seçim senaryoya göre değişir.",
			"VHF/UHF tercihi arazi, şehir yapısı ve yerel altyapıya bağlıdır.",
			"Yüksek watt tek başına çözüm değildir; anten ve ayar kalitesi de gerekir.",
		],
		commonMistakes: ["Sadece marka/popülerliğe göre karar vermek.", "APRS/DMR desteğini belgesiz varsaymak."],
		actionSteps: ["Kendi kullanımına göre 2-3 model karşılaştır.", "Teknik bilgiyi resmi dökümandan doğrula."],
	},
	glossary: {
		summary:
			"Terimler sözlüğü, cihaz menülerini ve operasyon adımlarını aynı teknik dilde anlamayı kolaylaştırır.",
		keyPoints: [
			"Offset, duplex, simplex ve tone kavramları birlikte öğrenilmelidir.",
			"Aynı işlev farklı markalarda farklı menü adlarıyla görünebilir.",
			"Dijital terimlerde ağ rolü (istemci, geçit, röle) net belirtilmelidir.",
		],
		commonMistakes: ["Menü isimlerini işlevin kendisiyle karıştırmak.", "Terimi bağlamdan kopuk ezberlemek."],
		actionSteps: ["Kendi cihaz menülerini sözlük terimleriyle eşleştir.", "Sahada kullanmak için kısa terim kartı hazırla."],
	},
	"first-7-days": {
		summary:
			"Yapılandırılmış ilk 7 gün planı, rastgele ayar değişiklikleri yerine kontrollü öğrenme sağlar ve temel güveni hızlıca oluşturur.",
		keyPoints: [
			"Her gün tek bir hedefe odaklanmak öğrenmeyi hızlandırır.",
			"Günlük kısa log tutmak ilerlemeyi görünür hale getirir.",
			"Hafta sonu değerlendirmesi bir sonraki ekipman ve ayar kararlarını kolaylaştırır.",
		],
		commonMistakes: ["İlk haftada çok fazla frekans ve menüyü birlikte denemek.", "Not almadan ilerleyip tekrarlanabilirliği kaybetmek."],
		actionSteps: ["Her gün tek odakla ilerle.", "Hafta sonunda çalışan profil ve geliştirme listesi çıkar."],
	},
};

const en: SectionDetailMap = {
	intro: {
		summary:
			"Amateur radio combines technical learning, disciplined communication, and emergency support without commercial intent.",
		keyPoints: [
			"Operate only within your national licensing and band rules.",
			"It is not only voice: antenna work, digital modes, and networking are core parts of the hobby.",
			"A listening-first mindset prevents most beginner mistakes.",
		],
		commonMistakes: [
			"Treating amateur radio like license-free personal radio services.",
			"Jumping into transmission before understanding local operating style.",
		],
		actionSteps: ["Read regulation and band plan first.", "Keep a listening log from day one."],
	},
	"core-concepts": {
		summary:
			"Understanding frequency, channel, power, and antenna efficiency is the fastest way to improve practical results.",
		keyPoints: [
			"VHF and UHF propagation differ by terrain, building density, and antenna setup.",
			"2 m and 70 cm are common beginner bands, but local usage matters.",
			"CTCSS/DCS controls access, not privacy.",
		],
		commonMistakes: ["Assuming higher power always solves coverage.", "Using too high squelch and missing weak usable signals."],
		actionSteps: ["Run simple A/B antenna tests.", "Compare CSQ, CTCSS, and DCS behavior on the same channel."],
	},
	"legal-practical": {
		summary:
			"Legal limits and practical band-planning discipline are the foundation of reliable and compliant operation.",
		keyPoints: [
			"National regulations define class-based power, frequency, and emission limits.",
			"Band plans are coordination tools that reduce interference and mode conflicts.",
			"Use country-specific repeater and channel data, not random online lists.",
		],
		commonMistakes: ["Applying another country's offset/tone plan directly.", "Ignoring class-of-license constraints."],
		actionSteps: ["Tag channel memories by source and date.", "Separate legal operation memories from experiments."],
	},
	"radio-types": {
		summary:
			"Handheld, mobile, and base radios offer different trade-offs in portability, output stability, and antenna performance.",
		keyPoints: [
			"Handheld radios are flexible but physically limited by antenna and battery.",
			"Mobile/base setups usually improve reliability through better antennas and power.",
			"Digital modes add capability but require network and profile planning.",
		],
		commonMistakes: ["Expecting base-station performance from handheld-only setups.", "Switching to digital without slot/group basics."],
		actionSteps: ["Define use cases: home, car, field.", "Keep analog and digital memory naming consistent."],
	},
	"choosing-first-radio": {
		summary:
			"A balanced first radio is about workflow and ecosystem, not just headline power specs.",
		keyPoints: [
			"Programming support, battery availability, and accessory ecosystem are long-term factors.",
			"Premium features (Bluetooth/GPS/APRS) matter only when tied to real tasks.",
			"CHIRP/CPS compatibility can drastically reduce setup friction.",
		],
		commonMistakes: ["Buying by hype instead of scenario.", "Ignoring cable/software support before purchase."],
		actionSteps: ["Create must-have vs nice-to-have list.", "Verify software/driver availability before buying."],
	},
	"first-power-on": {
		summary:
			"Safe first setup means correct antenna mounting, conservative defaults, and controlled menu changes.",
		keyPoints: [
			"Attach antenna with the radio off and without thread force.",
			"Start with low TX power and simple receive profile.",
			"Track every menu change during first setup.",
		],
		commonMistakes: ["Transmitting without antenna.", "Changing too many settings at once."],
		actionSteps: ["Save baseline settings.", "Change one parameter at a time and log result."],
	},
	"understanding-menus": {
		summary:
			"Menu items interact; duplex/offset/tone mismatches are a primary cause of failed calls.",
		keyPoints: [
			"SQL controls open/close threshold for received audio.",
			"BCL helps avoid transmitting over active traffic.",
			"STE/RP-STE reduces tail noise; it does not improve range.",
		],
		commonMistakes: ["Wrong shift direction with correct offset value.", "Wide/Narrow mismatch across stations."],
		actionSteps: ["Learn menus in receive/transmit/scan groups.", "Use channel templates for consistency."],
	},
	"first-listening": {
		summary:
			"Listening practice builds RF awareness and prevents premature on-air errors.",
		keyPoints: [
			"APRS packet sound is region-dependent: 144.390 MHz is common in North America, while 144.800 MHz is common in IARU Region 1 (Europe).",
			"Different traffic types can be identified by cadence and modulation behavior.",
			"Airband voice channels use AM in the VHF aviation segment.",
		],
		commonMistakes: ["Calling without observing channel flow first.", "Confusing internal noise with valid traffic."],
		actionSteps: ["Run timed monitoring sessions.", "Record repeater output/tone observations in a log."],
	},
	"first-speaking": {
		summary:
			"Short, clear, and procedural calls are the key to successful first transmissions.",
		keyPoints: [
			"Simplex means same frequency for TX/RX.",
			"Hearing a repeater does not guarantee access; TX path must match offset/tone.",
			"Brief call structure improves channel efficiency.",
		],
		commonMistakes: ["Long openings and unclear intent.", "Speaking immediately after PTT press."],
		actionSteps: ["Practice short-call template.", "Pause briefly after PTT before speaking."],
	},
	"repeater-logic": {
		summary: "Repeater operation depends on proper RX/TX split, shift direction, offset, and access tone.",
		keyPoints: [
			"You listen on repeater output and transmit on repeater input.",
			"Shift sign and offset value must both be correct.",
			"Many repeaters require CTCSS or DCS access control.",
		],
		commonMistakes: ["Transmitting on output frequency.", "Entering tone but leaving tone mode disabled."],
		actionSteps: ["Decode listing into RX/TX/offset/tone fields.", "Test with short check-in after monitoring."],
	},
	antennas: {
		summary:
			"Antenna quality and placement usually produce larger real-world gains than simply increasing transmitter power.",
		keyPoints: [
			"Height, surrounding obstacles, and matching matter more than brand labels.",
			"Connector compatibility (SMA variants) must be physically verified.",
			"Adapter chains can add loss and failure points.",
		],
		commonMistakes: ["Forcing mismatched SMA connectors.", "Treating tactical-looking antennas as guaranteed performance upgrades."],
		actionSteps: ["Compare antennas from same location.", "Label and standardize connector paths."],
	},
	"programming-software": {
		summary:
			"Reliable programming workflow requires correct cable/driver pairing, model-specific software, and disciplined backups.",
		keyPoints: [
			"CHIRP gives structured control over tone mode, duplex, offset, and channel metadata.",
			"CPS is usually vendor/model specific and should match firmware family.",
			"Backup before firmware changes is mandatory risk control.",
		],
		commonMistakes: ["Flashing incompatible firmware.", "Working from a single unversioned codeplug file."],
		actionSteps: ["Use dated versioned backups.", "Verify read/write cycle before field use."],
	},
	troubleshooting: {
		summary:
			"Troubleshooting should follow a fixed order: RF path and antenna, then channel settings, then software/firmware.",
		keyPoints: [
			"'Can hear but cannot key up repeater' usually means tone/offset/duplex mismatch.",
			"Wideband static issues often trace to squelch or local RF noise conditions.",
			"Birdies are possible internally-generated spurious responses.",
		],
		commonMistakes: ["Changing multiple variables at once.", "Jumping to firmware assumptions without RF checks."],
		actionSteps: ["Use one-variable test matrix.", "Run side-by-side tests with a known-good radio profile."],
	},
	"operating-etiquette": {
		summary:
			"On-air etiquette is an operational skill: concise calls, no overlap, and shared-channel awareness.",
		keyPoints: [
			"Listen-before-talk is both technical and social discipline.",
			"Repeaters are shared infrastructure; brief traffic keeps them usable.",
			"Beginners learn faster by observing local rhythm and style.",
		],
		commonMistakes: ["Unstructured long transmissions.", "Interrupting active exchanges."],
		actionSteps: ["Use concise call format.", "Always monitor channel for a few seconds before TX."],
	},
	"advanced-intro": {
		summary:
			"Advanced topics extend radio into data and network layers: APRS, DMR, hotspots, and gateway systems.",
		keyPoints: [
			"DMR uses a 12.5 kHz carrier with 2-slot TDMA architecture.",
			"APRS is packet-based tactical position/data exchange.",
			"Hotspot/iGate/digi roles should be clearly separated in design.",
		],
		commonMistakes: ["Adding complexity before mastering core analog operation.", "Using network configs without local policy alignment."],
		actionSteps: ["Start with one digital workflow.", "Draw topology before deployment."],
	},
	"build-projects": {
		summary:
			"Project work turns theory into repeatable skill: logging, automation, filtering, and measurement-driven optimization.",
		keyPoints: [
			"Server-based logging improves diagnosis and repeatability.",
			"ESP32 automation helps with predictable operational tasks.",
			"Measurement tools (tinySA, VNA, dummy load) prevent blind tuning.",
		],
		commonMistakes: ["Optimizing without measurements.", "Ignoring power planning in portable kits."],
		actionSteps: ["Define measurable success criteria.", "Maintain a documented field kit checklist."],
	},
	faq: {
		summary: "FAQ clarifies common beginner confusion in device choice, bands, power, and feature priorities.",
		keyPoints: [
			"No universal 'best first radio' exists outside scenario context.",
			"VHF/UHF choice depends on terrain and local infrastructure.",
			"Power alone cannot replace antenna and configuration quality.",
		],
		commonMistakes: ["Buying based on popularity metrics only.", "Assuming APRS/DMR support without documentation check."],
		actionSteps: ["Collect scenario-specific comparisons.", "Validate specs from official vendor documents."],
	},
	glossary: {
		summary:
			"Glossary standardizes technical language so settings and procedures are interpreted consistently across devices.",
		keyPoints: [
			"Offset/duplex/simplex/tone should be learned as a connected set.",
			"Menu naming differs by vendor while function may be identical.",
			"Network-mode terms need role context (client, gateway, relay).",
		],
		commonMistakes: ["Confusing vendor labels for different functions.", "Memorizing terms without operational examples."],
		actionSteps: ["Map your radio menus to glossary terms.", "Prepare a quick-reference term sheet."],
	},
	"first-7-days": {
		summary:
			"A structured first week builds confidence and prevents random configuration drift.",
		keyPoints: [
			"One focused objective per day outperforms scattered trial-and-error.",
			"Daily logging makes troubleshooting and progression visible.",
			"Week-end review informs next equipment and learning decisions.",
		],
		commonMistakes: ["Trying too many frequencies/settings too early.", "Skipping notes and losing repeatability."],
		actionSteps: ["Follow one-day/one-goal routine.", "Finish week with stable profile and action list."],
	},
};

export const getSectionDetails = (lang: Lang): SectionDetailMap => (lang === "tr" ? tr : en);


