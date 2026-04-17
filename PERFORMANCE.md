# Performance Targets & Benchmarks

This document outlines the performance targets and monitoring for the Elite Portfolio.

## Core Web Vitals Targets

### Google Lighthouse Scores
- **Performance**: >= 90
- **Accessibility**: 100 (zero violations)
- **Best Practices**: 100
- **SEO**: 100

### Core Metrics

| Metric | Abbreviation | Target | Good | Needs Work |
|--------|--------------|--------|------|-----------|
| Largest Contentful Paint | LCP | < 2.5s | < 2.5s | > 4s |
| First Input Delay | FID | < 100ms | < 100ms | > 300ms |
| Cumulative Layout Shift | CLS | < 0.1 | < 0.1 | > 0.25 |
| First Contentful Paint | FCP | < 1.8s | < 1.8s | > 3s |
| Time to Interactive | TTI | < 3.8s | < 3.8s | > 7.3s |

## Device-Specific Targets

### Desktop (1920x1080)
- LCP: < 2.0s
- FID: < 50ms
- CLS: < 0.05
- Bundle size: < 200KB

### Tablet (768x1024)
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Bundle size: < 200KB

### Mobile (375x667)
- LCP: < 3.0s
- FID: < 150ms
- CLS: < 0.1
- Bundle size: < 180KB

## Performance Budget

### JavaScript Bundle
- Initial: < 150KB (gzipped)
- Per route: < 50KB (gzipped)
- Vendor: < 100KB (gzipped)

### CSS
- Global: < 20KB (gzipped)
- Per route: < 10KB (gzipped)

### Images
- Hero image: < 100KB
- Thumbnail: < 50KB
- Avatar: < 20KB
- Average page: < 2MB total images

## Optimization Strategies

### Code Splitting
- Dynamic imports for modals and heavy components
- Route-based code splitting (Next.js automatic)
- Component-level lazy loading

### Image Optimization
- Use `next/image` for all images
- WebP format with fallbacks
- Responsive images with srcset
- Lazy loading with `loading="lazy"`

### Caching
- Static assets: 1 year cache
- HTML: 0 cache (always fresh)
- API responses: 5 minutes

### Network
- Minification (Next.js automatic)
- Compression (gzip/brotli via server)
- HTTP/2 push for critical resources

### Runtime Performance
- Memoization for expensive computations
- Debounced scroll handlers (150ms)
- Throttled resize handlers (100ms)
- Request idle callback for non-critical work

## Monitoring

### Automated Monitoring
- Lighthouse CI on every push
- Web Vitals tracking in production
- Accessibility audits with axe

### Manual Testing Checklist
- [ ] Lighthouse audit (desktop)
- [ ] Lighthouse audit (mobile)
- [ ] PageSpeed Insights
- [ ] WebPageTest
- [ ] Chrome DevTools Performance tab
- [ ] Network tab (throttled 3G)

### Local Testing

#### Development Build
```bash
npm run build
npm run start
npm run lighthouse
```

#### Production Simulation
```bash
npm run build
NEXT_PUBLIC_ENV=production npm start
npm run lighthouse
```

## Optimization Checklist

### Images
- [ ] All images use `next/image`
- [ ] Images have explicit width/height
- [ ] Images have descriptive alt text
- [ ] Images are optimized (< target size)
- [ ] WebP format with fallbacks
- [ ] Lazy loading enabled

### JavaScript
- [ ] No unused dependencies
- [ ] Dynamic imports for large components
- [ ] Tree-shaking enabled
- [ ] Source maps only in dev
- [ ] Memoization for expensive operations
- [ ] Event handlers debounced/throttled

### CSS
- [ ] No unused CSS rules
- [ ] Utility classes optimized (Tailwind purge)
- [ ] Critical CSS inlined
- [ ] Font optimization enabled
- [ ] CSS minified in production

### HTML
- [ ] Semantic markup
- [ ] No render-blocking resources
- [ ] Preload critical fonts
- [ ] Dns-prefetch for third parties

### Network
- [ ] HTTPS enabled
- [ ] CDN for static assets
- [ ] Compression enabled
- [ ] HTTP/2 enabled
- [ ] Browser cache enabled

## Performance Tools

### Testing
- **Lighthouse**: `npm run lighthouse`
- **WebPageTest**: https://www.webpagetest.org
- **PageSpeed Insights**: https://pagespeed.web.dev
- **Accessibility**: `npm run a11y`

### Monitoring
- **Vercel Analytics**: Built-in (Vercel deployment)
- **Web Vitals**: Real user monitoring (optional setup)
- **Error Tracking**: Sentry (optional integration)

### Development
- **DevTools**: Chrome/Firefox performance tab
- **Profiler**: React profiler for component performance
- **Bundle Analyzer**: `@next/bundle-analyzer` (optional)

## Common Performance Issues & Solutions

### High LCP
**Issue**: Largest Contentful Paint too slow
**Solutions**:
1. Optimize images (compression, format)
2. Reduce initial JavaScript
3. Use CDN for assets
4. Enable caching

### High FID
**Issue**: First Input Delay too slow
**Solutions**:
1. Break up long tasks (< 50ms)
2. Use Web Workers for heavy computation
3. Optimize JavaScript parsing
4. Reduce main thread work

### High CLS
**Issue**: Cumulative Layout Shift too high
**Solutions**:
1. Reserve space for dynamic content
2. Add `width` and `height` to images
3. Use `transform` instead of layout properties
4. Avoid injecting content above existing content

### Large Bundle
**Issue**: JavaScript bundle too large
**Solutions**:
1. Remove unused dependencies
2. Use dynamic imports for routes
3. Tree-shake unused exports
4. Use lighter alternatives

## Accessibility Performance

### WCAG 2.1 AA Targets
- Color contrast: >= 4.5:1
- Focus indicators: visible and clear
- Animation: respects `prefers-reduced-motion`
- Touch targets: >= 48x48px
- Keyboard navigation: fully functional

### Testing
```bash
npm run a11y          # Run axe audit
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests
```

## Regression Testing

Run Lighthouse before and after changes:

```bash
# Baseline
npm run build
npm run start &
npm run lighthouse > baseline.json

# Make changes...

# After changes
npm run lighthouse > after.json

# Compare reports
```

## Mobile Optimization

### Device Targets
- iPhone 12: 390x844
- Pixel 5: 393x851
- iPad: 768x1024

### Mobile-Specific
- Reduce particle count to 30-50% on mobile
- Disable cursor-glow on touch devices
- Increase touch target sizes (48x48px minimum)
- Optimize font sizes for readability
- Use mobile-first CSS approach

## Continuous Improvement

### Monthly Review
1. Check Lighthouse scores
2. Review Web Vitals data
3. Identify performance regressions
4. Plan optimizations

### Quarterly Goals
- Maintain >= 90 Performance score
- Zero accessibility violations
- < 100KB JavaScript initial load
- < 2.5s LCP

---

For questions or suggestions, refer to [CONTRIBUTING.md](./CONTRIBUTING.md).
