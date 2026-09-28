import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { createElement } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { afterEach, vi } from "vitest";

vi.mock("next/link", () => ({
  __esModule: true,
  default: ({
    children,
    href,
    ...rest
  }: { children?: ReactNode; href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) =>
    createElement("a", { href: String(href), ...rest }, children),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

if (typeof window !== "undefined") {
  if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = (callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 0);
  }
  if (typeof window.cancelAnimationFrame !== "function") {
    window.cancelAnimationFrame = (id: number) => window.clearTimeout(id);
  }
}
