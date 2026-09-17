import type { ReviewsConfig } from "@/types";

export const reviews = {
  heading: "What Customers Say",
  supportingText:
    "A sample of how customer feedback would be presented for a real plumbing business.",
  rating: "4.9",
  ratingLabel: "Average Rating",
  reviewCount: "800+ Customer Reviews",
  highlights: ["Customer-Focused Service", "Columbus Area Coverage"],
  note: "Sample reputation metrics shown for concept demonstration.",
  presentationNote: "Sample review presentation for this fictional portfolio concept.",
  reviews: [
    {
      name: "Jordan M.",
      location: "Columbus",
      quote:
        "Clear communication from the first call to the final explanation. The entire process felt organized and professional.",
    },
    {
      name: "Taylor R.",
      location: "Westerville",
      quote:
        "The request form was easy to use, and I knew exactly what information the team needed before the appointment.",
    },
    {
      name: "Casey L.",
      location: "Dublin",
      quote:
        "Professional, respectful and easy to work with. Everything was explained clearly.",
    },
  ],
} satisfies ReviewsConfig;
