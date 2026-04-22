import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";

const pages = [
  ["", "SDR / Dinleme ve RF Keşfi", "SDR öğrenme sürecini başlangıçtan ileri seviyeye kadar adım adım yöneten kapsamlı merkez."],
  ["nedir", "SDR Nedir?", "SDR mantığını, klasik alıcılardan farkını ve gerçek kullanım değerini sade dille öğrenin."],
  ["yeni-baslayan-icin", "Yeni Başlayan İçin SDR Yol Haritası", "Sıfırdan başlayan kullanıcı için kurulumdan ilk başarılı dinlemeye giden net akış."],
  ["hangi-sdr-cihazi-alinmali", "Hangi SDR Cihazı Alınmalı?", "Bütçe ve hedefe göre doğru SDR cihazını seçmek için karar çerçevesi."],
  ["ilk-30-dakika", "İlk 30 Dakikada SDR Kurulumu", "Cihaz bağlantısı, yazılım kurulumu ve ilk test dinlemesini hızlıca tamamlayın."],
  ["minimum-donanim-checklisti", "SDR İçin Minimum Donanım Checklisti", "Başlangıç için gerçekten gerekli donanımı gereksiz masraf yapmadan belirleyin."],
  ["kurulumda-15-yaygin-hata", "SDR Kurulumunda 15 Yaygın Hata", "Başlangıçta zaman kaybettiren tipik hataları ve pratik çözümlerini görün."],
  ["7-gunluk-sdr-ogrenme-plani", "7 Günlük SDR Öğrenme Planı", "Bir haftada temel SDR becerisi kazanmak için günlük net hedef planı."],

  ["cihazlar", "SDR Cihazları", "RTL-SDR, Airspy, SDRplay ve diğer cihaz sınıfları için kullanım odaklı rehber."],
  ["cihazlar/rtl-sdr", "RTL-SDR Rehberi", "RTL-SDR ile doğru başlangıç yapmak için güçlü ve zayıf yönler."],
  ["cihazlar/rtl-sdr-v3-v4-farklari", "RTL-SDR v3 ve v4 Farkları", "v3 ve v4 donanım farklarının sahadaki etkisini karşılaştırmalı öğrenin."],
  ["cihazlar/airspy-sdrplay-hackrf-karsilastirma", "Airspy, SDRplay, HackRF Karşılaştırması", "Orta ve ileri kullanıcılar için üç popüler SDR platformunu kıyaslayın."],
  ["cihazlar/cihaz-secim-tablosu", "SDR Cihaz Seçim Tablosu", "Kullanım senaryosuna göre cihaz kararını hızlandıran pratik tablo."],
  ["cihazlar/hf-icin-sdr-secimi", "HF Dinleme İçin SDR Seçimi", "HF odaklı kullanımda cihaz seçerken kritik teknik noktalar."],

  ["yazilimlar", "SDR Yazılımları", "SDR#, SDR++, HDSDR, GQRX ve kullanım profillerine göre seçim rehberi."],
  ["yazilimlar/sdrsharp", "SDR# (SDRSharp) Kurulum ve Kullanım", "Windows için SDR# kurulumundan ilk dinlemeye kadar adım adım rehber."],
  ["yazilimlar/sdr-plus-plus", "SDR++ Kurulum ve Kullanım", "Modern arayüzlü SDR++ ile temiz ve stabil bir başlangıç akışı."],
  ["yazilimlar/hdsdr", "HDSDR Başlangıç Rehberi", "HDSDR ile temel ayarlar, bant seçimi ve pratik dinleme adımları."],
  ["yazilimlar/gqrx", "GQRX Başlangıç Rehberi", "Linux ve çok platform kullanıcıları için GQRX kurulum ve kullanım notları."],
  ["yazilimlar/sdr-yazilim-karsilastirma", "SDR Yazılım Karşılaştırması", "Hangi yazılımın hangi kullanıcı profiline daha uygun olduğunu netleştirin."],

  ["ne-dinlenir", "SDR ile Ne Dinlenir?", "FM, hava bandı, ADS-B, NOAA, AIS ve HF dinleme alanlarına giriş."],
  ["ne-dinlenir/fm-radyo", "SDR ile FM Radyo Dinleme", "İlk başarılı sonuç için FM bandında doğru ayarla hızlı dinleme."],
  ["ne-dinlenir/hava-bandi", "SDR ile Hava Bandı Dinleme", "AM modülasyon ve hava bandı trafiği için doğru başlangıç yöntemleri."],
  ["ne-dinlenir/amator-telsiz-dinleme", "SDR ile Amatör Telsiz Dinleme", "Amatör bantlarda dinleme disiplinini ve frekans yaklaşımını öğrenin."],
  ["ne-dinlenir/noaa", "SDR ile NOAA Dinleme", "NOAA APT sinyali alma ve görüntü sürecine hazırlık adımları."],
  ["ne-dinlenir/ads-b", "SDR ile ADS-B Uçak Takibi", "1090 MHz odaklı ADS-B alımı ve temel performans optimizasyonu."],
  ["ne-dinlenir/ais", "SDR ile AIS Gemi Takibi", "AIS alımı için frekans, anten ve yazılım tarafını birlikte planlayın."],
  ["ne-dinlenir/hf-dinleme", "SDR ile HF Dinleme", "HF dinlemede gürültü yönetimi, anten ve beklenti planı."],

  ["antenler", "SDR Antenleri", "SDR performansını belirleyen anten türleri ve kurulum kriterleri."],
  ["antenler/sdr-icin-anten-temelleri", "SDR İçin Anten Temelleri", "Anten tipi, konum ve kablo kaybı etkilerini birlikte değerlendirin."],
  ["antenler/discone", "Discone Anten Rehberi", "Geniş bant dinleme için discone antenin artılarını ve sınırlarını öğrenin."],
  ["antenler/dipol", "Dipol Anten Rehberi", "Dipol ile maliyet etkin ve hedef frekans odaklı dinleme kurulumu."],
  ["antenler/noaa-antenleri", "NOAA Antenleri", "NOAA için QFH, turnstile ve pratik alternatiflerin karşılaştırması."],
  ["antenler/adsb-antenleri", "ADS-B 1090 MHz Antenleri", "ADS-B menzilini artırmak için anten tarafında kritik seçimler."],
  ["antenler/anten-kurulum-hatalari", "Anten Kurulumunda Sık Hatalar", "Kurulum hatalarının sinyal kalitesine etkisini hızlıca teşhis edin."],

  ["ayarlar", "SDR Ayarları", "Gain, AGC, PPM ve spektrum okuma temellerini tek merkezde toplayın."],
  ["ayarlar/gain-agc-ppm-waterfall", "Gain, AGC, PPM, Waterfall ve Spectrum", "Temel SDR ayarlarını doğru sırada optimize etme rehberi."],
  ["ayarlar/ornekleme-ve-bant-genisligi", "Örnekleme Hızı ve Bant Genişliği", "Örnekleme ve filtre ayarlarının sinyal kalitesine etkisi."],
  ["ayarlar/snr-dbfs-dinamik-aralik", "SNR, dBFS ve Dinamik Aralık", "Sinyal değerlendirmede kritik ölçümleri doğru yorumlama rehberi."],
  ["ayarlar/modulasyon-secimi", "SDR'de Modülasyon Seçimi", "FM, NFM, AM, USB, LSB seçiminde pratik karar yöntemi."],

  ["lna-filtre", "LNA ve Filtre", "RF zincirinde LNA ve filtre kullanımını doğru konumlandırma rehberi."],
  ["lna-filtre/lna-ne-zaman-gerekli", "LNA Ne Zaman Gerekli?", "LNA kullanımının fayda ve risk dengesini gerçek senaryolarla öğrenin."],
  ["lna-filtre/filtre-kullanimi", "SDR'de Filtre Kullanımı", "Band-pass ve notch filtreleri doğru yerde kullanma yaklaşımı."],
  ["lna-filtre/fm-overload-cozumu", "FM Overload Sorunu Çözümü", "Güçlü FM yayınlarından kaynaklanan baskı ve taşmaları azaltma adımları."],
  ["lna-filtre/rf-zinciri-planlama", "RF Zinciri Planlama", "Anten, kablo, filtre, LNA ve SDR sıralamasını doğru kurun."],

  ["uygulamalar", "SDR Uygulamalı Rehberler", "Gerçek kullanım senaryoları ile SDR becerisini pratikte geliştirin."],
  ["uygulamalar/ilk-fm-istasyonu", "İlk FM İstasyonunu Bulma", "Yeni başlayanlar için ilk istasyonu yakalama ve ses doğrulama adımları."],
  ["uygulamalar/adsb-kurulum", "ADS-B Kurulum Rehberi", "Cihaz, anten ve yazılım tarafını birleştirerek ilk ADS-B verisini alın."],
  ["uygulamalar/noaa-goruntu-alma", "NOAA Görüntüsü Alma Rehberi", "NOAA sinyalini kaydedip görüntüye dönüştürme sürecini adım adım uygulayın."],
  ["uygulamalar/hava-bandi-tarama", "Hava Bandı Tarama Rehberi", "Hava bandında stabil dinleme için tarama ve kanal yaklaşımı."],
  ["uygulamalar/evde-rf-kesif-gunlugu", "Evde RF Keşif Günlüğü", "Düzenli log tutarak RF keşfini ölçülebilir bir öğrenme sürecine çevirin."],

  ["sorun-giderme", "SDR Sorun Giderme", "Belirtiye göre hızlı teşhis ve adım adım çözüm merkezi."],
  ["sorun-giderme/sinyal-var-ses-yok", "Sinyal Var Ama Ses Yok", "Modülasyon ve ses zinciri kaynaklı bu sık sorunu sistemli çözün."],
  ["sorun-giderme/cihaz-gorunmuyor", "SDR Cihaz Görünmüyor", "Driver, USB ve yazılım katmanında görünmeme sorununu giderin."],
  ["sorun-giderme/ppm-kaymasi", "Frekans Kayması (PPM)", "Frekans kaymasının nedenini bulup kalibrasyonu doğru şekilde uygulayın."],
  ["sorun-giderme/gurultu-yuksek", "Gürültü Yüksek Sorunu", "Yüksek gürültü tabanını düşürmek için adım adım saha kontrol listesi."],
  ["sorun-giderme/adsb-paket-yok", "ADS-B Paket Gelmiyor", "ADS-B'de veri görünmeme sorununu antenden yazılıma kadar analiz edin."],
  ["sorun-giderme/noaa-decode-bozuk", "NOAA Decode Bozuk Çıkıyor", "NOAA görüntü bozulmalarını sinyal ve decode adımı bazında düzeltin."],

  ["yasal-ve-etik", "SDR Yasal ve Etik Sınırlar", "SDR dinleme sürecinde yasal çerçeve ve etik sınırları netleştirin."],
  ["yasal-ve-etik/turkiye-yasal-sinirlar", "Türkiye'de SDR Dinleme Yasal Sınırlar", "Türkiye özelinde SDR kullanımında dikkat edilmesi gereken hukuki çerçeve."],
  ["yasal-ve-etik/etik-ilkeler", "SDR Etik İlkeleri", "Dinleme, kayıt ve paylaşım süreçlerinde güvenli etik yaklaşımı öğrenin."],

  ["sozluk", "SDR Sözlüğü", "Sık kullanılan SDR terimlerini kısa, net ve uygulama odaklı öğrenin."],
  ["sozluk/ppm", "PPM Nedir?", "PPM kavramını SDR frekans doğruluğu açısından pratik olarak anlayın."],
  ["sozluk/agc", "AGC Nedir?", "AGC'nin alıcı davranışını nasıl etkilediğini sahadan örneklerle öğrenin."],
  ["sozluk/if", "IF Nedir?", "Ara frekans kavramının SDR akışındaki yerini sade biçimde kavrayın."],
  ["sozluk/iq", "IQ Nedir?", "IQ örnekleme mantığını SDR sinyal işleme açısından temel düzeyde öğrenin."],
  ["sozluk/decimation", "Decimation Nedir?", "Decimation ayarının performans ve görünür bant üzerindeki etkisini öğrenin."],
  ["sozluk/squelch", "Squelch Nedir?", "Squelch ayarını gürültü yönetimi için doğru kullanım yaklaşımıyla uygulayın."],

  ["araclar", "SDR Araçları", "PPM, NOAA ve ADS-B odaklı yardımcı araçların kullanım rehberi."],
  ["araclar/ppm-kalibrasyon-araci", "PPM Kalibrasyon Aracı", "PPM aracını doğru referansla kullanıp kararlı sonuç alın."],
  ["araclar/noaa-gecis-planlayici", "NOAA Geçiş Planlayıcı", "NOAA geçiş saatlerini doğru yorumlayarak verimli kayıt alın."],
  ["araclar/adsb-menzil-analizi", "ADS-B Menzil Analizi", "ADS-B kapsamayı yorumlamak ve iyileştirmek için menzil analiz yaklaşımı."],

  ["amatore-gecis-koprusu", "SDR'den Amatöre Geçiş", "Dinleme pratiğini amatör telsiz lisans ve işletme sürecine bağlayan köprü."],
  ["amatore-gecis-koprusu/sdrden-amatore-gecis", "SDR'den Amatör Telsizciliğe Geçiş", "SDR ile edinilen becerileri amatör telsiz pratiğine taşıma planı."],
  ["amatore-gecis-koprusu/lisansa-gecis-yolu", "Lisansa Geçiş Yolu", "Dinleme odaklı kullanıcı için lisans sürecine geçiş adımları."],
  ["amatore-gecis-koprusu/dinlenen-banddan-pratige", "Dinlenen Banddan Pratiğe", "Dinleme bilgisini çağrı disiplini ve pratik haberleşmeye dönüştürme rehberi."],
];

