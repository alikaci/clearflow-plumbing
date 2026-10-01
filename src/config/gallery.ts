import type { GalleryConfig } from "@/types";

export const gallery = {
  heading: "Project Gallery",
  supportingText:
    "Side-by-side before and after photos from common residential and commercial plumbing jobs.",
  note: "Project visuals are AI-generated artwork created for this portfolio concept.",
  previewCount: 3,
  pairs: [
    {
      id: "pipe-repair",
      category: "Pipe repair",
      description:
        "Corroded supply line replaced and the surrounding area returned to a clean, orderly state.",
      beforeKey: "galleryPipeBefore",
      afterKey: "galleryPipeAfter",
    },
    {
      id: "water-heater",
      category: "Water heater",
      description:
        "Aging water heater with visible wear replaced by a neatly installed unit and tidy connections.",
      beforeKey: "galleryHeaterBefore",
      afterKey: "galleryHeaterAfter",
    },
    {
      id: "drain-cleaning",
      category: "Drain cleaning",
      description:
        "Slow kitchen drain cleared and the sink area cleaned after the blockage was assessed and removed.",
      beforeKey: "galleryDrainBefore",
      afterKey: "galleryDrainAfter",
    },
    {
      id: "faucet-replacement",
      category: "Faucet replacement",
      description:
        "Dripping fixture replaced with a new faucet and clean, correctly sealed connections.",
      beforeKey: "galleryFaucetBefore",
      afterKey: "galleryFaucetAfter",
    },
    {
      id: "utility-room-cleanup",
      category: "Utility-room cleanup",
      description:
        "Cluttered utility area reorganized with accessible shutoff access and clear labeling.",
      beforeKey: "galleryUtilityBefore",
      afterKey: "galleryUtilityAfter",
    },
  ],
} satisfies GalleryConfig;
