"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { mainNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { filterNavigation } from "@/lib/features";
import { resolveHashHref } from "@/lib/links";
import { Wordmark } from "./Wordmark";
import { MobileMenu } from "./MobileMenu";

function isActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const navItems = filterNavigation(mainNavigation);
  const estimateHref = resolveHashHref(business.primaryCta.href, pathname);

  // Reflect the scroll position on the header (a soft shadow only) so the page
  // boundary stays readable once the user scrolls; the attribute is toggled on
  // the root and read by pure CSS, and the shadow never changes layout.
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      if (window.scrollY > 8) root.setAttribute("data-scrolled", "true");
      else root.removeAttribute("data-scrolled");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      root.removeAttribute("data-scrolled");
    };
  }, []);

  return (
    <header
      id="top"
      data-sticky-header="true"
      className="site-header sticky top-0 z-30 border-b border-border bg-white"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded-lg px-2.5 py-2 text-sm font-medium microtransition underline-offset-4",
                      active
                        ? "text-blue underline decoration-blue decoration-2"
                        : "text-text hover:text-blue",
                    ].join(" ")}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button
            href={business.secondaryCta.href}
            variant="ghost"
            className="hidden xl:inline-flex"
            aria-label={`Call ${business.phoneDisplay}`}
          >
            {business.phoneDisplay}
          </Button>
          <Button href={estimateHref} variant="primary">
            {business.primaryCta.label}
          </Button>
        </div>

        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}