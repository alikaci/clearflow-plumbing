"use client";

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

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href, pathname) ? "page" : undefined}
                  className="block rounded-lg px-2.5 py-2 text-sm font-medium text-text transition-colors hover:text-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
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