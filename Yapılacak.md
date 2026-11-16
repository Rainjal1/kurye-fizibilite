# Yapılacak

Yeni görevleri bu dosyaya yaz. Tamamlanan görevler `TASKS.md` içindeki tabloya eklenir.

## Bekleyen Görevler

- # Yayın Hazırlığı: Sıralı Düzeltme Planı

Bu projeyi yayına hazırlayacağız. Aşağıdaki görevleri **belirtilen sırayla** uygula. Sadece en üstteki aşamayı yapıp işlemi bitir. Tamamladığın aşama sorunsuzsa olduğu gibi task.md ye al. Sonraki aşamaları farklı bir sekmede başlatacağım.

## Genel Kurallar

- Önce mevcut kodu ve proje kurallarını incele. Özellikle `AGENTS.md`, `ROADMAP.md`, `TASKS.md` ve ilgili dosyaları oku.
- Mevcut mimariyi koru. Gereksiz refactoring yapma.
- Çalışan özellikleri yeniden yazma.
- Kullanıcı tarafından girilen özel değerleri otomatik olarak ezme.
- Değişiklikleri küçük ve kontrollü tut.
- Her aşamada ilgili testleri çalıştır.
- Başarısız test varsa sonraki aşamaya geçmeden önce nedenini araştır.
- Yeni bağımlılık ekleme. Gerçekten gerekliyse önce gerekçelendir.
- Git geçmişini, kullanıcı dosyalarını veya mevcut değişiklikleri izinsiz silme.
- Görev kapsamı dışındaki iyileştirmelere girişme.
- Kod yorumları İngilizce olsun.

## AŞAMA 3: localStorage Güvenliği

Dosyalar:
- `components/Calculator.tsx`
- Gerekirse ilgili yardımcı dosyalar

Tespit edilen sorun:
localStorage erişimi exception yakalamıyor.

Yapılacaklar:

1. localStorage erişimini güvenli hale getir.
2. Storage erişilemediğinde uygulama çalışmaya devam etmeli.
3. Okuma, yazma ve JSON parse hatalarını ayrı ayrı ele al.
4. Varsayılan tema ve uygulama ayarları kullanılabilmeli.
5. SSR ve hydration davranışını bozma.
6. Gereksiz yeni state veya karmaşık abstraction oluşturma.

Testler:
- Normal localStorage
- Boş localStorage
- Bozuk JSON
- localStorage erişim hatası
- localStorage yazma hatası

## AŞAMA 4: Grafik ve Sayısal Gösterim

Dosya: `components/Calculator.tsx`

1. Başabaş ayı ham ondalık gösterilmemeli.
2. Kullanıcıya anlamlı, okunabilir bir ay değeri gösterilmeli.
3. Grafik etiketleri 320px, 375px ve masaüstü ekranlarda okunabilir olmalı.
4. 920 birimlik sabit SVG viewBox'ın küçük ekranlarda oluşturduğu ölçekleme sorununu çöz.
5. Tam ekran grafik görünümünü de düzelt.
6. Grafik verilerini veya hesaplama sonuçlarını değiştirme.

Testler:
- Mobil grafik
- Masaüstü grafik
- Tam ekran grafik
- Başabaş ayı gösterimi

## AŞAMA 5: SEO ve Sosyal Meta Bilgileri

Dosyalar:
- `app/layout.tsx`
- Gerekirse `app/robots.ts`
- Gerekirse `app/sitemap.ts`

1. metadataBase ekle.
2. Canonical URL yapılandır.
3. Open Graph metadata ekle.
4. Twitter Card metadata ekle.
5. Robots metadata ekle.
6. robots.txt ve sitemap.xml oluştur.
7. Gerçek production domain henüz bilinmiyorsa uydurma domain kullanma. Gerekirse environment variable kullan ve eksik yapılandırmayı açıkça belirt.

## AŞAMA 6: İkinci Hesaplayıcıyı Ele Al

Dosya: `public/calculator.html`

