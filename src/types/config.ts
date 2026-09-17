export type BusinessEmail = {
  display: string;
  href: string | null;
};

export type BusinessHours = {
  short: string;
  full: string;
};

export type BusinessDisclosure = {
  fictional: string;
  aiImagery: string;
  copyright: string;
};

export type BusinessCta = {
  label: string;
  href: string;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type FeatureFlags = {
  onlineBooking: boolean;
  specialOffers: boolean;
  financing: boolean;
  membership: boolean;
  serviceAreaChecker: boolean;
  gallery: boolean;
  chatAssistant: boolean;
  costRangeTool: boolean;
  reputationSection: boolean;
  emergencyPath: boolean;
  photoUploadPreview: boolean;
};

export type NavigationItem = {
  label: string;
  href: string;
  flag?: keyof FeatureFlags;
};

export type BusinessConfig = {
  name: string;
  shortName: string;
  creator: string;
  region: string;
  serviceArea: string;
  phoneDisplay: string;
  phoneUri: string;
  email: BusinessEmail;
  hours: BusinessHours;
  primaryCta: BusinessCta;
  secondaryCta: BusinessCta;
  mobileBar: {
    call: BusinessCta;
    request: BusinessCta;
  };
  disclosures: BusinessDisclosure;
  description: string;
  socialLinks: readonly SocialLink[];
};

export type ServiceIconId =
  | "drain"
  | "leak"
  | "water-heater"
  | "pipe"
  | "fixture"
  | "sump-pump"
  | "sewer"
  | "wrench";

export type ServiceSummary = {
  slug: string;
  name: string;
  description: string;
  icon: ServiceIconId;
  requestHref: string;
};

export type TrustPoint = {
  title: string;
  description: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type ReputationConfig = {
  rating: string;
  ratingLabel: string;
  reviewCount: string;
  highlights: readonly string[];
  note: string;
};

export type HeroConfig = {
  eyebrow: string;
  heading: string;
  paragraph: string;
  trustPoints: readonly string[];
};

export type EmergencyConfig = {
  heading: string;
  text: string;
  callLabel: string;
  callHref: string;
  requestLabel: string;
  requestHref: string;
  safetyNote: string;
};

export type ServicesSectionConfig = {
  heading: string;
  supportingText: string;
};

export type WhyChooseConfig = {
  heading: string;
  points: readonly TrustPoint[];
};

export type ProcessConfig = {
  heading: string;
  steps: readonly ProcessStep[];
};

export type EstimatePlaceholderConfig = {
  heading: string;
  text: string;
};

export type FinalCtaConfig = {
  heading: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type HomePageConfig = {
  hero: HeroConfig;
  reputation: ReputationConfig;
  emergency: EmergencyConfig;
  servicesSection: ServicesSectionConfig;
  whyChoose: WhyChooseConfig;
  process: ProcessConfig;
  estimatePlaceholder: EstimatePlaceholderConfig;
  finalCta: FinalCtaConfig;
};