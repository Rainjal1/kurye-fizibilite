import { CalculatorInputs, ExpenseItem } from "./types";

export const DEFAULT_EQUIPMENT_ITEMS: ExpenseItem[] = [
  { id: "helmet", label: "ECE onaylı kask", amount: 4000 },
  { id: "gloves", label: "Koruyucu eldiven", amount: 800 },
  { id: "jacket", label: "Motosiklet montu", amount: 3500 },
  { id: "trousers", label: "Motosiklet pantolonu", amount: 2200 },
  { id: "boots", label: "Koruyucu bot", amount: 2800 },
  { id: "insulated-bag", label: "Isı yalıtımlı sırt çantası", amount: 1800 },
  { id: "reflective-vest", label: "Reflektif yelek", amount: 500 },
  { id: "rain-suit", label: "Yağmurluk takımı", amount: 800 },
  { id: "phone-mount", label: "Telefon tutucu", amount: 600 },
  { id: "phone", label: "Kurye telefonu", amount: 12000 },
  { id: "power-bank", label: "Powerbank ve kablolar", amount: 900 },
  { id: "helmet-camera", label: "Kask kamerası (önerilen)", amount: 3500 },
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
  customFixedExpenses: [],
  customVariableExpenses: [],
};
