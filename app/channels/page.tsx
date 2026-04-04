import { ComingSoon } from "@/components/portfolio/coming-soon"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"

export default async function ChannelsPage() {
  const data = await getPortfolioData()

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 lg:px-12">
        <h1 className="font-heading text-4xl text-text md:text-6xl">YouTube Channels</h1>
        <p className="mt-3 max-w-2xl text-muted">Add all your channels and links from admin dashboard.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data.channels.length ? (
            data.channels.map((item) => (
              <article key={item.id} className="rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
                <h2 className="font-heading text-2xl text-text">{item.name || "Coming Soon"}</h2>
                <p className="mt-3 text-sm text-muted">{item.description || "Coming Soon"}</p>
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-semibold text-accent underline underline-offset-4"
                  >
                    Open Channel
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-muted">Channel URL coming soon</p>
                )}
              </article>
            ))
          ) : (
            <ComingSoon text="Channels coming soon" className="md:col-span-2" />
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
