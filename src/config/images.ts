import type { ImageManifest } from "@/types";

/*
Image manifest.

Every slot lists the intended local path for the final AI-generated photo.
Until those files are supplied, `available: false` makes the UI render a
polished, brand-colored SVG fallback at the exact final aspect ratio, so no
broken images or layout shift are possible. To adopt a real photo: place the
file at `src` (under public/), then set `available: true`. No component change
is required.

Full generation prompts live in IMAGE_GENERATION_PROMPTS.md.
*/

export const images: ImageManifest = {
  heroTechnician: {
    src: "/images/hero-technician.jpg",
    alt: "ClearFlow plumbing technician preparing tools before a service visit.",
    width: 1600,
    height: 1200,
    aspectRatio: "4 / 3",
    priority: true,
    decorative: false,
    available: false,
    motif: "pipes",
    generationNote:
      "Photorealistic American plumbing technician in a navy ClearFlow uniform standing beside a service van or open tool case, natural daylight.",
  },
  serviceDrain: {
    src: "/images/service-drain-cleaning.jpg",
    alt: "Kitchen sink drain being inspected during a drain-cleaning service.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "drain",
    generationNote:
      "Photorealistic close view of a residential drain being inspected, clean tools, tidy work area, navy uniform details.",
  },
  serviceLeak: {
    src: "/images/service-leak-repair.jpg",
    alt: "Supply line under a sink being inspected for a leak.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "droplet",
    generationNote:
      "Photorealistic under-sink plumbing inspection with a towel and flashlight, clean cabinet, navy uniform, no visible damage exaggeration.",
  },
  serviceWaterHeater: {
    src: "/images/service-water-heater.jpg",
    alt: "Residential water heater being checked during a maintenance visit.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "tank",
    generationNote:
      "Photorealistic residential water heater in a tidy utility room with gauges and connections clearly visible, natural light.",
  },
  servicePipe: {
    src: "/images/service-pipe-repair.jpg",
    alt: "Exposed plumbing line being assessed for repair.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "pipes",
    generationNote:
      "Photorealistic exposed copper and PEX lines in a clean basement, technician hand pointing at a joint, navy uniform sleeve visible.",
  },
  serviceFaucet: {
    src: "/images/service-toilet-faucet.jpg",
    alt: "Kitchen faucet being serviced by a plumbing technician.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "droplet",
    generationNote:
      "Photorealistic modern kitchen faucet with a technician tightening a connection, clean countertop, natural window light.",
  },
  serviceSump: {
    src: "/images/service-sump-pump.jpg",
    alt: "Sump pump system in a clean basement being inspected.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "drain",
    generationNote:
      "Photorealistic sump pump and pit in a dry, organized basement with discharge line visible, natural light.",
  },
  serviceSewer: {
    src: "/images/service-sewer-line.jpg",
    alt: "Exterior sewer cleanout being reviewed during an assessment.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "pipes",
    generationNote:
      "Photorealistic exterior sewer cleanout near a residential foundation, technician crouching with a clipboard, daylight.",
  },
  technicianHomeowner: {
    src: "/images/technician-homeowner.jpg",
    alt: "ClearFlow technician speaking with a homeowner at the front door.",
    width: 1200,
    height: 900,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "people",
    generationNote:
      "Photorealistic friendly conversation between a navy-uniformed plumbing technician and a homeowner on a porch, natural light, no exaggerated expressions.",
  },
  brandedVan: {
    src: "/images/branded-van.jpg",
    alt: "ClearFlow Plumbing Co. service van parked at a residential curb.",
    width: 1600,
    height: 1000,
    aspectRatio: "16 / 10",
    priority: false,
    decorative: false,
    available: false,
    motif: "van",
    generationNote:
      "Photorealistic white service van with subtle navy ClearFlow branding, parked on a residential street, unreadable license plate.",
  },
  aboutTeam: {
    src: "/images/about-team.jpg",
    alt: "Illustrative scene representing the ClearFlow concept team and service approach.",
    width: 1400,
    height: 1050,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "people",
    generationNote:
      "Photorealistic small plumbing team in navy uniforms reviewing a job board in a clean shop, no name badges, no readable text.",
  },
  galleryPipeBefore: {
    src: "/images/gallery-pipe-before.jpg",
    alt: "Corroded supply line before a pipe repair.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "before",
    generationNote:
      "Photorealistic corroded residential supply line, honest condition without staging, neutral utility-room lighting.",
  },
  galleryPipeAfter: {
    src: "/images/gallery-pipe-after.jpg",
    alt: "Replaced supply line after a pipe repair.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "after",
    generationNote:
      "Photorealistic newly installed supply line with tidy supports, same angle as the before photo.",
  },
  galleryHeaterBefore: {
    src: "/images/gallery-heater-before.jpg",
    alt: "Aging water heater before replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "before",
    generationNote:
      "Photorealistic aging residential water heater with visible wear in a utility room, neutral lighting.",
  },
  galleryHeaterAfter: {
    src: "/images/gallery-heater-after.jpg",
    alt: "New water heater installed after replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "after",
    generationNote:
      "Photorealistic newly installed water heater with clean connections, same angle as the before photo.",
  },
  galleryDrainBefore: {
    src: "/images/gallery-drain-before.jpg",
    alt: "Slow kitchen drain before cleaning.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "before",
    generationNote:
      "Photorealistic kitchen sink with standing water and a used work area, honest condition, natural light.",
  },
  galleryDrainAfter: {
    src: "/images/gallery-drain-after.jpg",
    alt: "Clean, freely draining kitchen sink after service.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "after",
    generationNote:
      "Photorealistic clean kitchen sink with clear water and a tidy countertop, same angle as the before photo.",
  },
  galleryFaucetBefore: {
    src: "/images/gallery-faucet-before.jpg",
    alt: "Dripping, worn faucet before replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "before",
    generationNote:
      "Photorealistic older faucet with mineral buildup and a drip, neutral bathroom lighting.",
  },
  galleryFaucetAfter: {
    src: "/images/gallery-faucet-after.jpg",
    alt: "Newly installed faucet after replacement.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "after",
    generationNote:
      "Photorealistic new faucet with clean connections and a dry surface, same angle as the before photo.",
  },
  galleryUtilityBefore: {
    src: "/images/gallery-utility-before.jpg",
    alt: "Cluttered utility room before cleanup and organization.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "before",
    generationNote:
      "Photorealistic cluttered residential utility room with obstructed shutoff access, honest condition, neutral lighting.",
  },
  galleryUtilityAfter: {
    src: "/images/gallery-utility-after.jpg",
    alt: "Organized utility room after cleanup with accessible shutoffs.",
    width: 1000,
    height: 750,
    aspectRatio: "4 / 3",
    priority: false,
    decorative: false,
    available: false,
    motif: "after",
    generationNote:
      "Photorealistic organized utility room with clearly accessible shutoff valves and tidy labeling, same angle as the before photo.",
  },
  openGraph: {
    src: "/images/opengraph.jpg",
    alt: "ClearFlow Plumbing Co. concept social preview image.",
    width: 1200,
    height: 630,
    aspectRatio: "1200 / 630",
    priority: false,
    decorative: false,
    available: false,
    motif: "brand",
    generationNote:
      "Photorealistic plumbing scene with navy ClearFlow branding strip and generous empty space for a headline overlay, no phone number.",
  },
};
