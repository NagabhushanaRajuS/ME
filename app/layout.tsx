import type { Metadata } from "next"
import { Space_Grotesk, Sora } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ToastProvider } from "@/components/ui/toast-system"

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap"
})

const body = Sora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Nagabhushana Raju | AI/ML Engineer & Developer",
  description: "Multi-talented portfolio showcasing AI/ML projects, full-stack development, and data visualization expertise. Built with Next.js 14 and advanced animations."
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${heading.variable} ${body.variable}`}>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
