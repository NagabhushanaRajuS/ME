import { NextResponse } from "next/server"
import { isRequestAuthorized } from "@/lib/auth"
import { importCertificatesFromLocalFolder } from "@/lib/certificate-import"
import { getPortfolioData, savePortfolioData } from "@/lib/portfolio-store"

export const runtime = "nodejs"

export async function POST(request: import("next/server").NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const current = await getPortfolioData()
  const imported = await importCertificatesFromLocalFolder(current.certificates)

  const saved = await savePortfolioData({
    ...current,
    certificates: imported.certificates
  })

  return NextResponse.json({
    ok: true,
    importedCount: imported.importedCount,
    renamedCount: imported.renamedCount,
    skippedFiles: imported.skippedFiles,
    certificates: saved.certificates
  }, {
    headers: {
      "Cache-Control": "no-store"
    }
  })
}
