import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { ThemeBackground } from "@/components/effects/theme-background"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ParticleField } from "@/components/effects/particle-field"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { PortfolioHome } from "@/components/portfolio/portfolio-home"
import { getPortfolioData } from "@/lib/portfolio-store"
import { getLocalHologramPhotoUrls } from "@/lib/hologram-local"
import { getLocalResumeInsights } from "@/lib/resume-insights"

export const dynamic = "force-dynamic"

function hasMeaningfulText(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return false
  return !/^coming\s+soon\.?$/i.test(trimmed)
}

export default async function HomePage() {
  const data = await getPortfolioData()
  const localHologramPhotos = await getLocalHologramPhotoUrls()
  const resumeInsights = await getLocalResumeInsights()

  let viewData = data

  if (localHologramPhotos.length) {
    const profilePhotoUrl = viewData.owner.profilePhotoUrl?.trim() ?? ""

    viewData = {
      ...viewData,
      owner: {
        ...viewData.owner,
        hologramPhotoUrls: localHologramPhotos,
        profilePhotoUrl: profilePhotoUrl.length ? profilePhotoUrl : (localHologramPhotos[0] ?? "")
      }
    }
  }

  if (resumeInsights) {
    const currentIntro = viewData.owner.shortIntro?.trim() ?? ""
    const resumeIntro = resumeInsights.objective.trim() || resumeInsights.textPreview.trim()
    const currentHeadline = viewData.owner.headline?.trim() ?? ""
    const visitorEmail = viewData.visitorContact.email?.trim() ?? ""
    const visitorPhone = viewData.visitorContact.phone?.trim() ?? ""

    viewData = {
      ...viewData,
      owner: {
        ...viewData.owner,
        headline: hasMeaningfulText(currentHeadline)
          ? currentHeadline
          : "Software Engineer | AI-Enabled Full Stack Systems",
        shortIntro: hasMeaningfulText(currentIntro) ? currentIntro : resumeIntro
      },
      visitorContact: {
        ...viewData.visitorContact,
        email: visitorEmail.length ? visitorEmail : (resumeInsights.email ?? ""),
        phone: visitorPhone.length ? visitorPhone : (resumeInsights.phone ?? "")
      }
    }
  } else {
    viewData = {
      ...viewData,
      owner: {
        ...viewData.owner,
        headline: hasMeaningfulText(viewData.owner.headline)
          ? viewData.owner.headline
          : "Software Engineer | AI-Enabled Full Stack Systems"
      }
    }
  }

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={viewData.owner.name} />
      <PortfolioHome data={viewData} />
      <Footer />
    </main>
  )
}
