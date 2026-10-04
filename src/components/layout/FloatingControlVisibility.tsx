"use client";

import { useEffect } from "react";

/**
 * Width at and above which the fixed action bar is not rendered and the
 * suppression never applies.
 */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * Dead band, in pixels, around the sticky-header boundary.
 *
 * Without it, a scroll position that lands exactly on the boundary makes the
 * controls show and hide on consecutive frames, which reads as a flicker. The
 * band is one-sided: hiding requires the Hero to come HYSTERESIS_PX *below* the
 * line, while revealing happens as soon as it reaches the line. That asymmetry
 * keeps the common case (reveal the instant the Hero is gone) immediate, and only
 * makes re-hiding slightly sticky.
 */
const HYSTERESIS_PX = 8;

/**
 * Suppresses the fixed floating controls for as long as any meaningful part of
 * the Hero is still on screen below the sticky header.
 *
 * The Hero carries its own phone CTA and primary CTA, so while it is in view the
 * fixed action bar and assistant launcher are redundant and sit on top of content
 * the visitor is trying to read. The rule is deliberately absolute rather than
 * proportional: the controls appear only once the Hero's bottom edge has passed
 * the sticky header, so there is never a moment where both the Hero's own CTAs
 * and the floating controls are competing for the same space.
 *
 * The state is published as `data-floating-controls` on <html> and consumed in
 * CSS. That keeps the two floating components free of this concern, lets the
 * transition run without re-rendering either of them, and matches the existing
 * `data-shell-menu-open` / `data-assistant-open` convention.
 *
 * Two properties matter here:
 *
 * - No layout shift. Both controls are `position: fixed`, so suppressing them
 *   reflows nothing. The body's reserved action-bar padding is left untouched.
 * - Fails open. Without JavaScript the attribute is never written, so both
 *   controls stay visible and reachable exactly as before.
 *
 * `visibility` is what removes a hidden control from the tab order and the
 * accessibility tree; it is toggled in CSS with a delay so the fade-out finishes
 * before the control disappears.
 */
export function FloatingControlVisibility() {
  useEffect(() => {
    const root = document.documentElement;
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const clear = () => {
      delete root.dataset.floatingControls;
    };

    // Only a page that actually renders a Hero opts in, so no route check is
    // needed: every other route simply finds no Hero and bails out.
    const hero =
      document.querySelector("main [data-hero-root]")?.closest("section") ?? null;
    if (!hero) {
      clear();
      return;
    }

    // The sticky header's own height is the boundary line, and it is a constant
    // because the element is `sticky top-0`: once pinned it always occupies
    // 0..height regardless of scroll position. Measuring it beats hardcoding 65.
    const header = document.querySelector("[data-sticky-header]");
    if (!header) {
      clear();
      return;
    }

    // Current state, kept outside the DOM so the hysteresis band survives
    // between frames and between events.
    let state: "hero" | "page" | null = null;

    const apply = () => {
      // Above lg the action bar is not rendered and the launcher is useful
      // alongside the Hero, so the suppression never applies there.
      if (desktop.matches) {
        clear();
        state = null;
        return;
      }

      const boundary = header.getBoundingClientRect().height;
      const heroBottom = hero.getBoundingClientRect().bottom;

      // Never hide a control the keyboard is currently sitting on. Losing focus
      // to <body> because a scroll happened would strand keyboard and screen
      // reader users, so this fails open and the next focus change re-evaluates.
      const active = document.activeElement;
      const focusInsideControl =
        active instanceof Element &&
        active.closest("[data-floating-control]") !== null;

      let next: "hero" | "page";
      if (focusInsideControl) {
        next = "page";
      } else if (state === "page") {
        // Revealed: stay revealed until the Hero comes back past the line plus
        // the dead band.
        next = heroBottom > boundary + HYSTERESIS_PX ? "hero" : "page";
      } else {
        // Hidden (or not yet measured): reveal the moment the Hero's bottom has
        // passed the line.
        next = heroBottom <= boundary ? "page" : "hero";
      }

      if (root.dataset.floatingControls !== next) {
        root.dataset.floatingControls = next;
      }
      state = next;
    };

    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        apply();
      });
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("focusin", schedule);
    document.addEventListener("focusout", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("focusin", schedule);
      document.removeEventListener("focusout", schedule);
      if (frame) window.cancelAnimationFrame(frame);
      clear();
    };
  }, []);

  return null;
}