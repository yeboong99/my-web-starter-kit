import { HeroSection } from "@/components/home/hero-section";
import { TechStackGrid } from "@/components/home/tech-stack-grid";
import { QuickStart } from "@/components/home/quick-start";
import { FeatureHighlights } from "@/components/home/feature-highlights";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TechStackGrid />
      <QuickStart />
      <FeatureHighlights />
    </>
  );
}
