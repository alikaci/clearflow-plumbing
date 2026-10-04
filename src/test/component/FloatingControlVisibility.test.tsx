import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FloatingControlVisibility } from "@/components/layout/FloatingControlVisibility";

/**
 * The controller publishes `data-floating-controls` on <html> and consumes it in
 * CSS, so these tests assert the published state and the CSS contract is
 * covered separately by the browser probe.
 *
 * The rule under test is absolute, not proportional: the floating controls stay
 * suppressed until the Hero's bottom edge has passed the sticky header.
 */

/** Real height of the Hero at 390x844. */
const HERO_HEIGHT = 930;

/** The sticky header is `h-16` plus a 1px border. */
const HEADER_HEIGHT = 65;

/** Dead band, mirroring HYSTERESIS_PX in the component. */
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

function flush() {
  act(() => {
    vi.advanceTimersByTime(1);
  });
}

function scroll() {
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
  flush();
}

function focusChange() {
  act(() => {
    document.dispatchEvent(new Event("focusin"));
  });
  flush();
}

const state = () => document.documentElement.dataset.floatingControls;

let desktopMatches = false;

beforeEach(() => {
  vi.useFakeTimers();
  /*
  jsdom's own requestAnimationFrame is not driven by Vitest's fake timers, so
  the component's rAF throttle would never run. Routing it through setTimeout
  makes the throttled callback observable with advanceTimersByTime.
  */
  window.requestAnimationFrame = ((callback: FrameRequestCallback) =>
    window.setTimeout(() => callback(0), 0)) as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = ((id: number) =>
    window.clearTimeout(id)) as typeof window.cancelAnimationFrame;

  desktopMatches = false;
  window.matchMedia = ((query: string) => ({
    // A getter, not a snapshot: the component captures the MediaQueryList once
    // and reads `.matches` on every evaluation, so a resize test has to be able
    // to flip the value after mount.
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
  cleanup();
  document.body.innerHTML = "";
  document.documentElement.removeAttribute("data-floating-controls");
  vi.useRealTimers();
});

describe("FloatingControlVisibility", () => {
  it("suppresses the floating controls on first paint", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    render(<FloatingControlVisibility />);

    expect(state()).toBe("hero");
  });

  it("keeps the controls suppressed while any part of the Hero is below the sticky header", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);

    // Scrolled well past the fold, but the Hero still has 400px on screen.
    setHeroBottom(hero, 400);
    scroll();

    expect(state()).toBe("hero");
  });

  it("suppresses the controls even when only a sliver of the Hero remains", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);

    setHeroBottom(hero, HEADER_HEIGHT + 1);
    scroll();

    expect(state()).toBe("hero");
  });

  it("reveals the controls exactly when the Hero's bottom reaches the header line", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);

    setHeroBottom(hero, HEADER_HEIGHT);
    scroll();

    expect(state()).toBe("page");
  });

  it("reveals the controls after the Hero has fully exited above the header", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);

    setHeroBottom(hero, -300);
    scroll();

    expect(state()).toBe("page");
  });

  it("hides the controls again when the visitor scrolls back to the Hero", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);

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
      render(<FloatingControlVisibility />);

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
      render(<FloatingControlVisibility />);

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
      render(<FloatingControlVisibility />);

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
    render(<FloatingControlVisibility />);

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
    render(<FloatingControlVisibility />);

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
    render(<FloatingControlVisibility />);

    setHeroBottom(hero, -300);
    scroll();

    const launcher =
      document.querySelector<HTMLButtonElement>("[data-assistant-launcher]")!;
    launcher.focus();
    focusChange();
    expect(state()).toBe("page");

    // The visitor scrolls back to the Hero and then tabs away from the control.
    setHeroBottom(hero, 600);
    act(() => {
      (document.activeElement as HTMLElement | null)?.blur();
      document.dispatchEvent(new Event("focusout"));
    });
    flush();

    expect(state()).toBe("hero");
  });

  it("publishes nothing when the page has no Hero, so the controls stay visible", () => {
    document.body.innerHTML = `
      <header data-sticky-header="true"></header>
      <main><section aria-label="Other"><p>x</p></section></main>
    `;
    render(<FloatingControlVisibility />);

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
    render(<FloatingControlVisibility />);

    expect(state()).toBeUndefined();
  });

  it("publishes nothing above the lg breakpoint, where the action bar does not render", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    desktopMatches = true;

    render(<FloatingControlVisibility />);

    expect(state()).toBeUndefined();
  });

  it("stops suppressing once the viewport is resized up to desktop", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);
    render(<FloatingControlVisibility />);
    expect(state()).toBe("hero");

    desktopMatches = true;
    scroll();

    expect(state()).toBeUndefined();
  });

  it("renders no markup of its own", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    const { container } = render(<FloatingControlVisibility />);

    expect(container).toBeEmptyDOMElement();
  });

  it("clears the published state when it unmounts", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    const { unmount } = render(<FloatingControlVisibility />);
    expect(state()).toBe("hero");

    unmount();

    expect(state()).toBeUndefined();
  });

  it("stops listening after unmount", () => {
    const { hero, header } = mount();
    setHeroBottom(hero, 105 + HERO_HEIGHT);
    setHeaderHeight(header, HEADER_HEIGHT);

    const { unmount } = render(<FloatingControlVisibility />);
    unmount();

    setHeroBottom(hero, -300);
    scroll();

    expect(state()).toBeUndefined();
  });
});