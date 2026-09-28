import type { ServiceAreaConfig } from "@/types";
import { getPostalCodeExample, getPostalCodeFieldLabel } from "@/lib/market";

export const serviceAreas = {
  heading: "Plumbing Service Across Columbus and Nearby Communities",
  supportingText:
    "ClearFlow is presented as a Columbus-area plumbing service for this portfolio concept. Check whether your ZIP code appears in the demonstration coverage list, then request an estimate if you would like the team to confirm availability.",
  areas: [
    {
      name: "Columbus",
      description:
        "The central service area for this concept, covering older homes, rentals and small commercial properties across the city.",
    },
    {
      name: "Dublin",
      description:
        "Suburban properties where water-heater service, fixture repairs and drain maintenance are common requests.",
    },
    {
      name: "Westerville",
      description:
        "Established neighborhoods with a mix of aging pipework and newer fixtures that may need assessment.",
    },
    {
      name: "Hilliard",
      description:
        "Family homes where sump pumps, floor drains and general plumbing upkeep are frequent needs.",
    },
    {
      name: "Grove City",
      description:
        "Southwest communities with a blend of residential plumbing repairs and light commercial requests.",
    },
    {
      name: "Gahanna",
      description:
        "Northeast neighborhoods where leak detection and water-pressure concerns are common topics.",
    },
    {
      name: "Reynoldsburg",
      description:
        "East-side properties where sewer-line assessments and repeated drain blockages are typical requests.",
    },
    {
      name: "Worthington",
      description:
        "Older housing stock where pipe condition, fixture updates and water-heater replacement are frequent.",
    },
  ],
  zips: [
    "43004",
    "43016",
    "43017",
    "43026",
    "43068",
    "43081",
    "43085",
    "43109",
    "43110",
    "43119",
    "43123",
    "43125",
    "43137",
    "43201",
    "43202",
    "43204",
    "43206",
    "43209",
    "43211",
    "43213",
    "43214",
    "43215",
    "43219",
    "43220",
    "43221",
    "43229",
    "43231",
    "43235",
  ],
  checkerTitle: "Check Your ZIP Code",
  checkerDescription:
    "Enter a five-digit ZIP code to see whether it is part of the demonstration service area.",
  zipLabel: getPostalCodeFieldLabel(),
  zipHelp: `Five digits, for example ${getPostalCodeExample()}.`,
  submitLabel: "Check coverage",
  resetLabel: "Check another ZIP",
  successMessage:
    "Good news — this ZIP code is included in the demonstration service area.",
  alternativeMessage:
    "This area is not listed yet. Submit a request and the team can confirm availability.",
  disclaimer: "Service-area results are shown for portfolio demonstration.",
  invalidMessage: "Enter a five-digit ZIP code.",
} satisfies ServiceAreaConfig;
