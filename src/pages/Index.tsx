import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import QuickNavigation from "@/components/QuickNavigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-cosmic">
      <Navigation />
      <main>
        <HeroSection />
        <QuickNavigation />
      </main>
    </div>
  );
};

export default Index;
