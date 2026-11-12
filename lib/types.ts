export interface ExpenseItem {
  id: string;
  label: string;
  amount: number;
}

export interface CalculatorInputs {
  dailyPackages: number;
  averagePackagePrice: number;
  workingDaysPerMonth: number;
  projectionMonths: number;
  vehicleCost: number;
  equipmentItems: ExpenseItem[];
  licenseAndDocsCost: number;
  companySetupCost: number;
  fuelOrElectricityMonthly: number;
  maintenanceMonthly: number;
  insuranceMonthly: number;
  bagkurMonthly: number;
  accountingMonthly: number;
  phoneInternetMonthly: number;
  otherMonthly: number;
  customFixedExpenses: ExpenseItem[];
  customVariableExpenses: ExpenseItem[];
}

export interface CalculationResult {
  monthlyGrossRevenue: number;
  monthlyFixedExpenses: number;
  monthlyVariableExpenses: number;
  monthlyTotalExpenses: number;
  monthlyNetProfit: number;
  totalStartupCost: number;
  equipmentCost: number;
  paybackMonths: number | null;
  breakEvenPackagesPerDay: number | null;
  fixedExpenseItems: ExpenseItem[];
  variableExpenseItems: ExpenseItem[];
  projection: ProjectionPoint[];
  assumptions: string[];
}

export interface ProjectionPoint {
  month: number;
  revenue: number;
  expenses: number;
  netProfit: number;
}
