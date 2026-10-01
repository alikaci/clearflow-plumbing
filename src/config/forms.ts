import type { FormsConfig } from "@/types";
import { getPostalCodeLabel, getPostalCodeFieldLabel } from "@/lib/market";
import { services } from "./services";

export const forms = {
  estimateHeading: "Request a Free Estimate",
  estimateSupportingText:
    "Share a few details about the service, the location and the problem. The team can then follow up to discuss next steps. This demonstration does not create a real appointment.",
  bookingHeading: "Booking Preview",
  bookingSupportingText:
    "Walk through how a booking flow would work for a real plumbing business. Nothing is reserved and no calendar is connected.",
  bookingDisclaimer:
    "Times shown are for feature demonstration and do not represent real availability.",
  bookingConfirmation:
    "Booking preview complete. No real appointment was created.",
  stepTitles: ["Service", "Location", "Problem", "Contact", "Review"],
  bookingStepTitles: ["Service", "Date", "Time", "Contact", "Review"],
  serviceOptions: services.map((service) => ({
    value: service.slug,
    label: service.shortName,
  })),
  serviceOtherOption: { value: "other", label: "Other" },
  propertyTypes: [
    { value: "house", label: "House" },
    { value: "apartment-condo", label: "Apartment or Condo" },
    { value: "commercial", label: "Commercial Property" },
    { value: "other", label: "Other" },
  ],
  contactMethods: [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "text", label: "Text message" },
  ],
  contactTimes: [
    { value: "morning", label: "Morning" },
    { value: "afternoon", label: "Afternoon" },
    { value: "evening", label: "Evening" },
  ],
  /**
   * Lead-qualification timing. Values are stable internal identifiers; labels
   * are the customer-facing wording. Nothing here promises availability,
   * response time or dispatch.
   */
  urgencyOptions: [
    { value: "right-now", label: "Right now" },
    { value: "today", label: "Today" },
    { value: "this-week", label: "This week" },
    { value: "getting-estimate", label: "Just getting an estimate" },
  ],
  urgencyLegend: "When does this need attention?",
  urgencyHelp:
    "Your answer helps us plan the work. It does not confirm an appointment, a response time or a technician.",
  urgencySafetyHeading: "Some situations are emergencies, not service requests",
  urgencySafetyBody:
    "Fire, a suspected gas leak, electrical danger, or severe flooding that threatens personal safety needs emergency services rather than a plumbing appointment. If the building is unsafe, move to safety and call your local emergency number first. Contact us once everyone is safe.",
  urgencySafetyCallLabel: "Call the office",
  urgencySafetyLinkLabel: "Emergency plumbing help",
  timeRanges: [
    { value: "8-10", label: "8:00 AM - 10:00 AM" },
    { value: "10-12", label: "10:00 AM - 12:00 PM" },
    { value: "12-2", label: "12:00 PM - 2:00 PM" },
    { value: "2-4", label: "2:00 PM - 4:00 PM" },
    { value: "4-6", label: "4:00 PM - 6:00 PM" },
  ],
  cityLabel: "City",
  zipLabel: getPostalCodeFieldLabel(),
  descriptionLabel: "Describe the problem",
  descriptionHelp:
    "Include what you have noticed, when it started and anything that makes it worse.",
  photoLabel: "Add a local photo preview (optional)",
  photoHelp:
    "Choose an image up to 5 MB. The preview stays on your device, is never uploaded, never stored and is not transmitted anywhere during this demonstration.",
  photoRemoveLabel: "Remove photo",
  photoMaxBytes: 5 * 1024 * 1024,
  honeypotFieldName: "companyWebsite",
  /*
  The confirmation is the single place in the conversion flow that must state
  what did not happen. Earlier steps stay free of repeated warnings because the
  global portfolio disclosure already carries that context.
  */
  confirmationEyebrow: "REQUEST PREPARED",
  confirmationHeading: "Your Request Summary Is Ready",
  confirmationReferenceLabel: "Local reference",
  confirmationDisclosure:
    "This is a portfolio demonstration. No information has been sent to a plumbing company, no appointment has been created and no technician has been dispatched.",
  confirmationSupport:
    "Review the request you entered below, or start a new one. Nothing on this screen has been transmitted.",
  confirmationStatus:
    "Request prepared. No information was sent and no appointment was created.",
  confirmationSummaryHeading: "Request Summary",
  confirmationSummaryLabels: {
    service: "Service",
    city: "City",
    zip: getPostalCodeLabel(),
    propertyType: "Property type",
    urgency: "Timing",
    contactPreference: "Contact preference",
    description: "Problem description",
    photos: "Selected photos",
  },
  confirmationNotProvided: "Not provided",
  confirmationNoPhotos: "No photos selected",
  /*
  Workflow preview.

  This is a presentation of the operating sequence a plumbing office follows.
  It is deliberately not a CRM, dashboard or notification system: every step
  below is static config, and the visible status panel states plainly that no
  step has been entered and nothing was transmitted.
  */
  confirmationLiveWebsiteHeading: "How a Request Moves Through the Office",
  confirmationLiveWebsiteNote:
    "This is the sequence the office follows with a request. This demonstration stopped at the summary screen and did not transmit or retain the submitted information.",
  confirmationWorkflowStages: [
    "Website visitor",
    "Qualified website request",
    "Office review",
    "Customer follow-up",
    "Scheduling agreement",
    "On-site assessment",
    "Job follow-up",
  ] as const,
  confirmationWorkflowSteps: [
    {
      step: 1,
      title: "Qualified Website Request",
      owner: "Website",
      description:
        "The request you entered is structured into a qualified record: service, location, property type, timing and description.",
    },
    {
      step: 2,
      title: "Office Review",
      owner: "Office",
      description:
        "Reception reviews the request against the service area, current workload and the timing you selected, then decides the priority order.",
    },
    {
      step: 3,
      title: "Customer Follow-Up",
      owner: "Office",
      description:
        "The office contacts you using the method and time window you chose, confirms the problem and explains what an assessment would involve.",
    },
    {
      step: 4,
      title: "Scheduling Agreement",
      owner: "Customer",
      description:
        "You and the office agree an arrival window. The final price is confirmed after the on-site assessment, not before.",
    },
    {
      step: 5,
      title: "On-Site Assessment",
      owner: "Technician",
      description:
        "A technician assesses the plumbing, explains the cause and quotes the work before anything is carried out.",
    },
    {
      step: 6,
      title: "Job Follow-Up",
      owner: "Office",
      description:
        "After the work, the office reviews the invoice, warranty coverage and any further recommendations.",
    },
  ],
  confirmationWorkflowDisclosureHeading: "What has not happened",
  confirmationWorkflowDisclosureItems: [
    "No information was sent to ClearFlow Plumbing or to any other plumbing company.",
    "No lead was created in a customer relationship system.",
    "No appointment was created or added to a calendar.",
    "No technician was dispatched or assigned to a job.",
    "The details you entered were not stored and have been discarded with this page.",
  ],
  confirmationPrimaryLabel: "Start a New Request",
  confirmationSecondaryLabel: "Return Home",
  submitLabel: "Submit request",
  submittingLabel: "Preparing request...",
  backLabel: "Back",
  nextLabel: "Continue",
  reviewLabel: "Review your request",
  resetLabel: "Start a new request",
  privacyLabel:
    "I understand this is a portfolio demonstration, that no real appointment is created, and that I should not submit sensitive information.",
} satisfies FormsConfig;
