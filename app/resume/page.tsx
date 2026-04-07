import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeBackground } from "@/components/effects/theme-background"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ParticleField } from "@/components/effects/particle-field"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"
import { getLocalResumeInsights } from "@/lib/resume-insights"

export const dynamic = "force-dynamic"

export default async function ResumePage() {
  const data = await getPortfolioData()
  const insights = await getLocalResumeInsights()

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={data.owner.name} />

      <div className="page-container page-padding">
        <p className="kicker">Resume</p>
        <h1 className="page-title gradient-text-animate">Resume PDF</h1>
        <p className="page-subtitle">Loaded directly from the local folder: CONTENT/Resume</p>

        {insights ? (
          <div className="mt-6 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
            <p className="kicker">Detected From PDF</p>
            <p className="mt-3 text-sm text-muted">Email: {insights.email || "N/A"}</p>
            <p className="text-sm text-muted">Phone: {insights.phone || "N/A"}</p>
            {insights.textPreview ? (
              <p className="mt-4 text-sm text-muted">Preview: {insights.textPreview}</p>
            ) : null}
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-line bg-surface/70 p-6 shadow-card">
            <p className="text-sm text-muted">No resume PDF found in CONTENT/Resume yet.</p>
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/api/resume"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-accent px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black"
          >
            Open PDF
          </a>
          <a
            href="/api/resume?download=1"
            className="rounded-full border border-line px-5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-text"
          >
            Download
          </a>
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-line bg-bg/40">
          <iframe
            title="Resume"
            src="/api/resume"
            className="h-[80vh] w-full"
          />
        </div>
      </div>

      <Footer />
    </main>
  )
}
