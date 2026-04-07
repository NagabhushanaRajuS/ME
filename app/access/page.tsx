import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { AccessPortal } from "@/components/access/access-portal"
import { getPortfolioData } from "@/lib/portfolio-store"

export const dynamic = "force-dynamic"

export default async function AccessPage() {
  const data = await getPortfolioData()

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={data.owner.name} />

      <div className="page-container page-padding">
        <p className="kicker">Identity Access Layers</p>
        <h1 className="page-title gradient-text-animate">Control, Visitor, and AI Entry</h1>
        <p className="page-subtitle">
          Three synchronized access flows: creator control console, visitor check-in with acknowledgement mail,
          and direct machine-readable endpoints.
        </p>

        <AccessPortal />
      </div>

      <Footer />
    </main>
  )
}
