import type { AssistantConfig } from "@/types";

export const assistant = {
  title: "Website assistant",
  intro:
    "Choose a topic to see how a guided, scripted assistant could point visitors to the right information. Responses are fixed and no diagnosis is provided.",
  disclaimer:
    "This assistant is a scripted demonstration. It does not provide plumbing advice, diagnose problems or connect you with a live person.",
  choices: [
    {
      id: "leak",
      label: "I have a leak",
      response:
        "Leaks can range from a dripping fixture to a supply line that needs prompt attention. Review the Leak Repair service page to see common warning signs, then submit a request so the team can follow up.",
      href: "/services/leak-repair",
      hrefLabel: "Leak repair details",
    },
    {
      id: "drain",
      label: "I need drain cleaning",
      response:
        "Slow or blocked drains are usually assessed with a clear diagnostic process before any work is recommended. The Drain Cleaning page outlines what that conversation typically includes.",
      href: "/services/drain-cleaning",
      hrefLabel: "Drain cleaning details",
    },
    {
      id: "water-heater",
      label: "I need water-heater help",
      response:
        "Water-heater requests cover performance problems, maintenance and replacement conversations. Review the Water Heater Services page, then share the details through the request form.",
      href: "/services/water-heaters",
      hrefLabel: "Water heater details",
    },
    {
      id: "estimate",
      label: "I want an estimate",
      response:
        "The multi-step request form collects the service, location, problem details and preferred contact information so the team can follow up to discuss next steps.",
      href: "#estimate",
      hrefLabel: "Request an estimate",
    },
    {
      id: "other",
      label: "I have another question",
      response:
        "The Contact page lists the demonstration phone number, hours and service region, along with the request form and a privacy note.",
      href: "/contact",
      hrefLabel: "Contact details",
    },
  ],
} satisfies AssistantConfig;
