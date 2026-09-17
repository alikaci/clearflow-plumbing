"use client";

import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { Button } from "@/components/ui/Button";
import { resolveHashHref } from "@/lib/links";

export function MobileActionBar() {
  const pathname = usePathname();
  const requestHref = resolveHashHref(
    business.mobileBar.request.href,
    pathname,
  );

  return (
    <div
      className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="grid grid-cols-2 gap-2 px-4 pt-2">
        <Button href={business.mobileBar.call.href} variant="secondary" size="lg">
          {business.mobileBar.call.label}
        </Button>
        <Button href={requestHref} variant="primary" size="lg">
          {business.mobileBar.request.label}
        </Button>
      </div>
    </div>
  );
}
