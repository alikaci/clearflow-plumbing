import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Assistant } from "@/components/assistant/Assistant";
import { business } from "@/config/business";
import { assistant } from "@/config/assistant";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

let observed: ResizeObserver | undefined;

beforeEach(() => {
  observed = undefined;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(private readonly callback: () => void) {}
      observe() {
        observed = this as unknown as ResizeObserver;
        this.callback();
      }
      disconnect() {}
      unobserve() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.removeAttribute("style");
});

describe("MobileActionBar", () => {
  it("keeps the call and request actions with the demonstration phone number", () => {
    render(<MobileActionBar />);

    expect(
      screen.getByRole("link", { name: business.mobileBar.call.label }),
    ).toHaveAttribute("href", business.mobileBar.call.href);
    expect(business.mobileBar.call.href).toBe("tel:+16145550147");
    expect(
      screen.getByRole("link", { name: business.mobileBar.request.label }),
    ).toHaveAttribute("href", "#estimate");
  });

  it("keeps tappable button sizing and safe-area padding", () => {
    const { container } = render(<MobileActionBar />);
    const bar = container.querySelector(".mobile-action-bar");

    expect(bar).not.toBeNull();
    expect(bar).toHaveStyle({ paddingBottom: "env(safe-area-inset-bottom, 0px)" });
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveClass("min-h-12");
    }
  });

  it("publishes its measured height so the shell and assistant reserve the real space", () => {
    vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
      height: 91,
      width: 360,
      top: 709,
      right: 360,
      bottom: 800,
      left: 0,
      x: 0,
      y: 709,
      toJSON: () => ({}),
    } as DOMRect);

    render(<MobileActionBar />);

    expect(observed).toBeDefined();
    expect(
      document.documentElement.style.getPropertyValue(
        "--mobile-action-bar-height",
      ),
    ).toBe("91px");
  });
});

describe("Assistant", () => {
  it("stays closed on load behind an accessibly named launcher", () => {
    render(<Assistant />);

    const launcher = screen.getByRole("button", {
      name: "Open website assistant",
    });
    expect(launcher).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens a labelled panel that the launcher points to, then closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Assistant />);

    const launcher = screen.getByRole("button", {
      name: "Open website assistant",
    });
    await user.click(launcher);

    const dialog = screen.getByRole("dialog", { name: assistant.title });
    expect(launcher).toHaveAttribute("aria-expanded", "true");
    expect(dialog).toHaveAttribute("id", launcher.getAttribute("aria-controls"));

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(launcher).toHaveAttribute("aria-expanded", "false");
  });

  it("positions itself from the shared action bar height and gap tokens", () => {
    render(<Assistant />);

    const launcher = screen.getByRole("button", {
      name: "Open website assistant",
    });
    expect(launcher.className).toContain(
      "bottom-[calc(var(--mobile-action-bar-height)+var(--mobile-floating-gap))]",
    );
  });
});
