import type { FormsConfig } from "@/types";
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
  urgencyOptions: [
    { value: "urgent", label: "Yes, this is urgent" },
    { value: "not-urgent", label: "No, it can be scheduled" },
  ],
  timeRanges: [
    { value: "8-10", label: "8:00 AM - 10:00 AM" },
    { value: "10-12", label: "10:00 AM - 12:00 PM" },
    { value: "12-2", label: "12:00 PM - 2:00 PM" },
    { value: "2-4", label: "2:00 PM - 4:00 PM" },
    { value: "4-6", label: "4:00 PM - 6:00 PM" },
  ],
  cityLabel: "City",
  zipLabel: "ZIP code",
  descriptionLabel: "Describe the problem",
  descriptionHelp:
    "Include what you have noticed, when it started and anything that makes it worse.",
  photoLabel: "Add a local photo preview (optional)",
  photoHelp:
    "Choose an image up to 5 MB. The preview stays on your device, is never uploaded, never stored and is not transmitted anywhere during this demonstration.",
  photoRemoveLabel: "Remove photo",
  photoMaxBytes: 5 * 1024 * 1024,
  honeypotFieldName: "companyWebsite",
  successHeading: "Request prepared",
  successMessage: "Your request has been prepared.",
  successNote:
    "This portfolio demonstration did not create a real plumbing appointment.",
  submitLabel: "Submit request",
  submittingLabel: "Preparing request...",
  backLabel: "Back",
  nextLabel: "Continue",
  reviewLabel: "Review your request",
  resetLabel: "Start a new request",
  privacyLabel:
    "I understand this is a portfolio demonstration, that no real appointment is created, and that I should not submit sensitive information.",
} satisfies FormsConfig;
