"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  CalculatorInputs,
  ExpenseItem,
  ProjectionPoint,
} from "@/lib/types";
import { DEFAULT_INPUTS } from "@/lib/constants";
import { calculateFeasibility, formatTRY } from "@/lib/calculations";
import {
  calculateExpenseLabelRatio,
  EXPENSE_ROW_LAYOUT,
} from "@/lib/layout";

type ExpenseListKey =
  | "equipmentItems"
  | "personalExpenseItems"
  | "customFixedExpenses"
  | "customVariableExpenses";

type Theme = "light" | "dark";

type NumberFieldKey = {
  [K in keyof CalculatorInputs]: CalculatorInputs[K] extends number ? K : never;
}[keyof CalculatorInputs];

export default function Calculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [theme, setTheme] = useState<Theme>("light");
  const [personalExpensesOpen, setPersonalExpensesOpen] = useState(false);
  const [removedFields, setRemovedFields] = useState<
    ReadonlySet<NumberFieldKey>
  >(new Set());
  const [expenseLabelRatio, setExpenseLabelRatio] = useState<number>(
    EXPENSE_ROW_LAYOUT.defaultLabelRatio
  );
  const result = useMemo(() => calculateFeasibility(inputs), [inputs]);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    const initialTheme =
      storedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", nextTheme === "dark");
      window.localStorage.setItem("theme", nextTheme);
      return nextTheme;
    });
  }

  function resetInputs() {
    setInputs(DEFAULT_INPUTS);
    setPersonalExpensesOpen(false);
    setRemovedFields(new Set());
  }

  function togglePersonalExpenses(enabled: boolean) {
    update("personalExpensesEnabled", enabled);
    setPersonalExpensesOpen(enabled);
  }

  function update<K extends keyof CalculatorInputs>(
    key: K,
    value: CalculatorInputs[K]
  ) {
    setInputs((previous) => ({ ...previous, [key]: value }));
  }

  function updateExpenseItem(
    listKey: ExpenseListKey,
    id: string,
    changes: Partial<Pick<ExpenseItem, "label" | "amount">>
  ) {
    setInputs((previous) => ({
      ...previous,
      [listKey]: previous[listKey].map((item) =>
        item.id === id ? { ...item, ...changes } : item
      ),
    }));
  }

  function addExpenseItem(listKey: ExpenseListKey) {
    const prefix =
      listKey === "customFixedExpenses"
        ? "sabit"
        : listKey === "personalExpenseItems"
          ? "kisisel"
        : listKey === "customVariableExpenses"
          ? "degisken"
          : "ekipman";
    const newItem: ExpenseItem = {
      id: `${prefix}-${Date.now()}`,
      label: "",
      amount: 0,
    };

    setInputs((previous) => ({
      ...previous,
      [listKey]: [...previous[listKey], newItem],
    }));
  }

  function removeExpenseItem(listKey: ExpenseListKey, id: string) {
    setInputs((previous) => ({
      ...previous,
      [listKey]: previous[listKey].filter((item) => item.id !== id),
    }));
  }

  function removeNumberField(key: NumberFieldKey) {
    update(key, 0);
    setRemovedFields((previous) => new Set(previous).add(key));
  }

  return (
    <>
      <div className="header-actions">
        <details className="header-menu">
          <summary aria-label="Ayarlar ve tema menüsü">
            <span />
            <span />
            <span />
          </summary>
          <div className="header-menu-panel">
            <button type="button" onClick={toggleTheme}>
              {theme === "dark" ? "Ayd\u0131nl\u0131k mod" : "Karanl\u0131k mod"}
            </button>
            <button type="button" onClick={resetInputs}>
              Varsayılana dön
            </button>
          </div>
        </details>
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.45fr_1fr] xl:items-start">
        <section className="glass-card p-4 sm:p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-heading mt-2 text-xl font-bold tracking-tight sm:text-2xl">
                Hesaplama Bilgileri
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            <FormSection title="Gelirler">
              <div className="sheet-grid">
                <NumberCell
                  label="Günlük paket"
                  value={inputs.dailyPackages}
                  onChange={(value) => update("dailyPackages", value)}
                  isRemoved={removedFields.has("dailyPackages")}
                  onRemove={() => removeNumberField("dailyPackages")}
                />
                <NumberCell
                  label="Paket ücreti (₺)"
                  value={inputs.averagePackagePrice}
                  onChange={(value) => update("averagePackagePrice", value)}
                  isRemoved={removedFields.has("averagePackagePrice")}
                  onRemove={() => removeNumberField("averagePackagePrice")}
                />
                <NumberCell
                  label="Aylık gün"
                  value={inputs.workingDaysPerMonth}
                  onChange={(value) => update("workingDaysPerMonth", value)}
                  isRemoved={removedFields.has("workingDaysPerMonth")}
                  onRemove={() => removeNumberField("workingDaysPerMonth")}
                />
                <NumberCell
                  label="Grafik ufku (ay)"
                  value={inputs.projectionMonths}
                  onChange={(value) => update("projectionMonths", value)}
                  isRemoved={removedFields.has("projectionMonths")}
                  onRemove={() => removeNumberField("projectionMonths")}
                />
              </div>
              <p className="text-muted mt-2 text-xs font-semibold">
                Tahmini aylık brüt ciro: {formatTRY(result.monthlyGrossRevenue)}
              </p>
            </FormSection>

            <FormSection title="Ekipman">
              <details className="collapsible-panel">
                <summary>
                  <span>Ekipman kalemlerini düzenle</span>
                  <strong>{formatTRY(result.equipmentCost)}</strong>
                </summary>
                <div className="space-y-1.5">
                  {inputs.equipmentItems.map((item) => (
                    <EquipmentEditor
                      key={item.id}
                      item={item}
                      labelRatio={expenseLabelRatio}
                      onLabelRatioChange={setExpenseLabelRatio}
                      onChange={(changes) =>
                        updateExpenseItem("equipmentItems", item.id, changes)
                      }
                      onRemove={() =>
                        removeExpenseItem("equipmentItems", item.id)
                      }
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => addExpenseItem("equipmentItems")}
                    className="small-action-button"
                  >
                    Ekipman ekle
                  </button>
                </div>
              </details>
              <p className="text-muted mt-2 text-xs">
                Uber Eats ve Türkiye motosiklet güvenlik gereksinimleri referans
                alınmıştır. Isı yalıtımlı çanta en az 44x35x40 cm olmalıdır.
              </p>
            </FormSection>

            <FormSection title="Diğer Başlangıç Maliyetleri">
              <div className="sheet-grid">
                <NumberCell
                  label="Araç (₺)"
                  value={inputs.vehicleCost}
                  onChange={(value) => update("vehicleCost", value)}
                  isRemoved={removedFields.has("vehicleCost")}
                  onRemove={() => removeNumberField("vehicleCost")}
                />
                <NumberCell
                  label="Belgeler (₺)"
                  value={inputs.licenseAndDocsCost}
                  onChange={(value) => update("licenseAndDocsCost", value)}
                  isRemoved={removedFields.has("licenseAndDocsCost")}
                  onRemove={() => removeNumberField("licenseAndDocsCost")}
                />
                <NumberCell
                  label="Şirket kuruluşu (₺)"
                  value={inputs.companySetupCost}
                  onChange={(value) => update("companySetupCost", value)}
                  isRemoved={removedFields.has("companySetupCost")}
                  onRemove={() => removeNumberField("companySetupCost")}
                />
              </div>
              <p className="text-muted mt-2 text-xs font-semibold">
                Toplam başlangıç maliyeti: {formatTRY(result.totalStartupCost)}
              </p>
            </FormSection>

            <FormSection title="Aylık Sabit Giderler">
              <div className="sheet-grid">
                <NumberCell
                  label="Sigorta"
                  value={inputs.insuranceMonthly}
                  onChange={(value) => update("insuranceMonthly", value)}
                  isRemoved={removedFields.has("insuranceMonthly")}
                  onRemove={() => removeNumberField("insuranceMonthly")}
                />
                <NumberCell
                  label="Bağ-Kur"
                  value={inputs.bagkurMonthly}
                  onChange={(value) => update("bagkurMonthly", value)}
                  isRemoved={removedFields.has("bagkurMonthly")}
                  onRemove={() => removeNumberField("bagkurMonthly")}
                />
                <NumberCell
                  label="Muhasebe"
                  value={inputs.accountingMonthly}
                  onChange={(value) => update("accountingMonthly", value)}
                  isRemoved={removedFields.has("accountingMonthly")}
                  onRemove={() => removeNumberField("accountingMonthly")}
                />
                <NumberCell
                  label="Telefon / internet"
                  value={inputs.phoneInternetMonthly}
                  onChange={(value) => update("phoneInternetMonthly", value)}
                  isRemoved={removedFields.has("phoneInternetMonthly")}
                  onRemove={() => removeNumberField("phoneInternetMonthly")}
                />
                <NumberCell
                  label="Diğer"
                  value={inputs.otherMonthly}
                  onChange={(value) => update("otherMonthly", value)}
                  isRemoved={removedFields.has("otherMonthly")}
                  onRemove={() => removeNumberField("otherMonthly")}
                />
              </div>
              <CustomExpenseList
                items={inputs.customFixedExpenses}
                listKey="customFixedExpenses"
                labelRatio={expenseLabelRatio}
                onLabelRatioChange={setExpenseLabelRatio}
                onAdd={addExpenseItem}
                onChange={updateExpenseItem}
                onRemove={removeExpenseItem}
                addLabel="Sabit gider ekle"
              />
              <PersonalExpenseSection
                enabled={inputs.personalExpensesEnabled}
                open={personalExpensesOpen}
                items={inputs.personalExpenseItems}
                labelRatio={expenseLabelRatio}
                onLabelRatioChange={setExpenseLabelRatio}
                onEnabledChange={togglePersonalExpenses}
                onOpenChange={setPersonalExpensesOpen}
                onAdd={addExpenseItem}
                onChange={updateExpenseItem}
                onRemove={removeExpenseItem}
              />
            </FormSection>

            <FormSection title="Aylık Değişken Giderler">
              <div className="sheet-grid">
                <NumberCell
                  label="Yakıt / elektrik"
                  value={inputs.fuelOrElectricityMonthly}
                  onChange={(value) =>
                    update("fuelOrElectricityMonthly", value)
                  }
                  isRemoved={removedFields.has("fuelOrElectricityMonthly")}
                  onRemove={() =>
                    removeNumberField("fuelOrElectricityMonthly")
                  }
                />
                <NumberCell
                  label="Bakım ve lastik"
                  value={inputs.maintenanceMonthly}
                  onChange={(value) => update("maintenanceMonthly", value)}
                  isRemoved={removedFields.has("maintenanceMonthly")}
                  onRemove={() => removeNumberField("maintenanceMonthly")}
                />
              </div>
              <CustomExpenseList
                items={inputs.customVariableExpenses}
                listKey="customVariableExpenses"
                labelRatio={expenseLabelRatio}
                onLabelRatioChange={setExpenseLabelRatio}
                onAdd={addExpenseItem}
                onChange={updateExpenseItem}
                onRemove={removeExpenseItem}
                addLabel="Değişken gider ekle"
              />
            </FormSection>
          </div>
        </section>

        <section className="glass-card p-4 sm:p-5 xl:sticky xl:top-20">
          <div className="mb-4">
            <h2 className="text-heading mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Sonuçlar
            </h2>
          </div>

          <ResultCard
            label="Aylık Net Kâr"
            value={formatTRY(result.monthlyNetProfit)}
            tone={result.monthlyNetProfit < 0 ? "negative" : "primary"}
          />

          <div className="mt-3 grid grid-cols-2 gap-3">
            <ResultCard
              label="Aylık Brüt Ciro"
              value={formatTRY(result.monthlyGrossRevenue)}
            />
            <ResultCard
              label="Aylık Toplam Gider"
              value={formatTRY(result.monthlyTotalExpenses)}
            />
            <ResultCard
              label="İlk Yatırım"
              value={formatTRY(result.totalStartupCost)}
            />
            <ResultCard
              label="Başabaş Ayı"
              value={
                result.paybackMonths !== null
                  ? `${result.paybackMonths}. ay`
                  : "Kâra geçmiyor"
              }
              tone="accent"
            />
            <ResultCard
              label="Grafik Sonu Kasası"
              value={formatTRY(result.cumulativeCashAtHorizon)}
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

          <div className="mt-4 space-y-3">
            <ExpenseTable
              title="Gelirler"
              items={[
                { id: "packages", label: "Günlük paket", amount: inputs.dailyPackages },
                {
                  id: "price",
                  label: "Ortalama paket ücreti",
                  amount: inputs.averagePackagePrice,
                },
                {
                  id: "days",
                  label: "Aylık çalışma günü",
                  amount: inputs.workingDaysPerMonth,
                },
              ]}
              total={result.monthlyGrossRevenue}
              totalLabel="Aylık brüt ciro"
            />
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

          <div className="info-panel mt-4">
            <p className="text-xs font-bold uppercase tracking-wide">Önemli Notlar</p>
            <ul className="text-muted mt-2 space-y-1.5 text-xs leading-relaxed">
              {result.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      <section className="glass-card mt-5 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-heading mt-2 text-xl font-bold tracking-tight sm:text-2xl">
              Kümülatif Kasası
            </h2>
            <p className="text-muted mt-1 text-sm">
              İlk yatırımın etkisinden başlayarak aylık net kâr birikimi gösterilir.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-bold sm:grid-cols-4">
            <ChartStat label="İlk yatırım" value={formatTRY(result.totalStartupCost)} />
            <ChartStat label="Aylık ciro" value={formatTRY(result.monthlyGrossRevenue)} />
            <ChartStat label="Aylık gider" value={formatTRY(result.monthlyTotalExpenses)} />
            <ChartStat label="Aylık net kâr" value={formatTRY(result.monthlyNetProfit)} />
          </div>
        </div>
        <ProjectionChart
          projection={result.projection}
          breakEvenMonth={result.paybackMonths}
        />
      </section>
    </>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-muted mb-2 text-xs font-bold uppercase tracking-wide">
        {title}
      </h3>
      {children}
    </section>
  );
}

function NumberCell({
  label,
  value,
  onChange,
  isRemoved,
  onRemove,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isRemoved: boolean;
  onRemove: () => void;
}) {
  if (isRemoved) {
    return null;
  }

  return (
    <div className="sheet-cell">
      <span className="sheet-cell-label">{label}</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        aria-label={label}
        className="sheet-input"
        value={value}
        onChange={(event) => onChange(Number(event.target.value) || 0)}
      />
      <button
        type="button"
        onClick={onRemove}
        className="danger-button sheet-remove-button"
        aria-label={`${label} satırını sil`}
      >
        ×
      </button>
    </div>
  );
}

function CustomExpenseList({
  items,
  listKey,
  labelRatio,
  onLabelRatioChange,
  onAdd,
  onChange,
  onRemove,
  addLabel,
}: {
  items: ExpenseItem[];
  listKey: ExpenseListKey;
  labelRatio: number;
  onLabelRatioChange: (ratio: number) => void;
  onAdd: (listKey: ExpenseListKey) => void;
  onChange: (
    listKey: ExpenseListKey,
    id: string,
    changes: Partial<Pick<ExpenseItem, "label" | "amount">>
  ) => void;
  onRemove: (listKey: ExpenseListKey, id: string) => void;
  addLabel: string;
}) {
  return (
    <div className="mt-1.5 space-y-1.5">
      {items.map((item) => (
        <ExpenseEditor
          key={item.id}
          item={item}
          labelRatio={labelRatio}
          onLabelRatioChange={onLabelRatioChange}
          onChange={(changes) => onChange(listKey, item.id, changes)}
          onRemove={() => onRemove(listKey, item.id)}
        />
      ))}
      <button
        type="button"
        onClick={() => onAdd(listKey)}
        className="small-action-button"
      >
        {addLabel}
      </button>
    </div>
  );
}

function ExpenseEditor({
  item,
  labelRatio,
  onLabelRatioChange,
  onChange,
  onRemove,
}: {
  item: ExpenseItem;
  labelRatio: number;
  onLabelRatioChange: (ratio: number) => void;
  onChange: (changes: Partial<Pick<ExpenseItem, "label" | "amount">>) => void;
  onRemove: () => void;
}) {
  return (
    <ResizableExpenseRow
      labelRatio={labelRatio}
      onLabelRatioChange={onLabelRatioChange}
    >
      <ExpenseLabelInput
        value={item.label}
        onChange={(label) => onChange({ label })}
      />
      <div className="expense-value-cell">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          className="sheet-input expense-value-input"
          value={item.amount}
          onChange={(event) =>
            onChange({ amount: Number(event.target.value) || 0 })
          }
        />
        <button
          type="button"
          onClick={onRemove}
          className="danger-button sheet-remove-button"
          aria-label="Kalemi sil"
        >
          ×
        </button>
      </div>
    </ResizableExpenseRow>
  );
}

function EquipmentEditor({
  item,
  labelRatio,
  onLabelRatioChange,
  onChange,
  onRemove,
}: {
  item: ExpenseItem;
  labelRatio: number;
  onLabelRatioChange: (ratio: number) => void;
  onChange: (changes: Partial<Pick<ExpenseItem, "amount">>) => void;
  onRemove: () => void;
}) {
  return (
    <ResizableExpenseRow
      labelRatio={labelRatio}
      onLabelRatioChange={onLabelRatioChange}
    >
      <div className="static-expense-label">{item.label}</div>
      <div className="expense-value-cell">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          className="sheet-input expense-value-input"
          value={item.amount}
          onChange={(event) =>
            onChange({ amount: Number(event.target.value) || 0 })
          }
        />
        <button
          type="button"
          onClick={onRemove}
          className="danger-button sheet-remove-button"
          aria-label="Kalemi sil"
        >
          ×
        </button>
      </div>
    </ResizableExpenseRow>
  );
}

function ResizableExpenseRow({
  labelRatio,
  onLabelRatioChange,
  children,
}: {
  labelRatio: number;
  onLabelRatioChange: (ratio: number) => void;
  children: React.ReactNode;
}) {
  const rowRef = useRef<HTMLDivElement | null>(null);

  function updateRatio(nextLabelWidth: number) {
    const row = rowRef.current;
    if (!row) return;

    const rowRect = row.getBoundingClientRect();
    onLabelRatioChange(
      calculateExpenseLabelRatio(nextLabelWidth, rowRect.width)
    );
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    updateRatio(event.clientX);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    updateRatio(event.clientX);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const row = rowRef.current;
    if (!row) return;

    const rowRect = row.getBoundingClientRect();
    const availableWidth = Math.max(
      EXPENSE_ROW_LAYOUT.minimumLabelWidth,
      rowRect.width - EXPENSE_ROW_LAYOUT.minimumValueCellWidth
    );
    const currentLabelWidth = labelRatio * availableWidth;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      updateRatio(
        currentLabelWidth - EXPENSE_ROW_LAYOUT.keyboardAdjustmentWidth
      );
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      updateRatio(
        currentLabelWidth + EXPENSE_ROW_LAYOUT.keyboardAdjustmentWidth
      );
    }
  }

  return (
    <div
      ref={rowRef}
      className="dynamic-expense-grid"
      style={{ "--expense-label-ratio": labelRatio } as CSSProperties}
    >
      {children}
      <div
        className="expense-divider"
        role="separator"
        aria-orientation="vertical"
        aria-label="Etiket ve değer alanı genişliğini ayarla"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(labelRatio * 100)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

function ExpenseLabelInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      className="expense-label-input"
      value={value}
      placeholder={"Gider ad\u0131"}
      spellCheck={false}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.preventDefault();
      }}
    />
  );
}

