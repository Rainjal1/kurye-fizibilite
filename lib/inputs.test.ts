import assert from "node:assert/strict";
import test from "node:test";

import { adjustNumberValue } from "./inputs.ts";

test("adjusts revenue values with stepper controls", () => {
  assert.equal(adjustNumberValue(30, 1, 1), 31);
  assert.equal(adjustNumberValue(30, -1, 1), 29);
  assert.equal(adjustNumberValue(105, 1, 5), 110);
  assert.equal(adjustNumberValue(105, -1, 5), 100);
});

test("never steps below zero", () => {
  assert.equal(adjustNumberValue(0, -1, 1), 0);
});
