export type ThemeMode = "light" | "medium" | "dark"

export const THEME_ORDER: ThemeMode[] = ["light", "medium", "dark"]

export const THEME_LABELS: Record<ThemeMode, string> = {
  light: "Light",
  medium: "Medium",
  dark: "Dark"
}
