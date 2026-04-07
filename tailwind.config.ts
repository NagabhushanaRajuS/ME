import type { Config } from "tailwindcss"

const varColor = (cssVarName: string) => {
  return ({ opacityValue }: { opacityValue?: string }) => {
    if (opacityValue === undefined) return `var(${cssVarName})`
    const alpha = Number(opacityValue)
    if (Number.isNaN(alpha)) return `var(${cssVarName})`
    const pct = `${Math.round(alpha * 100)}%`
    return `color-mix(in srgb, var(${cssVarName}) ${pct}, transparent)`
  }
}

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: varColor("--bg"),
        surface: varColor("--surface"),
        text: varColor("--text"),
        muted: varColor("--muted"),
        line: varColor("--line"),
        accent: varColor("--accent"),
        accent2: varColor("--accent-2"),
        glow: varColor("--glow")
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
