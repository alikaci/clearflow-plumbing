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

export type FlagName = keyof FeatureFlags;

export type NavigationItem = {
  label: string;
  href: string;
  flag?: FlagName;
};

export type FooterNavGroup = {
  id: string;
  title: string;
  items: readonly NavigationItem[];
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

export type SelectOption<T extends string = string> = {
  value: T;
  label: string;
};

export type SelectOptionGroup = {
  label: string;
  options: readonly SelectOption[];
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

/*
Icons that configuration files may reference. The Icon component owns the
drawing of every name; this union only states which of those names content
config is allowed to use, so a config file never has to import a component.
*/
export type ContentIconId =
  | ServiceIconId
  | "check"
  | "clock"
  | "alert"
  | "map-pin"
  | "camera"
  | "phone";

export type ImageKey =
  | "heroTechnician"
  | "serviceDrain"
  | "serviceLeak"
  | "serviceWaterHeater"
  | "servicePipe"
  | "serviceFaucet"
  | "serviceSump"
  | "serviceSewer"
  | "technicianHomeowner"
  | "brandedVan"
  | "aboutTeam"
  | "galleryPipeBefore"
  | "galleryPipeAfter"
  | "galleryHeaterBefore"
  | "galleryHeaterAfter"
  | "galleryDrainBefore"
  | "galleryDrainAfter"
  | "galleryFaucetBefore"
  | "galleryFaucetAfter"
  | "galleryUtilityBefore"
  | "galleryUtilityAfter"
  | "openGraph";

export type ImageFallbackMotif =
  | "pipes"
  | "tank"
  | "drain"
  | "droplet"
  | "van"
  | "people"
  | "before"
  | "after"
  | "brand";

export type ImageAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: `${number} / ${number}`;
  priority: boolean;
  decorative: boolean;
  available: boolean;
  motif: ImageFallbackMotif;
  generationNote: string;
};

export type ImageManifest = Record<ImageKey, ImageAsset>;

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceSummary = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  icon: ServiceIconId;
  imageKey: ImageKey;
};

export type ServiceDetail = ServiceSummary & {
  headline: string;
  intro: string;
  commonProblems: readonly string[];
  warningSigns: readonly string[];
  assessmentIncludes: readonly string[];
  benefits: readonly string[];
  relatedSlugs: readonly string[];
  faqs: readonly ServiceFaq[];
};

export type Review = {
  name: string;
  location: string;
  quote: string;
};

export type ReviewsConfig = {
  heading: string;
  supportingText: string;
  rating: string;
  ratingLabel: string;
  reviewCount: string;
  highlights: readonly string[];
  note: string;
  presentationNote: string;
  reviews: readonly Review[];
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  detail: string;
};

export type MembershipBenefit = {
  title: string;
  description: string;
};

export type FinancingUseCase = {
  title: string;
  description: string;
};

export type ServiceArea = {
  name: string;
  description: string;
};

export type ServiceAreaConfig = {
  heading: string;
  supportingText: string;
  areas: readonly ServiceArea[];
  zips: readonly string[];
  checkerTitle: string;
  checkerDescription: string;
  zipLabel: string;
  zipHelp: string;
  submitLabel: string;
  resetLabel: string;
  successMessage: string;
  alternativeMessage: string;
  disclaimer: string;
  invalidMessage: string;
};

export type GalleryPair = {
  id: string;
  category: string;
  description: string;
  beforeKey: ImageKey;
  afterKey: ImageKey;
};

export type GalleryConfig = {
  heading: string;
  supportingText: string;
  note: string;
  previewCount: number;
  pairs: readonly GalleryPair[];
};

export type AssistantChoice = {
  id: string;
  label: string;
  response: string;
  href: string;
  hrefLabel: string;
};

export type AssistantConfig = {
  title: string;
  intro: string;
  disclaimer: string;
  choices: readonly AssistantChoice[];
};

