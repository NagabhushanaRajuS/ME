export type ProjectItem = {
  id: string
  title: string
  description: string
  ytDemoUrl: string
  tags: string[]
}

export type CertificateItem = {
  id: string
  title: string
  issuer: string
  date: string
  credentialUrl: string
  previewImage: string
}

export type GoalItem = {
  id: string
  title: string
  description: string
  status: "planned" | "in-progress" | "completed"
}

export type EducationItem = {
  id: string
  label: string
  institution: string
  website: string
  location: string
  years: string
}

export type ChannelItem = {
  id: string
  name: string
  url: string
  description: string
}

export type PortfolioOwner = {
  name: string
  headline: string
  shortIntro: string
  profilePhotoUrl: string
  introVideoUrl: string
  geometricAvatarNote: string
}

export type VisitorContactConfig = {
  email: string
  phone: string
}

export type PortfolioData = {
  owner: PortfolioOwner
  projects: ProjectItem[]
  certificates: CertificateItem[]
  goals: GoalItem[]
  education: EducationItem[]
  channels: ChannelItem[]
  visitorContact: VisitorContactConfig
  updatedAt: string
}

export type InquiryItem = {
  id: string
  name: string
  contact: string
  companyName: string
  purpose: string
  createdAt: string
}
