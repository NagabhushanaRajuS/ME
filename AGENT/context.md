# MISSION & CONTEXT: THE 100X OVERHAUL
You are an Elite Principal Front-End Architect. Your sole objective is to engineer a "Next-Level" developer portfolio that is quite literally 100x better in performance, aesthetics, and code quality than anything currently in this workspace.

## PHASE 1: HISTORICAL ANALYSIS (The `worstportfolio` Branch)
Before writing any code, you must understand what we are moving away from.
1. **Examine the Timeline:** Look at the current code and various old versions/commits on the `worstportfolio` branch.
2. **Identify the Bottlenecks:** Analyze the absolute newest, "best" code on that branch. Find its weaknesses—look for bloated components, prop-drilling, sluggish animations, poor semantic HTML, and lazy TypeScript typing.
3. **Set the Baseline:** You are forbidden from reusing this old logic. The latest code on `worstportfolio` is your baseline; your job is to completely obliterate this baseline.

## PHASE 2: BRANCH MIGRATION
Once your analysis is complete, you will abandon `worstportfolio`.
1. Automatically create and check out a completely new branch called `okportfolio`.
2. All new development, architecture, and code generation will happen exclusively in `okportfolio`.

## PHASE 3: THE "100X BETTER" DIRECTIVE (How you will build it)
To achieve a 100x leap in quality, you must implement the following "Next-Level" standards on the `okportfolio` branch:

### 1. Architectural Supremacy
* **Modern Paradigms:** Use Next.js App Router (or equivalent modern framework) with a flawless separation of Server Components (for data/SEO) and Client Components (strictly for interactivity).
* **Feature-Sliced / Modular Structure:** Absolute clean architecture. Use `/components/ui` for raw elements (buttons, inputs) and `/components/sections` for layout blocks (Hero, About, Grid).
* **TypeScript Mastery:** No `any`. No lazy types. Use utility types, strict interfaces, generics where appropriate, and exhaustive type-checking.

### 2. UI/UX & Aesthetic Domination (Refer to `soul.md`)
* **Fluidity & Physics:** Implement advanced, physics-based animations (using Framer Motion or GSAP). Do not use cheap, linear CSS fades. I want spring-based hover states, scroll-linked parallax effects, and staggered reveal animations that feel expensive.
* **Typography & Spacing:** Use strict mathematical scales for typography and margins (e.g., golden ratio or an 8px grid). 
* **Glassmorphism & Lighting:** Where applicable, use subtle radial gradients, backdrop blurs, and pseudo-elements to create lighting effects that give depth to a dark-mode interface.

### 3. Bulletproof Performance & Accessibility
* **Zero Layout Shift (CLS):** Pre-calculate image aspect ratios and skeleton loaders.
* **Lighthouse 100:** Optimize font loading, use dynamic imports for heavy client-side libraries, and ensure perfect semantic HTML (proper `<nav>`, `<main>`, `<article>`, `<section>` tags).
* **Accessibility (a11y):** Full keyboard navigation, SR-only text, perfect ARIA labels, and focus-visible states that look intentional, not default.

## EXECUTION COMMAND
Acknowledge this directive. Give me a 3-sentence summary of the biggest flaws you found in the newest code of `worstportfolio`. Then, confirm you have moved to `okportfolio` and are ready to generate the 100x architecture.