import { ComingSoon } from "@/components/portfolio/coming-soon"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"

export const dynamic = "force-dynamic"

export default async function GoalsPage() {
  const data = await getPortfolioData()

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={data.owner.name} />
      <div className="page-container page-padding">
        <p className="kicker">Roadmap</p>
        <h1 className="page-title gradient-text-animate">Goals & Improvement Plan</h1>
        <p className="page-subtitle">Set your goals and what you want to improve. Empty fields show Coming Soon.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data.goals.length ? (
            data.goals.map((goal) => (
              <article key={goal.id} className="animated-border card-premium card-premium-pad card-premium-hover">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">{goal.status || "planned"}</p>
                <h2 className="mt-2 font-heading text-2xl text-text">{goal.title || "Coming Soon"}</h2>
                <p className="mt-3 text-sm text-muted">{goal.description || "Coming Soon"}</p>
              </article>
            ))
          ) : (
            <ComingSoon text="Goals coming soon" className="md:col-span-2" />
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