1. Dosyanın kullanım amacını ve README referanslarını incele.
2. Ana uygulamadan farklı hesaplama yapan ikinci hesaplayıcıyı tespit et.
3. Mümkünse ikinci hesaplayıcıyı kaldır.
4. Geriye dönük kullanım gerektiriyorsa ana uygulamaya yönlendir.
5. İkinci hesaplama motorunu bağımsız şekilde bırakma.
6. Duplicate content sorununu gider.

## AŞAMA 7: Node ve npm Tekrarlanabilirliği

Dosya: `package.json`

1. Projenin kullandığı Node sürümünü belirle.
2. Uygun `engines` alanı ekle.
3. Kullanılan paket yöneticisine uygun `packageManager` alanı ekle.
4. `MODULE_TYPELESS_PACKAGE_JSON` uyarısını gidermek için en küçük ve güvenli değişikliği yap.
5. Mevcut scriptleri ve bağımlılıkları gereksiz yere değiştirme.

## AŞAMA 8: Lisans

1. README'de MIT lisansı bildirildiğini doğrula.
2. Uygun MIT `LICENSE` dosyası oluştur.
3. Copyright sahibi ve yıl konusunda bilgi yoksa tahminde bulunma, kullanıcıya bildir.

## AŞAMA 9: Test Kapsamı

Dosyalar:
- `lib/calculations.test.ts`
- `lib/inputs.test.ts`
- Gerekirse yeni test dosyaları

1. Aşama 1-3'te eklenen doğrulamaların testlerini tamamla.
2. Sınır değerlerini test et.
3. Negatif, sonsuz, NaN ve aşırı büyük girdileri test et.
4. Manuel gider değerlerinin korunmasını test et.
5. localStorage hatalarını test et.
6. Mevcut testleri koru.
7. Test kapsamını gereksiz yere büyütme.

## AŞAMA 10: Git ve Dokümantasyon Temizliği

1. `git status` ve `git ls-files` sonuçlarını incele.
2. İzlenmeyen dosyaları tek tek sınıflandır.
3. `0`, `0)`, `493`, `asd.png`, `patch.tmp`, `start-local.cmd` gibi dosyaları incele.
4. Kullanıcıya ait olabilecek hiçbir dosyayı izinsiz silme.
5. `TASKS.md` ve `Görevler.md` tutarsızlığını çöz.
6. ROADMAP ve TASKS kayıtlarını gerçek uygulama durumuna göre güncelle.
7. Grafik özellikleriyle ilgili eski veya yanlış görev açıklamalarını düzelt.

## AŞAMA 11: CI ve Son Yayın Kontrolü

1. Projede CI bulunup bulunmadığını kontrol et.
2. GitHub Actions üzerinden test ve build çalıştıracak basit bir workflow oluştur.
3. Gereksiz CI adımları ekleme.
4. Production build çalıştır.
5. Bütün testleri çalıştır.
6. TypeScript ve lint kontrollerini çalıştır.
7. Git diff ve git status incele.
8. Beklenmeyen dosya değişikliklerini bildir.

## Çalışma Protokolü

Her aşama için:

- Yapılan değişiklikleri kısaca bildir.
- Değiştirilen dosyaları listele.
- Çalıştırılan testleri ve sonuçlarını bildir.
- Başarısız test varsa sebebini belirt.
- Başarılı doğrulamadan sonra sonraki aşamaya geç.

**Bir aşama başarısızsa sonraki aşamaya geçme.**

Tüm aşamalar tamamlandığında şu raporu hazırla:

1. Çözülen sorunlar
2. Değiştirilen dosyalar
3. Test sonuçları
4. Build sonucu
5. Kalan sorunlar
6. Yayına hazır olma değerlendirmesi

Önemli: Bu görev bir kod temizleme veya yeniden tasarlama çalışması değildir. Amaç, mevcut uygulamayı minimum değişiklikle güvenilir ve yayına hazır hale getirmektir.
