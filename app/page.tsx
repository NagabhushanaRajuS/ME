import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeBackground } from "@/components/effects/theme-background"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ParticleField } from "@/components/effects/particle-field"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
