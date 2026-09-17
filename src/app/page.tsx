import { features } from "@/config/features";
import { buildMetadata } from "@/lib/metadata";
import { Hero } from "@/components/sections/Hero";
import { ReputationBar } from "@/components/sections/ReputationBar";
import { EmergencyCallout } from "@/components/sections/EmergencyCallout";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { ServiceAreaChecker } from "@/components/sections/ServiceAreaChecker";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { ReviewsSection } from "@/components/sections/ReviewsSection";
import { OptionalFeatures } from "@/components/sections/OptionalFeatures";
import { FaqSection } from "@/components/sections/FaqSection";
import { EstimateSection } from "@/components/sections/EstimateSection";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata = buildMetadata("home");

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      {features.reputationSection ? <ReputationBar /> : null}
      {features.emergencyPath ? <EmergencyCallout /> : null}
      <ServiceGrid />
      {features.serviceAreaChecker ? <ServiceAreaChecker /> : null}
      <WhyChoose />
      <ProcessSteps />
      {features.gallery ? <GalleryPreview /> : null}
      {features.reputationSection ? <ReviewsSection /> : null}
      <OptionalFeatures />
      <FaqSection />
      <EstimateSection />
      <FinalCta />
    </main>
  );
}
