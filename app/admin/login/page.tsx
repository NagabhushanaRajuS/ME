"use client"

import { useState } from "react"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })

    if (!response.ok) {
      setError("Invalid credentials")
      setLoading(false)
      return
    }

    window.location.href = "/admin"
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-5 py-20">
      <section className="w-full rounded-3xl border border-line bg-surface/70 p-8 shadow-card">
        <p className="kicker">Secure Control</p>
        <h1 className="mt-2 font-heading text-3xl text-text">Private Console Access</h1>
        <p className="mt-2 text-sm text-muted">Use your unique ID and passkey to open the control studio.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Control ID"
            className="w-full rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Passkey"
            className="w-full rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Enter Console"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
        <p className="mt-5 text-xs text-muted">
          Recommended flow: use the unified access page at <a href="/access" className="text-accent">/access</a>.
        </p>
      </section>
    </main>
  )
}
