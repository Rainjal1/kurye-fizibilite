export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function readStorageItem(
  storage: StorageLike | null,
  key: string
): string | null {
  if (!storage) return null;

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function parseStoredJson<T>(
  rawValue: string | null,
  isValidValue: (value: unknown) => value is T
): T | null {
  if (rawValue === null) return null;

  try {
    const parsedValue: unknown = JSON.parse(rawValue);
    return isValidValue(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
}

export function writeStorageItem(
  storage: StorageLike | null,
  key: string,
  value: string
): boolean {
  if (!storage) return false;

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function readStoredTheme(storage: StorageLike | null): Theme | null {
  const rawValue = readStorageItem(storage, THEME_STORAGE_KEY);
  const parsedTheme = parseStoredJson(rawValue, isTheme);

  if (parsedTheme) return parsedTheme;
  if (rawValue === "light" || rawValue === "dark") return rawValue;
  return null;
}

export function writeStoredTheme(
  storage: StorageLike | null,
  theme: Theme
): boolean {
  return writeStorageItem(storage, THEME_STORAGE_KEY, JSON.stringify(theme));
}
