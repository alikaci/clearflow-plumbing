import Link from "next/link";
import { business } from "@/config/business";
import { footerNavigation } from "@/config/navigation";
import { Container } from "@/components/ui/Container";
import { filterNavigation } from "@/lib/features";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const groups = footerNavigation
    .map((group) => ({ ...group, items: filterNavigation(group.items) }))
    .filter((group) => group.items.length > 0);

  return (
    <footer className="bg-navy text-footer-text">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Wordmark variant="dark" />
            <p className="mt-4 max-w-xs text-sm text-footer-muted">
              {business.description}
            </p>
            <ul className="mt-6 flex flex-col gap-2 text-sm text-footer-muted">
              <li>
                <a
href={business.phoneUri}
                className="inline-flex min-h-6 items-center underline-offset-2 transition-colors hover:text-white hover:underline"
              >
                Call {business.phoneDisplay}
                </a>
              </li>
              <li>
                {business.email.href ? (
                  <a
                    href={business.email.href}
                    className="underline-offset-2 transition-colors hover:text-white hover:underline"
                  >
                    {business.email.display}
                  </a>
                ) : (
                  <span>{business.email.display}</span>
                )}
              </li>
              <li>Office hours: {business.hours.full}</li>
              <li>
                <Link
                  href="/emergency"
                  className="inline-flex min-h-6 items-center underline-offset-2 hover:text-white hover:underline"
                >
                  {business.hours.emergencyLabel}
                </Link>
              </li>
              <li>Serving {business.serviceArea}</li>
            </ul>
          </div>

          {groups.map((group) => (
            <nav key={group.id} aria-label={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-footer-text">
                {group.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex py-0.5 text-sm text-footer-muted underline-offset-2 transition-colors hover:text-white hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col gap-3">
            <p className="text-sm text-footer-muted">
              {business.disclosures.fictional}
            </p>
            <p className="text-sm text-footer-muted">
              {business.disclosures.aiImagery}
            </p>
          </div>
          <p className="mt-6 text-sm text-footer-muted">
            {business.disclosures.copyright}
          </p>
          <div className="mt-6 flex justify-end">
            <a
              href="#top"
              className="inline-flex min-h-6 items-center text-sm font-medium text-footer-muted underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              Back to top
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
