import assert from "node:assert/strict";
import test from "node:test";

import {
  readStorageItem,
  readStoredTheme,
  writeStoredTheme,
  writeStorageItem,
} from "./storage.ts";

function createStorage(initialValue: string | null = null) {
  const values = new Map<string, string>();
  if (initialValue !== null) values.set("theme", initialValue);

  return {
    getItem(key: string) {
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      values.set(key, value);
    },
    get values() {
      return values;
    },
  };
}

test("reads a normal stored theme", () => {
  const storage = createStorage('"dark"');

  assert.equal(readStoredTheme(storage), "dark");
});

test("reads an empty storage as no stored theme", () => {
  assert.equal(readStoredTheme(createStorage()), null);
  assert.equal(readStoredTheme(createStorage("")), null);
});

test("falls back to the default theme when stored JSON is corrupt", () => {
  assert.equal(readStoredTheme(createStorage("{invalid")), null);
});

test("continues when storage access fails", () => {
  const storage = createStorage();
  storage.getItem = () => {
    throw new Error("Storage is disabled");
  };

  assert.equal(readStorageItem(storage, "theme"), null);
  assert.equal(readStoredTheme(storage), null);
});

test("continues when storage writes fail", () => {
  const storage = createStorage();
  storage.setItem = () => {
    throw new Error("Storage quota is exceeded");
  };

  assert.equal(writeStorageItem(storage, "theme", '"dark"'), false);
  assert.equal(writeStoredTheme(storage, "dark"), false);
});

test("supports the legacy unquoted theme value", () => {
  assert.equal(readStoredTheme(createStorage("light")), "light");
});

test("writes the theme as JSON", () => {
  const storage = createStorage();

  assert.equal(writeStoredTheme(storage, "dark"), true);
  assert.equal(storage.values.get("theme"), '"dark"');
});
