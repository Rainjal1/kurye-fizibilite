import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateExpenseLabelRatio,
  EXPENSE_ROW_LAYOUT,
} from "./layout.ts";

test("keeps the expense label at its minimum width", () => {
  const ratio = calculateExpenseLabelRatio(0, 300);

  assert.equal(
    ratio,
    EXPENSE_ROW_LAYOUT.minimumLabelWidth /
      (300 - EXPENSE_ROW_LAYOUT.minimumValueCellWidth)
  );
});

test("preserves the expense value area when the label is dragged too far", () => {
  const ratio = calculateExpenseLabelRatio(300, 300);

  assert.equal(ratio, 1);
});