export type CostToolConfig = {
  heading: string;
  supportingText: string;
  resultMessage: string;
  ctaLabel: string;
  ctaHref: string;
};

export type PropertyTypeValue =
  | "house"
  | "apartment-condo"
  | "commercial"
  | "other";

export type ContactMethodValue = "phone" | "email" | "text";

export type ContactTimeValue = "morning" | "afternoon" | "evening";

export type UrgencyValue = "urgent" | "not-urgent";

export type EstimateFormValues = {
  service: string;
  city: string;
  zip: string;
  propertyType: PropertyTypeValue;
  urgency: UrgencyValue;
  description: string;
  fullName: string;
  email: string;
  phone: string;
  contactMethod: ContactMethodValue;
  contactTime: ContactTimeValue;
  privacy: boolean;
};

export type BookingFormValues = {
  service: string;
  date: string;
  timeRange: string;
  fullName: string;
  email: string;
  phone: string;
};

export type FormsConfig = {
  estimateHeading: string;
  estimateSupportingText: string;
  bookingHeading: string;
  bookingSupportingText: string;
  bookingDisclaimer: string;
  bookingConfirmation: string;
  stepTitles: readonly string[];
  bookingStepTitles: readonly string[];
  serviceOptions: readonly SelectOption[];
  serviceOtherOption: SelectOption;
  propertyTypes: readonly SelectOption<PropertyTypeValue>[];
  contactMethods: readonly SelectOption<ContactMethodValue>[];
  contactTimes: readonly SelectOption<ContactTimeValue>[];
  urgencyOptions: readonly SelectOption<UrgencyValue>[];
  timeRanges: readonly SelectOption[];
  cityLabel: string;
  zipLabel: string;
  descriptionLabel: string;
  descriptionHelp: string;
  photoLabel: string;
  photoHelp: string;
  photoRemoveLabel: string;
  photoMaxBytes: number;
  honeypotFieldName: string;
  successHeading: string;
  successMessage: string;
  successNote: string;
  submitLabel: string;
  submittingLabel: string;
  backLabel: string;
  nextLabel: string;
  reviewLabel: string;
  resetLabel: string;
  privacyLabel: string;
};

export type SeoRouteConfig = {
  path: string;
  title: string;
  description: string;
};

export type SeoConfig = {
  siteName: string;
  siteUrl: string | null;
  indexable: false;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  openGraphImageKey: ImageKey;
  routes: Record<string, SeoRouteConfig>;
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

export type TrustPoint = {
  title: string;
  description: string;
};

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
};

export type FinalCtaConfig = {
  heading: string;
  text: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export type OptionalFeaturesConfig = {
  heading: string;
  supportingText: string;
  tiles: readonly {
    flag: FlagName;
    title: string;
    description: string;
    href: string;
    linkLabel: string;
  }[];
};

export type HomePageConfig = {
  hero: HeroConfig;
  emergency: EmergencyConfig;
  servicesSection: ServicesSectionConfig;
  whyChoose: WhyChooseConfig;
  process: ProcessConfig;
  finalCta: FinalCtaConfig;
  optionalFeatures: OptionalFeaturesConfig;
};

export type ProcessConfig = {
  heading: string;
  steps: readonly ProcessStep[];
};

export type PricingCostFactor = {
  title: string;
  description: string;
  icon: ContentIconId;
};

export type PricingConfig = {
  eyebrow: string;
  heading: string;
  intro: string;
  disclosure: string;
  process: ProcessConfig;
  processNote: string;
  costFactorsHeading: string;
  costFactors: readonly PricingCostFactor[];
  questionsHeading: string;
  questions: readonly string[];
  questionsNote: string;
  ctaHeading: string;
  ctaText: string;
  ctaPrimaryLabel: string;
  ctaPrimaryHref: string;
  ctaSecondaryLabel: string;
  ctaSecondaryHref: string;
};

export type PricingContextLink = {
  label: string;
  href: string;
};
