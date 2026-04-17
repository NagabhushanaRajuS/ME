# Contributing Guide

Welcome to the Elite Portfolio project! This guide will help you understand the codebase and maintain code quality.

## Code Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── api/               # API routes
├── components/            # React components
│   ├── effects/           # Animation effects
│   ├── sections/          # Page sections
│   ├── layout/            # Layout components
│   ├── ui/                # Reusable UI components
│   └── providers/         # Context providers
├── lib/                   # Utilities and helpers
│   ├── utils/            # Utility functions
│   └── data.ts           # Content data
├── public/               # Static assets
└── tests/                # Test files
    ├── unit/            # Unit tests
    └── e2e/             # End-to-end tests
```

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Animation Guidelines

### Types of Animations

1. **Scroll Animations** - Triggered by scroll position
   - Use Framer Motion's `useViewportScroll` hook
   - Always check `prefersReducedMotion()`
   - Debounce scroll handlers to 60fps

2. **Hover Animations** - Interactive element feedback
   - Use Framer Motion's `whileHover` prop
   - Keep duration under 300ms
   - Ensure keyboard-equivalent exists

3. **Transition Animations** - Page/section transitions
   - Use Framer Motion's `AnimatePresence` for route changes
   - Duration: 200-500ms
   - Respect reduced motion preference

4. **Background Animations** - Static background effects
   - Use CSS keyframes or canvas for performance
   - Optimize particle count for mobile
   - Consider hardware acceleration

5. **Particle Field** - Dynamic particle system
   - Optimized for all devices
   - Respects `prefers-reduced-motion`
   - Reduces particle count on mobile/low-end devices

6. **Cursor Glow** - Mouse tracking effect
   - Disabled on touch devices
   - Disabled when `prefers-reduced-motion` is set
   - Uses spring animation for smooth tracking

### Adding New Animations

```typescript
import { prefersReducedMotion, getAnimationDuration } from '@/lib/utils/performance'

export function MyAnimatedComponent() {
  const reducedMotion = prefersReducedMotion()
  const duration = getAnimationDuration(300, 0)

  return (
    <motion.div
      animate={reducedMotion ? {} : { y: [0, 10, 0] }}
      transition={{ duration }}
    >
      Animated content
    </motion.div>
  )
}
```

## Code Standards

### TypeScript
- Always use TypeScript for new files
- Use explicit type annotations for function parameters
- Avoid `any` type - use `unknown` if necessary

### Components
- Use functional components with hooks
- Keep components under 300 lines
- Extract complex logic into custom hooks
- Use React.memo for performance-critical components

### Naming Conventions
- Components: `PascalCase` (e.g., `MyComponent.tsx`)
- Files: `kebab-case` or `PascalCase` for components
- Functions/variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`

### Props
- Use object destructuring
- Define prop types as interfaces
- Document complex props

Example:
```typescript
interface MyComponentProps {
  /** Description of prop */
  title: string
  /** Optional prop description */
  variant?: 'primary' | 'secondary'
  /** Callback triggered on click */
  onClick?: () => void
}

export function MyComponent({ title, variant = 'primary', onClick }: MyComponentProps) {
  // ...
}
```

### Accessibility (A11y)

All new components must pass accessibility standards:

- **WCAG 2.1 AA compliance minimum**
- Semantic HTML (`<button>` instead of `<div onClick>`)
- ARIA labels for dynamic content: `aria-label`, `aria-describedby`, `role`
- Color contrast: 4.5:1 for text (7:1 for AAA)
- Keyboard navigation: all interactive elements must be focusable
- Focus indicators: visible outlines/styling
- Skip links for navigation
- Screen reader testing

Example accessible component:
```typescript
export function Button({ 
  children, 
  onClick, 
  ariaLabel 
}: { 
  children: React.ReactNode
  onClick: () => void
  ariaLabel?: string 
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      {children}
    </button>
  )
}
```

## Performance

### Key Metrics (Core Web Vitals)
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Optimization Checklist
- [ ] Use `next/image` for all images
- [ ] Implement dynamic imports for large components
- [ ] Memoize expensive computations
- [ ] Debounce scroll/resize handlers
- [ ] Lazy load below-the-fold content
- [ ] Run Lighthouse audit regularly

### Image Optimization
```typescript
import Image from 'next/image'

export function MyImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={800}
      height={600}
      loading="lazy"
    />
  )
}
```

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# Unit tests (watch mode)
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Accessibility audit
npm run a11y
```

### Writing Tests

Unit tests go in `tests/unit/` with `.test.ts(x)` extension:
```typescript
describe('MyComponent', () => {
  it('should render', () => {
    // test code
  })
})
```

E2E tests go in `tests/e2e/` with `.spec.ts` extension:
```typescript
test('should navigate to page', async ({ page }) => {
  await page.goto('/')
  // test code
})
```

## Commit Message Format

Follow conventional commits for clear git history:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:
```
feat(animations): add prefers-reduced-motion support
fix(accessibility): improve focus indicators
docs(guide): update contribution guidelines
```

## Pull Request Process

1. Create feature branch: `git checkout -b feature/description`
2. Make changes and commit following commit format
3. Push to your fork
4. Create PR with descriptive title and body
5. Ensure all checks pass:
   - Linting
   - Tests
   - Type checking
   - Lighthouse audit
   - Accessibility audit
6. Request review
7. Merge after approval

## Deployment

The project uses automatic CI/CD with GitHub Actions:

1. Tests run on every push and PR
2. Lighthouse audit validates performance
3. Accessibility audit checks WCAG compliance
4. Merges to `main` automatically deploy to Vercel

## Questions?

- Check existing issues and discussions
- Review code comments and JSDoc
- Ask in pull request comments
- Refer to [Next.js docs](https://nextjs.org/docs)
- Check [Framer Motion docs](https://www.framer.com/motion/)

---

Thank you for contributing to make this portfolio amazing!
