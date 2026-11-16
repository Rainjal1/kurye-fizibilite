import assert from "node:assert/strict";
import test from "node:test";

import { formatCompactTRY } from "./chart.ts";

test("formats large chart values as compact Turkish lira", () => {
  assert.equal(formatCompactTRY(75600), "₺75,6 B");
  assert.equal(formatCompactTRY(143900), "₺143,9 B");
  assert.equal(formatCompactTRY(1250000), "₺1,3 Mn");
  assert.equal(formatCompactTRY(950), "₺950");
});
