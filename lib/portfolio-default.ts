import type { PortfolioData } from "@/lib/portfolio-types"

export const defaultPortfolioData: PortfolioData = {
  owner: {
    name: "Nagabhushana Raju",
    headline: "Senior Frontend Architect",
    shortIntro: "I architect premium digital experiences at the intersection of design, motion, and engineering. Over 7+ years shipping product interfaces across fintech, SaaS, and enterprise — built with obsessive attention to craft, accessibility, and scale.",
    profilePhotoUrl: "",
    introVideoUrl: "",
    geometricAvatarNote: "Wireframe geometric avatar - coming soon"
  },
  projects: [],
  certificates: [
    {
      id: "cert-1",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta (Coursera)",
      date: "2023",
      credentialUrl: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
      previewImage: ""
    },
    {
      id: "cert-2",
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2022",
      credentialUrl: "https://aws.amazon.com/certification/certified-developer-associate/",
      previewImage: ""
    },
    {
      id: "cert-3",
      title: "Google UX Design Professional Certificate",
      issuer: "Google (Coursera)",
      date: "2022",
      credentialUrl: "https://www.coursera.org/professional-certificates/google-ux-design",
      previewImage: ""
    },
    {
      id: "cert-4",
      title: "TypeScript: The Complete Developer's Guide",
      issuer: "Udemy",
      date: "2021",
      credentialUrl: "https://www.udemy.com/course/typescript-the-complete-developers-guide/",
      previewImage: ""
    },
    {
      id: "cert-5",
      title: "Next.js & React – The Complete Guide",
      issuer: "Udemy",
      date: "2021",
      credentialUrl: "https://www.udemy.com/course/nextjs-react-the-complete-guide/",
      previewImage: ""
    }
  ],
  goals: [],
  education: [],
  channels: [],
  visitorContact: {
    email: "nagabhushana.raju@example.com",
    phone: ""
  },
  updatedAt: new Date(0).toISOString()
}
