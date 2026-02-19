/**
 * Format a number with locale-aware separators.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString();
}

/**
 * Format a percentage value.
 * Shows <0.01% for very small non-zero values.
 */
export function formatDensity(pct: number): string {
  if (pct === 0) return '0%';
  if (pct < 0.01) return '<0.01%';
  return pct.toFixed(2) + '%';
}

/**
 * Format entropy value.
 */
export function formatEntropy(entropy: number): string {
  if (entropy === 0) return '—';
  return entropy.toFixed(2);
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
