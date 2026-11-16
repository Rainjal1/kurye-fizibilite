export type StepperDirection = 1 | -1;

export function adjustNumberValue(
  value: number,
  direction: StepperDirection,
  step: number,
  minimum = 0
): number {
  const nextValue = value + direction * step;
  return Number.isFinite(nextValue) ? Math.max(minimum, nextValue) : minimum;
}
