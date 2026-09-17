import Link from "next/link";
import { business } from "@/config/business";
import { mainNavigation } from "@/config/navigation";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "./Wordmark";

export function Footer() {
  const serviceLinks = [
    { href: "/services", label: "Plumbing Services" },
    { href: "/emergency", label: "Emergency Plumbing" },
    { href: "/service-areas", label: "Service Areas" },
  ];

  return (
    <footer className="bg-navy text-footer-text">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Wordmark variant="dark" />
            <p className="mt-4 max-w-xs text-sm text-footer-muted">
              {business.description}
            </p>
          </div>

          <nav aria-label="Main">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-footer-text">
              Main
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {mainNavigation.map((item) => (
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

          <nav aria-label="Services">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-footer-text">
              Services
            </h2>
            <ul className="mt-4 flex flex-col gap-2">
              {serviceLinks.map((item) => (
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

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-footer-text">
              Contact
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-footer-muted">
              <li>
                <a
                  href={business.phoneUri}
                  className="underline-offset-2 transition-colors hover:text-white hover:underline"
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
              <li>{business.hours.full}</li>
            </ul>
          </div>
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
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/privacy"
              className="text-sm text-footer-muted underline-offset-2 transition-colors hover:text-white hover:underline"
            >
              Privacy
            </Link>
            <p className="text-sm text-footer-muted">
              {business.disclosures.copyright}
            </p>
          </div>
          <p className="mt-3 text-sm text-footer-muted">Concept by {business.creator}</p>
        </div>
      </Container>
    </footer>
  );
}