# Kurye Fizibilite Yol Haritası

Bu belge, ürünü küçük ve çalışabilir adımlarla geliştirmek için kullanılır. Her aşama bittiğinde bir önceki aşamanın çalışmaya devam etmesi gerekir.

## 1. Çekirdek MVP: Elle Girilen Temel Fizibilite

**Hedef:** Kullanıcı hiçbir yardımcı veri seçmeden kendi rakamlarıyla net kâr, toplam gider, geri ödeme süresi ve başabaş paket sayısını görebilsin.

### Kapsam

- Günlük paket sayısı
- Ortalama paket ücreti
- Aylık çalışma günü
- Başlangıç maliyet kalemleri
- Aylık gider kalemleri
- Temel sonuç kartları
- Varsayılanlar ve kullanıcı girdilerinin hepsinin görünür olduğu şeffaf sonuç ekranı

### Kabul Kriterleri

- Hesaplama yalnızca `lib/calculations.ts` içinde, saf fonksiyonlarla yapılır.
- Aynı girdi her zaman aynı sonucu verir.
- Negatif veya mantıksız girdiler engellenir.
- Sonuçlar TL formatında ve mobil ekranda okunabilir.
- “Bu bir tahmindir, yatırım tavsiyesi değildir” uyarısı görünür.

## 2. Vergi ve Gider Ayrıştırması

**Hedef:** Net kârın nasıl oluştuğunu kullanıcıya adım adım göster.

### Kapsam

- Brüt ciro
- İşletme giderleri
- Bağ-Kur primi
- Gelir vergisi tahmini
- Olası KDV / tevkifat notu
- Net kâr özeti

### Not

Vergi hesapları kesin mali müşavirlik tavsiyesi gibi sunulmamalı; her oran ve varsayım kullanıcıya açıkça gösterilmelidir.

## 3. Girdi Deneyimi İyileştirmesi

**Hedef:** Formun mobilde hızlı ve hatasız doldurulmasını sağlamak.

### Kapsam

- Alan bazlı doğrulama ve hata mesajları
- Varsayılanlara dön butonu
- Sayı girişlerinde temiz biçimlendirme
- Sonuç özetinin formun altında sabit ve okunabilir kalması
- Gerekirse tek sayfada daraltılabilir kartlar

## 4. Sonradan Eklenecekler: Araç ve Şehir Katmanı

Bu bölüm MVP dışıdır. `vehicleType`, `city` ve `dailyKm` alanları ileride bu katmana bağlanacaktır.

### Araç Tipi Katmanı

**Hedef:** Araç seçimine göre başlangıç maliyeti, enerji tüketimi, bakım ve günlük km varsayılanları önermek.

### Şehir Katmanı

**Hedef:** Şehre göre talep yoğunluğu, paket ücreti, trafik etkisi ve gider varsayılanları önermek.

### Uygulama İlkeleri

- Araç ve şehir seçimleri **öneri üretir**, kullanıcının özel girdilerini otomatik ezmez.
- Kullanıcı varsayılanları tek dokunuşla yükleyebilir.
- Her şehir ve araç varsayımı `lib/constants.ts` içinde merkezi olarak tutulur.
- Varsayılanların kaynağı ve güncellenme tarihi kullanıcıya gösterilir.

## 5. Kalite Güvencesi

### Kapsam

- `lib/calculations.ts` için birim testleri
- Temel UI smoke testi
- `npm run build` kontrolü
- Tip hatası ve lint kontrolü
- Sayısal sınır testleri (sıfır, negatif, çok büyük girdi)

## 6. Yayın ve Döngü

### Kapsam

- Vercel üzerinde ücretsiz yayına alma
- Temel SEO ve sosyal paylaşım meta verileri
- Kullanıcı geri bildirimi toplamak için basit bağlantı
- Varsayılan rakamları üç ayda bir gözden geçirme

## Önerilen Sıra

1. Çekirdek MVP hesaplamasını sadeleştir ve test et.
2. Vergi/gider ayrıştırmasını ekle.
3. Girdi doğrulaması ve mobil deneyimi iyileştir.
4. Araç ve şehir öneri katmanını ekle.
5. Yayın sonrası geri bildirimle varsayılanları güncelle.
