import type { PortfolioData } from "@/lib/portfolio-types"

export const defaultPortfolioData: PortfolioData = {
  owner: {
    name: "Nagabhushana Raju",
    headline: "Frontend Engineer",
    shortIntro: "Coming Soon",
    profilePhotoUrl: "",
    hologramPhotoUrls: ["", "", "", "", ""],
    introVideoUrl: "",
    geometricAvatarNote: "Wireframe geometric avatar - coming soon"
  },
  projects: [],
  certificates: [],
  goals: [],
  education: [],
  channels: [],
  visitorContact: {
    email: "",
    phone: ""
  },
  updatedAt: new Date(0).toISOString()
}
