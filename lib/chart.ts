const compactNumberFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 1,
});

export function formatCompactTRY(value: number): string {
  if (!Number.isFinite(value)) return "₺0";

  const absoluteValue = Math.abs(value);
  if (absoluteValue >= 1_000_000_000) {
    return `₺${compactNumberFormatter.format(value / 1_000_000_000)} Mr`;
  }
  if (absoluteValue >= 1_000_000) {
    return `₺${compactNumberFormatter.format(value / 1_000_000)} Mn`;
  }
  if (absoluteValue >= 1_000) {
    return `₺${compactNumberFormatter.format(value / 1_000)} B`;
  }
  return `₺${compactNumberFormatter.format(value)}`;
}
