import Hero from "@/components/home/Hero";
import WorksSection from "@/components/ui/WorksSection";
import PrototypesSection from "@/components/ui/PrototypesSection";
import ReviewsSection from "@/components/ui/ReviewsSection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <WorksSection />
      <PrototypesSection />
      <ReviewsSection />
    </main>
  );
}
