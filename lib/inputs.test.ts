import assert from "node:assert/strict";
import test from "node:test";

import {
  NUMBER_INPUT_LIMITS,
  adjustNumberValue,
  normalizeNumberInput,
  parseNumberInput,
} from "./inputs.ts";

test("adjusts revenue values with stepper controls", () => {
  const limits = NUMBER_INPUT_LIMITS.dailyPackages;
  assert.equal(adjustNumberValue(30, 1, 1, limits), 31);
  assert.equal(adjustNumberValue(30, -1, 1, limits), 29);
  assert.equal(adjustNumberValue(105, 1, 5, limits), 110);
  assert.equal(adjustNumberValue(105, -1, 5, limits), 100);
});

test("never steps below zero", () => {
  assert.equal(
    adjustNumberValue(0, -1, 1, NUMBER_INPUT_LIMITS.dailyPackages),
    0
  );
});

test("parses valid numbers", () => {
  const result = parseNumberInput("42", { min: 0, max: 100 });
  assert.equal(result.value, 42);
  assert.equal(result.isValid, true);
  assert.equal(result.isEmpty, false);
});

test("rejects empty input without losing the minimum fallback", () => {
  const result = parseNumberInput("   ", { min: 3, max: 10 });
  assert.equal(result.value, 3);
  assert.equal(result.isValid, false);
  assert.equal(result.isEmpty, true);
});

test("clamps negative values", () => {
  const result = parseNumberInput("-5", { min: 0, max: 100 });
  assert.equal(result.value, 0);
  assert.equal(result.isValid, false);
});

test("rejects NaN and Infinity", () => {
  for (const rawValue of ["NaN", "Infinity", "-Infinity"]) {
    const result = parseNumberInput(rawValue, { min: 0, max: 100 });
    assert.equal(result.value, 0);
    assert.equal(result.isValid, false);
    assert.equal(result.isEmpty, false);
  }
});

test("clamps excessively large values", () => {
  const result = parseNumberInput("1e309", { min: 0, max: 100 });
  assert.equal(result.value, 0);
  assert.equal(result.isValid, false);
});

test("uses the projection month limits", () => {
  const limits = NUMBER_INPUT_LIMITS.projectionMonths;
  assert.equal(parseNumberInput("0", limits).value, 1);
  assert.equal(parseNumberInput("1", limits).value, 1);
  assert.equal(parseNumberInput("120", limits).value, 120);
  assert.equal(parseNumberInput("121", limits).value, 120);
});

test("normalizes invalid numeric state", () => {
  assert.equal(normalizeNumberInput(Number.NaN, { min: 2, max: 5 }), 2);
  assert.equal(normalizeNumberInput(Number.POSITIVE_INFINITY, { min: 2, max: 5 }), 2);
  assert.equal(normalizeNumberInput(10, { min: 2, max: 5 }), 5);
});