function PersonalExpenseSection({
  enabled,
  open,
  items,
  labelRatio,
  onLabelRatioChange,
  onEnabledChange,
  onOpenChange,
  onAdd,
  onChange,
  onRemove,
}: {
  enabled: boolean;
  open: boolean;
  items: ExpenseItem[];
  labelRatio: number;
  onLabelRatioChange: (ratio: number) => void;
  onEnabledChange: (enabled: boolean) => void;
  onOpenChange: (open: boolean) => void;
  onAdd: (listKey: ExpenseListKey) => void;
  onChange: (
    listKey: ExpenseListKey,
    id: string,
    changes: Partial<Pick<ExpenseItem, "label" | "amount">>
  ) => void;
  onRemove: (listKey: ExpenseListKey, id: string) => void;
}) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <details
      className="collapsible-panel personal-expense-panel"
      open={open}
      onToggle={(event) => onOpenChange(event.currentTarget.open)}
    >
      <summary>
        <label className="personal-expense-toggle">
          <input
            type="checkbox"
            checked={enabled}
            onClick={(event) => event.stopPropagation()}
            onChange={(event) => onEnabledChange(event.target.checked)}
          />
          <span>Kişisel giderler</span>
        </label>
        <strong>{formatTRY(total)}</strong>
      </summary>
      <div className="space-y-1.5">
        {items.map((item) => (
          <ExpenseEditor
            key={item.id}
            item={item}
            labelRatio={labelRatio}
            onLabelRatioChange={onLabelRatioChange}
            onChange={(changes) => onChange("personalExpenseItems", item.id, changes)}
            onRemove={() => onRemove("personalExpenseItems", item.id)}
          />
        ))}
        <button
          type="button"
          onClick={() => onAdd("personalExpenseItems")}
          className="small-action-button"
        >
          Kişisel gider ekle
        </button>
      </div>
    </details>
  );
}

