import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FLOATING_CONTROLS_BOOTSTRAP,
  FloatingControlVisibility,
} from "@/components/layout/FloatingControlVisibility";

/**
 * The controller is an inline bootstrap script, so these tests start it the
 * same way a browser without a script-element execution path would: by
 * evaluating the exported source. jsdom does not run rendered <script>
 * elements, which is also why the component-contract test below only asserts
 * the markup; the browser-level proof that the script runs during parsing
 * lives in e2e/floating-controls.spec.ts.
 *
 * The rule under test is absolute, not proportional: the floating controls stay
 * suppressed until the Hero's bottom edge has passed the sticky header.
 */

/** Real height of the Hero at 390x844. */
const HERO_HEIGHT = 930;

/** The sticky header is `h-16` plus a 1px border. */
const HEADER_HEIGHT = 65;

/** Dead band, mirroring HYSTERESIS_PX in the script. */
const HYSTERESIS_PX = 8;

function mount() {
  document.body.innerHTML = `
    <header data-sticky-header="true"></header>
    <main>
      <section aria-label="Introduction">
        <div data-hero-root=""><h1>Plumbing Help, Without the Runaround.</h1></div>
      </section>
      <section aria-label="Later"><p>Later content</p></section>
    </main>
    <button type="button" data-floating-control data-assistant-launcher>Assistant</button>
  `;
  return {
    hero: document.querySelector("main [data-hero-root]")!.closest("section")!,
    header: document.querySelector("[data-sticky-header]")!,
  };
}

