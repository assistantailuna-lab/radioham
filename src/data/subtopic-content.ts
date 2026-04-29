import type { Lang, GuideSubtopic } from "./guide";

type RefItem = { label: string; url: string };

export type SubtopicArticle = {
	title: string;
	plainExplanation: string;
	deepDive: string[];
	whyItMatters: string[];
	stepByStep: string[];
	realLifeExample: string;
	commonMistakes: string[];
	quickCheck: string[];
	sources: RefItem[];
};

const refsTr = {
	btk: {
		label: "BTK Teknik Ölçütler (Madde 21 / Tablo-25)",
		url: "https://www.btk.gov.tr/uploads/regulations/frekans-tahsisinden-muaf-telsiz-cihaz-sistemleri-olcutler.pdf",
	},
	kegm: {
		label: "KEGM Amatör Telsizcilik SSS",
		url: "https://www.kiyiemniyeti.gov.tr/sss",
	},
	iaruHandbook: {
		label: "IARU Region 1 VHF Handbook",
		url: "https://www.iaru-r1.org/wp-content/uploads/2024/11/VHF_Handbook_V10_02.pdf",
	},
	iaruSpectrum: {
		label: "IARU Region 1 Spectrum",
		url: "https://www.iaru-r1.org/spectrum/",
	},
	etsiDmr: {
		label: "ETSI Digital Mobile Radio",
		url: "https://www.etsi.org/technologies/digital-mobile-radio",
	},
	aprs: {
		label: "APRS Protocol Specification 1.0.1",
		url: "https://www.aprs.org/doc/APRS101.PDF",
	},
};

const refsEn = {
	fcc97: {
		label: "FCC Part 97 - Amateur Radio Service Rules",
		url: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-D/part-97",
	},
	ofcom: {
		label: "Ofcom - Amateur Radio guidance and licensing",
		url: "https://www.ofcom.org.uk/spectrum/radio-equipment/amateur-radio/",
	},
	cept: {
		label: "CEPT T/R 61-01 - CEPT Radio Amateur Licence",
		url: "https://docdb.cept.org/document/845",
	},
	iaruHandbook: {
		label: "IARU Region 1 VHF Handbook",
		url: "https://www.iaru-r1.org/wp-content/uploads/2024/11/VHF_Handbook_V10_02.pdf",
	},
	iaruSpectrum: {
		label: "IARU Region 1 Spectrum",
		url: "https://www.iaru-r1.org/spectrum/",
	},
	arrlBandPlan: {
		label: "ARRL Band Plan Overview",
		url: "https://www.arrl.org/band-plan",
	},
	rsgbBandPlans: {
		label: "RSGB Band Plans",
		url: "https://rsgb.org/main/operating/band-plans/",
	},
	etsiDmr: {
		label: "ETSI Digital Mobile Radio",
		url: "https://www.etsi.org/technologies/digital-mobile-radio",
	},
	aprs: {
		label: "APRS Protocol Specification 1.0.1",
		url: "https://www.aprs.org/doc/APRS101.PDF",
	},
};

const trSectionSources: Record<string, RefItem[]> = {
	intro: [refsTr.btk, refsTr.kegm],
	"core-concepts": [refsTr.iaruHandbook],
	"legal-practical": [refsTr.btk, refsTr.kegm, refsTr.iaruSpectrum],
	"radio-types": [refsTr.etsiDmr],
	"choosing-first-radio": [refsTr.kegm],
	"first-power-on": [refsTr.kegm],
	"understanding-menus": [refsTr.iaruHandbook],
	"first-listening": [refsTr.iaruHandbook, refsTr.aprs],
	"first-speaking": [refsTr.iaruHandbook],
	"repeater-logic": [refsTr.iaruHandbook],
	antennas: [refsTr.iaruHandbook],
	"programming-software": [refsTr.etsiDmr],
	troubleshooting: [refsTr.iaruHandbook],
	"operating-etiquette": [refsTr.iaruSpectrum],
	"advanced-intro": [refsTr.aprs, refsTr.etsiDmr],
	"build-projects": [refsTr.aprs],
	faq: [refsTr.kegm, refsTr.btk],
	glossary: [refsTr.iaruSpectrum],
	"first-7-days": [refsTr.kegm],
};

const enSectionSources: Record<string, RefItem[]> = {
	intro: [refsEn.fcc97, refsEn.ofcom, refsEn.cept],
	"core-concepts": [refsEn.arrlBandPlan, refsEn.rsgbBandPlans, refsEn.iaruSpectrum],
	"legal-practical": [refsEn.fcc97, refsEn.ofcom, refsEn.cept, refsEn.arrlBandPlan, refsEn.rsgbBandPlans],
	"radio-types": [refsEn.etsiDmr],
	"choosing-first-radio": [refsEn.arrlBandPlan, refsEn.rsgbBandPlans],
	"first-power-on": [refsEn.fcc97, refsEn.ofcom],
	"understanding-menus": [refsEn.iaruHandbook],
	"first-listening": [refsEn.iaruHandbook, refsEn.aprs, refsEn.arrlBandPlan],
	"first-speaking": [refsEn.iaruHandbook, refsEn.arrlBandPlan],
	"repeater-logic": [refsEn.iaruHandbook, refsEn.arrlBandPlan, refsEn.rsgbBandPlans],
	antennas: [refsEn.iaruHandbook],
	"programming-software": [refsEn.etsiDmr],
	troubleshooting: [refsEn.arrlBandPlan, refsEn.iaruHandbook],
	"operating-etiquette": [refsEn.arrlBandPlan, refsEn.rsgbBandPlans],
	"advanced-intro": [refsEn.aprs, refsEn.etsiDmr],
	"build-projects": [refsEn.aprs],
	faq: [refsEn.fcc97, refsEn.ofcom, refsEn.cept],
	glossary: [refsEn.iaruSpectrum, refsEn.arrlBandPlan],
	"first-7-days": [refsEn.fcc97, refsEn.arrlBandPlan],
};

const enAnswersBySection: Record<number, string[]> = {
	3: [
		"Amateur radio is licensed because radio spectrum is limited public infrastructure, not a free-for-all resource. In the United States, FCC Part 97 defines the Amateur Radio Service and requires licensed operation on amateur allocations. In Europe, licensing is managed by each national regulator (for example Ofcom in the UK), and CEPT frameworks support cross-border recognition under defined conditions. The practical point is simple: a license proves minimum operating competence and keeps shared spectrum usable for everyone.",
		"Not all frequencies are free because many bands are assigned to safety-critical services such as aviation, maritime, emergency systems, satellite links, and government communications. Your radio being able to tune a frequency does not mean you are legally allowed to transmit there. In both the US and Europe, unauthorized transmission on protected services can lead to penalties and harmful interference with real operations. For beginners, the safe rule is: transmit only on frequencies explicitly allowed by your license and local band plan.",
		"Amateur bands are allocated frequency ranges where licensed amateurs may operate under specific limits. A few common examples: 20 m is 14.000-14.350 MHz in both US and Region 1 practice, while 2 m differs by region (US: 144-148 MHz, many European countries: 144-146 MHz). On 70 cm, US allocations commonly use 420-450 MHz, while many European plans center on 430-440 MHz. Exact allowed segments, power, and modes can change by country and license class, so always validate against your national regulator and current band plan before programming channels.",
		"A band plan is an operating map inside an allocated band: it separates calling channels, repeater segments, digital/data use, weak-signal activity, and other traffic types so operators do not collide. In the US, operators commonly use ARRL guidance, while in Europe operators follow IARU Region 1 and national society guidance (for example RSGB in the UK). Even where a plan is not always a criminal-law text by itself, it is operationally essential because it prevents interference and keeps shared use predictable.",
		"Simplex means direct radio-to-radio on one frequency, while repeater operation uses an input/output pair with offset and often access tone. Shared-use etiquette is similar in US and Europe: listen first, keep transmissions short, identify clearly with your callsign, and avoid occupying channels unnecessarily. Repeaters are community infrastructure, so long unstructured transmissions and frequent key-ups without purpose are poor practice. Also remember that amateur communications are generally not for encrypted private traffic in normal operation; follow your local legal limits and accepted operating practice.",
		"For a beginner, the legal-practical order should be: verify your license privileges, use only approved amateur allocations, then build channels from trusted local sources. Program channels with documented source notes (for example national repeater list + date), test at low power first, and keep configuration backups. If you travel between countries in Europe, check CEPT eligibility and host-country conditions before transmitting. This workflow prevents most legal mistakes and makes troubleshooting much easier.",
	],
};

