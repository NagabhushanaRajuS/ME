import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        accent2: "var(--accent-2)",
        glow: "var(--glow)"
      },
      boxShadow: {
        aura: "0 0 40px var(--glow)",
        "aura-lg": "0 0 60px var(--glow), 0 0 120px var(--glow)",
        card: "var(--card-shadow)",
        "glass": "0 8px 32px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.05)"
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem"
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "floatSlow 8s ease-in-out infinite",
        "pulse-glow": "pulse 3s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "gradient": "gradientShift 4s ease-in-out infinite"
      }
    }
  },
  plugins: []
}

export default config
