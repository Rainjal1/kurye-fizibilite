export const EXPENSE_ROW_LAYOUT = {
  defaultLabelRatio: 0.58,
  keyboardAdjustmentWidth: 16,
  minimumLabelWidth: 64,
  minimumValueCellWidth: 136,
} as const;

export function calculateExpenseLabelRatio(
  labelWidth: number,
  rowWidth: number
): number {
  const availableWidth = Math.max(
    EXPENSE_ROW_LAYOUT.minimumLabelWidth,
    rowWidth - EXPENSE_ROW_LAYOUT.minimumValueCellWidth
  );
  const maximumLabelWidth = availableWidth;
  const safeLabelWidth = Math.min(
    Math.max(labelWidth, EXPENSE_ROW_LAYOUT.minimumLabelWidth),
    maximumLabelWidth
  );

  return safeLabelWidth / availableWidth;
}
