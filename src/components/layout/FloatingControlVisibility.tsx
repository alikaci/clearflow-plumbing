/**
 * Suppresses the fixed floating controls while the Hero is still on screen.
 *
 * Architecture
 * ------------
 * The state machine lives in an inline bootstrap script (the exported
 * `FLOATING_CONTROLS_BOOTSTRAP` source), not in a React effect. That is the
 * correction for the real-device bug: the previous implementation wrote
 * `data-floating-controls` from `useEffect`, which only runs after hydration,
 * so on a physical phone the action bar and assistant launcher painted over
 * the Hero first and only disappeared a second or two later. The script is
 * rendered before the controls in the document, so it executes while the HTML
 * is still streaming - the attribute is already correct by the time
 * `.mobile-action-bar` and the launcher exist, and therefore by the time
 * either can be painted. No timeout, no delay, no race.
 *
 * One source of truth: the same script keeps evaluating after hydration, so
 * there is no handoff window and no chance of two controllers disagreeing
 * inside the hysteresis band. React contributes nothing but the script tag
 * itself.
 *
 * Reactiveness comes from four inputs, all of which re-run the same
 * `evaluate()` through one rAF-throttled `schedule()`:
 *
 * - scroll / resize: the ordinary boundary crossing.
 * - visualViewport resize, orientationchange: Android and iOS address-bar
 *   show/hide, pinch zoom and rotation, where `window.resize` alone is not
 *   guaranteed to fire on every engine.
 * - pageshow: bfcache restoration, which restores the scroll position without
 *   necessarily emitting a scroll event first.
 * - MutationObserver on the document: a client-side navigation that adds or
 *   removes the Hero, and the case where the script ran before the Hero was
 *   parsed. Callbacks run before paint, so a route change cannot show the
 *   controls for a frame.
 *
 * The rule itself is unchanged: hide until the Hero's bottom edge has passed
 * the sticky header, with an 8px dead band so the boundary cannot flicker, and
 * never hide a control the keyboard is currently on. Both controls are
 * `position: fixed`, so suppressing them reflows nothing; the attribute is
 * absent (controls visible) on desktop and on routes without a Hero, and it is
 * also what a browser with JavaScript disabled sees - an honest, usable
 * fallback where everything simply stays reachable.
 */

declare global {
  interface Window {
    /**
     * Live controller instance. Exposed so tests (and console debugging) can
     * re-evaluate on demand or tear the controller down; nothing in the app
     * reads it after the script has started.
     */
    __clearflowFloatingControls?: {
      apply: () => void;
      stop: () => void;
    };
  }
}

/**
 * The bootstrap source. It must stay a plain literal: the server embeds it in
 * the HTML and the client hydrates the exact same string, so any build-time
 * transformation difference between the two bundles would be a hydration
 * mismatch. It also contains no `</script>` sequence and no interpolation.
 */
export const FLOATING_CONTROLS_BOOTSTRAP = `(function () {
  if (window.__clearflowFloatingControls) return;

  var DESKTOP_QUERY = "(min-width: 1024px)";
  var HYSTERESIS_PX = 8;

  var root = document.documentElement;
  var desktop = window.matchMedia(DESKTOP_QUERY);
  var state = null;
  var frame = 0;
  var observer = null;

  function clear() {
    delete root.dataset.floatingControls;
  }

  function evaluate() {
    /*
    Above lg the action bar is not rendered and the launcher is useful next to
    the Hero, so the suppression never applies. The media query is re-read on
    every evaluation so a rotation or resize across the breakpoint is picked up
    without a reload.
    */
    if (desktop.matches) {
      clear();
      state = null;
      return;
    }

    /*
    Re-query both anchors every time instead of caching them: a client-side
    navigation replaces the Hero node, and a cached reference would keep
    reporting the geometry of a detached element (all zeros) forever.
    */
    var marker = document.querySelector("main [data-hero-root]");
    var hero = marker ? marker.closest("section") : null;
    var header = document.querySelector("[data-sticky-header]");

    if (!hero || !header) {
      clear();
      state = null;
      return;
    }

    var boundary = header.getBoundingClientRect().height;
    var heroBottom = hero.getBoundingClientRect().bottom;

    /*
    Never hide a control the keyboard is currently sitting on. Losing focus to
    <body> because a scroll happened would strand keyboard and screen reader
    users, so this fails open and the next focus change re-evaluates.
    */
    var active = document.activeElement;
    var focusInsideControl =
      active !== null &&
      active.nodeType === 1 &&
      active.closest("[data-floating-control]") !== null;

    var next;
    if (focusInsideControl) {
      next = "page";
    } else if (state === "page") {
      // Revealed: stay revealed until the Hero comes back past the line plus
      // the dead band, so jitter around the boundary cannot toggle twice.
      next = heroBottom > boundary + HYSTERESIS_PX ? "hero" : "page";
    } else {
      // Hidden (or not yet measured): reveal the moment the Hero's bottom has
      // passed the line, with no band in this direction.
      next = heroBottom <= boundary ? "page" : "hero";
    }

    if (root.dataset.floatingControls !== next) {
      root.dataset.floatingControls = next;
    }
    state = next;
  }

  function schedule() {
    if (frame) return;
    frame = window.requestAnimationFrame(function () {
      frame = 0;
      evaluate();
    });
  }

  function stop() {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("orientationchange", schedule);
    window.removeEventListener("pageshow", schedule);
    document.removeEventListener("focusin", schedule);
    document.removeEventListener("focusout", schedule);
    document.removeEventListener("DOMContentLoaded", schedule);
    if (desktop.removeEventListener) {
      desktop.removeEventListener("change", schedule);
    }
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", schedule);
    }
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    if (window.__clearflowFloatingControls) {
      delete window.__clearflowFloatingControls;
    }
  }

  window.__clearflowFloatingControls = { apply: evaluate, stop: stop };

  // A font swap can move the Hero's bottom edge without any scroll, resize or
  // DOM change, so re-measure once the real metrics are in.
  if (document.fonts && document.fonts.ready && document.fonts.ready.then) {
    document.fonts.ready.then(schedule);
  }

  evaluate();

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);
  window.addEventListener("pageshow", schedule);
  document.addEventListener("focusin", schedule);
  document.addEventListener("focusout", schedule);
  if (desktop.addEventListener) {
    desktop.addEventListener("change", schedule);
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", schedule);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  }
  if (typeof MutationObserver === "function") {
    observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }
})();`;

/**
 * Renders the bootstrap script. The only contract this component has is
 * document order: it must appear after the Hero and before the floating
 * controls so the attribute is settled before either control exists.
 */
export function FloatingControlVisibility() {
  return <script dangerouslySetInnerHTML={{ __html: FLOATING_CONTROLS_BOOTSTRAP }} />;
}
