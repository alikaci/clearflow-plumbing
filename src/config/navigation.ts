import type { NavigationItem } from "@/types";

export const mainNavigation: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Emergency", href: "/emergency" },
  { label: "Service Areas", href: "/service-areas" },
  { label: "About", href: "/about" },
  { label: "Offers", href: "/offers", flag: "specialOffers" },
  { label: "Contact", href: "/contact" },
];