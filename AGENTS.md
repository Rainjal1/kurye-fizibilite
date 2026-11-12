# AGENTS.md — Kurye Fizibilite Projesi

Bu dosya, projede çalışan AI coding agent'ları (Codex, Cursor, Claude, vb.) için talimatları içerir.

## Proje Özeti

Türkiye'de kuryeliğe (motokurye, scooter, araçlı kurye) başlamak isteyenler için **fizibilite hesaplama aracı**.

Kullanıcı şunları girer:
- Günlük ortalama paket / km
- Çalışma günü sayısı
- Başlangıç maliyetleri (veya varsayılanlar)
- Aylık gider kalemleri

Araç tipi ve şehir seçimi MVP'de hesaplamayı etkilemez. Bu alanlar yalnızca ileride eklenecek öneri katmanı için hazırlanır; ilgili plan `ROADMAP.md` içinde tutulur.

Araç şunları hesaplar:
- Aylık brüt ciro
- Aylık toplam gider
- Net kâr
- Geri ödeme süresi (ay)
- Başabaş noktası

## Temel Prensipler

1. **Şeffaflık**: Her varsayım görünür olmalı. Kullanıcı hangi rakamla hesaplandığını bilmeli.
2. **Mobil öncelik**: Çoğu kullanıcı telefonda kullanacak.
3. **Ücretsiz çekirdek**: Temel hesaplama her zaman ücretsiz ve açık kaynak kalacak.
4. **Gerçekçi varsayımlar**: Aşırı iyimser rakamlar kullanma. 2026 Türkiye gerçeklerine yakın ol.
5. **Güncellenebilirlik**: Sabitler (`lib/constants.ts`) kolayca güncellenebilir olmalı.

## Teknoloji Kuralları

- Next.js 15 App Router kullan.
- TypeScript zorunlu.
- Tailwind CSS ile stil ver.
- Hesaplama mantığını UI'dan ayır (`lib/` klasörü).
- Client component'lerde `"use client"` kullan.
- Gereksiz bağımlılık ekleme.
- Türkçe arayüz (değişken isimleri İngilizce olabilir, UI metinleri Türkçe).

## Dosya Sorumlulukları

| Dosya / Klasör              | Sorumluluk                                      |
|----------------------------|-------------------------------------------------|
| `lib/types.ts`             | Tüm TypeScript tipleri                          |
| `lib/constants.ts`         | Varsayılan değerler, yakıt tüketimi, Bağ-Kur vb.|
| `lib/calculations.ts`      | Saf hesaplama fonksiyonları                     |
| `components/Calculator.tsx`| Ana form + sonuç bileşeni                       |
| `app/page.tsx`             | Ana sayfa                                       |
| `app/layout.tsx`           | Root layout                                     |

## Hesaplama Mantığı Kuralları

- Tüm fonksiyonlar **saf** (pure) olmalı. Aynı girdi → aynı çıktı.
- Para birimi her zaman TL.
- Sonuçlarda KDV, Bağ-Kur, gelir vergisi gibi kalemler mümkün olduğunca ayrıştırılsın.
- Kullanıcı özel değer girebilmeli (varsayılanları override edebilmeli).
- MVP'de araç tipi, şehir ve `dailyKm` hesaplama sonucunu değiştirmez. Bu alanlar için varsayılan öneri mantığı eklemeden önce `ROADMAP.md`'deki 4. aşama uygulanır.

## UI / UX Kuralları

- Form adım adım veya tek sayfada net gruplar halinde olsun.
- Sonuçlar büyük ve okunaklı gösterilsin (Net Kâr en belirgin).
- "Bu bir tahmindir, yatırım tavsiyesi değildir" uyarısı her zaman görünsün.
- Loading state'e gerek yok (hesaplamalar anlık).

## Yapılmaması Gerekenler

- Backend / veritabanı ekleme (MVP aşamasında).
- Kullanıcı kaydı / authentication.
- Aşırı karmaşık state management (Zustand, Redux vb. ekleme).
- İngilizce UI metinleri.
- Gerçekçi olmayan varsayılan değerler kullanma.

## Monetizasyon Notu (Agent'lar için)

Kod açık kaynak kalacak. Monetizasyon hosted versiyon üzerinden (reklam + affiliate) yapılacak. Bu yüzden:
- Hesaplama motorunu temiz ve taşınabilir tut.
- UI tarafında affiliate veya reklam alanları için yer bırakılabilir (ama şimdilik ekleme).

## Dil

- Kod yorumları ve değişken isimleri: İngilizce
- Kullanıcıya görünen tüm metinler: Türkçe
