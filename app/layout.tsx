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
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var v=null;if(t){try{var p=JSON.parse(t);if(p==='dark'||p==='light'){v=p;}}catch(e){if(t==='dark'||t==='light'){v=t;}}}var d=v?v==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
