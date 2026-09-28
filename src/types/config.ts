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

export type MarketId = "US" | "UK" | "EU_BASE";

export type MarketCurrency = "USD" | "GBP" | "EUR";

export type MarketTaxLabel = "Tax" | "VAT";

export type MarketPostalCode = {
  label: string;
  /**
   * Sentence-case label for use inside a form field. Kept separate from
   * `label` so substituting it never changes the capitalisation of existing
   * copy.
   */
  fieldLabel: string;
  shortLabel: string;
  example: string;
};

/*
A market profile carries generic market conventions only: locale, currency,
terminology, date convention, phone prefix and a consent expectation.

It deliberately holds no business data. Company name, phone number, email,
service-area ZIP lists, business hours and enabled features belong to
`business`/`features` and must never be placed here.
*/
export type MarketProfile = {
  id: MarketId;
  label: string;
  locale: string;
  /**
   * ISO 3166-1 alpha-2 country code, or null when the profile is a regional
   * base that still requires a concrete country.
   */
  countryCode: string | null;
  currency: MarketCurrency;
  postalCode: MarketPostalCode;
  taxLabel: MarketTaxLabel;
  /** E.164 calling prefix, or null when unresolved. */
  phoneCountryCode: string | null;
  /** Display convention only. A country profile may override it. */
  dateFormat: string;
  supportsFinancing: boolean;
  supportsMembership: boolean;
  /**
   * Architectural default for an optional-tracking consent gate. This is not
   * legal advice and does not add tracking or any consent UI.
   */
  requiresOptionalTrackingConsent: boolean;
  /**
   * A regional base (EU_BASE) is a template, not a production market. It may
   * not be activated until concrete country-specific values are supplied.
   */
  requiresCountryCompletion: boolean;
  /** Explains why a profile is a base and what must be verified first. */
  activationNote: string | null;
};

export type VerifiedCredentialLogo = {
  src: string;
  /** Must identify the credential itself, never a generic word like "image". */
  alt: string;
};

export type VerifiedCredential = {
  name: string;
  registrationNumber?: string;
  /** Must be an absolute https URL. http and relative values are rejected. */
  verificationUrl: string;
  /** ISO 8601 date (YYYY-MM-DD) on which the credential was verified. */
  verifiedAt: string;
  logo?: VerifiedCredentialLogo;
};

export type CredentialsConfig = {
  enabled: boolean;
  heading?: string;
  intro?: string;
  items: readonly VerifiedCredential[];
};

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
  /*
  Single source of truth for the active market profile. This is a build-time
  setting: it is never inferred from geolocation, IP address, browser language
  or visitor input, and it is not exposed as a visitor-facing control.
  */
  activeMarketId: MarketId;
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

export type BeforeVisitImportance = "standard" | "important";

export type BeforeVisitItem = {
  title: string;
  description: string;
  importance?: BeforeVisitImportance;
};

export type BeforeVisitConfig = {
  intro?: string;
  items: readonly BeforeVisitItem[];
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
  beforeVisit?: BeforeVisitConfig;
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

export type ConfirmationStep = {
  step: number;
  title: string;
  description: string;
};

export type ConfirmationSummaryLabels = {
  service: string;
  city: string;
  zip: string;
  propertyType: string;
  urgency: string;
  contactPreference: string;
  description: string;
  photos: string;
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
  confirmationEyebrow: string;
  confirmationHeading: string;
  confirmationReferenceLabel: string;
  confirmationDisclosure: string;
  confirmationSupport: string;
  confirmationStatus: string;
  confirmationSummaryHeading: string;
  confirmationSummaryLabels: ConfirmationSummaryLabels;
  confirmationNotProvided: string;
  confirmationNoPhotos: string;
  confirmationLiveWebsiteHeading: string;
  confirmationLiveWebsiteNote: string;
  confirmationLiveWebsiteSteps: readonly ConfirmationStep[];
  confirmationPrimaryLabel: string;
  confirmationSecondaryLabel: string;
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
