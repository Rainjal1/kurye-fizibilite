import { CalculatorInputs, CalculationResult, ExpenseItem, ProjectionPoint } from "./types";

export function calculateFeasibility(
  inputs: CalculatorInputs
): CalculationResult {
  const {
    dailyPackages,
    averagePackagePrice,
    workingDaysPerMonth,
    projectionMonths,
    vehicleCost,
    equipmentItems,
    licenseAndDocsCost,
    companySetupCost,
    fuelOrElectricityMonthly,
    maintenanceMonthly,
    insuranceMonthly,
    bagkurMonthly,
    accountingMonthly,
    phoneInternetMonthly,
    otherMonthly,
    customFixedExpenses,
    customVariableExpenses,
  } = inputs;

  const monthlyGrossRevenue =
    dailyPackages * averagePackagePrice * workingDaysPerMonth;

  const equipmentCost = equipmentItems.reduce(
    (total, item) => total + item.amount,
    0
  );

  const fixedExpenseItems: ExpenseItem[] = [
    { id: "insurance", label: "Sigorta", amount: insuranceMonthly },
    { id: "bagkur", label: "Bağ-Kur primi", amount: bagkurMonthly },
    { id: "accounting", label: "Muhasebe", amount: accountingMonthly },
    { id: "phone-internet", label: "Telefon / internet", amount: phoneInternetMonthly },
    { id: "other", label: "Diğer sabit gider", amount: otherMonthly },
    ...customFixedExpenses,
  ];

  const variableExpenseItems: ExpenseItem[] = [
    {
      id: "fuel-or-electricity",
      label: "Yakıt / elektrik",
      amount: fuelOrElectricityMonthly,
    },
    { id: "maintenance", label: "Bakım ve lastik", amount: maintenanceMonthly },
    ...customVariableExpenses,
  ];

  const monthlyFixedExpenses = fixedExpenseItems.reduce(
    (total, item) => total + item.amount,
    0
  );
  const monthlyVariableExpenses = variableExpenseItems.reduce(
    (total, item) => total + item.amount,
    0
  );
  const monthlyTotalExpenses =
    monthlyFixedExpenses + monthlyVariableExpenses;

  const monthlyNetProfit = monthlyGrossRevenue - monthlyTotalExpenses;

  const totalStartupCost =
    vehicleCost + equipmentCost + licenseAndDocsCost + companySetupCost;

  const safeProjectionMonths = Math.min(
    120,
    Math.max(1, Math.round(projectionMonths || 1))
  );

  const projection: ProjectionPoint[] = Array.from(
    { length: safeProjectionMonths },
    (_, index) => ({
      month: index + 1,
      revenue: monthlyGrossRevenue,
      expenses: monthlyTotalExpenses,
      netProfit: monthlyNetProfit,
    })
  );

  let paybackMonths: number | null = null;
  if (monthlyNetProfit > 0) {
    paybackMonths = Math.ceil(totalStartupCost / monthlyNetProfit);
  }

  let breakEvenPackagesPerDay: number | null = null;
  if (averagePackagePrice > 0 && workingDaysPerMonth > 0) {
    const neededMonthlyPackages = monthlyTotalExpenses / averagePackagePrice;
    breakEvenPackagesPerDay =
      Math.ceil((neededMonthlyPackages / workingDaysPerMonth) * 10) / 10;
  }

  const assumptions: string[] = [
    "Paket başı ücret, 2026 platform tarifelerinin karma ortalamasıdır; mesafe, saat ve bonuslara göre değişir.",
    "Varsayılan Bağ-Kur primi, 2026 brüt asgari ücrete göre aylık 11.808 TL seviyesindedir.",
    "Yakıt / elektrik ve bakım tutarları Kasım 2026 fiyat seviyelerine göre tahminidir; gerçek tüketiminizle güncelleyin.",
    "Ekipman listesi Uber Eats ve Uber Moto gereksinimleri ile Türkiye motosiklet güvenlik pratiği referans alınarak hazırlanmıştır; fiyatlar Kasım 2026 tahminidir.",
    "Isı yalıtımlı çanta Uber Eats için en az 44x35x40 cm olmalıdır; marka zorunlu değildir.",
    "Gelir vergisi ve olası tevkifatlar bu versiyonda hesaba katılmamıştır.",
    "Bu bir tahmindir, yatırım tavsiyesi değildir.",
  ];

  return {
    monthlyGrossRevenue,
    monthlyFixedExpenses,
    monthlyVariableExpenses,
    monthlyTotalExpenses,
    monthlyNetProfit,
    totalStartupCost,
    equipmentCost,
    paybackMonths,
    breakEvenPackagesPerDay,
    fixedExpenseItems,
    variableExpenseItems,
    projection,
    assumptions,
  };
}

/** Parayı Türk Lirası formatında göster */
export function formatTRY(value: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(value);
}
