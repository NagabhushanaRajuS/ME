"use client"

import { useEffect, useMemo, useState } from "react"

type SyncState = {
  healthy: boolean
  updatedAt: string
  latencyMs: number
}

function formatAge(updatedAt: string) {
  const ts = Date.parse(updatedAt)
  if (!Number.isFinite(ts)) return "unknown"

  const seconds = Math.max(0, Math.floor((Date.now() - ts) / 1000))
  if (seconds < 60) return `${seconds}s ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export function LiveSyncIndicator() {
  const [state, setState] = useState<SyncState>({
    healthy: true,
    updatedAt: "",
    latencyMs: 0
  })

  useEffect(() => {
    let disposed = false

    const sync = async () => {
      const started = performance.now()
      const response = await fetch(`/api/public/portfolio?ts=${Date.now()}`, { cache: "no-store" }).catch(() => null)
      if (!response?.ok) {
        if (!disposed) {
          setState((prev) => ({ ...prev, healthy: false }))
        }
        return
      }

      const payload = await response.json().catch(() => null) as { updatedAt?: string } | null
      if (disposed) return

      setState({
        healthy: true,
        updatedAt: payload?.updatedAt ?? "",
        latencyMs: Math.max(1, Math.round(performance.now() - started))
      })
    }

    void sync()
    const id = window.setInterval(() => {
      void sync()
    }, 12000)

    return () => {
      disposed = true
      window.clearInterval(id)
    }
  }, [])

  const ageText = useMemo(() => formatAge(state.updatedAt), [state.updatedAt])

  return (
    <div className="live-sync-indicator hidden items-center gap-2 rounded-full border border-line bg-bg/45 px-3 py-1 text-[11px] uppercase tracking-[0.12em] text-muted lg:flex">
      <span className={`h-2 w-2 rounded-full ${state.healthy ? "animate-pulse bg-accent" : "bg-red-400"}`} />
      <span>Live Sync</span>
      <span className="text-muted/80">{ageText}</span>
      <span className="text-muted/70">{state.latencyMs}ms</span>
    </div>
  )
}
