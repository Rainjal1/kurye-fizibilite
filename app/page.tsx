import Calculator from "@/components/Calculator";

export default function Home() {
  return (
    <main className="app-shell text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-sm font-black text-white shadow-lg shadow-blue-500/25">
              KF
            </span>
            <div>
              <p className="text-base font-bold tracking-tight">Kurye Fizibilite</p>
              <p className="text-xs font-medium text-slate-500">
                2026 Türkiye verileriyle
              </p>
            </div>
          </div>
          <span className="hidden rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 sm:inline-flex">
            Ücretsiz ve açık kaynak
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pt-12">
        <section className="glass-card soft-appear mb-8 overflow-hidden p-6 sm:p-9">
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <span className="section-badge">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Hızlı fizibilite hesabı
              </span>
              <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
                Kuryeliğe başlamadan
                <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  gerçekçi bir bütçe
                </span>{" "}
                çıkar
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Paket sayısından Bağ-Kur primine kadar tüm kalemleri düzenle;
                aylık net kârını, başabaş noktanı ve geri ödeme süreni anında gör.
              </p>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-orange-50 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600 text-lg text-white shadow-lg shadow-blue-500/25">
                  ₺
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Şeffaf hesaplama</p>
                  <p className="text-xs text-slate-500">Her varsayım görünür ve düzenlenebilir</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/80 p-3">
                  <p className="text-xs font-semibold text-slate-500">Anlık sonuç</p>
                  <p className="mt-1 text-sm font-bold text-blue-700">Yükleme yok</p>
                </div>
                <div className="rounded-xl bg-white/80 p-3">
                  <p className="text-xs font-semibold text-slate-500">Mobil uyumlu</p>
                  <p className="mt-1 text-sm font-bold text-orange-600">Tek elle kullan</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Calculator />

        <footer className="glass-card mt-10 p-5 text-center text-xs leading-relaxed text-slate-500 sm:p-6">
          <p>
            Bu araç yalnızca bilgilendirme amaçlıdır. Yatırım tavsiyesi değildir.
            Rakamlar tahmindir ve kişiden kişiye değişir.
          </p>
          <p className="mt-2 font-semibold text-slate-600">
            Açık kaynak • MIT Lisans • Kasım 2026 varsayılanları
          </p>
        </footer>
      </div>
    </main>
  );
}
