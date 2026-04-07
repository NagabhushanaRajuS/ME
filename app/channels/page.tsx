import { ComingSoon } from "@/components/portfolio/coming-soon"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"

export const dynamic = "force-dynamic"

export default async function ChannelsPage() {
  const data = await getPortfolioData()

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={data.owner.name} />
      <div className="page-container page-padding">
        <p className="kicker">YouTube</p>
        <h1 className="page-title gradient-text-animate">YouTube Channels</h1>
        <p className="page-subtitle">Add all your channels and links from admin dashboard.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {data.channels.length ? (
            data.channels.map((item) => (
              <article key={item.id} className="animated-border card-premium card-premium-pad card-premium-hover">
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