function ExpenseTable({
  title,
  items,
  total,
  totalLabel = "Toplam",
}: {
  title: string;
  items: ExpenseItem[];
  total: number;
  totalLabel?: string;
}) {
  return (
    <div className="summary-table">
      <div className="summary-table-header">{title}</div>
      <table className="w-full text-left text-sm">
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.label || "İsimsiz kalem"}</td>
              <td className="text-right font-bold">{formatNumber(item.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>{totalLabel}</td>
            <td className="text-right">{formatTRY(total)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 1 }).format(
    value
  );
}

function ChartStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="chart-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProjectionChart({
  projection,
  breakEvenMonth,
}: {
  projection: ProjectionPoint[];
  breakEvenMonth: number | null;
}) {
  const width = 820;
  const height = 320;
  const padding = { top: 24, right: 24, bottom: 40, left: 108 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = projection.map((point) => point.cumulativeCash);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;
  const maxMonth = projection[projection.length - 1].month;

  const x = (month: number) => padding.left + (month / maxMonth) * chartWidth;
  const y = (value: number) =>
    padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;

  const gridValues = [0, 0.25, 0.5, 0.75, 1].map(
    (ratio) => minValue + ratio * valueRange
  );
  const tickMonths = Array.from(
    new Set(
      Array.from({ length: 7 }, (_, index) => Math.round((index * maxMonth) / 6))
    )
  );
  const points = projection
    .map((point) => `${x(point.month)},${y(point.cumulativeCash)}`)
    .join(" ");
  const breakEvenX = breakEvenMonth !== null ? x(breakEvenMonth) : null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="chart-canvas h-auto w-full"
      role="img"
      aria-label="Kümülatif kasası grafiği"
    >
      {gridValues.map((value) => (
        <g key={value}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={y(value)}
            y2={y(value)}
            className="chart-grid"
          />
          <text
            x={padding.left - 12}
            y={y(value) + 4}
            textAnchor="end"
            className="chart-label"
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
          className="chart-label"
        >
          {month}. ay
        </text>
      ))}
      <polyline
        points={points}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line"
      />
      {projection.map((point) => (
        <circle
          key={point.month}
          cx={x(point.month)}
          cy={y(point.cumulativeCash)}
          r="3"
          className="chart-point"
        >
          <title>
            {`${point.month}. ay • Kasada ${formatTRY(
              point.cumulativeCash
            )} • Net kâr ${formatTRY(point.monthlyNetProfit)}`}
          </title>
        </circle>
      ))}
      {breakEvenX !== null && breakEvenMonth !== null ? (
        <g>
          <circle cx={breakEvenX} cy={y(0)} r="6" className="chart-break-even" />
          <text
            x={Math.min(breakEvenX + 10, width - padding.right)}
            y={y(0) - 12}
            textAnchor={breakEvenX > width * 0.75 ? "end" : "start"}
            className="chart-break-even-label"
          >
            Başabaş: {breakEvenMonth}. ay
          </text>
        </g>
      ) : null}
    </svg>
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
              ? "negative-result"
              : ""
      }`}
    >
      <p
        className={`text-xs font-semibold ${
          tone === "primary" ? "text-white/80" : "text-muted"
        }`}
      >
        {label}
      </p>
      <p
        className={`mt-1 text-lg font-black tracking-tight sm:text-xl ${
          tone === "primary"
            ? "text-white"
            : tone === "negative"
              ? "text-red-600 dark:text-red-300"
              : "text-strong"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
