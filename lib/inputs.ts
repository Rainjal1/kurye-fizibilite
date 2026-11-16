import type { CalculatorInputs } from "./types.ts";

export type StepperDirection = 1 | -1;

export interface NumberInputLimits {
  min: number;
  max: number;
}

export interface NumberInputResult {
  value: number;
  isValid: boolean;
  isEmpty: boolean;
}

export type NumberFieldKey = {
  [K in keyof CalculatorInputs]: CalculatorInputs[K] extends number ? K : never;
}[keyof CalculatorInputs];

export const NUMBER_INPUT_LIMITS: Record<NumberFieldKey, NumberInputLimits> = {
  dailyPackages: { min: 0, max: 500 },
  averagePackagePrice: { min: 0, max: 5_000 },
  workingDaysPerMonth: { min: 0, max: 31 },
  projectionMonths: { min: 1, max: 120 },
  vehicleCost: { min: 0, max: 10_000_000 },
  licenseAndDocsCost: { min: 0, max: 10_000_000 },
  companySetupCost: { min: 0, max: 10_000_000 },
  fuelOrElectricityMonthly: { min: 0, max: 500_000 },
  maintenanceMonthly: { min: 0, max: 500_000 },
  insuranceMonthly: { min: 0, max: 100_000 },
  bagkurMonthly: { min: 0, max: 100_000 },
  accountingMonthly: { min: 0, max: 100_000 },
  phoneInternetMonthly: { min: 0, max: 50_000 },
  otherMonthly: { min: 0, max: 1_000_000 },
};

export const EXPENSE_AMOUNT_LIMITS: NumberInputLimits = {
  min: 0,
  max: 10_000_000,
};

export function adjustNumberValue(
  value: number,
  direction: StepperDirection,
  step: number,
  limits: NumberInputLimits
): number {
  const nextValue = value + direction * step;
  return normalizeNumberInput(nextValue, limits);
}

export function parseNumberInput(
  rawValue: string,
  limits: NumberInputLimits
): NumberInputResult {
  const trimmedValue = rawValue.trim();

  if (trimmedValue === "") {
    return { value: limits.min, isValid: false, isEmpty: true };
  }

  const parsedValue = Number(trimmedValue);
  if (!Number.isFinite(parsedValue)) {
    return { value: limits.min, isValid: false, isEmpty: false };
  }

  return {
    value: Math.min(limits.max, Math.max(limits.min, parsedValue)),
    isValid: parsedValue >= limits.min && parsedValue <= limits.max,
    isEmpty: false,
  };
}

export function normalizeNumberInput(
  value: number,
  limits: NumberInputLimits
): number {
  if (!Number.isFinite(value)) {
    return limits.min;
  }

  return Math.min(limits.max, Math.max(limits.min, value));
}