const trAnswersBySection: Record<number, string[]> = {
	1: [
		"Kişisel kazanç amacı olmadan, teknik eğitim, deneme-öğrenme ve haberleşme disiplini için yapılan lisanslı radyo faaliyetidir. Yani amaç para kazanmak değil; doğru frekans kullanımı, kurallı konuşma ve teknik beceri geliştirmektir. Bir amatör operatör, cihazı sadece 'konuşmak için' değil, sinyalin nasıl yayıldığını, antenin neden fark yarattığını ve sahada nasıl güvenli iletişim kurulacağını öğrenmek için kullanır.",
		"Bu hobi; elektrik kesintisi, afet veya kapsama sorunu gibi durumlarda alternatif iletişim yöntemi sağlayabilir, ama bunun yanında gündelikte de ciddi teknik beceri kazandırır. Frekans planlama, kısa-net konuşma, ekip içinde sıra ve disiplin, saha kurulum mantığı gibi konularda pratik yaptırır. Kısacası sadece bir cihaz kullanmayı değil, gerçek hayatta güvenilir iletişim kurmayı öğretir.",
		"Bu alana en çok; elektroniğe ve teknolojiye meraklı kişiler, doğa/dağcılık/off-road gibi etkinliklerde güvenli iletişim isteyenler ve afet gönüllüleri başlar. Kimisi teknik tarafı sevdiği için, kimisi sahada telefonu her zaman güvenilir bulmadığı için, kimisi de topluluk içinde disiplinli haberleşme öğrenmek için başlar. Ortak nokta, iletişimi hazır bir uygulama gibi tüketmek yerine nasıl çalıştığını gerçekten anlamak istemeleridir.",
		"Bu rehber, 'sıfır bilgiyle başladım' diyen kişiler için hazırlandı. Cihazı açtığında hangi ayarı neden yaptığını, hangi hatanın en sık yaşandığını ve nasıl hızlı teşhis edeceğini adım adım göstermek için yazıldı. Yani yalnızca menü isimlerini öğretmez; önce mantığı kurdurur, sonra pratikte doğru sırayla uygulamanı sağlar.",
	],
	2: [
		"Frekans, bir sinyalin saniyede kaç kez salındığını anlatır ve birimi Hertz'dir; telsizde ise bunu genelde MHz olarak görürsün. Ekranda gördüğün sayı aslında 'hangi hatta dinleme/gönderim yaptığını' söyler. Örneğin 145.500 MHz ile 433.500 MHz aynı şey değildir; farklı band, farklı yayılım davranışı ve farklı kullanım alanı demektir.",
		"VHF ve UHF, aynı işi yapan ama farklı frekans aralığında çalışan iki haberleşme yoludur. Basit anlatımla: VHF dalgası genelde açık alanda daha iyi yürür, UHF ise şehir içinde bina ve engeller arasında çoğu zaman daha iyi sonuç verir. Örnek: Kırsalda dağ-tepe hattında VHF çoğu zaman avantajlıdır; şehir merkezinde bina aralarında UHF daha stabil duyulabilir. Yine de bu kesin kural değildir; anten kalitesi, cihaz ayarı, bulunduğun yükseklik ve çevresel parazit sonucu değiştirebilir.",
		"2 metre ve 70 santimetre ifadeleri, frekansın dalga boyu karşılığıdır ve amatör dünyada çok kullanılan kısa isimlerdir. Pratikte '2m' denince 144 MHz civarı, '70cm' denince 430 MHz civarı anlaşılır. Cihazda bu adları görmek, hangi bantta çalıştığını hızlıca kavramanı sağlar.",
		"Kanal; sadece frekans değil, frekansla birlikte tone, offset, güç, genişlik gibi ayarların tek kayıtta tutulmuş halidir. Hafıza kanalı da bu hazır profilin cihazda saklanmasıdır. Bu sayede her kullanımda menüye girip ayar kurmazsın; doğru profile geçip hızlı ve hatasız çalışırsın.",
		"Watt, cihazın RF çıkış gücünü ifade eder ama 'çok watt = her zaman iyi iletişim' anlamına gelmez. Anten zayıfsa veya konum kötü ise güç artışı beklenen farkı vermeyebilir. Doğru yaklaşım önce iyi anten ve doğru kurulum, sonra gerektiği kadar güç kullanmaktır.",
		"Anten, telsizin en kritik parçasıdır çünkü sinyalin havaya çıkışı ve havadan toplanması burada olur. Aynı cihaz iki farklı antenle bambaşka performans gösterebilir. Bu yüzden çekim sorunu yaşadığında ilk bakılacak yer çoğu zaman cihaz menüsü değil anten-kablo-konnektör zinciridir.",
		"Modülasyon, konuştuğun sesin radyo sinyaline hangi yöntemle çevrildiğini anlatır. FM, amatör telsizde en yaygın ve pratik konuşma modudur; AM özellikle hava bandında kullanılır; dijital modlar ise sesi/veriyi sayısal olarak kodlayıp taşır. Çok basit düşün: Aynı dili konuşmak gibi, iki tarafın modu aynı değilse birbirini duysa bile düzgün anlayamaz. Bu yüzden frekans doğru olsa bile mod yanlışsa ses boğuk, kırık veya anlamsız gelebilir.",
		"Squelch (SQL), telsizin sesi ne zaman açıp kapatacağına karar veren 'gürültü eşiğidir'. Çok düşük ayarda cihaz sürekli hışırdar, çok yüksek ayarda zayıf ama gerçek konuşmaları susturur; bu yüzden orta seviyeden başlayıp bulunduğun ortama göre küçük adımlarla ayarlamak en doğru yöntemdir. CTCSS ve DCS ise kanala eklenen ton/kod filtresidir: frekans aynı olsa bile doğru ton/kod yoksa bazı röleler seni kabul etmez ya da sen bazı konuşmaları duyamazsın. En kritik bilgi: CTCSS/DCS gizlilik veya şifreleme değildir; sadece aynı frekansta istenen trafiği ayırmaya yarayan bir kapı mekanizmasıdır.",
	],
	3: [
		"Amatör telsiz lisanslıdır çünkü frekans spektrumu sınırlı ve herkesin ortak kullandığı bir kaynaktır. Lisans sistemi, 'kim olursa olsun yayın yapsın' yerine, temel teknik bilgiyi ve kurallı kullanım sorumluluğunu doğrular. Yani lisans bir formalite değil; hem güvenlik hem düzen hem de girişim/parazit kontrolü için temel filtredir.",
		"Bazı frekanslar sivil-askeri kritik hizmetlere ayrılmıştır: havacılık, denizcilik, acil yardım, kamu güvenliği gibi. Bu yüzden bir cihazın bir frekansı alabilmesi veya menüde görünmesi, o frekansta yayın yapmanın serbest olduğu anlamına gelmez. Kural çok nettir: dinleyebilmek teknik bir durumdur, yayın yapabilmek ise hukuki yetki gerektirir.",
		"Amatör bantlar, lisanslı amatörlerin haberleşme ve teknik deneme yapabildiği ayrılmış frekans aralıklarıdır. Pratikte en çok kullanılan aralıklar şunlardır: HF tarafında 1.8-2.0 MHz (160 m), 3.5-3.8 MHz (80 m), 7.0-7.2 MHz (40 m), 14.0-14.35 MHz (20 m), 21.0-21.45 MHz (15 m), 28.0-29.7 MHz (10 m); VHF/UHF tarafında 144-146 MHz (2 m) ve 430-440 MHz (70 cm). Yeni başlayanların sahada en sık gördüğü değerler 145.500 MHz simplex çağrı frekansı ve UHF'de 433 MHz çevresindeki simplex/röle kullanım aralıklarıdır. Ancak kritik kural şudur: kesin kullanım yetkisi, çıkış gücü ve mod (FM/SSB/dijital) ülke mevzuatı ve güncel band planına göre belirlenir; bu yüzden cihaz programlamadan önce yerel resmî liste mutlaka kontrol edilmelidir.",
		"Band planı, bir bandın içinde trafiğin karışmaması için yapılan kullanım düzenidir. Örneğin bazı segmentler çağrı/simplex, bazıları röle giriş-çıkış, bazıları dijital/veri için ayrılır. Planı takip etmek bir tavsiye değil, pratikte çakışmayı azaltan ve toplulukta uyumu sağlayan temel çalışma disiplinidir.",
		"Röle, bir istasyonun sinyalini alıp tekrar yayınlayan paylaşımlı altyapıdır; simplex ise iki istasyonun doğrudan konuşmasıdır. Rölede sıra ve kısa konuşma disiplini daha kritiktir çünkü aynı kaynak çok kişi tarafından kullanılır. Simplex daha esnek görünse de yine frekans işgali, üst üste konuşma ve gereksiz uzun yayınlardan kaçınmak gerekir.",
		"Yeni başlayan biri için en doğru yaklaşım: önce dinleme, sonra kısa deneme, sonra kalıcı kayıt. İlk günlerde amaç uzun sohbet etmek değil; frekans, tone, offset, güç, mod zincirini doğru kurup sistemli şekilde doğrulamaktır. Bu yöntem hem hata ayıklamayı hızlandırır hem de yanlış alışkanlıkların baştan yerleşmesini engeller.",
	],
	4: [
		"El telsizi (HT), hafif ve taşınabilir olduğu için yeni başlayanlar için en kolay başlangıç noktasıdır. Yürüyüşte, araç dışında veya ev içinde hızlı kullanım sağlar. Ancak küçük anten, düşük çıkış gücü ve batarya kapasitesi nedeniyle menzil ortamdan çok etkilenir. Aynı cihazla açık alanda net duyduğun sinyali bina içinde zayıf duyabilirsin. Bu yüzden el telsizinde performansı artırmanın ilk adımı genelde güç yükseltmek değil, daha iyi anten ve daha iyi konum seçimidir.",
		"Araç telsizi, harici araç anteni ve araç elektriğinden sürekli besleme sayesinde el telsizine göre daha stabil çalışır. Uzun süreli dinleme/gönderimde batarya stresi yoktur, çıkış gücü de çoğu modelde daha yüksektir. Özellikle hareket halindeyken röle erişimi daha tutarlı olur. Doğru montaj için antenin şase/topraklaması, kablo kalitesi ve sigorta bağlantısı önemlidir; yanlış montaj parazit ve performans kaybına neden olabilir.",
		"Sabit istasyon, ev/iş yerinde kurulan ve genellikle dış ortam anteni kullanan yapıdır. Anteni yüksek ve açık bir noktaya koyabildiğin için hem dinleme kalitesi hem gönderim başarısı belirgin artar. Uzun vadede en verimli kurulum budur çünkü güç kaynağı, anten, kablo ve aksesuarları düzenli şekilde optimize edebilirsin. Başlangıçta küçük bir masaüstü kurulumla başlamak, sonra anteni iyileştirerek adım adım büyütmek en sağlıklı yöntemdir.",
		"Analog telsiz, özellikle FM ses haberleşmesinde en sade ve öğrenmesi kolay yapıdır. Frekans, tone ve güç ayarını doğru yaptığında hızlıca sonuç alırsın. Hata ayıklama da daha nettir: ses var/yok, parazit var/yok gibi temel belirtilerle ilerlersin. Yeni başlayan için avantajı, karmaşık ağ ve kimlik ayarlarına girmeden haberleşme disiplinini öğrenmektir.",
		"Dijital telsiz; daha temiz ses, kullanıcı kimliği, grup çağrısı ve bazı modellerde veri özellikleri sunar. Ancak bu sistemde frekans tek başına yetmez; color code, talkgroup, slot gibi ek ayarlar da doğru olmalıdır. Ayarlardan biri bile yanlışsa cihaz sessiz kalabilir. Bu nedenle dijitalde başarı anahtarı, doğru codeplug/profil kullanmak ve ayar mantığını ezberlemek değil anlamaktır.",
		"DMR, amatör dünyada yaygın kullanılan dijital haberleşme standardıdır. Temel farkı, bir frekansta zaman dilimleri (Time Slot 1/2) ve konuşma grupları (Talkgroup) ile trafiği düzenlemesidir. Analogda herkes aynı taşıyıcıda sırayla konuşurken, DMR'de kimin kimi duyacağı daha planlıdır. Pratikte doğru çalışması için en kritik üçlü şudur: doğru frekans + doğru color code + doğru talkgroup/slot eşleşmesi.",
		"APRS, sesli sohbet için değil veri iletimi için kullanılan bir sistemdir. Konum bilgisi, kısa metin mesajı, telemetri ve durum verisi paketler halinde gönderilir. Bu nedenle APRS frekansında çoğu zaman konuşma değil modem benzeri veri sesi duyarsın. Amacı 'sohbet etmek' değil, istasyonların nerede olduğunu ve hangi bilgiyi paylaştığını ağ üzerinde görünür kılmaktır.",
	],
	5: [
		"Yeni başlayan biri cihaz seçerken ilk soru 'en iyi model hangisi?' değil, 'ben bunu nerede ve ne sıklıkla kullanacağım?' olmalıdır. Haftada 1-2 kez şehir içinde dinleme yapacaksan temel bir el telsizi yeterli olabilir; her gün aktif kullanım, araçla seyahat veya kırsalda daha güvenilir bağlantı istiyorsan daha güçlü bir model ya da araç/sabit çözüm gerekir. Kendi ihtiyacını anlamak için önce üç şeyi yaz: kullanım ortamın (şehir-kırsal), kullanım süren (kısa-uzun), hedefin (dinleme mi, düzenli konuşma mı). Bu üç cevap doğru cihaz tipini büyük ölçüde belirler.",
		"Ucuz cihaz mı dengeli cihaz mı sorusunda asıl konu fiyat değil, toplam maliyettir. Çok ucuz bir cihaz ilk alımda avantajlı görünür ama ses kalitesi, dayanıklılık, yazılım desteği ve aksesuar eksikliği nedeniyle kısa sürede ikinci cihaza geçmene neden olabilir. Dengeli cihaz yaklaşımı; 'işimi görecek kadar sağlam, programlaması kolay, bataryası bulunur, yedek parçası erişilebilir' çizgisini hedefler. İnsanların çoğu için en doğru nokta en ucuz veya en pahalı değil, orta segmentte güvenilir bir modeldir.",
		"Bluetooth gerekli mi sorusunu netleştirmek için kullanım alışkanlığına bakmalısın. Telsizi elde tutup klasik PTT ile konuşacaksan Bluetooth'un katkısı sınırlıdır. Kask, araç içi eller serbest düzen, kablosuz kulaklık ya da mobil uygulama entegrasyonu kullanacaksan anlamlı hale gelir. Yani Bluetooth bir performans artırıcı değil, kullanım kolaylığı özelliğidir. İhtiyacın yoksa bu bütçeyi daha iyi antene veya yedek bataryaya ayırmak genelde daha doğru yatırım olur.",
		"GPS, APRS ve spektrum analizi gibi özellikler 'iyi görünür' ama herkes için gerekli değildir. Konum paylaşımı, rota takibi veya saha koordinasyonu yapacaksan GPS/APRS çok faydalıdır; sadece yerel röle dinleyip temel görüşme yapacaksan şart değildir. Spektrum özellikleri teknik merakı olan kullanıcıya değer katar, fakat başlangıç seviyesinde zorunlu değildir. İhtiyacı doğru okumak için şu test işe yarar: Bu özelliği haftada en az bir kez gerçekten kullanacak mıyım? Cevap hayırsa ilk cihazda öncelik yapmamak daha doğrudur.",
		"Programlama kolaylığı, yeni başlayanların en çok zorlandığı noktayı çözer: doğru kanal setini hızlı ve hatasız kurmak. Frekans, offset, tone, güç ve kanal adı gibi ayarları tek tek cihaz menüsünden girmek hem yorucu hem hataya açıktır. Bilgisayardan toplu düzenleme, yedek alma ve geri yükleme desteği olan cihazlar öğrenme sürecini ciddi hızlandırır. Bir cihaz seçerken sadece teknik özelliklere değil, yazılım olgunluğu ve kullanıcı topluluğu desteğine de bakmak gerekir.",
		"Anten girişi, batarya sistemi ve aksesuar ekosistemi cihazın 'kâğıt üstü' değil gerçek ömrünü belirler. Yaygın konnektör kullanan bir modelde anten yükseltmesi kolay olur; nadir konnektörlerde seçenek azalır. Yedek batarya bulunamayan cihaz sahada risk yaratır, çünkü cihaz sağlam olsa bile kullanım süren kısalır. Programlama kablosu, harici mikrofon, kulaklık, araç şarjı gibi parçaların piyasada kolay bulunması günlük kullanımda büyük fark oluşturur.",
		"Gerçek ihtiyaç listesi çıkarırken kendine kısa bir ihtiyaç profili yap: zorunlu, önemli, opsiyonel. Zorunluya 'çift bant, temiz ses, güvenilir batarya, kolay programlama'; önemliye 'sağlam kasa, iyi hoparlör, hızlı tarama'; opsiyonale 'Bluetooth, APRS, gelişmiş ekran' gibi maddeler yaz. Sonra modeli bu listeye göre puanla; reklam metnine göre değil. Bu yöntem, başkalarının önerisiyle değil kendi kullanımınla uyumlu cihaz seçmeni sağlar ve 'aldım ama bana uymadı' ihtimalini ciddi azaltır.",
	],
	6: [
		"Kutudan çıkan parçaları ilk gün tek tek kontrol et: cihaz gövdesi, anten, batarya, şarj ünitesi, klips ve varsa kablo/aksesuarlar. Sonra fiziksel kontrol yap: anten dişi düzgün mü, batarya kilidi tam oturuyor mu, PTT tuşu takılmadan çalışıyor mu. Bu adım erken teşhis sağlar; üretim kaynaklı bir sorunu baştan ayırırsın.",
		"Anteni takarken cihaz kapalı olsun, anteni düz eksende oturtup nazikçe çevir. Zorlayarak sıkmak konnektöre kalıcı zarar verebilir. Antensiz yayın yapmaktan kaçın; özellikle yüksek güçte cihazın RF katını zorlayabilir. Güvenli sıra: önce anteni tak, sonra cihazı aç.",
		"İlk şarjda üreticinin tavsiyesini izleyip bataryanın ısınma davranışını gözlemle. Normal kullanımda hafif ısınma olabilir ama belirgin sıcaklık artışı veya çok hızlı boşalma not edilmelidir. İlk hafta sonunda ortalama çalışma süresini yazmak, ileride performans düşüşünü erken fark etmene yardımcı olur.",
		"Ekrandaki simgeler menüye girmeden durum teşhisi yapmanı sağlar: güç seviyesi (LOW/HIGH), tone açık-kapalı, duplex/shift, pil seviyesi, kanal-frekans modu. Örneğin TX simgesi görünüp karşı taraf duymuyorsa sorun çoğu zaman güçte değil tone/offset veya anten tarafındadır. Simge okumayı öğrenmek, hata ayıklama süresini ciddi azaltır.",
		"Fabrika ayarlarını değiştirmeden önce başlangıç durumunu referans al: mevcut frekans/kanal, SQL seviyesi, güç seviyesi, tone ve tarama ayarları. Mümkünse not al ya da fotoğrafla kaydet. Böylece bir ayar bozulduğunda hızlıca geri dönersin. En güvenli yöntem: tek seferde tek ayar değiştir, sonucu test et, sonra ilerle.",
		"Cihazı ilk açtığında (model isimleri farklı olabilir) genel başlangıç menü konumu şu şekilde olsun:\n1) `Mode`: `VFO` (öğrenme aşamasında menüyü görmek kolay olur).\n2) `TDR/Dual Watch`: `ON`.\n3) `A/B TX` veya `TX Select`: tek bir satıra sabitle (`A`).\n4) `SQL/Squelch`: `3-5` arası (orta seviye).\n5) `TX Power`: `LOW` veya `MID`.\n6) `Wide/Narrow`: amatör FM için çoğu durumda `Wide`.\n7) `STEP`: `12.5 kHz` (gerekirse `25 kHz`).\n8) `CTCSS`: `OFF`.\n9) `DCS`: `OFF`.\n10) `Shift/Offset`: `OFF`.\n11) `VOX`: `OFF`.\n12) `BCL/Busy Lock`: `ON`.\n13) `TOT/Time-Out Timer`: `60-90 sn`.\n14) `Beep/Key Tone`: `LOW` veya `OFF`.\n15) `Roger Beep`: `OFF`.\n16) `STE/RP-STE` (tail azaltma): `ON` (varsa).\n17) `Scan Resume` (TO/CO/SE): başlangıç için `TO`.\n18) `Battery Save`: `ON`.\n19) `Backlight`: `10-15 sn`.\n20) `Auto Key Lock`: `OFF` (öğrenirken).\n21) `PTT ID/ANI/DTMF Auto`: `OFF`.\n22) `Alarm`: `OFF`.\n23) `Noise Reduction`: `OFF` ile başla, sonra test ederek aç.\n24) `Channel Name Display`: başlangıçta `FREQ` (frekansı gör).\n\nSon kontrol:\n1) Ekranda `TDR` açık mı bak.\n2) TX satırı doğru mu (`A/B`) kontrol et.\n3) Güç `LOW/MID`, SQL orta, tone/offset kapalı mı doğrula.\n4) Bu temel düzen oturduktan sonra tek tek ayar değiştirerek kişiselleştir.",
	],
	7: [
		"SQL / Squelch ne yapar:\n1) Gürültü eşiğini belirler; eşik altındaki sinyali susturur.\n2) Çok düşükte sürekli hışırtı, çok yüksekte zayıf ama gerçek konuşmaların kaçması olur.\nBaşlangıç ayarı:\n1) Genelde `3-5` arası.\n2) Sessiz ortamda bir kademe düşür, şehir parazitinde bir kademe yükselt.\nPratik ipucu:\n1) Bir frekansta konuşma gelip gidiyorsa SQL bir kademe azaltıp tekrar dinle.",
		"TX Power (LOW/MID/HIGH) ne yapar:\n1) Cihazın gönderim çıkış gücünü belirler.\n2) Güç artınca menzil bazen artar ama batarya tüketimi ve istenmeyen parazit de artar.\nBaşlangıç ayarı:\n1) Yakın haberleşmede `LOW`.\n2) Uzak veya zayıf erişimde `MID`, gerçekten gerekiyorsa `HIGH`.\nPratik ipucu:\n1) Önce anten/konum iyileştir, sonra gücü yükselt; her zaman tersini yapma.",
		"Wide / Narrow ne yapar:\n1) Yayın bant genişliğini belirler.\n2) Karşı tarafın ayarıyla uyumlu değilse ses boğuk, ince veya çok sert gelebilir.\nBaşlangıç ayarı:\n1) Amatör FM konuşmada çoğu durumda `Wide`.\n2) Dar kanal planı kullanılan özel yerlerde `Narrow`.\nPratik ipucu:\n1) Ses anlaşılmıyorsa frekanstan önce bu ayarın eşleşmesini kontrol et.",
		"BCL (Busy Channel Lock) ne yapar:\n1) Kanal meşgulse PTT'yi kilitler, üstüne konuşmayı engeller.\nNeden önemli:\n1) Ortak kullanım adabını korur ve çakışmayı azaltır.\nBaşlangıç ayarı:\n1) `ON` önerilir.\nPratik ipucu:\n1) PTT basınca cihaz göndermezse önce kanalın boş olup olmadığını dinle; bu arıza değil koruma olabilir.",
		"STE / RP-STE ne yapar:\n1) Konuşma sonunda oluşan patlama/kuyruk sesini azaltır.\n2) Sinyal gücünü artırmaz, sadece dinleme konforu sağlar.\nBaşlangıç ayarı:\n1) Destekleyen cihazlarda `ON`.\nPratik ipucu:\n1) Açınca karşı taraf sesi kesikleşiyorsa kapatıp karşılaştır; modelden modele sonuç değişir.",
		"VOX ne yapar:\n1) Ses algılayınca PTT'ye basmadan otomatik yayın başlatır.\nRisk:\n1) Ortam gürültüsünde istemsiz yayın açabilir.\nBaşlangıç ayarı:\n1) `OFF` (özellikle öğrenme aşamasında).\n2) Kullanacaksan VOX seviyesi düşük hassasiyetten başlat.\nPratik ipucu:\n1) Fan, rüzgar, araç sesi varsa VOX çoğu zaman sorun çıkarır.",
		"Noise Reduction (NR) ne yapar:\n1) Arka plan gürültüsünü bastırarak konuşmayı temizlemeye çalışır.\n2) Bazı cihazlarda sesi robotik/yapay hale getirebilir.\nBaşlangıç ayarı:\n1) `OFF` ile başla.\n2) Parazitli ortamda `LOW` seviyesiyle test et.\nPratik ipucu:\n1) Açık-kapalı karşılaştırmayı aynı konuşmada yap; kulağa net gelen ayarı seç.",
		"Scan ne yapar:\n1) Kanal/frekansları sırayla tarar, aktif sinyal görünce durur.\nBaşlangıç ayarı:\n1) Sadece gerçekten takip edeceğin kanalları tarama listesine koy.\n2) `Scan Resume` olarak başlangıçta çoğu kullanıcı için `TO` (zaman aşımıyla devam) pratiktir.\nPratik ipucu:\n1) Liste çok uzarsa aktif çağrıları geç yakalarsın; az ama doğru kanal daha verimlidir.",
		"Dual Watch / TDR ne yapar:\n1) İki satırı dönüşümlü dinler.\n2) Çoğu elde gerçek çift alıcı değil, hızlı geçiş mantığıdır.\nBaşlangıç ayarı:\n1) İki frekansı aynı anda takip edeceksen `ON`.\n2) `A/B TX` ile yayın satırını sabitle.\nPratik ipucu:\n1) Dual açıkken en sık hata yanlış satırdan TX yapmaktır; çağrıdan önce TX satırını kontrol et.",
		"Shift / Offset ne yapar:\n1) RX ve TX frekansını belirli bir farkla ayırır.\n2) Özellikle röle kullanımında kritik parametredir.\nBaşlangıç ayarı:\n1) Genel dinleme/öğrenmede `OFF`.\n2) Gerektiğinde yön (`+/-`) ve değer birlikte doğru girilmeli.\nPratik ipucu:\n1) Röleyi duyup açamıyorsan ilk bakılacak üçlü: shift yönü, offset değeri, tone.",
		"CTCSS / DCS ne yapar:\n1) Aynı frekanstaki trafiği ton/kod ile filtreler.\n2) Şifreleme değildir, sadece erişim filtresidir.\nBaşlangıç ayarı:\n1) Genel kullanımda `OFF`.\n2) Gerekiyorsa önce `TX tone` gir, `RX tone`u gerekmedikçe açma.\nPratik ipucu:\n1) TX ve RX tone alanlarını karıştırmak en yaygın hatadır; menü satırını iki kez kontrol et.",
		"Kanal adı ve hafıza kaydı ne sağlar:\n1) Frekans, güç, tone, offset gibi ayarları tek profilde saklar.\n2) Sahada hızlı ve hatasız geçiş sağlar.\nBaşlangıç düzeni:\n1) İsim standardı kullan: `BAND-AMAC-FREQ` (ör. `VHF-SIMPLEX-145500`).\n2) Sık kullanılanları üst kanallara koy.\nPratik ipucu:\n1) Her büyük değişiklikten önce yedek al; yanlış kaydı geri dönmek kolay olur.",
	],
	8: [
		"Önce dinlemek neden önemli:\n1) Bölgedeki konuşma düzenini, bekleme sürelerini ve çağrı adabını öğrenirsin.\n2) Kimin hangi saatlerde aktif olduğunu fark edersin.\n3) Yanlış zamanda PTT basıp trafiği bölme riskin azalır.\nPratik uygulama:\n1) En az 10-15 dakika sadece dinleme yap.\n2) Konuşma aralıklarını not et; sonra çağrını o ritme göre ver.",
		"Röle nasıl dinlenir:\n1) Rölenin çıkış frekansını dinlemeye alırsın; dinlemek için çoğu durumda tone gerekmez.\n2) Trafik varsa röle kuyruğu, konuşma stili ve yoğun saatler net anlaşılır.\n3) Bazı rölelerde zayıf sinyalde kopmalar normal olabilir.\nPratik uygulama:\n1) Farklı saatlerde aynı röleyi dinle.\n2) En temiz duyduğun konumu not et; bu gönderim testinde de işe yarar.",
		"Simplex frekans nasıl dinlenir:\n1) Simplex'te iki istasyon doğrudan konuşur; arada röle yoktur.\n2) Bu yüzden kapsama tamamen konum, anten ve çevre engellerine bağlıdır.\n3) Şehir içinde bina gölgeleri, kırsalda arazi yapısı sinyali ciddi etkiler.\nPratik uygulama:\n1) Aynı frekansı ev içinde ve açık alanda karşılaştır.\n2) Sinyal farkı çoksa sorun genelde ayardan çok konum/anten tarafındadır.",
		"APRS frekansında neden veri sesi duyulur:\n1) APRS sesli sohbet değil, paket veri sistemidir.\n2) Duyduğun ses modem benzeri dijital veri tonudur.\n3) Bu sesin varlığı ağda veri akışı olduğunu gösterir.\nPratik uygulama:\n1) APRS frekansında konuşma bekleme.\n2) Veri sesini duyuyorsan cihazın dinleme kısmı çalışıyor demektir.",
		"Airband neden AM'dir:\n1) Havacılıkta aynı anda iki yayın çakıştığında AM'de bunu ayırt etmek FM'e göre daha kolaydır.\n2) Güvenlik açısından 'kanalda bir şey var mı' bilgisinin duyulması önemlidir.\n3) FM alıcı ile AM trafiği doğru anlaşılmaz, bu normaldir.\nPratik uygulama:\n1) Airband dinlerken cihazın modunu mutlaka `AM` yap.\n2) Frekans doğru olsa bile mod yanlışsa ses bozuk gelir.",
		"Gerçek sinyal ile iç gürültü nasıl ayırt edilir:\n1) Gerçek sinyalde ritim, kelime ve anlamlı ses yapısı vardır.\n2) İç gürültü/birdie daha sabit, mekanik ve anlamsız karakterdedir.\n3) Anteni çıkarınca kaybolmayan sesler çoğu zaman cihaz içi kaynaklıdır.\nPratik uygulama:\n1) Aynı frekansı anten takılı/takısız dinleyip karşılaştır.\n2) Konum değiştirince değişen sesler genelde dış sinyaldir.",
	],
	9: [
		"Simplex nedir:\n1) Alım ve gönderim aynı frekansta yapılan doğrudan haberleşmedir.\n2) Arada röle olmadığı için iki cihazın birbirini doğrudan duyması gerekir.\n3) Mesafe ve engel arttıkça kalite hızlı düşebilir.\nPratik uygulama:\n1) İlk denemelerde kısa mesafede başlayıp sonra uzaklaşarak test et.",
		"İki telsiz aynı frekansta nasıl konuşturulur:\n1) Frekans, mod, Wide/Narrow ve tone ayarları birebir eşleşmeli.\n2) Bir cihazda tone açık diğerinde kapalıysa tek yönlü iletişim oluşabilir.\n3) SQL çok yüksekse gelen zayıf sesi susturur.\nPratik kontrol sırası:\n1) Frekans.\n2) Mod ve bant genişliği.\n3) Tone.\n4) SQL ve güç.",
		"Dört telsiz aynı frekansta nasıl çalışır:\n1) Aynı anda tek kişi konuşur; diğerleri dinler.\n2) Konuşma kısa tutulur ve her iletim sonrası küçük boşluk bırakılır.\n3) Bu boşluk yeni çağrıların veya acil anonsların girmesine imkan verir.\nPratik kural:\n1) Uzun monolog yerine 1-2 cümlelik dönüşümlü konuşma yap.\n2) Kanal meşgulse BCL açık tut.",
		"Röleye ilk çağrı nasıl yapılır:\n1) Önce kısa süre dinle, kanal boşsa çağrı ver.\n2) İlk çağrıda kısa ve net ol: çağrı işareti + kısa kontrol isteği.\n3) Uzun tanıtım yerine önce erişimin çalıştığını doğrula.\nPratik örnek yaklaşım:\n1) '... röle dinlemede mi, kısa kontrol rica ederim.'\n2) Yanıt gelirse sonra normal konuşmaya geç.",
		"Doğru kısa çağrı örnekleri:\n1) Kim olduğunu söyle.\n2) Ne istediğini tek cümlede belirt.\n3) Karşı tarafa cevap verecek alan bırak.\nNeden önemli:\n1) Röle ve ortak frekansta kanal verimliliğini artırır.\n2) Yeni başlayan için en güvenli iletişim biçimidir.",
		"Neden röleyi duyup açamayabilirsin:\n1) Yanlış shift yönü veya yanlış offset değeri.\n2) Yanlış/eksik TX tone (CTCSS/DCS).\n3) Uplink zayıf olması (senin gönderimin röleye ulaşmıyor).\n4) Yanlış TX satırı (dual açık kullanımda sık olur).\nPratik teşhis:\n1) Önce tone+offset+shift'i doğrula.\n2) Sonra açık alanda kısa test çağrısı dene.\n3) Gerekirse güç/anten/konum iyileştir.",
	],
	10: [
		"Röle nedir:\n1) Röle, bir frekanstan aldığı sinyali aynı anda başka bir frekanstan yeniden yayınlayan otomatik istasyondur.\n2) Temel amacı kapsama alanını büyütmektir; el telsizinle doğrudan ulaşamadığın kişilere röle üzerinden ulaşabilirsin.\n3) Basit mantıkla röle 'yüksek konumdaki ara istasyon' gibi çalışır: sen aşağıdan röleye çıkarsın, röle seni daha geniş alana dağıtır.\nPratikte ne kazandırır:\n1) Şehir içinde bina gölgelerinde veya kırsalda engel arkasında iletişim şansını artırır.\n2) Düşük güçlü cihazlarla daha istikrarlı haberleşme yapılmasını sağlar.\n3) Ortak bir kanal disiplini oluşturur; aynı altyapıyı çok kullanıcı paylaşır.",
		"RX ve TX ne demek:\n1) `RX` (receive), cihazın dinlediği frekanstır.\n2) `TX` (transmit), PTT'ye bastığında gönderdiğin frekanstır.\n3) Rölede kritik nokta şudur: çoğu zaman dinlediğin frekans ile gönderdiğin frekans aynı değildir.\nNeden kritik:\n1) Röleyi net duyup yine de çıkamamanın en büyük nedeni TX tarafının yanlış kalmasıdır.\n2) Dual/TDR açık kullanımda yanlış satırdan TX yapmak çok yaygın hatadır.\nKontrol listesi:\n1) Ekranda hangi satırın TX seçili olduğunu kontrol et (`A/B TX`).\n2) RX frekansını röle çıkışıyla, TX frekansını röle girişiyle eşleştir.\n3) Kısa bir çağrıyla doğrula.",
		"Offset nedir:\n1) Offset, rölenin çıkış (dinlediğin) frekansı ile giriş (gönderdiğin) frekansı arasındaki farktır.\n2) Cihaz menüsünde genelde sayısal fark olarak girilir (ör. `0.600 MHz`, `7.600 MHz`, `5.000 MHz` gibi).\n3) Offset tek başına yetmez; yön (shift +/−) de doğru olmalıdır.\nNasıl düşünmelisin:\n1) RX, referans frekansındır.\n2) TX, RX'ten offset kadar yukarı veya aşağı kaydırılır.\n3) Kayma yanlışsa röleyi duyarsın ama röle seni hiç duymaz.\nPratik kontrol:\n1) VFO modunda RX frekansını gir.\n2) Offset değerini gir.\n3) PTT'ye basmadan cihazın gösterdiği TX frekansını kontrol et; röle kaydıyla birebir aynı olmalı.",
		"Shift yönü nasıl anlaşılır:\n1) Shift yönü, TX'in RX'e göre hangi tarafa kayacağını belirler: `+` yukarı, `-` aşağı.\n2) Röle listelerinde genellikle `+`, `-` veya doğrudan giriş/çıkış frekansı birlikte verilir.\n3) En güvenli yöntem, yönü ezberlemek değil giriş-çıkış frekanslarını hesapla/doğrula yaklaşımıdır.\nUygulama adımı:\n1) RX frekansını gir.\n2) Offset'i gir.\n3) Shift'i `+` yapıp TX frekansını kontrol et.\n4) Uymuyorsa `-` yapıp tekrar kontrol et.\nSaha ipucu:\n1) Bazı cihazlarda TX frekansını PTT yarım basışta veya monitör ekranında görebilirsin.\n2) Görmeden işlem yapma; 'muhtemelen doğru' yaklaşımı rölede en çok zaman kaybettiren hatadır.",
		"Tone neden gerekir:\n1) Birçok röle, girişte belirli bir CTCSS veya DCS tonu ister.\n2) Doğru tone yoksa röleyi duyarsın ama PTT bastığında röle açılmaz.\n3) Tone, gizlilik sağlamaz; sadece erişim filtresi gibi çalışır.\nDoğru kurulum mantığı:\n1) Önce `TX tone`u gir (röleyi açmak için gerekli olan budur).\n2) `RX tone`u sadece gerçekten gerekiyorsa aç.\n3) RX tone gereksiz açık kalırsa bazı yayınları duyamazsın.\nPratik teşhis:\n1) Shift/offset doğru, sinyal güçlü ama röle açılmıyorsa ilk şüphe tone ayarıdır.\n2) Tone tipi (CTCSS mi DCS mi) ve değeri birlikte kontrol edilmelidir.",
		"Röle kaydından doğru ayar nasıl çıkarılır:\n1) Röle bilgisini satır satır oku: çıkış frekansı, giriş frekansı veya shift/offset, tone tipi-değeri, mod.\n2) Cihaza gelişigüzel girmek yerine standart sıra kullan:\n3) `a)` RX (çıkış frekansı)\n4) `b)` Shift yönü\n5) `c)` Offset değeri\n6) `d)` TX tone (gerekiyorsa RX tone)\n7) `e)` Wide/Narrow ve güç\n8) `f)` Test çağrısı\nEn sık hata noktaları:\n1) Nokta/virgül karışıklığı nedeniyle offset'in yanlış girilmesi.\n2) TX tone yerine RX tone alanının doldurulması.\n3) Kanal kaydına geçmeden test yapılmaması.\nPratik öneri:\n1) Önce VFO'da çalıştır, doğrulanınca hafızaya kaydet.\n2) Kanal adına tone/shift bilgisini kısa kodla ekle (ör. `RPT145600 -600 T88.5`).",
		"VHF ve UHF röle farkları:\n1) VHF (2 m) çoğu senaryoda açık alan ve kırsalda daha iyi yayılım gösterebilir.\n2) UHF (70 cm) şehir içinde bina/engel yoğun ortamlarda daha stabil sonuç verebilir.\n3) Kesin kural yoktur; anten yüksekliği, rölenin konumu, çevresel gürültü ve cihaz kalitesi sonucu değiştirir.\nTeknik düşünce:\n1) Düşük frekans (VHF) genelde daha uzun dalga boyu nedeniyle açık hatlarda avantajlıdır.\n2) Daha yüksek frekans (UHF) şehir içinde yansıma/engel davranışıyla pratik avantaj sağlayabilir.\n3) Aynı güce rağmen farklı bantlarda çok farklı saha sonucu alınması normaldir.\nSaha karşılaştırması:\n1) Aynı noktada bir VHF bir UHF röleyi sırayla test et.\n2) Sinyal raporu, ses netliği ve erişim başarısını not al.\n3) Sonra günlük kullanım için en kararlı olanı önceliklendir.",
		"Gerçek örneklerle röle ekleme:\n1) Örnek senaryo mantığı: Elinde sadece röle çıkış frekansı ve tone bilgisi var.\n2) Adım adım ilerle:\n3) `a)` VFO moduna geç.\n4) `b)` Röle çıkış frekansını RX'e gir.\n5) `c)` Röle kaydındaki shift yönünü seç.\n6) `d)` Offset değerini gir.\n7) `e)` İstenen TX tone'u ayarla.\n8) `f)` Wide/Narrow ve gücü uygun seviyeye getir.\n9) `g)` Kısa test çağrısı yap.\n10) `h)` Çalışıyorsa hafızaya kaydet.\nÖrnek kontrol çağrısı:\n1) '... röle üzerinde kısa test, duyuluyor muyum?'\n2) Yanıt gelirse profil doğruya yakındır; gelmezse tone-shift-offset üçlüsünü tekrar kontrol et.\nSon güvenlik adımı:\n1) Çalışan profili yedekle.\n2) Aynı röle için ikinci bir 'test profili' açarak farklı ayar denemelerini orada yap; çalışan profili bozma.",
	],
	11: [
		"Stok anten yeterli mi sorusunun kısa cevabı: başlangıç için evet, kalıcı çözüm için çoğu zaman hayır. Kutudan çıkan anten, cihazın temel çalışmasını görmek için uygundur; yani menü öğrenme, yakın mesafe deneme ve ilk dinleme pratiği için iş görür. Ama sinyal sınırına yaklaştığında ilk tıkanan parça çoğunlukla stok antendir. Bunu anlamanın en temiz yolu aynı frekansta, aynı konumda, aynı saatte karşılaştırma yapmaktır. Bir antenle duyduğun istasyonu diğer antenle daha net ve daha az parazitli duyuyorsan fark gerçektir; his değil ölçülebilir sonuçtur.",
		"Daha uzun anten ne kazandırır sorusunda ana fikir şudur: doğru tasarlanmış daha uzun anten, özellikle elde kullanımda daha iyi alım ve daha verimli gönderim sağlayabilir. Bunun nedeni sadece fiziksel uzunluk değil, antenin hedef banda uyumu ve verimidir. Yani rastgele uzun bir anten her zaman iyi olmaz; 2 m ve 70 cm için uygun tasarlanmış ürün tercih etmek gerekir. Pratikte kullanıcı şunu hisseder: aynı noktada daha az cızırtı, daha az kopma ve röleye daha rahat erişim. Eğer uzun antene geçince iyileşme yoksa sorun çoğu zaman antenin kendisi değil, kötü konum, yanlış konnektör veya çevresel parazittir.",
		"Nagoya, Signal Stick, teleskopik ve taktik anten farkını marka değil kullanım tipi üzerinden okumak gerekir. Nagoya tarzı antenler genelde günlük kullanımda dengeli bir seçenek sunar; Signal Stick benzeri esnek antenler fiziksel dayanıklılık ve taşımada avantaj verir; teleskopik antenler doğru uzatıldığında performans sağlayabilir ama kırılgan ve pratik olmayan bir yapıya sahiptir; taktik diye satılan katlanır modeller ise görüntü olarak cazip olsa da kalite modelden modele çok değişir. Buradaki doğru yaklaşım 'hangisi popüler?' değil, 'hangi senaryoda hangi anten en tutarlı çalışıyor?' sorusudur. Saha kullanımı için dayanıklılık, ev kullanımı için stabil performans, araç için ise mekanik güvenlik önce gelir.",
		"Araç anteni ve ev anteni arasındaki fark sadece montaj yeri değildir; çalışma mantığı da farklıdır. Araç anteni genelde metal gövdeyi şase/karşı zemin gibi kullanır ve hareket halindeki iletişim için optimize edilir. Ev anteninde ise en kritik unsur yükseklik ve açık görüş hattıdır; anteni çatıya veya engellerden uzak bir noktaya almak çoğu zaman cihaz değiştirmekten daha büyük fark yaratır. Araçta kablo geçişi ve topraklama, evde ise kablo kaybı ve yıldırım güvenliği planlanmalıdır. Yani aynı anten tipini iki ortamda aynı sonuçla beklemek doğru değildir.",
		"Anten verimi ile güç farkında yeni başlayanların yaptığı en büyük hata, sinyal sorununun çözümünü doğrudan watt artırmakta aramaktır. Oysa kötü antenle yüksek güç basmak çoğu zaman batarya tüketimini ve ısınmayı artırır, ama beklenen iletişim kalitesini getirmez. Verimli anten ve doğru konum ise hem alım hem gönderimde çift taraflı iyileşme sağlar. Basit düşün: güç sadece 'bağırmak' gibidir, anten ise 'ağzını doğru yöne çevirmek'. Önce anteni düzeltmek çoğu durumda daha temiz, daha stabil ve daha ekonomik sonuç verir. Güç artışı en son ayar olmalıdır.",
		"Anten seçerken konnektör türleri kritik bir detaydır çünkü yanlış eşleşme sadece performans düşürmez, fiziksel hasar da doğurabilir. Telsiz tarafında en sık görülenler SMA, BNC ve N tipi bağlantılardır; elde cihazlarda SMA daha yaygındır. Adaptör kullanmak mümkündür ama her ek parça kayıp ve mekanik zayıflık riski ekler. Bu yüzden ideal olan, cihazına doğrudan uyan anten ya da kısa ve kaliteli bir adaptör zinciri kullanmaktır. Siparişten önce cihaz konektörünü gözle kontrol edip teknik belgede doğrulamak, yanlış ürün maliyetini baştan engeller.",
		"SMA male ve SMA female ayrımı en çok karıştırılan konulardan biridir, bu yüzden iki şeye birlikte bakman gerekir: dış diş yapısı ve merkez pin. Genel pratikte 'erkek/dişi' ayrımı sadece vida dişine göre değil merkezde pin olup olmamasına göre de doğrulanır. Yanlış parçayı zorlayarak çevirmek kısa vadede tutmuş gibi görünür ama zamanla soket gevşetir, temas hatası üretir ve RF performansını bozar. En güvenli yöntem, takmadan önce iki parçayı yan yana getirip diş yönünü ve merkez pin durumunu görsel olarak teyit etmektir. Emin değilsen zorlamak yerine model koduyla tekrar doğrulamak her zaman daha güvenlidir.",
	],
	12: [
		"Programlama kablosu, telsizin hafıza kanal listesini ve bazı gelişmiş ayarlarını bilgisayardan okuyup yazmanı sağlayan veri köprüsüdür. Burada kritik nokta kablonun sadece fiziksel olarak uyması değildir; içindeki dönüştürücü çipin sürücü uyumu da gerekir. Uyum zayıfsa cihaz bazen görünür, bazen görünmez; okuma/yazma yarıda kesilebilir. Yeni başlayan için en güvenli akış şudur: önce sadece `Read` yap, dosyayı kaydet, sonra tek küçük değişiklikle `Write` dene. İlk aşamada toplu değişiklik yapmak yerine küçük adımla ilerlemek hata riskini ciddi düşürür.",
		"USB-C ile programlama kulağa modern ve kolay gelir, ama pratikte belirleyici olan port şekli değil protokol uyumudur. Bazı cihazlarda USB-C sadece şarj içindir; veri hattı kapalı olabilir. Bazılarında ise hem şarj hem programlama vardır fakat belirli yazılım sürümü ister. Bu yüzden 'USB-C var, kesin programlanır' varsayımı hatalıdır. Doğru yöntem: üretici dokümanında modelin programlama desteğini kontrol etmek, ardından cihazı bilgisayara bağlayıp önce tanınırlık testini yapmak. Tanınma yoksa kablo arızası sanmadan önce sürücü ve port modunu doğrula.",
		"CHIRP, çok sayıda cihazda kanal yönetimini kolaylaştıran pratik bir araçtır; özellikle frekans, tone, isim ve tarama listesi düzenlemede büyük hız kazandırır. Ancak güvenli kullanım disiplin ister. En iyi yöntem: `Read from Radio` ile mevcut profili çek, bu dosyayı tarih atarak yedekle, sonra düzenleme yap, en son `Upload to Radio` ile yaz. Her yazımdan sonra cihazda rastgele 2-3 kanal açıp frekans/tone doğrulaması yapmak gerekir. Böylece tüm profilin yanlış yazılması gibi bir durumda erken yakalayıp geri dönebilirsin.",
		"CPS, üreticinin kendi cihaz ailesi için sunduğu resmi programlama yazılımıdır. Avantajı modeline özel menüleri daha doğru yönetmesi ve bazı gelişmiş özellikleri CHIRP'ten daha eksiksiz desteklemesidir. Dezavantajı ise sürüm/uyumluluk karmaşasıdır: aynı markanın farklı revizyonları farklı CPS isteyebilir. Bu nedenle kurulumda 'en yeni sürüm her zaman en iyi sürüm' mantığı yerine 'modelime uygun ve doğrulanmış sürüm' yaklaşımı daha sağlıklıdır. Program yazmadan önce doğru model seçimi yapılmazsa kanal eşleşmeleri bozulabilir veya bazı menüler yanlış alanlara gidebilir.",
		"Telefondan programlama uygulamaları sahada hız kazandırır; özellikle küçük frekans düzeltmeleri veya hazır profili aktarmada işe yarar. Ama kapsamlı kanal planı, toplu adlandırma ve yedek yönetimi için masaüstü hala daha kontrollü bir ortamdır. Telefonda en büyük risk, hızlı işlem yaparken yanlış profile yazmak veya eski dosyayı üzerine kaydetmektir. Bu yüzden mobil kullanımda bile bir ana kural bırakma: her kritik değişiklikten önce yedek al, işlemden sonra en az bir test çağrısı ve bir dinleme testi yap. Hızlı olmak ile güvenli olmak arasında denge kurmak gerekir.",
		"Firmware güncellemesi, cihazın iç yazılımını değiştirdiği için sıradan kanal yazımından daha riskli bir işlemdir. Güncelleme öncesi model kodu, donanım revizyonu, bölge varyantı ve hedef sürüm birebir eşleşmelidir. Batarya seviyesi düşükken veya kararsız güç kaynağıyla güncelleme yapmak ciddi risk taşır; süreç yarım kalırsa cihaz açılmayabilir. Güvenli yaklaşım: tam şarj, stabil kablo, doğru dosya, tek seferde işlem. Ayrıca mümkünse mevcut yapılandırmayı ve mevcut firmware bilgisini not etmek, sorun halinde geri dönüş planı sağlar.",
		"Yanlış firmware riskleri teorik değil, sahada sık görülen gerçek problemlerdir: menü kaymaları, frekans adımı hataları, TX/RX davranış bozulması, hatta cihazın hiç açılmaması. Benzer model adları (örneğin aynı serinin farklı donanım revizyonları) en çok hata yapılan noktadır. Dosya adı benziyor diye yüklemek yerine, model etiketi ve üretici notlarını satır satır eşleştirmek gerekir. Güncelleme sonrası mutlaka temel fonksiyon testi yapılmalıdır: açılış, VFO, kanal geçişi, dinleme, kısa TX testi. Bu testler geçmeden cihazı sahada kritik kullanımda değerlendirmemek en doğrusudur.",
		"Yedek alma alışkanlığı tüm programlama sürecinin sigortasıdır. Bir profili yanlışlıkla bozduğunda, çalışan son yedeğe dönmek saatlerce menü düzeltmekten çok daha hızlıdır. İyi bir düzen için dosya adında tarih ve kısa açıklama kullan: `2026-04-13_tr_local_repeaters_v1.img` gibi. Büyük değişiklik öncesi ve sonrası ayrı yedek almak, hangi adımda sorun çıktığını bulmayı kolaylaştırır. Kısacası profesyonel kullanımın farkı daha az hata yapmak değil, hata olduğunda dakikalar içinde güvenli şekilde geri dönebilmektir.",
	],
	13: [
		"Hiçbir şey duymuyorum diyorsan panik yapmadan en temel zinciri sırayla kontrol et. İlk olarak ses seviyesi (volume) gerçekten açık mı, sonra squelch (SQL) çok yüksekte mi bak. SQL yüksekse zayıf ama gerçek sinyaller tamamen susar ve cihaz ölü gibi görünür. Ardından doğru frekansta olduğundan emin ol; kanal adının tanıdık olması yetmez, frekans/tone profili bozulmuş olabilir. Anten tam oturmamış, gevşek veya yanlış adaptörle takılıysa alım ciddi düşer. En pratik teşhis: bilinen aktif bir frekansa geç, SQL'i 1-2 kademe düşür, anteni yeniden tak, açık alana çıkıp tekrar dene. Bu temel adımların biri yanlışsa cihaz çalışsa bile sen hiçbir şey duymayabilirsin.",
		"Her frekansta hışırtı gelmesi çoğu zaman arıza değil ayar veya ortam problemidir. SQL çok düşükse cihaz sürekli arka plan gürültüsünü açar; SQL biraz yükseltilince gereksiz hışırtı kesilir. Şehir içinde LED sürücüler, bilgisayar adaptörleri, ucuz USB şarjlar ve inverterler geniş bant parazit üretebilir, bu da 'her yerde gürültü var' hissi verir. Test yöntemi çok nettir: aynı frekansta ev içinde, pencere kenarında ve açık alanda kıyasla. Açık alanda belirgin düzeliyorsa sorun çoğunlukla çevresel EMI/parazittir. Evde cihazı güç kaynaklarından uzaklaştırmak, farklı oda denemek ve gerekiyorsa harici daha iyi antene geçmek etkili olur.",
		"Röleyi duyuyorum ama gönderemiyorum belirtisi, röle kullanımında en klasik hatadır. Bunun anlamı şudur: downlink'i (rölenin çıkışını) alıyorsun ama uplink'in (senin gönderimin) röleye ulaşmıyor ya da röle tarafından kabul edilmiyor. İlk kontrol üçlüsü: shift yönü, offset değeri, TX tone. Bu üçlüden biri yanlışsa röle seni duymaz. Sonra TX satırının doğru olduğuna bak; dual watch açıkken yanlış satırdan yayın yapmak çok yaygındır. Teknik ayarlar doğruysa kapsama konusu devreye girer: bina içinde, düşük konumda veya zayıf antenle uplink düşebilir. Kısa test çağrısını açık alanda ve mümkünse biraz yüksek noktada tekrar etmek sorunun ayar mı kapsama mı olduğunu hızlıca ayırır.",
		"Tone doğru ama yine açmıyor durumunda, sadece tone sayısını kontrol etmek yetmez; tone'un nereye yazıldığını kontrol etmek gerekir. Birçok cihazda `TX tone` ve `RX tone` ayrı menülerdedir. Röleyi açmak için gereken genellikle TX tone'dur; kullanıcılar yanlışlıkla RX tone'a değer girip çalışmasını bekler. Ayrıca CTCSS mi DCS mi kullanıldığı da doğru seçilmelidir; aynı rakam farklı sistemde işe yaramaz. Bir diğer kritik nokta ters ton (normal/invert) seçimidir; özellikle DCS'te yanlış kutuplama rölenin hiç açılmamasına yol açar. Teşhis için en sağlam yöntem: röle kaydını satır satır yeniden gir, önce sadece gerekli TX tone'u aç, RX tone'u kapalı tutarak test et.",
		"Aynı frekansta iki cihaz konuşmuyor probleminde insanlar sadece frekansa bakıp diğer ayarları atlar. Oysa frekans aynı olsa bile mod (FM/AM), wide-narrow, CTCSS/DCS, hatta bazı modellerde scramble/compander gibi filtreler farklıysa iletişim bozulur. İki cihazı yan yana koyup menü karşılaştırması yapmak en hızlı çözümdür. Güvenli reset yaklaşımı: her iki cihazda da tone filtrelerini kapat, FM modunu eşitle, kanal genişliğini eşitle, SQL'i orta seviyeye al ve düşük güçte kısa test yap. Çalıştıktan sonra gerekiyorsa tone'u birlikte aç. Bu yöntem, hatayı tek tek ekleyerek bulmayı sağlar.",
		"Motor veya helikopter gibi ses duyuyorum dediğinde bunun sebebi çoğunlukla gerçek konuşma değil parazit, intermod veya dijital veri sesidir. APRS gibi veri frekanslarında modem benzeri ses duyman normaldir ve arıza değildir. Buna karşılık sürekli dönen mekanik tonda bir ses belirli noktalarda çıkıyorsa yakındaki elektronik kaynaklar veya kuvvetli vericilerin karışımı olabilir. En pratik ayırım testi: birkaç metre yer değiştir, anteni farklı yönde tut, mümkünse aynı frekansı başka cihazda dinle. Ses bir cihazda var diğerinde yoksa cihaz içi hassasiyet/filtre farkı olabilir; her iki cihazda da benzerse dış kaynak olasılığı artar.",
		"Cihaz içi birdie nedir sorusunun pratik cevabı: telsizin kendi elektronik devrelerinden kaynaklanan sahte sinyal noktasıdır. Yani dışarıdan yayın gelmiyorken bazı frekanslarda cihaz kendi içinde 'varmış gibi' sinyal üretir. Birdie genelde sabit frekansta tekrar eder, konum değiştirsen bile çok değişmez ve anteni çıkarınca bile tamamen kaybolmayabilir. Bu yüzden yeni kullanıcı bunu gerçek trafik sanıp yanlış yorumlayabilir. Çözüm yaklaşımı, bu frekansları not edip tarama listesinde atlamak veya çalışma frekansını bir miktar kaydırmaktır. Her cihazda az veya çok olabilir; tamamen sıfır olması şart değildir.",
		"Anten mi ayar mı sorun sorusunu doğru ayırmak için rastgele deneme yerine çapraz test yapman gerekir. Önce bilinen çalışan bir profil aç: frekans, mod, tone, shift kesin doğru olsun. Sonra aynı profille iki test yap: mevcut anten ve referans anten (veya bilinen sağlam başka cihaz). Eğer referans antenle belirgin düzelme varsa sorun büyük ihtimalle anten/konnektör hattındadır. Anten değişince hiçbir fark yok ama profil değişince düzeliyorsa sorun ayar tarafındadır. Ek olarak farklı konum testi yap: açık alanda düzelip kapalı alanda bozuluyorsa sistemin çalıştığı, esas sınırlayıcının ortam olduğu anlaşılır. Bu yöntemle 'cihaz bozuk mu' sorusunu da netleştirirsin.",
	],
	14: [
		"Telsizde konuşma disiplini, teknik bilgiden bile önce gelir çünkü ortak frekansta herkesin hakkını koruyan şey bu disiplindir. Amatör haberleşmede amaç sadece konuşmak değil; anlaşılır, kısa, sıralı ve saygılı iletişim kurmaktır. İyi bir operatör, mikrofonu çok kullanan değil kanalı doğru kullanan kişidir. Disiplinli konuşmanın temel kuralları şunlardır: konuşmadan önce dinlemek, mesajı kısa cümlelerle vermek, PTT'ye basınca 1 saniye bekleyip sonra konuşmak, cümle sonunda kısa durak bırakmak ve gereksiz tekrar yapmamak. Bu alışkanlıklar hem seni daha anlaşılır yapar hem de kanal yoğunken trafiğin kilitlenmesini önler. Özellikle acil/önemli trafik olasılığı olan frekanslarda bu disiplin hayati değere yaklaşır.",
		"Aynı anda konuşmamak, telsiz adabının en temel ama en çok ihlal edilen kuralıdır. Çünkü iki kişi aynı anda PTT'ye bastığında çoğu zaman ikisi de tam anlaşılmaz; birine öncelik verilmez, bilgi kaybı olur. Bunu önlemek için her iletimden önce birkaç saniye dinleme, konuşma bitiminden sonra çok kısa bir bekleme ve sonra çağrıya girme alışkanlığı gerekir. Rölede bu kural daha da kritiktir; rölenin kuyruk/çıkış davranışı nedeniyle hemen üstüne basmak diğer istasyonları kesebilir. Pratikte 'konuşma bitti sandım' hatasını azaltmak için son kelimeden sonra yarım saniye daha dinlemek iyi bir alışkanlıktır. Konuşma çakıştığında da ısrarla devam etmek yerine kısa bir özür ve yeniden sıralı giriş yapmak doğru yaklaşımdır.",
		"Çağrı verirken kısa ve net olmak, hem seni profesyonel gösterir hem de karşı tarafın hızlı cevap vermesini sağlar. Doğru çağrı formatı temelde üç parçadan oluşur: kime seslendiğin (genel/özel), kim olduğun (çağrı işareti), ne istediğin (kısa amaç). Örneğin uzun bir giriş yerine tek cümlelik bir kontrol çağrısı çok daha verimlidir. Uzun hikaye, gereksiz detay veya art arda tekrarlanan cümleler kanalı yorar ve başkalarının giriş şansını düşürür. İyi çağrının ölçütü şudur: karşı taraf ilk seferde anlamalı ve ne cevap vereceğini bilmeli. Bu yüzden cümleyi kurarken önce zihninde planla, sonra PTT'ye bas. Bilgi aktarımında da en kritik bilgiyi başta ver, detay gerekiyorsa ikinci iletime bırak.",
		"Röleleri gereksiz meşgul etmemek, ortak kaynak kullanımında adalet ilkesidir. Röleler bireysel değil topluluk altyapısıdır; uzun ve içeriği zayıf konuşmalar başkalarının erişimini engeller. Özellikle yoğun saatlerde bir kişinin uzun monoloğu, acil kısa bir çağrının araya girmesini zorlaştırabilir. Bu nedenle konuşmayı parçalara bölmek, her parça sonunda kısa boşluk bırakmak ve konu uzayacaksa daha uygun bir simplex frekansa geçmek iyi operatör davranışıdır. Röle üzerinde deneme/test yaparken de süreyi kısa tutmak gerekir; aynı testi tekrar tekrar uzun şekilde yapmak doğru değildir. Kural basit: ihtiyaç kadar konuş, kanalın ortak olduğunu hep hatırla.",
		"Başkalarının üstüne çıkmamak, sadece nezaket değil teknik zorunluluktur. Üste çıkma olduğunda hem mevcut konuşma bozulur hem de yeni başlayanlar için frekans kaotik hale gelir. Bunu önlemek için konuşma akışını dinleyip doğal boşlukta girmek gerekir; karşı tarafın çağrı işareti veya devir teslim cümlesi bitmeden PTT basmamak önemlidir. Eğer yanlışlıkla üstüne çıktıysan savunmaya geçmeden kısa bir geri çekilme ifadesi kullanıp tekrar beklemek en doğru tavırdır. Yoğun ağlarda 'kısa aralık bırakma' kuralı özellikle işe yarar: her iletim sonrası 1-2 saniye ara, yeni istasyon girmek istiyorsa fırsat bulsun. Bu davranış trafiği sakinleştirir ve frekansta güven duygusu oluşturur.",
		"Yeni başlayan biri nasıl dinleyip öğrenmeli sorusunun en güçlü cevabı: önce kulak eğitimi, sonra kısa pratik. İlk günlerde amaç çok konuşmak değil, iyi operatörlerin ritmini ve dilini yakalamaktır. Dinlerken şunları not et: çağrılar ne kadar kısa, hangi kelimeler standart kullanılıyor, insanlar konuşmayı nasıl devrediyor, yoğunlukta nasıl sıra korunuyor. Sonra bunu küçük adımlarla uygula: günde bir-iki kısa kontrol çağrısı, bir-iki kısa yanıt, ardından tekrar dinleme. Bu döngü öğrenmeyi hızlandırır çünkü teoriyi sahadaki gerçek akışla birleştirirsin. Hata yaptığında utanmak yerine düzeltme kültürünü benimsemek gerekir; amatör toplulukta kalıcı gelişim, 'daha çok konuşma' ile değil 'daha doğru konuşma' ile gelir.",
	],
	15: [
		"APRS'e girişte en önemli şey, bunun bir konuşma sistemi değil paket veri sistemi olduğunu net anlamaktır. APRS ile konum, kısa mesaj, durum bilgisi ve telemetri paketleri gönderilir; bu yüzden frekansta duyduğun şey genellikle dijital veri sesidir. Başlangıç için karmaşık senaryo kurmana gerek yok: önce sadece çağrı işareti ve temel beacon ayarıyla çalıştır, sonra harita üzerinde paketin görünüp görünmediğini kontrol et. Doğru başlangıç sırası şudur: frekans doğrulama, beacon aralığını makul seçme, gereksiz sık gönderimden kaçınma ve ilk denemeleri sabit konumda yapma. Böylece sistemin gerçekten çalıştığını görüp sonra mobil kullanıma geçersin.",
		"DMR'ye girişte kullanıcıları zorlayan nokta, analog mantıkla dijital sistemi yönetmeye çalışmaktır. DMR'de frekans tek başına yetmez; radio ID, color code, time slot ve talkgroup birlikte doğru olmalıdır. Yeni başlayan için en güvenli yöntem tek bir röle ve tek bir talkgroup ile sade profil oluşturmaktır. Karmaşık codeplug dosyasıyla başlamak yerine küçük ve çalıştığı doğrulanmış bir yapı kurmak daha hızlı öğrenme sağlar. İlk hedefin teknik mükemmellik değil, istikrarlı bir ilk bağlantı olmalı; bağlantı kurulduktan sonra ikinci talkgroup, tarama listesi ve kontak yönetimi gibi adımları eklemek çok daha kolay olur.",
		"Hotspot, dijital telsizini yerel RF üzerinden internetteki dijital ağlara bağlayan kişisel bir köprü gibi çalışır. Pratikte ev içinde düşük güçle temiz erişim sağlar ve uzak rölelere ihtiyaç duymadan deneme yapmana imkan verir. Ancak hotspot'un doğru çalışması için ağ ayarı, kimlik bilgileri ve hedef sistem seçimi tutarlı olmalıdır. En sık hata, aynı anda birden çok profile geçip sorunun nerede olduğunu kaybetmektir. Doğru yaklaşım: önce tek ağda stabil bağlantı kur, sonra ek özellik aç. Hotspot bir 'sihirli kutu' değil; RF tarafı (telsiz ayarı) ve IP tarafı (ağ ayarı) birlikte doğru olduğunda verimli çalışır.",
		"Digi ve iGate farkı APRS altyapısında kritik bir ayrımdır. Digi (digipeater), RF'den gelen APRS paketini tekrar RF'e ileterek kapsama zinciri oluşturur; iGate ise RF ile internet arasında köprü kurar ve paketleri APRS-IS tarafına taşır. Basit anlatımla digi sahadaki RF ağını büyütür, iGate ise sahayı internete bağlar. Yeni başlayan için bu farkı bilmek önemlidir çünkü 'paketim haritaya düşmedi' sorununda arıza nerede aranacağını belirler. Eğer bölgede iGate yoksa RF'de çalışan paket internete çıkmayabilir; eğer digi yoksa uzak istasyonlara RF üzerinden ulaşım zayıflayabilir.",
		"GPS'li telsizler, APRS ve takip odaklı kullanımlarda ciddi kolaylık sağlar çünkü konumu manuel girmek yerine otomatik üretir. Ancak GPS'in iyi çalışması için açık gökyüzü, ilk uydu kilidi süresi ve cihazın anten performansı önemlidir. Kapalı alanda veya araç içinde ilk kilidin gecikmesi normaldir. Pratik kullanımda en iyi sonuç için cihazı kısa süre açık alanda bekletip ilk kilidi aldıktan sonra hareket etmek gerekir. GPS verisi doğruysa APRS paketleri anlam kazanır; yanlış veya kilitsiz GPS ile gönderilen bilgi hem seni hem takip edenleri yanıltır.",
		"Telsiz ve telefon uygulaması sistemleri birlikte kullanıldığında günlük operasyon ciddi şekilde kolaylaşır: log tutma, konum görme, kanal profili taşıma ve hızlı not alma tek ekranda toplanabilir. Ama burada önemli bir sınır var: telefon uygulaması RF fiziğini düzeltmez. Yani antenin, frekans ayarın veya tone/offset'in yanlışsa uygulama bunu telafi edemez. Doğru iş akışı, önce telsizi RF olarak stabil hale getirmek, sonra uygulamayla yönetim katmanını güçlendirmektir. Sahada hızlı hareket edenler için bu kombinasyon özellikle değerlidir, fakat temel doğrulama adımları yine telsiz üzerinde yapılmalıdır.",
		"Sunucu ile entegrasyon fikirleri, amatör telsiz hobisini kişisel laboratuvara çevirmenin en güçlü yollarından biridir. Örneğin gelen/giden paketlerin loglanması, belirli çağrı işaretleri için bildirim, kapsama kalitesi istatistiği veya günlük kullanım raporu gibi otomasyonlar kurulabilir. Başlangıç için en doğru yöntem küçük bir hedef seçmektir: örneğin sadece log toplama ve web panelde gösterme. Bir anda alarm, harita, analiz, kullanıcı yönetimi eklemek projeyi kilitler. Ölçülebilir ilerleme için adım adım gitmek gerekir: veri topla, doğrula, sakla, görselleştir, sonra otomatik karar katmanı ekle.",
		"Ölçüm cihazları (TinySA, VNA, dummy load) ileri seviye öğrenmede oyunun kurallarını değiştirir çünkü tahmin yerine ölçüme dayalı karar verirsin. TinySA ile çevredeki sinyal yoğunluğunu ve parazit yapısını gözlemleyebilirsin; VNA ile anten/hat uyumunu (ör. rezonans eğilimi) anlayabilirsin; dummy load ile gerçek yayına çıkmadan güvenli test yapabilirsin. Bu araçlar özellikle 'neden çekmiyor?' gibi sorularda kör denemeyi azaltır. Yeni başlayan için hedef cihazları ezberlemek değil, doğru soru sormaktır: Sorun frekansta mı, antende mi, güçte mi, çevresel parazitte mi? Ölçüm araçları bu soruya kanıtla cevap verir.",
	],
	16: [
		"Dinleme istasyonu kurmak, sadece bir telsizi masaya koymaktan ibaret değildir; aslında küçük bir alım altyapısı tasarlamaktır. İyi bir dinleme istasyonunda üç şey belirleyicidir: antenin yeri, çevresel gürültü seviyesi ve kayıt/izleme düzeni. İlk adım olarak farklı konumlarda test dinlemesi yapıp en temiz alım noktasını bulman gerekir. Sonra kablo güzergahını kısa ve düzenli tutarak kayıpları azaltırsın. Eğer amaç uzun süreli izleme ise güç kaynağı kararlılığı ve ısı yönetimi de planlanmalıdır. Başlangıçta sade bir sistem kurup, her iyileştirmenin etkisini not ederek ilerlemek en verimli yöntemdir.",
		"Ubuntu sunucu ile kayıt/log sistemi kurmak, öğrenme sürecini rastgele denemeden veriye dayalı gelişime taşır. Tarih-saat damgalı kayıtlar sayesinde hangi frekansta ne zaman trafik arttı, hangi ayarda performans düştü, hangi saatlerde parazit yükseldi gibi sorulara somut yanıt alırsın. Bu sistemin gücü, geçmişe dönüp karşılaştırma yapabilmendir. Pratikte küçük bir günlük veritabanı ve düzenli log dosyası bile çok iş görür. Özellikle sorun giderirken 'dün çalışıyordu bugün neden bozuldu?' sorusu için kayıt tutmak büyük avantajdır. Sunucu tarafında hedef önce stabil kayıt almak olmalı, gelişmiş grafik/panel özellikleri ikinci adımda eklenmelidir.",
		"ESP32 ile telsiz otomasyonu, düşük maliyetli ama güçlü bir proje alanıdır. Basit seviyede PTT tetikleme, durum LED'i, telemetri okuma veya belirli olaylarda uyarı gönderme gibi işlevlerle başlanabilir. Buradaki kritik kural güvenliktir: RF zincirine kör müdahale etmek yerine önce sadece izleme/okuma yapan senaryolarla başlamak daha sağlıklıdır. Ardından kontrollü şekilde komut tarafına geçebilirsin. Proje büyüdükçe besleme kalitesi, izolasyon ve hata durumunda güvenli kapanış mantığı önemli hale gelir. En iyi sonuç için tek bir küçük hedef belirle (ör. gelen sinyalde log tetikle) ve onu sorunsuz hale getirmeden yeni özellik ekleme.",
		"Anten deneme projeleri, doğru yöntemle yapılırsa en hızlı performans kazanımını sağlar. Ana kural: tek değişken yaklaşımı. Aynı anda hem anteni hem konumu hem kabloyu değiştirirsen hangi unsurun fark yarattığını anlayamazsın. Doğru testte sabit bir referans frekans seçilir, aynı saat diliminde ölçüm alınır ve sonuçlar not edilir. Sinyal raporu, gürültü seviyesi ve anlaşılabilirlik gibi kriterler birlikte değerlendirilmelidir. Bu yöntemle birkaç haftada kendi ortamın için en verimli anten yapısını bulabilirsin. Teoride çok iyi görünen bir anten, senin lokasyonda beklenenden kötü çıkabilir; kararı katalog değil test verir.",
		"RX-only preamp ve filtre mantığı, zayıf sinyalleri daha okunur hale getirirken gereksiz sinyalleri bastırmaya dayanır. Preamp sinyali yükseltir ama her zaman fayda sağlamaz; güçlü parazit ortamında alıcıyı doyuma sürükleyip durumu kötüleştirebilir. Filtre ise istenmeyen bant dışı yükü azaltarak alıcıyı rahatlatır. En doğru kullanım, bu iki elemanı ölçüm ve karşılaştırma ile ayarlamaktır: preamp açık/kapalı dinleme farkı, filtreli/filtresiz gürültü tabanı gibi. Kör kullanımda 'daha çok kazanç = daha iyi alım' yanılgısı sık görülür. Ama pratikte temiz sinyal, sadece güçlü sinyalden daha değerlidir.",
		"Taşınabilir saha çantası hazırlamak, sahada hız ve güvenlik için profesyonel bir alışkanlıktır. İyi bir çantada güç yönetimi (yedek batarya, şarj çözümü), bağlantı seti (adaptör, kısa kablolar), temel servis ekipmanı (yedek anten, küçük el aleti) ve kayıt disiplini (not defteri/uygulama) birlikte bulunur. Çantanın başarısı çok ekipman taşımak değil, doğru ekipmanı düzenli taşımaktır. Sahada sorun yaşandığında aradığın parçayı 30 saniyede bulamıyorsan düzen iyi değildir. Bu yüzden her kullanım sonrası çantayı eski düzene döndürmek gerekir. Düzenli çanta, özellikle etkinlik ve acil iletişim senaryolarında hata oranını belirgin azaltır.",
	],
	17: [
		"En iyi ilk telsiz hangisi sorusunun doğru cevabı model adı değil, kullanım senaryosudur. Yeni başlayanların çoğu 'en güçlü' veya 'en popüler' modele yöneliyor ama uzun vadede memnuniyeti belirleyen şey menü sadeliği, yazılım desteği, batarya bulunabilirliği ve yerel rölelere uyumdur. İlk cihaz için ideal profil genelde şudur: çift bant (VHF/UHF), anlaşılır menü, güvenilir şarj-batarya, kolay programlama ve yaygın aksesuar. Eğer hedefin sadece temel öğrenme ve yerel dinleme/konuşma ise orta segment dengeli bir cihaz çoğu zaman en doğru seçimdir. Çok özellikli ama karmaşık bir model, öğrenme hızını düşürüp cihazı gereksiz zorlaştırabilir.",
		"VHF mi UHF mi daha iyi sorusunda tek doğru yok; doğru cevap bulunduğun çevreye göre değişir. Açık arazide, yüksek noktalarda ve daha serbest görüş hattında VHF çoğu zaman avantaj sağlayabilir. Şehir içinde binalar, dar sokaklar ve yansımaların yoğun olduğu ortamda UHF pratikte daha stabil hissedilebilir. Ama bu bir matematik kuralı gibi kesin değildir; aynı şehirde bile mahalleden mahalleye sonuç değişebilir. En doğru yöntem, aynı noktada her iki bantta da kısa dinleme ve kısa erişim testi yapmaktır. Kararı internet yorumu değil kendi sahandaki performans belirlemelidir.",
		"Daha yüksek watt her zaman daha iyi mi sorusunda kritik gerçek şu: iletişim kalitesi sadece çıkış gücüne bağlı değildir. Anten zayıfsa, konum kötü ise veya karşı tarafın alımı sınırlıysa gücü yükseltmek beklenen etkiyi vermez. Güç artışı batarya tüketimini, ısınmayı ve bazı durumlarda istenmeyen girişim riskini artırır. Bu yüzden en sağlıklı sıra: önce anten/konum optimizasyonu, sonra gerekli ise güç artırımıdır. Kısaca 'önce verim sonra güç' yaklaşımı hem daha temiz sinyal hem daha uzun kullanım süresi sağlar.",
		"Bluetooth gerçekten gerekli mi sorusu tamamen kullanım alışkanlığına bağlıdır. Standart elde kullanımda PTT ile konuşan biri için Bluetooth çoğu zaman zorunlu değildir. Ama kask, araç içi kulaklık, kablosuz aksesuar veya telefon entegrasyonu kullanacaksan ciddi kolaylık sağlayabilir. Burada dikkat edilmesi gereken nokta şu: Bluetooth iletişim menzilini artırmaz, sadece kullanım konforunu artırır. Bütçe sınırlıysa önce anten, batarya ve programlama altyapısına yatırım yapmak genelde daha doğru önceliktir.",
		"APRS'i cihazım destekliyor mu sorusunda en sık hata, GPS ile APRS'i aynı şey sanmaktır. GPS sadece konumu hesaplar; APRS ise bu veriyi belirli protokolle paketleyip yayınlama/iletme sistemidir. Bir cihazda GPS olması APRS yayın veya APRS mesajlaşma desteği olduğu anlamına gelmez. Teknik belgede açıkça APRS TX/RX, beacon, messaging, path gibi ifadeler aranmalıdır. Emin olmak için kullanıcı kılavuzundaki menülere bak: APRS ile ilgili ayrı ayar ekranları yoksa çoğu zaman tam APRS desteği de yoktur.",
		"DMR cihazı nasıl anlaşılır sorusunda kutudaki 'digital' ifadesi tek başına yeterli değildir. Gerçek DMR cihazlarda radio ID, talkgroup, color code, slot ve kontak yönetimi gibi menüler bulunur. Ayrıca üretici dokümanında DMR standardına uyum ifadesi açık olmalıdır. Satın alma öncesi kontrol için en pratik yöntem: cihazın yazılım (CPS) ekran görüntülerine bakmak ve talkgroup/slot alanlarını doğrulamaktır. Eğer bu alanlar yoksa cihaz dijital olabilir ama DMR ekosistemiyle beklenen şekilde çalışmayabilir.",
		"Aynı frekans neden her yerde kullanılamaz sorusunun temel sebebi spektrumun ortak ve planlı yönetilmesidir. Frekans tahsisi ülkeye, lisans sınıfına, band planına ve yerel koordinasyona göre değişir. Bir bölgede sorun çıkarmayan kullanım, başka bölgede kritik bir servise girişim oluşturabilir. Bu yüzden 'internetten gördüm, her yerde olur' yaklaşımı risklidir. Güvenli yaklaşım: yerel band planını ve resmi düzenlemeleri referans almak, özellikle röle ve ortak frekanslarda topluluk kurallarına uymaktır. Radyo özgürlüğü, kurallı kullanım disipliniyle birlikte anlam kazanır.",
	],
	18: [
		"APRS: Amatör radyo üzerinde konum, kısa mesaj ve telemetri gibi verileri paket halinde taşıyan sistemdir. Sesli sohbet için değil, veri paylaşımı için kullanılır. APRS frekansında duyulan modem benzeri sesler normaldir.",
		"BCL: `Busy Channel Lock` ifadesinin kısaltmasıdır. Kanal meşgulken PTT'nin gönderime geçmesini engeller. Amaç üst üste konuşmayı azaltmak ve ortak kanal adabını korumaktır.",
		"Beacon: Belirli aralıklarla otomatik gönderilen bilgi paketidir. APRS'te çoğunlukla konum veya durum bilgisini duyurmak için kullanılır. Çok sık beacon göndermek kanal yükünü artırabileceği için aralık ayarı dengeli yapılmalıdır.",
		"CHIRP: Çok sayıda telsiz modelinde kanal okuma/yazma için kullanılan açık kaynak programlama yazılımıdır. Toplu kanal düzenleme ve yedekleme işlemlerini kolaylaştırır. Güvenli kullanımda önce `Read`, sonra yedek, en son `Write` akışı önerilir.",
		"CTCSS: Analog haberleşmede kullanılan sürekli alt ton sistemidir. Aynı frekansta istenmeyen trafiği filtrelemek veya röle erişim kontrolü sağlamak için kullanılır. Şifreleme değildir, sadece ton bazlı bir kapı mekanizmasıdır.",
		"DCS: CTCSS'e benzer amaçla çalışan dijital kodlu filtreleme yöntemidir. Kanalı 'özel' yapmaz; yalnızca kod eşleşen trafiğin duyulmasına/erişimine yardımcı olur. Yanlış kod veya ters kod seçimi iletişimi tamamen kesebilir.",
		"DMR: `Digital Mobile Radio` standardıdır. Frekansın yanında color code, time slot ve talkgroup gibi parametrelerle çalışır. Analogdan farkı, iletişimi dijital paket yapısıyla düzenlemesidir.",
		"Duplex: Alım (`RX`) ve gönderimin (`TX`) farklı frekanslarda gerçekleştiği çalışma şeklidir. Röle kullanımının temelidir. Cihazda shift ve offset ayarları duplex mantığını oluşturur.",
		"FM: Ses bilgisini frekans değişimiyle taşıyan modülasyon türüdür. Amatör VHF/UHF ses haberleşmede en yaygın modlardan biridir. FM'de karşılıklı anlaşılabilirlik için mod ve kanal genişliği uyumu önemlidir.",
		"GPS: Cihazın uydu sinyallerinden konum hesaplamasını sağlar. APRS gibi konum tabanlı sistemlerde büyük kolaylık sunar. Kapalı alanlarda ilk kilit süresi uzayabilir; bu normaldir.",
		"Hotspot: Dijital telsiz ile internet tabanlı dijital ağlar arasında yerel köprü görevi gören küçük geçittir. Genellikle düşük güçte kişisel erişim için kullanılır. RF ayarı ve ağ ayarı birlikte doğru olmalıdır.",
		"Offset: Röle çıkış frekansı ile giriş frekansı arasındaki sayısal farktır. Değer doğru olsa bile shift yönü yanlışsa röle açılmaz. Bu yüzden offset her zaman shift ile birlikte düşünülmelidir.",
		"Repeater: Bir frekanstan aldığı sinyali başka frekanstan tekrar yayınlayan otomatik istasyondur. Amaç kapsama alanını genişletmektir. El telsiziyle zor ulaşılan noktalarda iletişimi mümkün kılar.",
		"Simplex: İki yönlü haberleşmenin aynı frekansta doğrudan yapıldığı yöntemdir. Arada röle yoktur; bu nedenle kapsama tamamen konum, engel durumu ve anten performansına bağlıdır.",
		"SQL: `Squelch` seviyesidir; cihazın gürültü eşiğini belirler. Çok düşükte sürekli hışırtı, çok yüksekte zayıf sinyal kaybı yaşanır. Genelde orta seviyeden başlanıp ortama göre ayarlanır.",
		"STE: Konuşma sonundaki kuyruk/patlama sesini azaltmaya yardımcı olan işlevdir. Özellikle bazı röle ve cihaz kombinasyonlarında dinleme konforunu artırır. Sinyal gücünü değil ses kapanış davranışını etkiler.",
		"TDR: `Dual Watch` mantığıyla iki kanal/frekansı dönüşümlü izleme özelliğidir. Çoğu elde gerçek çift alıcı değildir, hızlı geçiş yaparak dinler. Yanlış TX satırı seçimi bu modda sık görülen hatadır.",
		"UHF: Daha yüksek frekans bölgesidir; amatör kullanımda 70 cm bandını da kapsar. Şehir içi engelli ortamlarda pratikte avantaj sağlayabildiği durumlar olur. Yerel test her zaman en doğru kararı verir.",
		"VHF: Daha düşük frekans bölgesidir; amatör kullanımda 2 m bandını da kapsar. Açık alan ve kırsal koşullarda çoğu zaman etkili sonuç verebilir. Anten ve konum etkisi bu bantta da belirleyicidir.",
		"VOX: Ses algılandığında PTT'ye basmadan otomatik gönderim başlatan özelliktir. Eller serbest kullanımda pratik olabilir, ancak gürültülü ortamda istemsiz yayın açabilir. Bu nedenle hassasiyet ayarı dikkatli yapılmalıdır.",
	],
	19: [
		"1. günün hedefi cihazla arkadaş olmaktır. Tuşların ne yaptığını, VFO ile kanal modunun farkını, ekran simgelerinin ne anlattığını öğren. Bugün konuşma hedefi koyma; önce cihazı güvenli ve sakin kullanma refleksi geliştir. Gün sonunda yapman gereken kontrol: sesi aç-kapat, kanal/frekans geçişi, menüye gir-çık, batarya durumu okuma. Bu temel hakimiyet kurulmadan sonraki günlerde ayar hatası riski artar.",
		"2. gün menü mantığını oturtma günüdür. SQL, TX power, Wide/Narrow, scan, VOX, dual watch gibi temel ayarları tek tek incele ve her değişiklikten sonra kısa dinleme testi yap. Aynı anda birden fazla ayarı değiştirme; hangi ayarın ne sonuç ürettiğini anlayamazsın. Küçük bir not listesi tut: hangi ayar hangi değerdeyken cihaz daha stabil çalışıyor. Bu notlar ileride sorun giderirken en hızlı referansın olur.",
		"3. gün menüdeki İlk Kurulum sekmesine geçip simplex ayar adımlarını uygula. Amaç sadece menüde ilerlemek değil, ayarların neden o sırayla yapıldığını anlamak: frekans, mod, kanal genişliği, tone durumu, kayıt disiplini. Testi önce kısa mesafede yap; çalıştığını görünce kanalı hafızaya kaydet. Kanal adı verirken düzenli bir format kullanırsan ileride karışıklık yaşamazsın.",
		"4. gün yine İlk Kurulum sekmesinden röle ayar akışını uygula. Burada kritik olan üçlüyi kaçırma: shift yönü, offset değeri, TX tone. Röleyi duyuyor olman ayarın doğru olduğu anlamına gelmez; uplink tarafı da doğrulanmalı. Kısa kontrol çağrısı ile erişimi test et, çalışıyorsa hafızaya kaydet. Çalışmıyorsa rastgele kurcalamak yerine aynı üçlü üzerinde sistemli geri kontrol yap.",
		"5. gün anten karşılaştırma günüdür. Stok anten ile alternatif anteni aynı konum, aynı saat, aynı frekansta dene ki sonuç adil olsun. Sadece 'duydum/duymadım' değil, ses netliği, kopma oranı ve röle erişim başarısını birlikte not al. Bu günün amacı en pahalı anteni seçmek değil, senin ortamında en tutarlı çalışan anteni bulmaktır.",
		"6. gün kısa ve net çağrı pratiği yap. Çağrı verirken kimlik + amaç + kısa bekleme düzenini oturt. Uzun cümlelerle kanalı meşgul etmek yerine tek cümlede anlaşılır olmayı hedefle. Konuşma adabı açısından en kritik alışkanlık: konuşmadan önce dinleme, konuşma bitince kısa boşluk bırakma, gerekirse başkasına öncelik verme.",
		"7. gün haftayı kapatma ve sistemi kalıcılaştırma günüdür. Bir haftalık notlarını açıp en sık yaptığın 3 hatayı belirle; sonra bu hataları önleyecek kalıcı kontrol listesi yaz. Çalışan kanal profilini yedekle, tarihli dosya adıyla sakla. Böylece ileride bir ayar bozulduğunda dakikalar içinde geri dönebilir ve sıfırdan başlamak zorunda kalmazsın.",
	],
};


