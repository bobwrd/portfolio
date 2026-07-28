/** Covers the Roman grain fleet (~1st-3rd c. CE) through the present, in decade steps. */
export const MIN_DECADE = -300;
export const MAX_DECADE = 2020;
export const DECADE_STEP = 10;

export function formatDecade(decade: number): string {
  if (decade < 0) return `${Math.abs(decade)}s BCE`;
  if (decade < 1000) return `${decade}s CE`;
  return `${decade}s`;
}

export function clampToDecade(year: number): number {
  const d = Math.round(year / DECADE_STEP) * DECADE_STEP;
  return Math.min(MAX_DECADE, Math.max(MIN_DECADE, d));
}
