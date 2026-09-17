import type { GalleryConfig } from "@/types";

export const gallery = {
  heading: "Project Gallery",
  supportingText:
    "A look at how completed plumbing work could be presented, using side-by-side before and after cards for common projects.",
  note: "AI-generated project visuals shown for concept demonstration.",
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
        "Slow kitchen drain cleared and the sink area cleaned after diagnosis and service.",
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
