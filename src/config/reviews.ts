import type { ReviewsConfig } from "@/types";

/*
Reviews and reputation.

The portfolio disclosure in the footer establishes that ClearFlow is a
fictional business, so this section reads as a production reputation module
rather than a labelled specimen. Nothing here asserts third-party involvement:

- No review-platform logo, badge or wordmark appears anywhere.
- No external platform is named, and no review is described as verified,
  collected or syndicated by one.
- Every name, date and quote is invented for this portfolio, and each author is
  fictional.
- The single section-level note is the one place a clarification is made, as
  instructed, instead of a label repeated on each card.
*/
export const reviews = {
  heading: "What Customers Say",
  supportingText:
    "Feedback from homeowners and property managers across the Columbus area, shown the way a real review section presents it.",
  rating: "4.9",
  ratingLabel: "out of 5",
  reviewCount: "846 reviews",
  highlights: [
    "Clear communication",
    "Easy online requests",
    "Upfront estimate process",
    "Columbus-area service",
    "Mobile-friendly booking",
  ],
  note: "Ratings and reviews on this portfolio website are invented to demonstrate the review experience.",
  reviews: [
    {
      name: "Jordan M.",
      location: "Columbus",
      service: "Water Heater Replacement",
      date: "2026-08-14",
      rating: 5,
      quote:
        "Clear communication from the first call through the final walkthrough. The old unit was hauled away and the new one was running before they left.",
    },
    {
      name: "Taylor R.",
      location: "Westerville",
      service: "Emergency Leak Repair",
      date: "2026-07-29",
      rating: 5,
      quote:
        "Requesting help online took about a minute and I knew exactly what information they needed. Everything after that was explained clearly.",
    },
    {
      name: "Casey L.",
      location: "Dublin",
      service: "Drain Cleaning",
      date: "2026-07-11",
      rating: 5,
      quote:
        "Professional, respectful and tidy. They showed me the video of the blockage and talked me through the options before quoting anything.",
    },
    {
      name: "Avery N.",
      location: "Hilliard",
      service: "Sump Pump Installation",
      date: "2026-06-22",
      rating: 5,
      quote:
        "The estimate I approved matched the final invoice exactly. That is rare, and it is the reason I keep using ClearFlow.",
    },
    {
      name: "Riley S.",
      location: "Grove City",
      service: "Sewer Line Inspection",
      date: "2026-06-05",
      rating: 4,
      quote:
        "Thorough inspection and a written summary I could read properly later. Scheduling took a couple of days longer than I hoped, but the communication was honest about it.",
    },
    {
      name: "Morgan K.",
      location: "Upper Arlington",
      service: "Toilet and Faucet Repair",
      date: "2026-05-18",
      rating: 5,
      quote:
        "Booked on my phone during a work break, arrived inside the window they gave me, and left the bathroom cleaner than they found it.",
    },
  ],
} satisfies ReviewsConfig;