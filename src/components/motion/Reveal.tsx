"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { staggerDelay } from "@/lib/motion";

type RevealVariant = "fade" | "up" | "in";

type RevealProps = {
  children: ReactNode;
  /** Element rendered as the reveal wrapper; join grids with "li". */
  as?: ElementType;
  variant?: RevealVariant;
  /** 0-based index used to derive a bounded stagger delay. */
  index?: number;
  /** Explicit delay override; falls back to the bounded stagger helper. */
  delayMs?: number;
  className?: string;
};

/**
 * Progressive-enhancement reveal on scroll.
 *
 * Content is fully visible in the server-rendered HTML and stays visible
 * whenever JavaScript is unavailable or "prefers-reduced-motion" is set. Only
 * after hydration, for elements that sit below the fold, is the "pending" state
 * applied, and an IntersectionObserver flips it to "revealed" once. A 4s timer
 * fail-opens any element the observer never fires for, and elements that are
 * already in view are revealed on the next frame so the first paint is stable.
 */
export function Reveal({
  children,
  as,
  variant = "up",
  index = 0,
  delayMs,
  className,
}: RevealProps) {
  const nodeRef = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<"idle" | "pending" | "revealed">("idle");

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let revealed = false;
    let observer: IntersectionObserver | null = null;
    let frame = 0;
    let failOpen = 0;

    const revealSafely = () => {
      if (revealed) return;
      revealed = true;
      observer?.disconnect();
      window.clearTimeout(failOpen);
      setState("revealed");
    };

    const canMatchMedia = typeof window.matchMedia === "function";
    const prefersReduced =
      canMatchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!("IntersectionObserver" in window) || prefersReduced) {
      frame = window.requestAnimationFrame(revealSafely);
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    const isBelowFold = () => {
      const rect = node.getBoundingClientRect();
      return rect.bottom <= 0 || rect.top > window.innerHeight;
    };

    // Elements already in view at hydration are revealed on the next frame
    // without ever creating an observer.
    if (!isBelowFold()) {
      frame = window.requestAnimationFrame(revealSafely);
      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    frame = window.requestAnimationFrame(() => {
      setState("pending");
    });

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) revealSafely();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);

    failOpen = window.setTimeout(revealSafely, 4000);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(failOpen);
      observer?.disconnect();
    };
  }, []);

  const delay = delayMs ?? staggerDelay(index);
  const attributes = {
    "data-reveal": "",
    "data-reveal-variant": variant,
    "data-reveal-state": state,
    style: { "--reveal-stagger-ms": `${delay}ms` } as CSSProperties,
    className,
  };

  const Tag = as as "div" | "li" | undefined;
  if (Tag === "li") {
    return (
      <li ref={nodeRef as React.Ref<HTMLLIElement>} {...attributes}>
        {children}
      </li>
    );
  }
  return (
    <div ref={nodeRef as React.Ref<HTMLDivElement>} {...attributes}>
      {children}
    </div>
  );
}