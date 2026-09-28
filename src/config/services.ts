import type { ServiceDetail, ServiceSummary } from "@/types";

export const services: readonly ServiceDetail[] = [
  {
    slug: "drain-cleaning",
    name: "Drain Cleaning",
    shortName: "Drain Cleaning",
    description:
      "Help for slow, blocked or overflowing drains using a clear diagnostic process.",
    icon: "drain",
    imageKey: "serviceDrain",
    headline: "Drain Cleaning for Slow, Blocked or Overflowing Drains",
    intro:
      "A drain that drains slowly or backs up is usually a sign that something is restricting the flow. Rather than guessing, a clear diagnostic process looks at where the blockage is and what is likely causing it before any work is recommended.",
    commonProblems: [
      "Kitchen sinks that drain slowly or pool water while in use.",
      "Bathroom drains that collect standing water after a shower.",
      "Repeated blockages in the same fixture or line.",
      "Fixtures that gurgle or back up when another drain is used.",
    ],
    warningSigns: [
      "Water rising in one fixture when another is used.",
      "Persistent odors coming from a drain.",
      "Multiple slow drains in the same property.",
      "Water backing up into a tub, shower or floor drain.",
    ],
    assessmentIncludes: [
      "A conversation about when the problem started and how often it recurs.",
      "A visual review of the affected fixtures and accessible drain lines.",
      "A discussion of the likely cause and the options available.",
      "A clear explanation of the recommended next step before any work begins.",
    ],
    benefits: [
      "Addressing the underlying restriction instead of only the symptom.",
      "Reducing the chance of repeat backups in the same line.",
      "Restoring normal drainage so daily routines are not disrupted.",
      "Documenting what was found so future service conversations start informed.",
    ],
    relatedSlugs: ["sewer-lines", "pipe-repair"],
    faqs: [
      {
        question: "Can a slow drain fix itself?",
        answer:
          "Usually not. A slow drain typically means material is already collecting in the line, and it tends to worsen over time rather than clear on its own.",
      },
      {
        question: "Will I know what the problem is before work starts?",
        answer:
          "The assessment is meant to explain what was observed and what the recommended next step is, so you can decide how to proceed.",
      },
      {
        question: "Do I need to be home for a drain assessment?",
        answer:
          "Access to the affected fixtures and any accessible cleanouts is what matters. The request form lets you share details ahead of time.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Do Not Add More Drain Cleaner",
          description:
            "Avoid adding more chemical drain cleaner before a service visit. If a product has already been used, tell the service provider what was used and when.",
        },
        {
          title: "Avoid Using the Affected Drain",
          description:
            "If water is backing up or draining very slowly, avoid continued use when it may cause additional overflow.",
        },
        {
          title: "Clear the Area Around the Fixture",
          description:
            "Move personal items away from the sink, tub or floor drain only when the area is safe to approach.",
        },
        {
          title: "Note Where the Backup Occurs",
          description:
            "Record whether the problem affects one fixture or several fixtures and when it was first noticed.",
        },
      ],
    },
  },
  {
    slug: "leak-repair",
    name: "Leak Repair",
    shortName: "Leak Repair",
    description:
      "Identify and address visible leaks before they lead to larger water-damage problems.",
    icon: "leak",
    imageKey: "serviceLeak",
    headline: "Leak Repair to Address Problems Before They Spread",
    intro:
      "Leaks rarely stay the same size. A small drip under a sink or a faint stain on a ceiling can point to moisture that is already affecting nearby materials. Identifying the source clearly is the first step toward a sensible repair plan.",
    commonProblems: [
      "Dripping or corroded connections under sinks and fixtures.",
      "Water stains on walls, ceilings or cabinet floors.",
      "Supply lines that show moisture, mineral buildup or corrosion.",
      "Fixtures that leave a puddle after use.",
    ],
    warningSigns: [
      "A water meter that changes when nothing is in use.",
      "Musty odors in cabinets or utility areas.",
      "Soft or discolored flooring near fixtures.",
      "Visible moisture or dripping that returns after being wiped.",
    ],
    assessmentIncludes: [
      "A review of the reported leak area and nearby accessible plumbing.",
      "A conversation about when the moisture was first noticed.",
      "A discussion of repair options and any areas that require further review.",
      "A clear summary of what was found and what is recommended next.",
    ],
    benefits: [
      "Reducing the chance of larger water-damage repairs later.",
      "Protecting cabinets, flooring and nearby finishes.",
      "Understanding the source rather than treating only the visible symptom.",
      "Documenting the repair so future requests have context.",
    ],
    relatedSlugs: ["pipe-repair", "water-heaters"],
    faqs: [
      {
        question: "Is a small drip worth addressing?",
        answer:
          "Small leaks can affect surrounding materials over time. Having the source identified early usually keeps the conversation simpler.",
      },
      {
        question: "Can you find a leak that is not visible?",
        answer:
          "Hidden moisture can require further review. The assessment conversation explains what can be checked and what may need additional steps.",
      },
      {
        question: "What should I do while waiting for a response?",
        answer:
          "If water is actively escaping, it is reasonable to shut off the nearest supply valve or the main shutoff if you can access it safely. For unsafe conditions, contact the appropriate emergency service.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Keep Clear of Electrical Hazards",
          description:
            "Do not enter standing water or touch electrical devices, outlets or equipment near the leak. If electricity may be involved, contact the appropriate emergency service or utility provider.",
          importance: "important",
        },
        {
          title: "Use a Known Shutoff Only If Safe",
          description:
            "If the correct local shutoff is clearly identified and can be reached safely, it may help limit water flow. Do not force a stuck valve or enter an unsafe area.",
        },
        {
          title: "Keep the Area Clear",
          description:
            "Move belongings away from the affected area only when it is safe, and avoid covering or altering the leak in a way that hides its source.",
        },
        {
          title: "Note What You Observed",
          description:
            "Record when the leak started and whether it appears during use, continuously or only under certain conditions.",
        },
      ],
    },
  },
  {
    slug: "water-heaters",
    name: "Water Heater Services",
    shortName: "Water Heater",
    description:
      "Support for water-heater problems, maintenance, replacement and installation requests.",
    icon: "water-heater",
    imageKey: "serviceWaterHeater",
    headline: "Water Heater Services for Performance and Replacement",
    intro:
      "Water heaters work quietly in the background until something changes. Whether the water is not as hot as it used to be, the unit is aging, or you are planning a replacement, the conversation starts with understanding the current equipment and what you need from it.",
    commonProblems: [
      "Water that does not reach the expected temperature.",
      "Inconsistent hot water during normal use.",
      "Units that are visibly aged, corroded or leaking.",
      "Planning a replacement or installation request.",
    ],
    warningSigns: [
      "Moisture or rust around the base of the unit.",
      "Popping or rumbling sounds during heating.",
      "Discolored water from hot taps.",
      "A unit that is well beyond its typical service life.",
    ],
    assessmentIncludes: [
      "A review of the unit, its age and its visible condition.",
      "A conversation about performance concerns and usage patterns.",
      "A discussion of maintenance, repair or replacement options.",
      "A clear explanation of the next step before any decision is made.",
    ],
    benefits: [
      "Understanding whether maintenance or replacement makes more sense.",
      "Planning larger work with clear expectations before it begins.",
      "Reducing the chance of an unexpected failure at an inconvenient time.",
      "Keeping equipment details documented for future requests.",
    ],
    relatedSlugs: ["leak-repair", "pipe-repair"],
    faqs: [
      {
        question: "How do I know if my water heater needs replacing?",
        answer:
          "Age, visible corrosion, inconsistent performance and repeated repairs are all reasons to discuss replacement. The assessment conversation covers the trade-offs.",
      },
      {
        question: "Can maintenance extend the life of a unit?",
        answer:
          "Ongoing maintenance is often presented as a way to keep equipment performing as expected, though it depends on the condition of the unit.",
      },
      {
        question: "Do you provide a fixed price over the phone?",
        answer:
          "No. Pricing depends on the equipment, the property and the work involved, so it is discussed after an assessment.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Do Not Open Access Panels",
          description:
            "Do not remove covers or attempt to inspect internal gas or electrical components.",
          importance: "important",
        },
        {
          title: "Record Visible Error Information",
          description:
            "Note any visible error code, warning light, unusual sound or leak without opening or adjusting the equipment.",
        },
        {
          title: "Clear the Surrounding Area",
          description:
            "Move stored items away from the water heater only when the area is dry and safe to approach.",
        },
        {
          title: "Treat Gas or Electrical Concerns as Urgent",
          description:
            "If there is a suspected gas leak, electrical hazard, fire risk or immediate threat to safety, leave the area and contact the appropriate emergency service or utility provider.",
          importance: "important",
        },
      ],
    },
  },
  {
    slug: "pipe-repair",
    name: "Pipe Repair",
    shortName: "Pipe Repair",
    description:
      "Assessment and repair options for damaged, leaking or aging plumbing lines.",
    icon: "pipe",
    imageKey: "servicePipe",
    headline: "Pipe Repair for Damaged, Leaking or Aging Lines",
    intro:
      "Plumbing lines age, corrode and occasionally fail. Pipe problems can be obvious, such as visible moisture, or subtle, such as a drop in water pressure. An assessment helps clarify what is happening and which repair options are realistic.",
    commonProblems: [
      "Visible corrosion, scaling or moisture on exposed pipe.",
      "Reduced water pressure at one or more fixtures.",
      "Water stains that suggest a line inside a wall or ceiling.",
      "Older pipework that may be reaching the end of its service life.",
    ],
    warningSigns: [
      "Discolored water when a tap is first opened.",
      "Banging or hammering sounds in the lines.",
      "Repeated leaks in the same area.",
      "Visible bulging or deformation on exposed pipe.",
    ],
    assessmentIncludes: [
      "A review of the affected lines and the surrounding accessible areas.",
      "A conversation about pressure, discoloration and when issues appear.",
      "A discussion of repair options and any areas that need further review.",
      "A clear summary with the recommended next step.",
    ],
    benefits: [
      "Understanding whether a localized repair or a larger plan fits the situation.",
      "Reducing the chance of water damage from a worsening line.",
      "Restoring consistent pressure and flow where possible.",
      "Documenting findings for future service conversations.",
    ],
    relatedSlugs: ["leak-repair", "sewer-lines"],
    faqs: [
      {
        question: "Can a leaking pipe be repaired without replacing the whole line?",
        answer:
          "Sometimes a localized repair is appropriate, and sometimes a larger section makes more sense. The assessment explains the options for your situation.",
      },
      {
        question: "Why did my water pressure drop?",
        answer:
          "Pressure changes can come from a restriction, a failing line or a fixture issue. The assessment narrows down the likely cause.",
      },
      {
        question: "Should I turn off the water if a pipe is leaking?",
        answer:
          "If water is actively escaping, shutting off the nearest valve or the main shutoff is a reasonable step when it can be done safely.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Do Not Disturb Damaged Pipework",
          description:
            "Avoid moving, bending or applying temporary force to damaged or corroded pipes.",
        },
        {
          title: "Clear Safe Access",
          description:
            "Move nearby stored items only when the area is dry and safe to approach.",
        },
        {
          title: "Record the Conditions",
          description:
            "Note whether leaking or noise occurs continuously, during fixture use or when specific appliances operate.",
        },
        {
          title: "Stay Clear of Electrical Hazards",
          description:
            "Do not approach standing water near outlets, wiring or powered equipment. Contact the appropriate emergency service or utility provider if an immediate hazard exists.",
          importance: "important",
        },
      ],
    },
  },
  {
    slug: "toilets-faucets",
    name: "Toilet and Faucet Repair",
    shortName: "Toilet or Faucet",
    description:
      "Practical support for running toilets, dripping faucets and damaged fixtures.",
    icon: "fixture",
    imageKey: "serviceFaucet",
    headline: "Toilet and Faucet Repair for Everyday Fixture Problems",
    intro:
      "Toilets and faucets are the fixtures homeowners use most, so small problems become noticeable quickly. A running toilet or a dripping faucet is usually straightforward to assess and often simpler to address than it first appears.",
    commonProblems: [
      "Toilets that run continuously or refill on their own.",
      "Faucets that drip after being closed.",
      "Fixtures that are loose, cracked or difficult to operate.",
      "Weak or inconsistent water flow at a tap.",
    ],
    warningSigns: [
      "Water pooling around the base of a toilet.",
      "A toilet that requires repeated flushing.",
      "Mineral buildup around a faucet base or aerator.",
      "A fixture that moves when used.",
    ],
    assessmentIncludes: [
      "A review of the affected fixture and its visible connections.",
      "A conversation about how long the problem has been present.",
      "A discussion of repair or replacement options.",
      "A clear explanation of the recommended next step.",
    ],
    benefits: [
      "Resolving a daily annoyance with a clear plan.",
      "Reducing water waste from a running toilet or dripping tap.",
      "Preventing a small fixture issue from affecting surrounding surfaces.",
      "Keeping fixtures reliable for everyday use.",
    ],
    relatedSlugs: ["leak-repair", "general-plumbing"],
    faqs: [
      {
        question: "Is a running toilet a serious problem?",
        answer:
          "It is usually an internal parts issue rather than a structural one, but it wastes water continuously, so it is worth addressing.",
      },
      {
        question: "Can a dripping faucet be repaired rather than replaced?",
        answer:
          "It depends on the fixture and condition. The assessment covers whether a repair or replacement is the better fit.",
      },
      {
        question: "Do you work on all fixture brands?",
        answer:
          "The concept presents general fixture support. A real business would confirm brand coverage when the request is reviewed.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Avoid Continued Use During an Overflow",
          description:
            "If the fixture is overflowing, avoid flushing or running additional water into it.",
        },
        {
          title: "Do Not Force Stuck Handles or Valves",
          description:
            "Avoid forcing a handle, shutoff or fitting that does not move normally.",
        },
        {
          title: "Clear the Fixture Area",
          description:
            "Move personal items away from the toilet, sink or faucet when the area is safe and dry enough to approach.",
        },
        {
          title: "Note When the Problem Happens",
          description:
            "Record whether the issue is constant, occurs during use or returns after a temporary improvement.",
        },
      ],
    },
  },
  {
    slug: "sump-pumps",
    name: "Sump Pump Services",
    shortName: "Sump Pump",
    description:
      "Inspection, maintenance and replacement support for sump-pump systems.",
    icon: "sump-pump",
    imageKey: "serviceSump",
    headline: "Sump Pump Services for Basement and Crawlspace Protection",
    intro:
      "A sump pump is only useful when it works. Because it runs quietly and often out of sight, problems are easy to miss until water is already where it should not be. Inspection and maintenance are presented as ways to reduce that risk.",
    commonProblems: [
      "Pumps that run constantly or never seem to run.",
      "Unusual noises or vibration during operation.",
      "Pumps that are aged or have not been serviced in years.",
      "Standing water near the sump pit.",
    ],
    warningSigns: [
      "Water in the basement after moderate rain.",
      "A sump pit that stays full after the pump runs.",
      "Visible rust or debris in the pit.",
      "A pump that trips a breaker or smells hot.",
    ],
    assessmentIncludes: [
      "A review of the pump, pit and visible discharge line.",
      "A conversation about seasonal performance and past issues.",
      "A discussion of maintenance or replacement options.",
      "A clear summary with the recommended next step.",
    ],
    benefits: [
      "Understanding whether the current system is ready for the next season.",
      "Reducing the chance of unexpected water in a basement or crawlspace.",
      "Planning replacement before a failure occurs at the worst time.",
      "Keeping equipment details documented for future service.",
    ],
    relatedSlugs: ["sewer-lines", "general-plumbing"],
    faqs: [
      {
        question: "How often should a sump pump be checked?",
        answer:
          "An annual check before the wettest season is a common recommendation, though it depends on the property and the system.",
      },
      {
        question: "Can a noisy sump pump be repaired?",
        answer:
          "Sometimes noise points to debris, a loose component or normal operation of an older unit. The assessment identifies the likely cause.",
      },
      {
        question: "Do you install backup systems?",
        answer:
          "A real business may offer backup options. This concept presents inspection, maintenance and replacement support as the core services.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Do Not Enter Water Near Electrical Equipment",
          description:
            "Do not touch the pump, outlet, extension cord or electrical equipment while standing water is present.",
          importance: "important",
        },
        {
          title: "Do Not Bypass Electrical Controls",
          description:
            "Do not modify plugs, extension cords, alarms, switches or other electrical controls.",
        },
        {
          title: "Note Alarms or Warning Lights",
          description:
            "Record visible alarms, warning lights or unusual sounds without reaching into the pit or opening electrical equipment.",
        },
        {
          title: "Keep the Pit Area Accessible",
          description:
            "Move nearby stored items only when the floor is dry and the area is safe to approach.",
        },
      ],
    },
  },
  {
    slug: "sewer-lines",
    name: "Sewer Line Services",
    shortName: "Sewer Line",
    description:
      "Request an assessment for backups, repeated blockages and suspected sewer-line problems.",
    icon: "sewer",
    imageKey: "serviceSewer",
    headline: "Sewer Line Services for Backups and Repeated Blockages",
    intro:
      "Sewer problems affect the whole property and tend to return if the underlying cause is not identified. Repeated backups or multiple slow drains are usually a sign that the main line deserves a closer look.",
    commonProblems: [
      "Backups at the lowest fixtures in the property.",
      "Repeated blockages in multiple drains.",
      "Slow drainage throughout the property.",
      "Persistent odors near drains or the cleanout.",
    ],
    warningSigns: [
      "Wastewater backing up into tubs, showers or floor drains.",
      "Gurgling sounds when water is used elsewhere.",
      "Multiple fixtures draining slowly at the same time.",
      "Soggy ground or odors near the exterior cleanout.",
    ],
    assessmentIncludes: [
      "A conversation about the pattern and frequency of backups.",
      "A visual review of accessible cleanouts and affected fixtures.",
      "A discussion of what further review may be needed.",
      "A clear explanation of the recommended next step.",
    ],
    benefits: [
      "Understanding whether the problem is recurring or isolated.",
      "Planning for a larger repair with realistic expectations.",
      "Reducing the disruption caused by repeated backups.",
      "Documenting the situation for future service conversations.",
    ],
    relatedSlugs: ["drain-cleaning", "pipe-repair"],
    faqs: [
      {
        question: "What causes repeated sewer backups?",
        answer:
          "Common causes include accumulation in the line, root intrusion and pipe condition. The assessment explains what is known and what may need further review.",
      },
      {
        question: "Is a sewer problem always expensive?",
        answer:
          "Not necessarily, but it does depend on the cause and the condition of the line. Pricing is discussed after an assessment rather than estimated blindly.",
      },
      {
        question: "Should I keep using water if the sewer is backing up?",
        answer:
          "Reducing water use until the issue is reviewed is a reasonable step to limit further backups.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Limit Water Use During a Backup",
          description:
            "If sewage or wastewater is backing up, avoid running additional fixtures when continued use may worsen the overflow.",
        },
        {
          title: "Keep Clear of Contaminated Areas",
          description:
            "Keep children and pets away from sewage, wastewater and affected surfaces.",
          importance: "important",
        },
        {
          title: "Do Not Add Chemical Cleaners",
          description:
            "Avoid adding drain-cleaning chemicals. Tell the service provider about any product already used.",
        },
        {
          title: "Note Which Fixtures Are Affected",
          description:
            "Record whether the problem appears at one fixture, several fixtures or the lowest drains in the property.",
        },
      ],
    },
  },
  {
    slug: "general-plumbing",
    name: "General Plumbing Support",
    shortName: "General Plumbing",
    description:
      "Not sure which service you need? Describe the problem and request an assessment.",
    icon: "wrench",
    imageKey: "technicianHomeowner",
    headline: "General Plumbing Support When You Are Not Sure Where to Start",
    intro:
      "Not every plumbing problem fits neatly into a category. If something seems off but you are unsure what it is, describing what you noticed is enough to begin. The request can then be directed to the right kind of assessment.",
    commonProblems: [
      "Symptoms that do not clearly match a single service.",
      "Multiple small issues noticed around the property.",
      "Water pressure or drainage changes without an obvious cause.",
      "Questions about what kind of service a situation needs.",
    ],
    warningSigns: [
      "Any active water where it does not belong.",
      "Drains or fixtures behaving differently than usual.",
      "Unexplained sounds from the plumbing system.",
      "Recurring issues that have been addressed before.",
    ],
    assessmentIncludes: [
      "A conversation about what you have noticed and when it started.",
      "Guidance on which service area the situation most closely matches.",
      "A review of accessible plumbing where appropriate.",
      "A clear explanation of the recommended next step.",
    ],
    benefits: [
      "Starting the conversation without needing to diagnose anything yourself.",
      "Being directed to the right service rather than guessing.",
      "Documenting the concern so follow-up is straightforward.",
      "Understanding what happens next before committing to anything.",
    ],
    relatedSlugs: ["leak-repair", "drain-cleaning"],
    faqs: [
      {
        question: "What if I cannot describe the problem precisely?",
        answer:
          "Describing what you noticed, when it started and what changed is usually enough to start. The assessment fills in the rest.",
      },
      {
        question: "Will I be told which service I actually need?",
        answer:
          "Yes. The request is reviewed and directed to the most appropriate service area based on what you describe.",
      },
      {
        question: "Is it worth requesting an assessment for a minor issue?",
        answer:
          "Small issues are often the easiest to address. Getting an explanation early tends to keep the conversation simple.",
      },
    ],
    beforeVisit: {
      items: [
        {
          title: "Record What You Have Observed",
          description:
            "Note when the problem began, which fixtures are affected and whether the issue is changing.",
        },
        {
          title: "Prepare Safe Access",
          description:
            "Move personal items away from the affected area only when it is safe to do so.",
        },
        {
          title: "Mention Previous Repairs",
          description:
            "Tell the service provider about recent repairs, replacements or temporary measures related to the problem.",
        },
        {
          title: "Keep the Work Area Clear",
          description:
            "Keep children and pets away from wet, damaged or restricted areas.",
        },
      ],
    },
  },
];

export const serviceSummaries: readonly ServiceSummary[] = services.map(
  (service) => ({
    slug: service.slug,
    name: service.name,
    shortName: service.shortName,
    description: service.description,
    icon: service.icon,
    imageKey: service.imageKey,
  }),
);

export const serviceSlugs: readonly string[] = services.map(
  (service) => service.slug,
);

export function getService(slug: string): ServiceDetail | undefined {
  return services.find((service) => service.slug === slug);
}

export function isServiceSlug(slug: string): boolean {
  return services.some((service) => service.slug === slug);
}
