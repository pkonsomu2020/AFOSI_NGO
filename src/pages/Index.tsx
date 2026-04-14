import { useOptimizedScroll } from "@/hooks/useOptimizedScroll";
import Navbar from "@/components/Navbar";
import PageLoader from "@/components/PageLoader";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PillarsSection from "@/components/PillarsSection";
import PartnersSection from "@/components/PartnersSection";
import StatsSection from "@/components/StatsSection";
import ProgramsSection from "@/components/ProgramsSection";
import NewsSection from "@/components/NewsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  useOptimizedScroll();
  
  return (
    <div className="min-h-screen bg-background">
      <PageLoader />
      <Navbar />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <PartnersSection />
      <StatsSection />
      <ProgramsSection />
      <NewsSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Index;
