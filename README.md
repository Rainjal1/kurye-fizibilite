# Kurye Fizibilite

Kuryeliğe başlamak isteyenler için ücretsiz fizibilite hesaplama aracı.

## Proje Amacı

Kullanıcıların kurye işine başlamadan önce:
- Başlangıç maliyetlerini
- Aylık işletme giderlerini
- Tahmini brüt ve net kazançlarını
- Yatırımın geri dönüş süresini

hesaplamasını sağlayan, şeffaf ve güncel bir araç.

## Teknoloji Stack (Ücretsiz)

- **Framework**: Next.js 15 (App Router)
- **Stil**: Tailwind CSS
- **Dil**: TypeScript
- **Hosting**: Vercel (ücretsiz)
- **Hesaplamalar**: Client-side (tarayıcıda)

## Kurulum

```bash
npm install
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini açın.

## Basit HTML Prototipi

Bağımlılık kurmadan denemek için `public/calculator.html` dosyasını tarayıcıda açabilirsiniz. Next.js geliştirme sunucusu çalışırken aynı sayfa `http://localhost:3000/calculator.html` adresinde de erişilebilir.

## Klasör Yapısı

```
kurye-fizibilite/
├── app/                  # Next.js App Router
├── components/           # UI bileşenleri
├── lib/                  # Hesaplama mantığı, sabitler, tipler
├── public/               # Statik dosyalar
├── AGENTS.md             # AI agent talimatları
├── README.md
└── package.json
```

## Geliştirme Notları

- Tüm kritik hesaplamalar `lib/calculations.ts` içinde tutulur.
- Varsayılan değerler ve sabitler `lib/constants.ts` içindedir.
- Mobil öncelikli tasarım yapılır.
- Sonuçlar şeffaf olmalı (hangi varsayımlarla hesaplandığı gösterilmeli).

## Lisans

MIT
