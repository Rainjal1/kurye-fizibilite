import assert from "node:assert/strict";
import test from "node:test";
import { calculateFeasibility, calculateVariableExpenseDefaults } from "./calculations.ts";
import { DEFAULT_INPUTS, VEHICLE_OPTIONS } from "./constants.ts";

test("personal expenses are excluded by default", () => {
  const result = calculateFeasibility(DEFAULT_INPUTS);

  assert.equal(
    result.fixedExpenseItems.some((item) => item.id === "personal-rent"),
    false
  );
});

test("variable expense defaults scale with package count and working days", function () {
  const baseDefaults = calculateVariableExpenseDefaults(30, 24);
  const increasedDefaults = calculateVariableExpenseDefaults(40, 26);

  assert.equal(baseDefaults.fuelOrElectricityMonthly, 4500);
  assert.equal(baseDefaults.maintenanceMonthly, 1800);
  assert.equal(increasedDefaults.fuelOrElectricityMonthly, 4980);
  assert.equal(increasedDefaults.maintenanceMonthly, 1950);
});

test("payback is reported as an exact day count", function () {
  const result = calculateFeasibility({
    ...DEFAULT_INPUTS,
    vehicleCost: 0,
    equipmentItems: [],
    licenseAndDocsCost: 0,
    companySetupCost: 0,
  });

  assert.equal(result.paybackDays, 0);
});

test("payback month matches the exact investment recovery point", function () {
  const result = calculateFeasibility(DEFAULT_INPUTS);
  const expectedPaybackMonths =
    result.totalStartupCost / result.monthlyNetProfit;

  assert.ok(Math.abs(result.paybackMonths! - expectedPaybackMonths) < 0.001);
});

test("vehicle options offer three popular motorcycle models with prices", function () {
  assert.equal(VEHICLE_OPTIONS.length, 3);
  for (const option of VEHICLE_OPTIONS) {
    assert.ok(option.id);
    assert.ok(option.label);
    assert.ok(option.price);
  }
});

test("enabled personal expenses are included in fixed expenses", () => {
  const result = calculateFeasibility({
    ...DEFAULT_INPUTS,
    personalExpensesEnabled: true,
  });

  const personalExpenseTotal = result.fixedExpenseItems
    .filter((item) => item.id.startsWith("personal-"))
    .reduce((total, item) => total + item.amount, 0);

  assert.equal(
    result.monthlyFixedExpenses,
    calculateFeasibility(DEFAULT_INPUTS).monthlyFixedExpenses +
      personalExpenseTotal
  );
});

test("projection months use the shared input limits", () => {
  const low = calculateFeasibility({
    ...DEFAULT_INPUTS,
    projectionMonths: -10,
  });
  const high = calculateFeasibility({
    ...DEFAULT_INPUTS,
    projectionMonths: 999,
  });
  const invalid = calculateFeasibility({
    ...DEFAULT_INPUTS,
    projectionMonths: Number.NaN,
  });

  assert.equal(low.projection.length, 2);
  assert.equal(high.projection.length, 121);
  assert.equal(invalid.projection.length, 2);
});