const labelMap = new Map(pages.map(([path, title]) => [path, title]));

const findParent = (path) => {
  if (!path.includes("/")) return "";
  return path.split("/").slice(0, -1).join("/");
};

const pathToUrl = (path) => (path ? `/sdr/${path}` : "/sdr");

const toLabel = (path) => labelMap.get(path) ?? path;

const relatedFor = (idx) => {
  const [path] = pages[idx];
  const parent = findParent(path);
  const samePrefix = pages.filter(([p]) => findParent(p) === parent && p !== path);
  const sibling = samePrefix.length ? samePrefix[idx % samePrefix.length][0] : "yeni-baslayan-icin";
  const next = pages[(idx + 1) % pages.length][0];
  const set = ["", parent, sibling, next, "sorun-giderme"].filter((p, i, arr) => p !== path && arr.indexOf(p) === i);
  return set.slice(0, 5);
};

const sanitize = (s) => s.replace(/`/g, "");

const makeContent = (path, title, description, relatedPaths) => {
  const section1 = `${title} konusunda doğru başlangıç, hedefi net belirlemekle başlar. Bu sayfada sadece kavramsal tanım vermekle kalmıyor, sahada gerçekten iş yapan bir uygulama düzeni de kuruyoruz. Özellikle yeni başlayan kullanıcılar için hangi ayarı neden yaptığını bilmek, rastgele deneme süresini ciddi şekilde azaltır.`;
  const section2 = `Uygulama adımlarını küçük ve ölçülebilir parçalara bölmek en güvenli yöntemdir. Her değişiklikten sonra waterfall görünümü, ses temizliği veya paket alma oranı gibi gözlenebilir bir çıktı üzerinden doğrulama yapılmalıdır. Bu yaklaşım, hatalı ayarı erken yakalamanızı sağlar.`;
  const section3 = `Performans tarafında tek bir metriğe odaklanmak yerine bütün zinciri değerlendirmek gerekir: anten konumu, giriş seviyesi, yazılım ayarı ve çevresel gürültü birlikte sonucu belirler. Bu nedenle sayfanın sonunda verdiğimiz ilgili bağlantılar, bir sonraki doğru adımı seçmenizi hızlandırır.`;

  const sourceList = path.startsWith("yasal-ve-etik/")
    ? [
        "BTK ve ilgili mevzuat metinleri [Kaynak kontrolü gerekir]",
        "Resmi kurum duyuruları ve yayınları [Kaynak kontrolü gerekir]",
        "Yerel düzenleyici çerçeveye dair uzman hukuk değerlendirmeleri [Kaynak kontrolü gerekir]",
      ]
    : [
        "Resmi yazılım ve donanım dokümantasyonları",
        "Üretici teknik notları ve sürüm kayıtları",
        "Saha testleri ve pratik kullanım notları",
      ];

  const faqThird = path.startsWith("yasal-ve-etik/")
    ? "Yasal yorumlar neden kesin hüküm gibi verilmemeli?"
    : "Aynı konu farklı cihazlarda neden farklı davranır?";
  const faqThirdAnswer = path.startsWith("yasal-ve-etik/")
    ? "Mevzuat yorumu bağlama göre değişebilir. Bu yüzden kesin hukuki iddialarda resmi metin ve uzman görüşü kontrolü gerekir."
    : "Donanım mimarisi, tuner kalitesi, yazılım sürümü ve ortam gürültüsü farklı olduğu için sonuçlar cihazdan cihaza değişebilir.";

  return {
    what: [
      `${title} için temel çerçeve`,
      "Uygulama adımları ve kontrol noktaları",
      "Sık yapılan hatalar ve önleme yöntemi",
      "İç linklerle bir sonraki öğrenme adımı",
    ],
    sections: [
      ["Temel Çerçeve", section1],
      ["Uygulama Adımları", section2],
      ["Performans ve Doğrulama", section3],
    ],
    mistakes: [
      "Tek bir ayarı değiştirip diğer parametreleri sabit tutmamak",
      "Sonucu ölçmeden ayarı kalıcı kabul etmek",
      "Anten ve çevresel gürültü etkisini göz ardı etmek",
      "Sorun durumunda sistematik teşhis yerine rastgele deneme yapmak",
    ],
    quick: [
      "Önce donanım bağlantısını doğrula.",
      "Ayar değişikliklerini küçük adımlarla yap.",
      "Her adımı gözlenebilir çıktı ile kontrol et.",
      "Takıldığında ilgili sorun giderme sayfasına geç.",
    ],
    sources: sourceList,
    faq: [
      ["Bu sayfadan en hızlı nasıl fayda alırım?", "Önce 'Bu sayfada ne var' bölümünü okuyup ardından uygulama adımlarını sırasıyla test edin."],
      ["Yeni başlayan biri için kritik hata nedir?", "Ayarlara hızlıca yüklenip temel doğrulama adımlarını atlamak en yaygın hatadır."],
      [faqThird, faqThirdAnswer],
    ],
    related: relatedPaths.map((p) => ({ href: pathToUrl(p), label: p === "" ? "SDR Ana Sayfa" : toLabel(p) })),
  };
};

const renderPage = (path, title, description, idx) => {
  const depth = path ? path.split("/").length : 0;
  const up = "../".repeat(depth + 2);
  const relatedPaths = relatedFor(idx);
  const c = makeContent(path, title, description, relatedPaths);
  const route = pathToUrl(path);
  const canonical = route;
  const breadcrumb = path ? path.split("/").join(" / ") : "ana";

  const list = (arr) => arr.map((x) => `\t\t\t\t<li>${sanitize(x)}</li>`).join("\n");
  const relatedList = c.related
    .map((x) => `\t\t\t\t<li><a href="${x.href}">${sanitize(x.label)}</a></li>`)
    .join("\n");
  const sectionBlocks = c.sections
    .map(([h, p]) => `\t\t\t<h3>${sanitize(h)}</h3>\n\t\t\t<p>${sanitize(p)}</p>`)
    .join("\n\n");
  const faqBlocks = c.faq
    .map(([q, a]) => `\t\t\t\t<article class="card">\n\t\t\t\t\t<h3>${sanitize(q)}</h3>\n\t\t\t\t\t<p>${sanitize(a)}</p>\n\t\t\t\t</article>`)
    .join("\n");

  return `---
import Layout from "${up}layouts/Layout.astro";
import SiteNav from "${up}components/SiteNav.astro";
import SiteFooter from "${up}components/SiteFooter.astro";
import "${up}styles/site.css";
---

<Layout lang="tr" title="${sanitize(title)} | RadioHam" description="${sanitize(description)}" canonical="${canonical}">
	<SiteNav lang="tr" current="sdr" />

	<section class="page-hero">
		<div class="container">
			<nav class="crumb">Ana Sayfa / SDR / ${sanitize(breadcrumb)}</nav>
			<h1>${sanitize(title)}</h1>
			<p>${sanitize(description)}</p>
		</div>
	</section>

	<section class="section">
		<div class="container sdr-layout">
			<article class="outline-section">
				<p class="sdr-intro">${sanitize(description)} Bu içerik, teknik doğruluk ile sade anlatımı birlikte tutarak yayınlanabilir seviyede pratik bir rehber sunar.</p>

				<h2>Bu Sayfada Ne Var?</h2>
				<ul>
${list(c.what)}
				</ul>

				<h2>Ana Başlıklar</h2>
${sectionBlocks}

				<h2>Sık Yapılan Hatalar</h2>
				<ul>
${list(c.mistakes)}
				</ul>

				<h2>Kaynaklar</h2>
				<ul>
${list(c.sources)}
				</ul>
			</article>

			<aside class="toc-box sdr-side">
				<h3>Hızlı Özet</h3>
				<ul>
${list(c.quick)}
				</ul>

				<h3>İlgili Bağlantılar</h3>
				<ul>
${relatedList}
				</ul>
			</aside>
		</div>
	</section>

	<section class="section muted">
		<div class="container cards">
${faqBlocks}
		</div>
	</section>

	<SiteFooter lang="tr" />
</Layout>

<style>
	.crumb { margin: 0 0 10px; font: 600 13px/1.3 "Barlow", sans-serif; color: #c7def8; }
	.sdr-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; }
	.sdr-intro { color: #3d5a7b; line-height: 1.75; margin: 0 0 14px; }
	.outline-section h2 { margin: 16px 0 8px; font: 700 22px/1.2 "Exo 2", sans-serif; color: #11406f; }
	.outline-section h3 { margin: 12px 0 6px; font: 700 18px/1.2 "Exo 2", sans-serif; color: #1d4f82; }
	.outline-section p { margin: 0 0 10px; color: #3f5d7e; line-height: 1.7; }
	.outline-section ul, .sdr-side ul { margin: 0; padding-left: 18px; display: grid; gap: 7px; }
	.sdr-side a { color: #145ea9; text-decoration: none; border-bottom: 1px dotted #91b8e2; }
	.cards h3 { margin: 0 0 8px; }
	.cards p { margin: 0; }
	@media (max-width: 980px) { .sdr-layout { grid-template-columns: 1fr; } }
</style>
`;
};

for (let i = 0; i < pages.length; i += 1) {
  const [path, title, description] = pages[i];
  const fullPath = path ? join("src/pages/sdr", path, "index.astro") : join("src/pages/sdr", "index.astro");
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, renderPage(path, title, description, i), "utf8");
}

const routes = pages.map(([path]) => pathToUrl(path));
const routesTs = `export const sdrRoutes: string[] = ${JSON.stringify(routes, null, 2)};\n`;
writeFileSync("src/data/sdr-routes.ts", routesTs, "utf8");

rmSync("src/pages/sdr/[...slug].astro", { force: true });
rmSync("src/data/sdr.ts", { force: true });

console.log(`Generated ${pages.length} SDR pages.`);
