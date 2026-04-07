import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeBackground } from "@/components/effects/theme-background"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ParticleField } from "@/components/effects/particle-field"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { PortfolioHome } from "@/components/portfolio/portfolio-home"
import { getPortfolioData } from "@/lib/portfolio-store"

export default async function HomePage() {
  const data = await getPortfolioData()

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <PortfolioHome data={data} />
      <Footer />
    </main>
  )
}
