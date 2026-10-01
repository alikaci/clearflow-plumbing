import { z } from "zod";

const zipPattern = /^\d{5}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const serviceValues = [
  "drain-cleaning",
  "leak-repair",
  "water-heaters",
  "pipe-repair",
  "toilets-faucets",
  "sump-pumps",
  "sewer-lines",
  "general-plumbing",
  "other",
] as const;

export const estimateStepSchemas = [
  z.object({
    service: z
      .string()
      .refine(
        (value) => (serviceValues as readonly string[]).includes(value),
        "Choose the service you need.",
      ),
  }),
  z.object({
    city: z.string().trim().min(2, "Enter your city."),
    zip: z.string().regex(zipPattern, "Enter a five-digit ZIP code."),
    propertyType: z.enum(["house", "apartment-condo", "commercial", "other"]),
  }),
  z.object({
    urgency: z.enum(["right-now", "today", "this-week", "getting-estimate"]),
    description: z
      .string()
      .trim()
      .min(10, "Add a short description of at least 10 characters.")
      .max(2000, "Keep the description under 2000 characters."),
  }),
  z.object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .refine((value) => emailPattern.test(value), "Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a phone number.")
      .max(30, "Keep the phone number under 30 characters."),
    contactMethod: z.enum(["phone", "email", "text"]),
    contactTime: z.enum(["morning", "afternoon", "evening"]),
  }),
  z.object({
    privacy: z
      .boolean()
      .refine((value) => value, "Acknowledge the demonstration notice to continue."),
  }),
] as const;

export const bookingStepSchemas = [
  z.object({
    service: z
      .string()
      .refine(
        (value) => (serviceValues as readonly string[]).includes(value),
        "Choose the service you need.",
      ),
  }),
  z.object({
    date: z
      .string()
      .trim()
      .refine((value) => value.length > 0, "Choose a preferred date.")
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        "Choose a valid date.",
      ),
  }),
  z.object({
    timeRange: z.string().trim().min(1, "Choose a time range."),
  }),
  z.object({
    fullName: z.string().trim().min(2, "Enter your full name."),
    email: z
      .string()
      .trim()
      .refine((value) => emailPattern.test(value), "Enter a valid email address."),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a phone number.")
      .max(30, "Keep the phone number under 30 characters."),
  }),
] as const;

type SchemaLike = {
  safeParse: (value: unknown) => {
    success: boolean;
    error?: { issues: readonly { path: readonly PropertyKey[]; message: string }[] };
  };
};

export function collectErrors(
  schema: SchemaLike,
  values: Record<string, unknown>,
): Record<string, string> {
  const result = schema.safeParse(values);
  if (result.success || !result.error) return {};

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "_form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
