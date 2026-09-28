export const MOTION_STAGGER_STEP = 60;
export const MOTION_STAGGER_MAX = 240;

/**
 * Bounded stagger delay in milliseconds for a 0-based index. The cap keeps the
 * last cards of long grids from lingering on screen after the first row has
 * arrived, so motion stays responsive rather than decorative.
 */
export function staggerDelay(index: number): number {
  const normalized = Number.isFinite(index) && index > 0 ? Math.floor(index) : 0;
  return Math.min(normalized * MOTION_STAGGER_STEP, MOTION_STAGGER_MAX);
}