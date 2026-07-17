import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import ProofOfWorkSection from "./components/ProofOfWorkSection";
import AISection from "./components/AISection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProofOfWorkSection />
        <ProjectsSection />
        <SkillsSection />
        <AISection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
