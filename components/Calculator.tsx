"use client";

import { useMemo, useState } from "react";
import { CalculatorInputs, ExpenseItem, ProjectionPoint } from "@/lib/types";
import { DEFAULT_INPUTS } from "@/lib/constants";
import { calculateFeasibility, formatTRY } from "@/lib/calculations";

type ExpenseListKey =
  | "equipmentItems"
  | "customFixedExpenses"
  | "customVariableExpenses";

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const result = useMemo(() => calculateFeasibility(inputs), [inputs]);

  function update<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function updateExpenseItem(
    listKey: ExpenseListKey,
    id: string,
    changes: Partial<Pick<ExpenseItem, "label" | "amount">>
  ) {
    setInputs((prev) => ({
      ...prev,
      [listKey]: prev[listKey].map((item) =>
        item.id === id ? { ...item, ...changes } : item
      ),
    }));
  }

  function addExpenseItem(listKey: ExpenseListKey) {
    const prefix =
      listKey === "customFixedExpenses"
        ? "sabit"
        : listKey === "customVariableExpenses"
          ? "degisken"
          : "ekipman";
    const newItem: ExpenseItem = {
      id: `${prefix}-${Date.now()}`,
      label: "",
      amount: 0,
    };

    setInputs((prev) => ({ ...prev, [listKey]: [...prev[listKey], newItem] }));
  }

  function removeExpenseItem(listKey: ExpenseListKey, id: string) {
    setInputs((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((item) => item.id !== id),
    }));
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section className="glass-card soft-appear p-5 sm:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="section-badge">1. Adım</span>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Hesaplama Bilgileri
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Tüm değerleri kendi senaryona göre güncelleyebilirsin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setInputs(DEFAULT_INPUTS)}
              className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-200"
            >
              Varsayılana dön
            </button>
          </div>

          <div className="space-y-7">
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-800">
                Çalışma Parametreleri
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Günlük Paket"
                  value={inputs.dailyPackages}
                  onChange={(value) => update("dailyPackages", value)}
                />
                <NumberField
                  label="Ortalama Paket Ücreti (₺)"
                  value={inputs.averagePackagePrice}
                  onChange={(value) => update("averagePackagePrice", value)}
                />
                <NumberField
                  label="Aylık Çalışma Günü"
                  value={inputs.workingDaysPerMonth}
                  onChange={(value) => update("workingDaysPerMonth", value)}
                />
                <NumberField
                  label="Grafik Ufku (ay)"
                  value={inputs.projectionMonths}
                  onChange={(value) => update("projectionMonths", value)}
                />
              </div>
            </div>

            <div>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-wide text-blue-800">
                  Ekipman Listesi
                </h3>
                <button
                  type="button"
                  onClick={() => addExpenseItem("equipmentItems")}
                  className="small-action-button"
                >
                  Ekle
                </button>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-slate-500">
                Uber Eats, Uber Moto ve Türkiye motosiklet güvenlik gereksinimleri
                referans alınmıştır. Isı yalıtımlı çanta en az 44x35x40 cm olmalıdır.
              </p>
              <div className="space-y-3">
                {inputs.equipmentItems.map((item) => (
                  <ExpenseEditor
                    key={item.id}
                    item={item}
                    onChange={(changes) =>
                      updateExpenseItem("equipmentItems", item.id, changes)
                    }
                    onRemove={() => removeExpenseItem("equipmentItems", item.id)}
                  />
                ))}
              </div>
              <div className="expense-total">
                <span>Ekipman toplamı</span>
                <span>{formatTRY(result.equipmentCost)}</span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-800">
                Başlangıç Maliyetleri
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Araç Maliyeti (₺)"
                  value={inputs.vehicleCost}
                  onChange={(value) => update("vehicleCost", value)}
                />
                <NumberField
                  label="Belgeler (SRC, psikoteknik...)"
                  value={inputs.licenseAndDocsCost}
                  onChange={(value) => update("licenseAndDocsCost", value)}
                />
                <NumberField
                  label="Şirket Kuruluşu"
                  value={inputs.companySetupCost}
                  onChange={(value) => update("companySetupCost", value)}
                />
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-800">
                Aylık Sabit Giderler
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Sigorta"
                  value={inputs.insuranceMonthly}
                  onChange={(value) => update("insuranceMonthly", value)}
                />
                <NumberField
                  label="Bağ-Kur Primi"
                  value={inputs.bagkurMonthly}
                  onChange={(value) => update("bagkurMonthly", value)}
                />
                <NumberField
                  label="Muhasebe"
                  value={inputs.accountingMonthly}
                  onChange={(value) => update("accountingMonthly", value)}
                />
                <NumberField
                  label="Telefon / İnternet"
                  value={inputs.phoneInternetMonthly}
                  onChange={(value) => update("phoneInternetMonthly", value)}
                />
                <NumberField
                  label="Diğer"
                  value={inputs.otherMonthly}
                  onChange={(value) => update("otherMonthly", value)}
                />
              </div>
              <div className="mt-4 space-y-3">
                {inputs.customFixedExpenses.map((item) => (
                  <ExpenseEditor
                    key={item.id}
                    item={item}
                    onChange={(changes) =>
                      updateExpenseItem("customFixedExpenses", item.id, changes)
                    }
                    onRemove={() =>
                      removeExpenseItem("customFixedExpenses", item.id)
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addExpenseItem("customFixedExpenses")}
                className="small-action-button mt-4"
              >
                Sabit gider ekle
              </button>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-blue-800">
                Aylık Değişken Giderler
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Yakıt / Elektrik"
                  value={inputs.fuelOrElectricityMonthly}
                  onChange={(value) => update("fuelOrElectricityMonthly", value)}
                />
                <NumberField
                  label="Bakım ve Lastik"
                  value={inputs.maintenanceMonthly}
                  onChange={(value) => update("maintenanceMonthly", value)}
                />
              </div>
              <div className="mt-4 space-y-3">
                {inputs.customVariableExpenses.map((item) => (
                  <ExpenseEditor
                    key={item.id}
                    item={item}
                    onChange={(changes) =>
                      updateExpenseItem("customVariableExpenses", item.id, changes)
                    }
                    onRemove={() =>
                      removeExpenseItem("customVariableExpenses", item.id)
                    }
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => addExpenseItem("customVariableExpenses")}
                className="small-action-button mt-4"
              >
                Değişken gider ekle
              </button>
            </div>
          </div>
        </section>

        <section className="glass-card soft-appear p-5 sm:p-7 lg:sticky lg:top-24">
          <div className="mb-5">
            <span className="section-badge">2. Adım</span>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Sonuçlar
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Değerleri değiştirdikçe hesaplama anında yenilenir.
            </p>
          </div>

          <ResultCard
            label="Aylık Net Kâr"
            value={formatTRY(result.monthlyNetProfit)}
            tone={result.monthlyNetProfit < 0 ? "negative" : "primary"}
          />

          <div className="mt-4 grid grid-cols-2 gap-4">
            <ResultCard
              label="Aylık Brüt Ciro"
              value={formatTRY(result.monthlyGrossRevenue)}
            />
            <ResultCard
              label="Aylık Toplam Gider"
              value={formatTRY(result.monthlyTotalExpenses)}
            />
            <ResultCard
              label="Geri Ödeme Süresi"
              value={
                result.paybackMonths !== null
                  ? `${result.paybackMonths} ay`
                  : "Kâr etmiyor"
              }
              tone="accent"
            />
            <ResultCard
              label="Başabaş Günlük Paket"
              value={
                result.breakEvenPackagesPerDay !== null
                  ? `${result.breakEvenPackagesPerDay} paket`
                  : "-"
              }
            />
          </div>

          <div className="mt-4">
            <ResultCard
              label="Toplam Başlangıç Maliyeti"
              value={formatTRY(result.totalStartupCost)}
            />
          </div>

          <div className="mt-6 space-y-5">
            <ExpenseTable
              title="Sabit Giderler"
              items={result.fixedExpenseItems}
              total={result.monthlyFixedExpenses}
            />
            <ExpenseTable
              title="Değişken Giderler"
              items={result.variableExpenseItems}
              total={result.monthlyVariableExpenses}
            />
          </div>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
              Önemli Notlar
            </p>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-600">
              {result.assumptions.map((item) => (
                <li className="flex gap-2" key={item}>
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="glass-card soft-appear mt-6 p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-badge">3. Adım</span>
            <h2 className="mt-3 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Aylık Nakit Akışı Grafiği
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Dikey eksende tutar, yatay eksende ay gösterilir.
            </p>
          </div>
          <div className="w-32">
            <NumberField
              label="Ay sayısı"
              value={inputs.projectionMonths}
              onChange={(value) => update("projectionMonths", value)}
            />
          </div>
        </div>
        <ProjectionChart projection={result.projection} />
      </section>
    </>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field-shell block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-500">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        className="field-input"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
    </label>
  );
}

function ExpenseEditor({
  item,
  onChange,
  onRemove,
}: {
  item: ExpenseItem;
  onChange: (changes: Partial<Pick<ExpenseItem, "label" | "amount">>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid grid-cols-[1fr_130px_44px] items-end gap-2">
      <label className="field-shell block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">
          Kalem
        </span>
        <input
          type="text"
          className="field-input"
          value={item.label}
          placeholder="Örn. Yıllık bakım"
          onChange={(event) => onChange({ label: event.target.value })}
        />
      </label>
      <label className="field-shell block">
        <span className="mb-1.5 block text-xs font-semibold text-slate-500">
          Tutar (₺)
        </span>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          className="field-input"
          value={item.amount}
          onChange={(event) =>
            onChange({ amount: Number(event.target.value) || 0 })
          }
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        className="h-[46px] rounded-xl border border-red-200 bg-red-50 text-sm font-bold text-red-600 transition hover:bg-red-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100"
        aria-label="Kalemi sil"
      >
        Sil
      </button>
    </div>
  );
}

function ExpenseTable({
  title,
  items,
  total,
}: {
  title: string;
  items: ExpenseItem[];
  total: number;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
          {title}
        </p>
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs text-slate-500">
            <th className="px-4 py-2 font-semibold">Kalem</th>
            <th className="px-4 py-2 text-right font-semibold">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-2.5 font-medium text-slate-700">
                {item.label || "İsimsiz gider"}
              </td>
              <td className="px-4 py-2.5 text-right font-bold text-slate-900">
                {formatTRY(item.amount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-blue-50/70">
            <td className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-blue-800">
              Toplam
            </td>
            <td className="px-4 py-3 text-right text-sm font-black text-blue-900">
              {formatTRY(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function ProjectionChart({ projection }: { projection: ProjectionPoint[] }) {
  const width = 820;
  const height = 340;
  const padding = { top: 24, right: 24, bottom: 42, left: 104 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = projection.flatMap((point) => [
    point.revenue,
    point.expenses,
    point.netProfit,
  ]);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;
  const maxMonth = projection.length;

  const x = (month: number) =>
    padding.left + ((month - 1) / Math.max(maxMonth - 1, 1)) * chartWidth;
  const y = (value: number) =>
    padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  const lines = [
    { key: "revenue", label: "Brüt ciro", color: "#2563eb" },
    { key: "expenses", label: "Toplam gider", color: "#f97316" },
    { key: "netProfit", label: "Net kâr", color: "#16a34a" },
  ] as const;
  const gridValues = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => minValue + ratio * valueRange
  );
  const tickMonths = Array.from(
    new Set(
      Array.from({ length: 7 }, (_, index) =>
        Math.min(maxMonth, Math.max(1, Math.round((index * maxMonth) / 6) + 1))
      )
    )
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-600">
        {lines.map((line) => (
          <span className="inline-flex items-center gap-2" key={line.key}>
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: line.color }}
            />
            {line.label}
          </span>
        ))}
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Aylık ciro, gider ve net kâr grafiği"
      >
        {gridValues.map((value) => (
          <g key={value}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={y(value)}
              y2={y(value)}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
            <text
              x={padding.left - 12}
              y={y(value) + 4}
              textAnchor="end"
              className="fill-slate-500 text-[11px] font-semibold"
            >
              {formatTRY(value)}
            </text>
          </g>
        ))}
        {tickMonths.map((month) => (
          <text
            key={month}
            x={x(month)}
            y={height - 14}
            textAnchor="middle"
            className="fill-slate-500 text-[11px] font-semibold"
          >
            {month}. ay
          </text>
        ))}
        {lines.map((line) => (
          <polyline
            key={line.key}
            fill="none"
            stroke={line.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={projection
              .map((point) => `${x(point.month)},${y(point[line.key])}`)
              .join(" ")}
          />
        ))}
        {projection.map((point) => (
          <circle
            key={point.month}
            cx={x(point.month)}
            cy={y(point.netProfit)}
            r="3"
            fill="#16a34a"
          >
            <title>
              {`${point.month}. ay • Ciro ${formatTRY(point.revenue)} • Gider ${formatTRY(
                point.expenses
              )} • Net kâr ${formatTRY(point.netProfit)}`}
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

function ResultCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "primary" | "accent" | "negative";
}) {
  return (
    <div
      className={`result-card ${
        tone === "primary"
          ? "primary-result"
          : tone === "accent"
            ? "accent-result"
            : tone === "negative"
              ? "border-red-200 bg-red-50"
              : ""
      }`}
    >
      <p
        className={`text-xs font-semibold ${
          tone === "primary" ? "text-blue-50" : "text-slate-500"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-xl font-black tracking-tight sm:text-2xl ${
          tone === "primary"
            ? "text-white"
            : tone === "negative"
              ? "text-red-700"
              : tone === "accent"
                ? "text-orange-700"
                : "text-slate-950"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
