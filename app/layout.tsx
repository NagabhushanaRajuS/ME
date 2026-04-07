import type { Metadata } from "next"
import { IBM_Plex_Mono, Sora, Space_Grotesk } from "next/font/google"
import type { ReactNode } from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"

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

const terminal = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-terminal",
  display: "swap"
})

export const metadata: Metadata = {
  title: "Nagabhushana Raju | Frontend Architect",
  description: "Premium multi-theme personal portfolio powered by Next.js 14 and Framer Motion"
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${heading.variable} ${body.variable} ${terminal.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
