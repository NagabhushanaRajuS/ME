import { redirect } from "next/navigation"
import { AdminEditor } from "@/components/admin/admin-editor"
import { isServerAuthorized } from "@/lib/auth"

export default function AdminPage() {
  if (!isServerAuthorized()) {
    redirect("/access")
  }

  return <AdminEditor />
}
