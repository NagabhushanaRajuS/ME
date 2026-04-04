import { CertificateCarousel } from "@/components/portfolio/certificate-carousel"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { ThemeBackground } from "@/components/effects/theme-background"
import { ParticleField } from "@/components/effects/particle-field"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { getPortfolioData } from "@/lib/portfolio-store"

export default async function CertificatesPage() {
  const data = await getPortfolioData()

  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-28 md:px-8 lg:px-12">
        <h1 className="font-heading text-4xl text-text md:text-6xl">Certificates</h1>
        <p className="mt-3 max-w-2xl text-muted">Animated 3D slide view. Add your certificate details from admin dashboard.</p>
        <div className="mt-10">
          <CertificateCarousel certificates={data.certificates} />
        </div>
      </div>
      <Footer />
    </main>
  )
}
