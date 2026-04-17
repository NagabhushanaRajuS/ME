import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SidebarNav } from "@/components/layout/sidebar-nav"
import { Breadcrumb } from "@/components/layout/breadcrumb"
import { ThemeBackground } from "@/components/effects/theme-background"
import { CursorGlow } from "@/components/effects/cursor-glow"
import { ParticleField } from "@/components/effects/particle-field"
import { ScrollProgress } from "@/components/effects/scroll-progress"
import { PageTransition } from "@/components/layout/page-transition"

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-bg text-text">
      <ThemeBackground />
      <ParticleField />
      <CursorGlow />
      <ScrollProgress />
      <Header />
      <SidebarNav />
      <Breadcrumb />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </main>
  )
}
