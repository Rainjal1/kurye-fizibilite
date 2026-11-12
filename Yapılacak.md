# Yapılacak Görevler ve Sonuç Kaydı

**Kayıt tarihi / saati:** 12 Kasım 2026 Perşembe, 19:34 (Europe/Istanbul)

## 1- Görev: Sabit ve değişken gider ayrı gösterimi

**Yapılacak:** Sabit ve değişken giderler ayrı bir gösterimde, alt başlık içindeki veriler alt alta ve iki sütun halinde (kalem / tutar) gösterilsin.

**Sonuç:** Yapıldı.

- `lib/types.ts` içine kalemleri temsil eden `ExpenseItem` tipi eklendi.
- `lib/calculations.ts` sabit ve değişken giderleri ayrı hesaplar ve sonuç nesnesine kalemleri aktarır.
- `components/Calculator.tsx` içinde sabit ve değişken giderler için ayrı tablolar, toplam satırları ve iki sütunlu kalem/tutar gösterimi eklendi.

## 2- Görev: Sabit ve değişken giderlere "ekle" butonu

**Yapılacak:** Hem sabit hem de değişken giderlere "ekle" butonu eklenerek kullanıcı kendi maliyet kalemini girebilsin.

**Sonuç:** Yapıldı.

- Sabit giderler için "Sabit gider ekle" butonu eklendi.
- Değişken giderler için "Değişken gider ekle" butonu eklendi.
- Yeni kalemlerde ad, tutar ve silme işlemleri kullanılabilir.
- Yeni kalemler anında hesaplama, tablo ve toplamlara dahil edilir.

## 3- Görev: Kıyafet, çanta ve diğer ekipmanların ayrı gösterimi

**Yapılacak:** Uber başlangıç referansı alınarak kıyafet, çanta gibi ekipman ücretleri tek tek gösterilsin.

**Sonuç:** Yapıldı.

- `lib/constants.ts` içinde varsayılan ekipman listesi oluşturuldu.
- ECE onaylı kask, koruyucu eldiven, motosiklet montu, pantolonu, botu, ısı yalıtımlı sırt çantası, reflektif yelek, yağmurluk, telefon tutucu, kurye telefonu, powerbank/kablolar ve kask kamerası ayrı kalemler halinde eklendi.
- Uber Eats referansına göre ısı yalıtımlı çanta ölçüsü ve ekipman notu arayüzde gösteriliyor.
- Kullanıcı mevcut ekipman tutarlarını değiştirebilir, yeni ekipman ekleyebilir ve silebilir.

## 4- Görev: En altta 3 yıllık, değiştirilebilir grafik

**Yapılacak:** En alta grafik eklensin; y ekseni tutarı, x ekseni ayları göstersin. 3 yıllık olsun ama ay sayısı değiştirilebilsin.

**Sonuç:** Yapıldı.

- Varsayılan grafik ufku 36 ay olarak ayarlandı.
- "Grafik Ufku (ay)" ve grafik bölümündeki "Ay sayısı" alanları ile süre değiştirilebilir.
- Brüt ciro, toplam gider ve net kâr üç ayrı seri olarak gösterilir.
- Yeni bağımlılık eklenmedi; grafik erişilebilir SVG olarak implement edildi.
- Grafik noktalarında ay, ciro, gider ve net kâr bilgisi tooltip olarak görünür.

## Karşılaşılan Sorunlar

1. Geliştirme ortamında `npm`, `node` ve `npx` komutları PATH üzerinde bulunmuyor; bu nedenle `npm run build` çalıştırılamadı.
2. Proje dizininde Git deposu bulunmuyor; `git diff --check` ve `git status` doğrulaması yapılamadı.
3. PowerShell bu ortamda `SSE` vb. zorunlu işlemci komutlarını destekleyemediği için başlatılamadı; komutlar `cmd` ve Bash uyumlu `apply_patch` üzerinden yürütüldü.
4. `npm run build` alternatifi olarak TypeScript paketi ile ön derleme tanı kontrolü yapıldı. TypeScript kod tanı hataları bulunmadı; yalnızca ortam kaynaklı `incremental` yapılandırma uyarısı alındı.

## Genel Sonuç

Tüm görevler kod tarafında tamamlandı. Kullanıcı arayüzü ve hesaplama motoru aynı veri modelini kullanacak şekilde güncellendi. Üretim derlemesi, Node.js/npm PATH sorunu giderildikten sonra `npm run build` komutuyla tekrar doğrulanmalıdır.
