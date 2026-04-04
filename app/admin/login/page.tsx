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
        <h1 className="font-heading text-3xl text-text">Portfolio Admin Login</h1>
        <p className="mt-2 text-sm text-muted">Use your unique credentials to edit the entire portfolio.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Username"
            className="w-full rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            required
          />
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-line bg-bg/50 px-4 py-3 text-text"
            required
          />
          <button
            disabled={loading}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-black disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}
      </section>
    </main>
  )
}
