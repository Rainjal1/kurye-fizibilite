import type {
  CalculatorInputs,
  CalculationResult,
  ExpenseItem,
  ProjectionPoint,
} from "./types.ts";
import { NUMBER_INPUT_LIMITS, normalizeNumberInput } from "./inputs.ts";

export function calculateVariableExpenseDefaults(
  dailyPackages: number,
  workingDaysPerMonth: number
) {
  return {
    fuelOrElectricityMonthly: 1440 + 90 * workingDaysPerMonth + 30 * dailyPackages,
    maintenanceMonthly: 75 * workingDaysPerMonth,
  };
}

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
    personalExpensesEnabled,
    personalExpenseItems,
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
    ...(personalExpensesEnabled ? personalExpenseItems : []),
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

  let paybackDays: number | null = null;
  if (totalStartupCost === 0) {
    paybackDays = 0;
  } else if (monthlyNetProfit > 0) {
    paybackDays = Math.ceil((totalStartupCost / monthlyNetProfit) * 30);
  }

  const safeProjectionMonths = Math.round(
    normalizeNumberInput(
      projectionMonths,
      NUMBER_INPUT_LIMITS.projectionMonths
    )
  );

  const projection: ProjectionPoint[] = [
    {
      month: 0,
      cumulativeCash: -totalStartupCost,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      monthlyNetProfit: 0,
    },
    ...Array.from({ length: safeProjectionMonths }, (_, index) => {
      const month = index + 1;
      const cumulativeCash =
        -totalStartupCost + month * monthlyNetProfit;

      return {
        month,
        cumulativeCash,
        monthlyRevenue: monthlyGrossRevenue,
        monthlyExpenses: monthlyTotalExpenses,
        monthlyNetProfit,
      };
    }),
  ];

  const cumulativeCashAtHorizon = projection[projection.length - 1].cumulativeCash;
  let paybackMonths: number | null = null;
  if (totalStartupCost === 0) {
    paybackMonths = 0;
  } else if (monthlyNetProfit > 0) {
    paybackMonths = totalStartupCost / monthlyNetProfit;
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
    "Uber Eats ve Türkiye motosiklet güvenlik gereksinimleri referans alınmıştır. Isı yalıtımlı çanta en az 44x35x40 cm olmalıdır.",
    "Ekipman fiyatları Kasım 2026 tahminidir.",
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
  paybackDays,
    cumulativeCashAtHorizon,
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
