import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, waitFor } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  callback: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;
  observed: Element[] = [];
  disconnected = false;

  constructor(
    callback: (entries: Array<{ isIntersecting: boolean; target: Element }>) => void,
  ) {
    this.callback = callback;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(element: Element) {
    this.observed.push(element);
  }

  unobserve() {}

  disconnect() {
    this.disconnected = true;
  }

  trigger(intersecting: boolean) {
    this.callback(
      this.observed.map((target) => ({ isIntersecting: intersecting, target })),
    );
  }
}

function stubIntersectionObserver() {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
}

function stubMatchMedia(matches: boolean) {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches })));
}

const originalRect = Element.prototype.getBoundingClientRect;

function belowFoldRect() {
  Element.prototype.getBoundingClientRect = function (
    this: Element,
  ): DOMRect {
    if (this.hasAttribute("data-reveal")) {
      return {
        top: 2000,
        bottom: 2600,
        height: 600,
        width: 300,
        left: 0,
        right: 300,
        x: 0,
        y: 2000,
        toJSON: () => ({}),
      } as DOMRect;
    }
    return originalRect.call(this);
  };
}

afterEach(() => {
  Element.prototype.getBoundingClientRect = originalRect;
  vi.unstubAllGlobals();
  cleanup();
});

describe("Reveal", () => {
  it("renders children server-side style and reveals immediately when the observer is missing", async () => {
    render(<Reveal index={4}>Request a visit</Reveal>);

    const node = document.querySelector("[data-reveal]");
    expect(node).not.toBeNull();
    expect(node).toHaveAttribute("data-reveal-variant", "up");
    await waitFor(() =>
      expect(node).toHaveAttribute("data-reveal-state", "revealed"),
    );
    expect((node as HTMLElement).style.getPropertyValue("--reveal-stagger-ms")).toBe(
      "240ms",
    );
    expect(node).toHaveTextContent("Request a visit");
  });

  it("applies the bounded stagger delay from the index and honors explicit delays", () => {
    const { container } = render(
      <>
        <Reveal index={1}>a</Reveal>
        <Reveal index={9}>b</Reveal>
        <Reveal delayMs={500}>c</Reveal>
      </>,
    );

    const nodes = container.querySelectorAll("[data-reveal]");
    expect(nodes).toHaveLength(3);
    expect((nodes[0] as HTMLElement).style.getPropertyValue("--reveal-stagger-ms")).toBe(
      "60ms",
    );
    expect((nodes[1] as HTMLElement).style.getPropertyValue("--reveal-stagger-ms")).toBe(
      "240ms",
    );
    expect((nodes[2] as HTMLElement).style.getPropertyValue("--reveal-stagger-ms")).toBe(
      "500ms",
    );
  });

  it("keeps content visible immediately under prefers-reduced-motion", async () => {
    stubIntersectionObserver();
    stubMatchMedia(true);

    render(<Reveal>Reduced motion me</Reveal>);

    const node = document.querySelector("[data-reveal]");
    expect(node).toHaveTextContent("Reduced motion me");
    await waitFor(() =>
      expect(node).toHaveAttribute("data-reveal-state", "revealed"),
    );
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("marks a below-the-fold element pending after a frame, then reveals it once it intersects and disconnects", async () => {
    stubIntersectionObserver();
    belowFoldRect();

    render(<Reveal>Below the fold</Reveal>);

    await waitFor(() =>
      expect(document.querySelector("[data-reveal]")).toHaveAttribute(
        "data-reveal-state",
        "pending",
      ),
    );

    const observer = FakeIntersectionObserver.instances[0];
    expect(observer.observed).toHaveLength(1);
    expect(observer.disconnected).toBe(false);

    act(() => {
      observer.trigger(true);
    });

    expect(document.querySelector("[data-reveal]")).toHaveAttribute(
      "data-reveal-state",
      "revealed",
    );
    expect(observer.disconnected).toBe(true);
  });

  it("keeps above-the-fold content revealed without ever creating an observer", async () => {
    stubIntersectionObserver();
    Element.prototype.getBoundingClientRect = function (
      this: Element,
    ): DOMRect {
      if (this.hasAttribute("data-reveal")) {
        return {
          top: 100,
          bottom: 500,
          height: 400,
          width: 300,
          left: 0,
          right: 300,
          x: 0,
          y: 100,
          toJSON: () => ({}),
        } as DOMRect;
      }
      return originalRect.call(this);
    };

    render(<Reveal>Already in view</Reveal>);

    const node = document.querySelector("[data-reveal]");
    await waitFor(() =>
      expect(node).toHaveAttribute("data-reveal-state", "revealed"),
    );
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it("preserves the requested element type, variant, and className", () => {
    const { container } = render(
      <Reveal as="li" variant="fade" className="border-l-2 pl-4">
        Entry
      </Reveal>,
    );

    const node = container.querySelector("li[data-reveal]");
    expect(node).not.toBeNull();
    expect(node).toHaveAttribute("data-reveal-variant", "fade");
    expect(node).toHaveClass("border-l-2");
    expect(node).toHaveClass("pl-4");
  });
});