const enSectionFallback: Record<string, string> = {
	intro: "Learn the term first, then place it in operating context.",
	"core-concepts": "Map the concept to the radio menu label.",
	"legal-practical": "Check local authority rules first (FCC in the US, Ofcom/CEPT frameworks in Europe).",
	"radio-types": "Choose by usage environment, not only by specs.",
	"choosing-first-radio": "Prioritize usability and software support.",
	"first-power-on": "Start simple and validate basic behavior first.",
	"understanding-menus": "Change one setting at a time and validate.",
	"first-listening": "Listen first to understand channel rhythm.",
	"first-speaking": "Use short and clear call format.",
	"repeater-logic": "Validate RX/TX, offset and tone together.",
	antennas: "Compare antennas under the same conditions.",
	"programming-software": "Back up before writing changes.",
	troubleshooting: "Use fixed troubleshooting order.",
	"operating-etiquette": "Discipline matters on shared channels.",
	"advanced-intro": "Start with one stable workflow.",
	"build-projects": "Define measurable goals.",
	faq: "Most answers depend on your scenario.",
	glossary: "Match term to menu label.",
	"first-7-days": "Small daily goals improve retention.",
};

const ensureSentence = (text: string) => {
	const t = text.trim();
	if (!t) return t;
	return /[.!?]$/.test(t) ? t : `${t}.`;
};

