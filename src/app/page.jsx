import CategorySection from "@/components/Home/CategorySection";
import FeaturedSection from "@/components/Home/FeaturedSection";
import HeroSection from "@/components/Home/HeroSection";
import LatestSection from "@/components/Home/LatestSection";
import TestimonialSection from "@/components/Home/TestimonialSection";
import WhyChooseUs from "@/components/Home/WhyChooseUs";

export default function Home() {
  return (
    <main>
      <HeroSection />

      <CategorySection></CategorySection>

      <FeaturedSection />

      <LatestSection></LatestSection>

      <WhyChooseUs></WhyChooseUs>

      <TestimonialSection></TestimonialSection>
    </main>
  );
}
