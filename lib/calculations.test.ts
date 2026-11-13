import assert from "node:assert/strict";
import test from "node:test";
import { calculateFeasibility } from "./calculations.ts";
import { DEFAULT_INPUTS } from "./constants.ts";

test("personal expenses are excluded by default", () => {
  const result = calculateFeasibility(DEFAULT_INPUTS);

  assert.equal(
    result.fixedExpenseItems.some((item) => item.id === "personal-rent"),
    false
  );
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
