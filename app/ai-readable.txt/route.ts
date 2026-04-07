import { NextResponse } from "next/server"
import { getPortfolioData } from "@/lib/portfolio-store"

function listLine(label: string, value: string) {
  return `${label}: ${value && value.trim().length ? value : "N/A"}`
}

export async function GET() {
  const data = await getPortfolioData()

  const lines: string[] = []
  lines.push("PORTFOLIO AI READABLE FEED")
  lines.push(`Updated: ${data.updatedAt}`)
  lines.push("")

  lines.push("OWNER")
  lines.push(listLine("Name", data.owner.name))
  lines.push(listLine("Headline", data.owner.headline))
  lines.push(listLine("ShortIntro", data.owner.shortIntro))
  lines.push("")

  lines.push("VISITOR CONTACT")
  lines.push(listLine("Email", data.visitorContact.email))
  lines.push(listLine("Phone", data.visitorContact.phone))
  lines.push("")

  lines.push("PROJECTS")
  if (!data.projects.length) {
    lines.push("- N/A")
  } else {
    for (const project of data.projects) {
      lines.push(`- ${project.title || "Untitled"} | ${project.description || "N/A"} | tags=${project.tags.join(",") || "N/A"}`)
    }
  }
  lines.push("")

  lines.push("CERTIFICATES")
  if (!data.certificates.length) {
    lines.push("- N/A")
  } else {
    for (const cert of data.certificates) {
      const courseLinks = Array.isArray(cert.courseLinks) ? cert.courseLinks.filter(Boolean) : []
      const credentialPart = cert.credentialUrl ? ` | credential=${cert.credentialUrl}` : ""
      const coursesPart = courseLinks.length ? ` | courses=${courseLinks.join(",")}` : ""
      lines.push(`- ${cert.title || "Untitled"} | ${cert.issuer || "N/A"} | ${cert.date || "N/A"}${credentialPart}${coursesPart}`)
    }
  }
  lines.push("")

  lines.push("GOALS")
  if (!data.goals.length) {
    lines.push("- N/A")
  } else {
    for (const goal of data.goals) {
      lines.push(`- ${goal.title || "Untitled"} | ${goal.status || "planned"} | ${goal.description || "N/A"}`)
    }
  }
  lines.push("")

  lines.push("EDUCATION")
  if (!data.education.length) {
    lines.push("- N/A")
  } else {
    for (const edu of data.education) {
      lines.push(`- ${edu.label || "N/A"} | ${edu.institution || "N/A"} | ${edu.years || "N/A"} | ${edu.website || "N/A"}`)
    }
  }
  lines.push("")

  lines.push("CHANNELS")
  if (!data.channels.length) {
    lines.push("- N/A")
  } else {
    for (const channel of data.channels) {
      lines.push(`- ${channel.name || "N/A"} | ${channel.url || "N/A"}`)
    }
  }

  return new NextResponse(lines.join("\n"), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  })
}
