"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { Button } from "@/components/ui/Button";
import { resolveHashHref } from "@/lib/links";

export function MobileActionBar() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const requestHref = resolveHashHref(
    business.mobileBar.request.href,
    pathname,
  );

  // The bar's real height depends on the device safe-area inset, the label
  // wrapping at narrow widths and any user text scaling, so publish the
  // measured height instead of hard-coding it. The page shell and the assistant
  // launcher both read --mobile-action-bar-height from this value.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar || typeof ResizeObserver === "undefined") return;

    const root = document.documentElement;
    const publish = () => {
      root.style.setProperty(
        "--mobile-action-bar-height",
        `${Math.round(bar.getBoundingClientRect().height)}px`,
      );
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(bar);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--mobile-action-bar-height");
    };
  }, []);

  return (
    <div
      ref={barRef}
      className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-4 pt-2">
        <Button
          href={business.mobileBar.call.href}
          variant="secondary"
          size="lg"
          className="max-[26rem]:px-3 max-[26rem]:text-[0.9375rem]"
        >
          {business.mobileBar.call.label}
        </Button>
        <Button
          href={requestHref}
          variant="primary"
          size="lg"
          className="max-[26rem]:px-3 max-[26rem]:text-[0.9375rem]"
        >
          {business.mobileBar.request.label}
        </Button>
      </div>
    </div>
  );
}
