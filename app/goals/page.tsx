import { ComingSoon } from "@/components/portfolio/coming-soon"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"

export default async function GoalsPage() {
  const data = await getPortfolioData()

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 lg:px-12">
        <h1 className="font-heading text-4xl text-text md:text-6xl">Goals & Improvement Plan</h1>
        <p className="mt-3 max-w-2xl text-muted">Set your goals and what you want to improve. Empty fields show Coming Soon.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data.goals.length ? (
            data.goals.map((goal) => (
              <article key={goal.id} className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
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