const getTrAnswer = (subtopic: GuideSubtopic) => {
	const sectionAnswers = trAnswersBySection[subtopic.sectionNumber];
	const answer = sectionAnswers?.[subtopic.itemNumber - 1];
	if (answer) return ensureSentence(answer);
	return `${subtopic.title} için bu başlıkta doğrudan pratik ayar ve kullanım mantığını öğrenmek gerekir.`;
};

const getEnAnswer = (subtopic: GuideSubtopic) => {
	const sectionAnswers = enAnswersBySection[subtopic.sectionNumber];
	const answer = sectionAnswers?.[subtopic.itemNumber - 1];
	if (answer) return ensureSentence(answer);
	return "";
};

const defaultEnBase = (subtopic: GuideSubtopic) =>
	`${subtopic.title} is a key part of ${subtopic.sectionTitle} for operators in the US and Europe.`;

export const buildSubtopicArticle = (lang: Lang, subtopic: GuideSubtopic): SubtopicArticle => {
	const isTr = lang === "tr";
	const enAnswer = isTr ? "" : getEnAnswer(subtopic);
	const base = isTr ? getTrAnswer(subtopic) : enAnswer || defaultEnBase(subtopic);
	const sectionSources = isTr ? trSectionSources : enSectionSources;
	const defaultSource = isTr ? refsTr.iaruSpectrum : refsEn.iaruSpectrum;
	const detailed = isTr
		? base
		: enAnswer
			? ensureSentence(base)
			: `${ensureSentence(base)} ${enSectionFallback[subtopic.sectionId] ?? ""}`.trim();
	const sectionSummary = isTr
		? `${subtopic.sectionTitle} bölümünde bu başlık, sahada doğru ayar ve doğru işletim sırasını kurmak için temel taşı görevi görür.`
		: `Inside ${subtopic.sectionTitle}, this topic is a practical building block for stable setup and operation.`;
	const whyItMatters = isTr
		? [
				"Hatalı ayar zinciri nedeniyle oluşan sessizlik, parazit veya erişim sorunlarını azaltır.",
				"Sahada deneme-yanılma süresini kısaltır ve tekrarlanabilir sonuç üretir.",
				"Yerel mevzuat ve bant planına uygun, disiplinli kullanım alışkanlığı oluşturur.",
			]
		: [
				"Reduces silent failures caused by mismatched settings.",
				"Improves repeatability instead of trial-and-error operation.",
				"Supports compliant and disciplined use in shared spectrum.",
			];
	const stepByStep = isTr
		? [
				`Önce ${subtopic.fullTitle} için hedef kullanımını belirle (dinleme, simplex, röle veya dijital).`,
				"Tek bir parametreyi değiştir ve kısa bir test kaydı al.",
				"Çalışan ayarları kanal profiline kaydet, tarih ve kaynak notu ekle.",
				"Bir sorun oluşursa son çalışan profile geri dönerek farkı izole et.",
			]
		: [
				`Define your goal for ${subtopic.fullTitle} (monitoring, simplex, repeater, or digital).`,
				"Change one parameter at a time and run a short validation test.",
				"Save the working profile with date and source notes.",
				"Rollback to last known-good profile to isolate failures.",
			];
	const commonMistakes = isTr
		? [
				"Aynı anda birden fazla menü değerini değiştirip sonucu yorumlamaya çalışmak.",
				"Frekans doğru olsa da tone/offset/duplex uyumunu atlamak.",
				"Çalışan ayarları yedeklemeden yeni denemelere geçmek.",
			]
		: [
				"Changing multiple parameters at once and losing causality.",
				"Ignoring tone/offset/duplex alignment after setting frequency.",
				"Skipping backups before experiments.",
			];
	const quickCheck = isTr
		? ["Frekans", "Mod (FM/AM/Dijital)", "TX gücü", "Tone / DCS", "Shift / Offset", "Kanal kayıt adı"]
		: ["Frequency", "Mode", "TX power", "Tone / DCS", "Shift / Offset", "Saved channel label"];
	const deepDive = isTr
		? [
				detailed,
				sectionSummary,
				`${subtopic.fullTitle} özelinde iyi sonuç için ayar, test ve kayıt adımlarının aynı sırayla uygulanması gerekir.`,
			]
		: [detailed, sectionSummary, `For ${subtopic.fullTitle}, use a stable setup-test-log loop for reliable results.`];
	const realLifeExample = isTr
		? `Örnek: ${subtopic.title} ayarı sonrası iletişim kurulamadığında önce tone ve offset değerlerini doğrulayıp, ardından bir önceki çalışan kanalı geri yüklemek çoğu sorunu dakikalar içinde çözer.`
		: `Example: after changing ${subtopic.title}, validate tone/offset first, then compare against your previous known-good channel profile.`;

	return {
		title: subtopic.fullTitle,
		plainExplanation: detailed,
		deepDive,
		whyItMatters,
		stepByStep,
		realLifeExample,
		commonMistakes,
		quickCheck,
		sources: sectionSources[subtopic.sectionId] ?? [defaultSource],
	};
};
