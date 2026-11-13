import type { CalculatorInputs, ExpenseItem } from "./types.ts";

export const DEFAULT_EQUIPMENT_ITEMS: ExpenseItem[] = [
  { id: "helmet", label: "ECE onayl\u0131 kask", amount: 4000 },
  { id: "gloves", label: "Koruyucu eldiven", amount: 800 },
  { id: "jacket", label: "Motosiklet montu", amount: 3500 },
  { id: "trousers", label: "Motosiklet pantolonu", amount: 2200 },
  { id: "boots", label: "Koruyucu bot", amount: 2800 },
  { id: "insulated-bag", label: "Is\u0131 yal\u0131t\u0131ml\u0131 s\u0131rt \u00e7antas\u0131", amount: 1800 },
  { id: "reflective-vest", label: "Reflektif yelek", amount: 500 },
  { id: "rain-suit", label: "Ya\u011fmurluk tak\u0131m\u0131", amount: 800 },
  { id: "phone-mount", label: "Telefon tutucu", amount: 600 },
  { id: "phone", label: "Kurye telefonu", amount: 12000 },
  { id: "power-bank", label: "Powerbank ve kablolar", amount: 900 },
  { id: "helmet-camera", label: "Kask kameras\u0131 (\u00f6nerilen)", amount: 3500 },
];

export const DEFAULT_INPUTS: CalculatorInputs = {
  dailyPackages: 30,
  averagePackagePrice: 105,
  workingDaysPerMonth: 24,
  projectionMonths: 36,
  vehicleCost: 95000,
  equipmentItems: DEFAULT_EQUIPMENT_ITEMS,
  licenseAndDocsCost: 12000,
  companySetupCost: 3500,
  fuelOrElectricityMonthly: 4500,
  maintenanceMonthly: 1800,
  insuranceMonthly: 900,
  bagkurMonthly: 11808,
  accountingMonthly: 1500,
  phoneInternetMonthly: 600,
  otherMonthly: 500,
  personalExpensesEnabled: false,
  personalExpenseItems: [
    { id: "personal-rent", label: "Kira", amount: 12000 },
    {
      id: "personal-utilities",
      label: "Elektrik / su / do\u011falgaz",
      amount: 2500,
    },
    { id: "personal-groceries", label: "Market / g\u0131da", amount: 6000 },
    {
      id: "personal-transport",
      label: "Ki\u015fisel ula\u015f\u0131m",
      amount: 1500,
    },
    {
      id: "personal-health",
      label: "Sa\u011fl\u0131k / ki\u015fisel bak\u0131m",
      amount: 1000,
    },
  ],
  customFixedExpenses: [],
  customVariableExpenses: [],
};