/** Positions the Hero so that its bottom edge sits at `bottom` in viewport space. */
function setHeroBottom(hero: Element, bottom: number) {
  hero.getBoundingClientRect = () => {
    const top = bottom - HERO_HEIGHT;
    return {
      top,
      bottom,
      left: 0,
      right: 390,
      width: 390,
      height: HERO_HEIGHT,
      x: 0,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  };
}

function setHeaderHeight(header: Element, height: number) {
  header.getBoundingClientRect = () =>
    ({
      top: 0,
      bottom: height,
      left: 0,
      right: 390,
      width: 390,
      height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;
}

/** Starts the bootstrap exactly as the embedded script would. */
function start() {
  window.eval(FLOATING_CONTROLS_BOOTSTRAP);
}

function stop() {
  window.__clearflowFloatingControls?.stop();
}

function flush() {
  vi.advanceTimersByTime(1);
}

function scroll() {
  window.dispatchEvent(new Event("scroll"));
  flush();
}

function focusChange() {
  document.dispatchEvent(new Event("focusin"));
  flush();
}

/**
 * Lets the MutationObserver microtask run, then the rAF-throttled evaluation
 * it schedules through the fake-timer stand-in.
 */
async function settleDomChange() {
  await null;
  flush();
}

const state = () => document.documentElement.dataset.floatingControls;

let desktopMatches = false;

beforeEach(() => {
  vi.useFakeTimers();
  /*
  jsdom's own requestAnimationFrame is not driven by Vitest's fake timers, so
  the controller's rAF throttle would never run. Routing it through setTimeout
  makes the throttled callback observable with advanceTimersByTime.
  */
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(0), 0)) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = ((id: number) =>
    window.clearTimeout(id)) as typeof window.cancelAnimationFrame;

  desktopMatches = false;
  window.matchMedia = ((query: string) => ({
    // A getter, not a snapshot: the controller reads `.matches` on every
    // evaluation, so a resize test has to be able to flip the value after
    // start.
    get matches() {
      return query.includes("min-width") ? desktopMatches : false;
    },
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  document.documentElement.removeAttribute("data-floating-controls");
});

afterEach(() => {
  stop();
  cleanup();
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-floating-controls");
  vi.useRealTimers();
});

describe("floating control bootstrap", () => {
  it("suppresses the floating controls on first paint", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    start();

    expect(state()).toBe("hero");
  });

  it("keeps the controls suppressed while any part of the Hero is below the sticky header", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    // Scrolled well past the fold, but the Hero still has 400px on screen.
    setHeroBottom(hero, 400);
    scroll();

    expect(state()).toBe("hero");
  });

  it("suppresses the controls even when only a sliver of the Hero remains", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, HEADER_HEIGHT + 1);
    scroll();

    expect(state()).toBe("hero");
  });

  it("reveals the controls exactly when the Hero's bottom reaches the header line", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, HEADER_HEIGHT);
    scroll();

    expect(state()).toBe("page");
  });

  it("reveals the controls after the Hero has fully exited above the header", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    scroll();

    expect(state()).toBe("page");
  });

  it("hides the controls again when the visitor scrolls back to the Hero", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    scroll();
    expect(state()).toBe("page");

    setHeroBottom(hero, 600);
    scroll();

    expect(state()).toBe("hero");
  });

  describe("hysteresis", () => {
    it("does not flicker when the Hero re-enters within the dead band", () => {
      const { hero, header } = mount();
      setHeroBottom(hero, 105 + HERO_HEIGHT);
      setHeaderHeight(header, HEADER_HEIGHT);
      start();

      setHeroBottom(hero, -300);
      scroll();
      expect(state()).toBe("page");

      // The Hero comes back, but only just: inside the 8px band the controls
      // stay revealed rather than toggling on consecutive frames.
      setHeroBottom(hero, HEADER_HEIGHT + HYSTERESIS_PX - 1);
      scroll();
      expect(state()).toBe("page");

      setHeroBottom(hero, HEADER_HEIGHT + 1);
      scroll();
      expect(state()).toBe("page");
    });

    it("hides once the Hero passes the far side of the dead band", () => {
      const { hero, header } = mount();
      setHeroBottom(hero, 105 + HERO_HEIGHT);
      setHeaderHeight(header, HEADER_HEIGHT);
      start();

      setHeroBottom(hero, -300);
      scroll();
      expect(state()).toBe("page");

      setHeroBottom(hero, HEADER_HEIGHT + HYSTERESIS_PX + 1);
      scroll();

      expect(state()).toBe("hero");
    });

    it("stays stable when repeatedly nudged across the boundary", () => {
      const { hero, header } = mount();
      setHeroBottom(hero, 105 + HERO_HEIGHT);
      setHeaderHeight(header, HEADER_HEIGHT);
      start();

      setHeroBottom(hero, -300);
      scroll();

      // Jitter either side of the line must not produce a second transition.
      for (const offset of [1, 0, 1, 0, 1]) {
        setHeroBottom(hero, HEADER_HEIGHT + offset);
        scroll();
        expect(state()).toBe("page");
      }
    });
  });

  it("reveals immediately on the way out, with no dead band", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    // Coming from the hidden state, the controls appear as soon as the Hero's
    // bottom touches the line, with no hysteresis in this direction.
    setHeroBottom(hero, HEADER_HEIGHT);
    scroll();

    expect(state()).toBe("page");
  });

  it("never hides a control the keyboard is currently on", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    scroll();
    expect(state()).toBe("page");

    // The visitor scrolls back to the Hero while focused on the launcher.
    const launcher =
      document.querySelector<HTMLButtonElement>("[data-assistant-launcher]")!;
    launcher.focus();
    setHeroBottom(hero, 600);
    focusChange();

    expect(state()).toBe("page");
  });

  it("hides the controls once focus leaves them again", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    scroll();

    const launcher =
      document.querySelector<HTMLButtonElement>("[data-assistant-launcher]")!;
    launcher.focus();
    focusChange();
    expect(state()).toBe("page");

    // The visitor scrolls back to the Hero and then tabs away from the control.
    setHeroBottom(hero, 600);
    (document.activeElement as HTMLElement | null)?.blur();
    focusChange();

    expect(state()).toBe("hero");
  });

  it("publishes nothing when the page has no Hero, so the controls stay visible", () => {
    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main><section aria-label="Other"><p>x</p></section></main>
    `;
    start();

    expect(state()).toBeUndefined();
  });

  it("publishes nothing when there is no sticky header to measure against", () => {
    document.body.innerHTML = `
      <main>
        <section aria-label="Introduction">
          <div data-hero-root=""><h1>Plumbing Help, Without the Runaround.</h1></div>
        </section>
      </main>
    `;
    start();

    expect(state()).toBeUndefined();
  });

  it("publishes nothing above the lg breakpoint, where the action bar does not render", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    desktopMatches = true;

    start();

    expect(state()).toBeUndefined();
  });

  it("stops suppressing once the viewport is resized up to desktop", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    expect(state()).toBe("hero");

    desktopMatches = true;
    scroll();

    expect(state()).toBeUndefined();
  });

  it("keeps the published state stable when nothing relevant changed", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    expect(state()).toBe("hero");

    scroll();
    scroll();

    expect(state()).toBe("hero");
  });
});

describe("bootstrap lifecycle", () => {
  it("starts only once even if the script is evaluated twice", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    start();

    stop();

    // A second listener would survive the single stop() and keep publishing.
    setHeroBottom(hero, -300);
    scroll();

    expect(state()).toBe("hero");
  });

  it("exposes apply() for an on-demand re-evaluation", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    window.__clearflowFloatingControls!.apply();

    expect(state()).toBe("page");
  });

  it("stops listening and releases the global when stopped", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    stop();

    expect(window.__clearflowFloatingControls).toBeUndefined();
    setHeroBottom(hero, -300);
    scroll();
    expect(state()).toBe("hero");
  });

  it("can be started again after a stop", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    stop();

    setHeroBottom(hero, -300);
    start();

    expect(state()).toBe("page");
  });
});

describe("pre-hydration and route-change inputs", () => {
  it("waits for a Hero that has not been parsed yet", async () => {
    // The script ran before the Hero existed in the stream.
    document.body.innerHTML = `<header data-sticky-header="true"></header><main></main>`;
    start();
    expect(state()).toBeUndefined();

    // The Hero arrives; the observer re-evaluates before the next paint.
    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main>
        <section aria-label="Introduction">
          <div data-hero-root=""><h1>Plumbing Help, Without the Runaround.</h1></div>
        </section>
      </main>
    `;
    const hero = document.querySelector("main [data-hero-root]")!.closest("section")!;
    const header = document.querySelector("[data-sticky-header]")!;
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    await settleDomChange();

    expect(state()).toBe("hero");
  });

  it("clears the state when a client-side navigation removes the Hero", async () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    expect(state()).toBe("hero");

    // A route change replaces the page content without any scroll.
    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main><section aria-label="Services"><p>x</p></section></main>
    `;

    await settleDomChange();

    expect(state()).toBeUndefined();
  });

  it("publishes the state when a client-side navigation adds the Hero", async () => {
    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main><section aria-label="Services"><p>x</p></section></main>
    `;
    start();
    expect(state()).toBeUndefined();

    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main>
        <section aria-label="Introduction">
          <div data-hero-root=""><h1>Plumbing Help, Without the Runaround.</h1></div>
        </section>
      </main>
    `;
    const hero = document.querySelector("main [data-hero-root]")!.closest("section")!;
    const header = document.querySelector("[data-sticky-header]")!;
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    await settleDomChange();

    expect(state()).toBe("hero");
  });

  it("re-evaluates on pageshow, as a bfcache restore does", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();
    expect(state()).toBe("hero");

    // The scroll position is restored without a scroll event having fired.
    setHeroBottom(hero, -300);
    window.dispatchEvent(new Event("pageshow"));
    flush();

    expect(state()).toBe("page");
  });

  it("re-evaluates on orientationchange", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    start();

    setHeroBottom(hero, -300);
    window.dispatchEvent(new Event("orientationchange"));
    flush();

    expect(state()).toBe("page");
  });

  it("re-evaluates on visualViewport resize, as an address-bar collapse does", () => {
    const listeners = new Set<EventListener>();
    Object.defineProperty(window, "visualViewport", {
      configurable: true,
      value: {
        addEventListener: (type: string, cb: EventListener) => {
          if (type === "resize") listeners.add(cb);
        },
        removeEventListener: (type: string, cb: EventListener) => {
          if (type === "resize") listeners.delete(cb);
        },
      },
    });

    try {
      const { hero, header } = mount();
      setHeroBottom(hero, 105 + HERO_HEIGHT);
      setHeaderHeight(header, HEADER_HEIGHT);
      start();
      expect(state()).toBe("hero");

      setHeroBottom(hero, -300);
      for (const cb of listeners) cb(new Event("resize"));
      flush();
      expect(state()).toBe("page");

      // The listener is torn down with the rest of the controller.
      stop();
      expect(listeners.size).toBe(0);
    } finally {
      delete (window as { visualViewport?: unknown }).visualViewport;
    }
  });

  it("re-evaluates on DOMContentLoaded when it started mid-parse", async () => {
    Object.defineProperty(document, "readyState", {
      configurable: true,
      value: "loading",
    });

    try {
      document.body.innerHTML = `
        <header data-sticky-header="true"></header>
        <main>
          <section aria-label="Introduction">
            <div data-hero-root=""><h1>Plumbing Help, Without the Runaround.</h1></div>
          </section>
        </main>
      `;
      const hero = document.querySelector("main [data-hero-root]")!.closest("section")!;
      const header = document.querySelector("[data-sticky-header]")!;
      setHeroBottom(hero, 105 + HERO_HEIGHT);
      setHeaderHeight(header, HEADER_HEIGHT);

      // Starts mid-parse with the Hero still on screen...
      start();
      expect(state()).toBe("hero");

      // ...and re-measures once the document finishes parsing.
      setHeroBottom(hero, -300);
      document.dispatchEvent(new Event("DOMContentLoaded"));
      flush();

      expect(state()).toBe("page");
    } finally {
      delete (document as { readyState?: string }).readyState;
    }
  });
});

describe("FloatingControlVisibility component", () => {
  it("renders the bootstrap as an inline script and nothing else", () => {
    const { container } = render(<FloatingControlVisibility />);

    const scripts = container.querySelectorAll("script");
    expect(scripts).toHaveLength(1);
    expect(scripts[0].innerHTML).toBe(FLOATING_CONTROLS_BOOTSTRAP);
    expect(container.firstElementChild).toBe(scripts[0]);
  });

  it("ships a self-contained script with no external references", () => {
    // The source is embedded verbatim into the HTML, so it must not try to
    // import anything or close the script element early.
    expect(FLOATING_CONTROLS_BOOTSTRAP).not.toContain("</script");
    expect(FLOATING_CONTROLS_BOOTSTRAP).not.toContain("import ");
    expect(FLOATING_CONTROLS_BOOTSTRAP).not.toContain("${");
  });
});
