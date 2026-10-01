import type { AssistantConfig } from "@/types";
import { business } from "./business";
import { financingNotice } from "./financing";

/*
ClearFlow Guide: a guided, scripted website assistant.

This is deliberately not an AI assistant. There is no model, no API, no backend
and no storage: each intent below is a fixed response plus a small set of
keyword/phrase terms, and src/lib/assistant-intents.ts routes typed text to
exactly one of them (or to the fallback). Nothing here diagnoses a problem,
promises availability, or implies a real person is present.

Copy rules applied throughout:
  - emergency-call availability is stated only from config, never as office hours
  - no technician dispatch, no "we are responding", no promised response time
  - no claim of diagnosis or repair instruction
  - financing and booking are always described as demonstrations
  - business facts (hours, demo phone) are referenced from config, not retyped
*/

const service = (slug: string) => `/services/${slug}`;

export const assistant = {
  name: "ClearFlow Guide",
  statusLabel: "Guided demo",
  dialogLabel: "Website assistant",

  welcome:
 "Hi - I'm the ClearFlow Guide. Tell me what you're noticing, or choose a topic below, and I'll point you to the most relevant information on this demonstration website.",
  explanation:
    "This is a scripted, guided tour of the site rather than a conversation with a person. Describe a plumbing symptom in a few words and it will suggest the closest page.",
  disclosures: [
    "Answers come from configured website information, not from a live system.",
    "It cannot diagnose a plumbing problem or provide repair instructions.",
    "It does not connect to a live person.",
    "Nothing you type is sent anywhere or stored.",
    "ClearFlow Plumbing Co. and this interaction are fictional portfolio demonstrations.",
  ],

  quickPrompts: [
    { label: "I have a water leak", text: "I have a water leak" },
    { label: "My drain is blocked", text: "My drain is blocked" },
    { label: "No hot water", text: "No hot water" },
    { label: "Check my service area", text: "Check my service area" },
    { label: "How does pricing work?", text: "How does pricing work?" },
    { label: "Request an estimate", text: "Request an estimate" },
  ],

  inputLabel: "Describe your plumbing question",
  inputPlaceholder: "e.g. my sink is draining slowly",
  sendLabel: "Send",
  startOverLabel: "Start over",
  maxLength: 300,

  /*
  Safety is matched before every other intent and wins outright, so a message
  that mixes danger with a plumbing symptom ("the water heater is leaking and I
  smell gas") still produces this response. It gives no repair steps and no
  technical gas or electrical procedure.
  */
  safetyIntent: {
    id: "safety",
    keywords: [
      "gas",
      "smoke",
      "fire",
      "fumes",
      "sparks",
      "sparking",
      "shock",
      "electrical",
      "electricity",
      "electrocution",
      "ignition",
      "explosion",
      "flooding",
      "danger",
      "emergency",
    ],
    phrases: [
      "gas smell",
      "smell gas",
      "smells like gas",
      "gas leak",
      "on fire",
      "fire hazard",
      "electrical hazard",
      "power outlet",
      "exposed wire",
      "live wire",
      "standing water",
      "water near electricity",
      "water by the outlet",
      "near the electrical",
      "severe flooding",
      "water is rising",
      "rising water",
      "immediate danger",
      "immediate threat",
      "someone unconscious",
      "person unconscious",
    ],
    response: {
      text:
 "Your safety comes before any plumbing question. If there is immediate danger - a gas smell, fire, smoke, sparks, or standing water near electricity - leave the area and avoid the hazard, then contact the appropriate emergency service or utility provider. This guided demo cannot provide emergency response and cannot send help; it is a scripted website tour only. No repair steps are given here for safety reasons. The Emergency page explains how this site presents urgent situations.",
      variant: "safety",
      actions: [
        { label: "Read the emergency guidance", href: "/emergency" },
        { label: "Call the demonstration number", href: business.phoneUri },
      ],
    },
  },

  fallback: {
    text:
      "I couldn't match that question to a specific topic in this guided demo. You can describe the plumbing symptom in a few words, explore the Services page, or use the request form to show how a real service request could begin.",
    actions: [
      { label: "Browse all services", href: "/services" },
      { label: "Open the request form", href: "#estimate" },
      { label: "Contact details", href: "/contact" },
    ],
  },

  intents: [
    {
      id: "leak",
      keywords: ["leak", "leaking", "leaked", "drip", "dripping", "drips", "seeping", "moisture", "puddle"],
      phrases: [
        "water leak",
        "leaking pipe",
        "leaking pipes",
        "water coming from the pipe",
        "water coming from pipe",
        "water coming out of the pipe",
        "water spraying from",
        "water stain",
        "wet ceiling",
        "under the sink",
        "pipe is leaking",
      ],
      response: {
        text:
 "A leak can range from a dripping fixture to a supply line that needs prompt attention. The Leak Repair page lists the warning signs worth noting and what an assessment may include. Nothing here is a diagnosis - describing what you observed is enough to start a request.",
        actions: [{ label: "See leak repair", href: service("leak-repair") }],
      },
    },
    {
      id: "drain",
      keywords: ["drain", "drains", "drained", "clog", "clogged", "clogging", "blocked", "blockage", "slow", "gurgling", "gurgle"],
      phrases: [
        "blocked drain",
        "clogged drain",
        "slow drain",
        "sink not draining",
        "not draining",
        "drain backing up",
        "water not going down",
        "drain is slow",
      ],
      response: {
        text:
          "Slow or blocked drains are usually assessed with a clear diagnostic process before any work is recommended. The Drain Cleaning page walks through what that conversation typically includes, and what to avoid before a visit.",
        actions: [{ label: "See drain cleaning", href: service("drain-cleaning") }],
      },
    },
    {
      id: "water-heater",
      keywords: ["heater", "heaters", "hotwater", "tankless", "lukewarm", "boiler"],
      phrases: [
        "no hot water",
        "hot water",
        "water heater",
        "water heater leaking",
        "cold water",
        "cold water only",
        "water is cold",
        "not getting hot",
        "water stays cold",
      ],
      response: {
        text:
          "Water-heater requests cover performance problems, maintenance and replacement conversations. The Water Heater Services page explains common symptoms and what a review of the unit may include, without advising you to open any access panel.",
        actions: [{ label: "See water heater services", href: service("water-heaters") }],
      },
    },
    {
      id: "toilets-faucets",
      keywords: [
        "toilet",
        "toilets",
        "faucet",
        "faucets",
        "tap",
        "taps",
        "flush",
        "flushing",
        "overflowing",
        "running",
        "handle",
        "lever",
      ],
      phrases: [
        "clogged toilet",
        "toilet overflowing",
        "running toilet",
        "toilet runs",
        "toilet is running",
        "dripping faucet",
        "dripping tap",
        "running tap",
        "weak flush",
        "faucet is dripping",
        "tap is dripping",
      ],
      response: {
        text:
          "Running toilets and dripping faucets are everyday fixture problems that are usually straightforward to assess. The Toilet and Faucet Repair page covers the common symptoms and what a review of the fixture may include.",
        actions: [{ label: "See fixture repair", href: service("toilets-faucets") }],
      },
    },
    {
      id: "sewer",
      keywords: [
        "sewer",
        "sewage",
        "wastewater",
        "backup",
        "backups",
        "backing",
        "mainline",
      ],
      phrases: [
        "sewer backup",
        "sewer line",
        "sewage backup",
        "multiple drains backing up",
        "all drains backing up",
        "drains backing up",
        "toilet and sink backing up",
        "gurgling when i flush",
      ],
      response: {
        text:
          "Sewer problems affect the whole property and tend to return if the underlying cause is not identified. The Sewer Line Services page explains the patterns that suggest a main-line review, and how to limit further backups while it is assessed. Keep children and pets away from any affected area.",
        actions: [{ label: "See sewer line services", href: service("sewer-lines") }],
      },
    },
    {
      id: "pipe",
      keywords: [
        "pipe",
        "pipes",
        "piping",
        "pressure",
        "corroded",
        "corrosion",
        "burst",
        "busted",
        "discolored",
      ],
      phrases: [
        "low water pressure",
        "low pressure",
        "water pressure",
        "damaged pipe",
        "burst pipe",
        "pipe burst",
        "bursting pipe",
        "brown water",
        "discolored water",
        "hammering in the pipes",
      ],
      response: {
        text:
          "Pressure changes and damaged lines usually need an assessment to distinguish a restriction from a failing section. The Pipe Repair page covers the warning signs and what the assessment may include, so you can see the options before deciding anything.",
        actions: [{ label: "See pipe repair", href: service("pipe-repair") }],
      },
    },
    {
      id: "sump",
      keywords: ["sump", "pump", "pumps", "basement", "crawlspace", "pit"],
      phrases: [
        "sump pump",
        "sump pumps",
        "basement water",
        "water in my basement",
        "basement flooding",
        "crawlspace water",
        "sump pit",
      ],
      response: {
        text:
          "Sump pumps fail quietly, so problems often appear as water where it should not be. The Sump Pump Services page covers inspection, maintenance and replacement, plus the electrical precautions to take when standing water is present. If water is near powered equipment, contact the appropriate emergency service or utility provider instead.",
        actions: [{ label: "See sump pump services", href: service("sump-pumps") }],
      },
    },
    {
      id: "general",
      keywords: ["unsure", "general", "unknown", "weird", "strange", "mystery"],
      phrases: [
        "not sure",
        "other problem",
        "help me choose",
        "dont know",
        "do not know",
        "something else",
        "not sure what to do",
        "which service",
        "what do i need",
        "not sure which",
      ],
      response: {
        text:
          "Not every problem fits one category, and you are not expected to diagnose it. The General Plumbing Support page explains how an unspecific request is reviewed and directed, and the request form is the way to describe what you have noticed in your own words.",
        actions: [
          { label: "See general plumbing", href: service("general-plumbing") },
          { label: "Describe it on the request form", href: "#estimate" },
        ],
      },
    },
    {
      id: "service-area",
      keywords: [
        "area",
        "areas",
        "serve",
        "serves",
        "serving",
        "zip",
        "zipcode",
        "location",
        "cover",
        "coverage",
        "columbus",
      ],
      phrases: [
        "do you serve my area",
        "service area",
        "service areas",
        "zip code",
        "zip codes",
        "my area",
        "do you cover",
        "where do you work",
        "do you come to",
        "in my city",
      ],
      response: {
        text:
          "Coverage for this concept is the Columbus area and nearby communities. The Service Areas page has a ZIP-code check that shows exactly which demonstration areas are included, and a request confirms availability for anything not listed.",
        actions: [
          { label: "Check my service area", href: "/service-areas#check-coverage" },
        ],
      },
    },
    {
      id: "pricing",
      keywords: [
        "price",
        "pricing",
        "prices",
        "cost",
        "costs",
        "expensive",
        "charge",
        "charges",
        "fee",
        "fees",
        "quote",
        "quotes",
        "estimate",
        "howmuch",
      ],
      phrases: [
        "how much",
        "how much does it cost",
        "how does pricing work",
        "what does it cost",
        "get an estimate",
        "request an estimate",
        "free estimate",
        "cost estimate",
        "price of a repair",
        "what will it cost",
      ],
      response: {
        text:
 "Pricing here is explained as a process rather than a number: the scope is described, the work is assessed, and you would approve the estimate before anything began. The Pricing Process page covers the steps and the questions worth asking. The request form below shows how a real request could begin-this demonstration does not produce a real quote.",
        actions: [
          { label: "See how pricing works", href: "/pricing" },
          { label: "Open the request form", href: "#estimate" },
        ],
      },
    },
    {
      id: "financing",
      keywords: ["financing", "finance", "payment", "payments", "plan", "plans", "installment", "loan", "afford", "monthly", "budget"],
      phrases: [
        "payment plan",
        "monthly payments",
        "pay monthly",
        "finance the work",
        "payment options",
        "pay for",
        "break the cost up",
      ],
      response: {
        text: () =>
          `Payment options are described on this site but are not actually offered. ${financingNotice} The Financing page explains how a business like this would introduce payment options for larger projects such as water-heater replacement or sewer work.`,
        actions: [{ label: "See the financing page", href: "/financing" }],
      },
    },
    {
      id: "booking",
      keywords: [
        "book",
        "booking",
        "appointment",
        "appointments",
        "schedule",
        "scheduling",
        "slot",
        "reserve",
        "technician",
      ],
      phrases: [
        "book a visit",
        "book an appointment",
        "schedule a visit",
        "make an appointment",
        "request service",
        "request a service",
        "get a technician",
        "send a technician",
        "same day",
        "come out",
      ],
      response: {
        text:
          "Booking on this site is a demonstration: the form walks through how a request would be organized for a real business, and no appointment is ever created by it. The request form collects the service, location, description and contact preference so you can see the whole flow.",
        actions: [
          { label: "Open the request form", href: "#estimate" },
          { label: "See the booking preview", href: "/book" },
        ],
      },
    },
    {
      id: "hours",
      keywords: [
        "hours",
        "hour",
        "open",
        "opening",
        "close",
        "closing",
        "closed",
        "weekend",
        "weekday",
        "weekdays",
        "availability",
      ],
      phrases: [
        "business hours",
        "opening hours",
        "what hours",
        "what are your hours",
        "when are you open",
        "when open",
        "are you open",
        "opening times",
        "closing time",
        "open today",
        "emergency hours",
        "24/7",
      ],
      response: {
        text: () =>
          `Office hours are ${business.hours.full}. Emergency calls are taken ${business.hours.emergency}, including nights and weekends. These hours describe the fictional business on this portfolio site and no technician is dispatched from this website.`,
        actions: [{ label: "See contact details", href: "/contact" }],
      },
    },
    {
      id: "contact",
      keywords: [
        "contact",
        "call",
        "phone",
        "number",
        "telephone",
        "email",
        "reach",
        "talk",
        "speak",
        "person",
        "someone",
      ],
      phrases: [
        "phone number",
        "call you",
        "contact number",
        "contact details",
        "reach you",
        "speak to someone",
        "talk to someone",
        "talk to a person",
        "email address",
        "get in touch",
      ],
      response: {
        text: () =>
          `The number listed here is ${business.phoneDisplay}. It belongs to a fictional business, and no person, technician or plumber receives messages from this website. The Contact page lists the hours, service region and request form alongside it.`,
        actions: [
          { label: `Call ${business.phoneDisplay}`, href: business.phoneUri },
          { label: "See contact details", href: "/contact" },
        ],
      },
    },
    {
      id: "privacy",
      keywords: [
        "privacy",
        "private",
        "store",
        "stored",
        "save",
        "saved",
        "data",
        "record",
        "recorded",
        "log",
        "logs",
        "track",
        "tracked",
        "cookies",
        "analytics",
      ],
      phrases: [
        "is this stored",
        "do you save this",
        "are you saving this",
        "is my message saved",
        "what happens to my message",
        "do you track",
        "is this private",
        "data privacy",
        "privacy policy",
        "what data",
        "my data",
      ],
      response: {
        text:
          "Assistant messages live only in this browser tab as ordinary component state. Nothing you type here is transmitted, stored, logged or shared, and a page reload clears the conversation. This site sets no cookies and runs no analytics. The Privacy Notes page describes the whole demonstration's data posture.",
        actions: [{ label: "Read the privacy notes", href: "/privacy" }],
      },
    },
  ],
} satisfies AssistantConfig;
