import { CertificateCarousel } from "@/components/portfolio/certificate-carousel"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"
import { curateCertificates } from "@/lib/certificate-curation"

export const dynamic = "force-dynamic"

export default async function CertificatesPage() {
  const data = await getPortfolioData()
  const certificates = curateCertificates(data.certificates)

  return (
    <main className="page-shell">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header ownerName={data.owner.name} />
      <div className="page-container page-padding">
        <p className="kicker">Certificates</p>
        <h1 className="page-title gradient-text-animate">Certificates</h1>
        <p className="page-subtitle">Animated 3D slide view. Add manually or auto-import screenshots from CONTENT/Certificates in Control Studio.</p>
        <div className="mt-10">
          <CertificateCarousel certificates={certificates} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
