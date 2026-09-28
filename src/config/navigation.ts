import type { FooterNavGroup, NavigationItem } from "@/types";
import { serviceSummaries } from "./services";

export const mainNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Emergency", href: "/emergency", flag: "emergencyPath" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "Offers", href: "/offers", flag: "specialOffers" },
  { label: "Contact", href: "/contact" },
];

export const footerNavigation: readonly FooterNavGroup[] = [
  {
    id: "company",
    title: "Company",
    items: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
  {
    id: "services",
    title: "Services",
    items: [
      { label: "All Services", href: "/services" },
      ...serviceSummaries.map((service) => ({
        label: service.shortName,
        href: `/services/${service.slug}`,
      })),
    ],
  },
  {
    id: "coverage",
    title: "Coverage",
    items: [
      { label: "Service Areas", href: "/service-areas" },
      { label: "Emergency", href: "/emergency", flag: "emergencyPath" },
      { label: "Booking Preview", href: "/book", flag: "onlineBooking" },
    ],
  },
  {
    id: "more",
    title: "More",
    items: [
      { label: "Gallery", href: "/gallery", flag: "gallery" },
      { label: "Offers", href: "/offers", flag: "specialOffers" },
      { label: "Membership", href: "/membership", flag: "membership" },
      { label: "Financing", href: "/financing", flag: "financing" },
      { label: "How Pricing Works", href: "/pricing" },
    ],
  },
];
