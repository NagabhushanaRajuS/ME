# STAGE 3: Multi-Page Portfolio Architecture

## Directory Structure

```
app/
├── (portfolio)/                    # Route Group for portfolio pages
│   ├── layout.tsx                 # Shared portfolio layout
│   ├── projects/
│   │   └── page.tsx              # Projects showcase with filtering
│   ├── about/
│   │   └── page.tsx              # Detailed about with skills & stats
│   ├── experience/
│   │   └── page.tsx              # Experience timeline
│   ├── blog/
│   │   └── page.tsx              # Blog section (stub)
│   └── contact/
│       └── page.tsx              # Contact form & info
├── components/
│   ├── page-transition.tsx       # Page transition component
│   ├── breadcrumb.tsx            # Breadcrumb navigation
│   └── layout/
│       └── sidebar-nav.tsx       # Collapsible sidebar navigation
├── page.tsx                      # Homepage (all 7 sections)
├── layout.tsx                    # Root layout
├── sitemap.ts                    # Dynamic sitemap generation
└── globals.css
middleware.ts                     # Route analytics middleware
public/
├── robots.txt                    # SEO robots configuration
```

## Routes Overview

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Homepage with all 7 sections (hero, about, experience, projects, skills, contact) |
| `/projects` | `(portfolio)/projects/page.tsx` | Projects showcase with filtering by tech stack, sorting, and search |
| `/about` | `(portfolio)/about/page.tsx` | Detailed biography, skills breakdown by category, stats grid |
| `/experience` | `(portfolio)/experience/page.tsx` | Experience timeline with education and certifications |
| `/blog` | `(portfolio)/blog/page.tsx` | Technical blog section (stub for future posts) |
| `/contact` | `(portfolio)/contact/page.tsx` | Contact form with social links and contact info |
| `/admin` | `app/admin/page.tsx` | Admin dashboard (enhanced) |

### Admin Routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Admin authentication |
| `/admin` | Admin dashboard |

## Navigation Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ROOT LAYOUT                             │
│  (Theme, Fonts, Error Boundary, Theme Provider)             │
└─────────────┬───────────────────────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
        ▼           ▼
    HOMEPAGE    (PORTFOLIO) LAYOUT
    page.tsx    shared layout + breadcrumb + sidebar nav
        │           │
        │           ├─ /projects
        │           │  └─ Projects Page (filtering, sorting, search)
        │           │
        │           ├─ /about
        │           │  └─ About Page (skills, stats, bio)
        │           │
        │           ├─ /experience
        │           │  └─ Experience Page (timeline)
        │           │
        │           ├─ /blog
        │           │  └─ Blog Page (stub)
        │           │
        │           └─ /contact
        │              └─ Contact Page (form + info)
        │
        └─ Full 7-section layout
           - Header (with page indicator)
           - Hero
           - About
           - Experience
           - Projects
           - Skills
           - Contact
           - Footer
```

## Component Hierarchy

### Header Component (Enhanced)
- Logo with home link
- Navigation with active page indicator
- Animated underline for current page
- Mobile menu
- Theme switcher
- Admin button

### Portfolio Pages Layout
```
(portfolio) Layout
├── Theme & Effects (Background, Particles, Glow, Progress)
├── Header (with nav indicator)
├── SidebarNav (collapsible)
├── Breadcrumb Navigation
├── PageTransition Wrapper
│   └── Page Content
│       ├── Projects/About/Experience/Blog/Contact
│       └── Custom content per page
└── Footer
```

### Page Transition Wrapper
- Fade/slide animation on route change
- Key-based re-mounting for fresh animations
- Scroll-to-top on navigation

### Breadcrumb Navigation
- Shows page hierarchy
- Animated stagger entrance
- Active page highlighting
- Only visible for non-root pages

### Sidebar Navigation
- Collapsible on mobile
- Fixed on desktop
- Active route indicator
- Smooth animations

## Key Features

### 1. Projects Page
- Grid layout (responsive: 1-2 columns)
- 3D tilt cards with hover effects
- Search functionality
- Filter by technology stack
- Sort by date or impact
- Result count display

### 2. About Page
- Expanded biography
- Skills breakdown by category (Core, Backend, Design)
- Skill progress bars with animation
- Stats grid (GPA, Projects, Internships, Graduation year)
- Inline experience section
- CTA to contact page

### 3. Experience Page
- Vertical timeline layout
- Professional experience section
- Education section
- Certifications section
- Animated timeline dots
- Responsive for mobile

### 4. Blog Page
- Featured posts layout
- Category tags
- Publication dates
- Call-to-action for subscription
- Future blog posts placeholder

### 5. Contact Page
- Full contact form with validation
- Contact information cards
- Social media links
- Email and location display
- Form submission feedback
- Responsive layout

## Navigation Enhancements

### Header Updates
- Uses Next.js Link component for smooth navigation
- Active page indicator with animated underline
- Dynamic link selection based on current route
- Mobile-responsive navigation

### Link Prefetching
- Next.js Link components automatically prefetch routes
- Smooth page transitions with no reload
- Preserved scroll position intelligently

## SEO & Analytics

### Robots.txt
- Allows all public routes
- Blocks admin pages
- Sitemap reference
- Crawl delay specification

### Sitemap Generation
- Dynamic sitemap.ts for route discovery
- Automatic route enumeration
- Change frequency and priority settings
- Last modified timestamps

### Middleware
- Route logging (development)
- Security headers
- Custom tracking headers
- Path and timestamp tracking

## Mobile Responsiveness

- All pages mobile-first designed
- Sidebar nav collapses to bottom button on mobile
- Breadcrumb responsive
- Forms full-width with proper spacing
- Grid layouts adapt from 1-3 columns
- Touch-friendly buttons and inputs

## Performance Optimizations

- Dynamic imports for heavy components
- Page transitions with framer-motion
- CSS Glass morphism effects
- Particle field performance optimization
- Lazy loading for project images
- Code splitting per page

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Light/Dark theme support
- CSS Grid and Flexbox layouts
- Modern JavaScript (ES2020+)

---

**Created:** 2026-04-17
**Stage:** 3 - Multi-Page Portfolio Architecture
**Status:** Complete
