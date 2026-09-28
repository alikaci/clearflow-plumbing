import { describe, expect, it } from "vitest";
import {
  MOTION_STAGGER_MAX,
  MOTION_STAGGER_STEP,
  staggerDelay,
} from "@/lib/motion";

describe("staggerDelay", () => {
  it("returns no delay for the first item", () => {
    expect(staggerDelay(0)).toBe(0);
  });

  it("multiplies the step for later items", () => {
    expect(staggerDelay(1)).toBe(MOTION_STAGGER_STEP);
    expect(staggerDelay(2)).toBe(MOTION_STAGGER_STEP * 2);
    expect(staggerDelay(3)).toBe(MOTION_STAGGER_STEP * 3);
  });

  it("caps the delay at the maximum so long grids stay responsive", () => {
    expect(staggerDelay(MOTION_STAGGER_MAX / MOTION_STAGGER_STEP)).toBe(
      MOTION_STAGGER_MAX,
    );
    expect(staggerDelay(20)).toBe(MOTION_STAGGER_MAX);
    expect(staggerDelay(100)).toBe(MOTION_STAGGER_MAX);
  });

  it("treats negative and non-finite indexes as the first item", () => {
    expect(staggerDelay(-1)).toBe(0);
    expect(staggerDelay(Number.NaN)).toBe(0);
    expect(staggerDelay(Number.POSITIVE_INFINITY)).toBe(0);
  });
});