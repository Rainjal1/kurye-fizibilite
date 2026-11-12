import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kurye Fizibilite | Kuryeliğe Başlamadan Önce Hesapla",
  description:
    "Kuryeliğe başlamak isteyenler için ücretsiz fizibilite hesaplama aracı. Başlangıç maliyeti, net kâr ve geri ödeme süresini hemen öğrenin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
