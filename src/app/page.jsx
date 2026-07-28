import CategorySection from '@/components/Home/CategorySection';
import FeaturedSection from '@/components/Home/FeaturedSection';
import HeroSection from '@/components/Home/HeroSection';

export default function Home() {
  return (
    <main>
      <HeroSection />

      <CategorySection></CategorySection>

      <FeaturedSection />
    </main>
  );
}