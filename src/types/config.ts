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