import { promises as fs } from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"
import { getDefaultResumeFileName, resolveLocalResumePath } from "@/lib/resume-local"

export const runtime = "nodejs"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const download = searchParams.get("download") === "1"

  const fileName = await getDefaultResumeFileName()
  if (!fileName) {
    return NextResponse.json({ error: "Resume PDF not found in CONTENT/Resume" }, { status: 404 })
  }

  const filePath = resolveLocalResumePath(fileName)
  if (!filePath) {
    return NextResponse.json({ error: "Invalid resume filename" }, { status: 400 })
  }

  const buffer = await fs.readFile(filePath).catch(() => null)
  if (!buffer) {
    return NextResponse.json({ error: "Resume file not readable" }, { status: 404 })
  }

  const safeDownloadName = `resume${path.extname(fileName).toLowerCase() || ".pdf"}`

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename=\"${safeDownloadName}\"`,
      "Cache-Control": "no-store"
    }
  })
}
