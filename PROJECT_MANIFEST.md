# PROJECT MANIFEST — Webloom Complete Export

Complete inventory of the exported project. This package contains **100% of the source code required to reproduce the running application** once environment variables are configured.

**Export date:** 2026-08-24
**Framework:** Next.js 16.2 (App Router, Turbopack) · React 19 · TypeScript 5.9
**Database:** PostgreSQL (Neon) via Drizzle ORM
**UI:** Tailwind CSS 4 · Framer Motion 13 · Three.js / React Three Fiber

---

## 1. Directory structure

```
webloom/
├── src/
│   ├── app/                          # Next.js App Router (pages, APIs, metadata)
│   │   ├── about/                    # About page
│   │   ├── admin/                    # Protected admin application
│   │   ├── api/                      # Backend API route handlers (10 endpoints)
│   │   │   ├── admin/content/        # Posts/testimonials/FAQs CRUD
│   │   │   ├── admin/github/         # GitHub discovery/import/review
│   │   │   ├── admin/leads/          # Lead list + status pipeline
│   │   │   ├── admin/session/        # Admin login/logout/session
│   │   │   ├── admin/settings/       # Contact email + social links
│   │   │   ├── admin/stats/          # Analytics + activity logs
│   │   │   ├── contact/              # Public project-brief ingestion
│   │   │   ├── health/               # App + DB healthcheck
│   │   │   ├── site-settings/        # Cached public settings
│   │   │   └── track/                # Privacy-conscious analytics ingestion
│   │   ├── blog/                     # Blog index + [slug] article pages
│   │   ├── contact/                  # Contact page with prefilled briefs
│   │   ├── legal/[doc]/              # Privacy / Terms / Cookies
│   │   ├── pricing/                  # Pricing tabs + estimator + FAQ
│   │   ├── services/                 # Services detail page
│   │   ├── work/                     # Verified projects + concepts
│   │   ├── error.tsx                 # Global error boundary
│   │   ├── globals.css               # Design tokens, themes, loader CSS
│   │   ├── icon.svg                  # Favicon / app icon
│   │   ├── layout.tsx                # Root layout, fonts, SEO, theme script
│   │   ├── loading.tsx               # Software loading animation boundary
│   │   ├── not-found.tsx             # Custom 404
│   │   ├── page.tsx                  # Homepage
│   │   ├── robots.ts                 # robots.txt generation
│   │   ├── sitemap.ts                # sitemap.xml generation
│   │   └── template.tsx              # Route transition wrapper
│   ├── components/                   # All React components (24 files)
│   │   ├── admin/                    # Admin shell, panels, GitHub importer
│   │   ├── blog/                     # Blog search/filter
│   │   ├── home/                     # 13 homepage sections + hero
│   │   ├── pricing/                  # Pricing tabs + estimator
│   │   ├── chrome.tsx                # Nav/footer shell, tracker, cursor
│   │   ├── contact-form.tsx          # Validated project-brief form
│   │   ├── faq.tsx                   # Accessible accordion + FAQ JSON-LD
│   │   ├── github-work-section.tsx   # Verified projects + archive
│   │   ├── hero3d.tsx                # Three.js hero scene (lazy, adaptive)
│   │   ├── software-loader.tsx       # Loading animation component
│   │   └── ...                       # nav, footer, motion, theme, ui, tier-card
│   ├── db/
│   │   ├── index.ts                  # Bounded PostgreSQL pool + Drizzle client
│   │   └── schema.ts                 # 8-table schema (source of truth)
│   └── lib/
│       ├── auth.ts                   # HMAC admin sessions, timing-safe compare
│       ├── data.ts                   # Cached data access, analytics, logging
│       ├── github.ts                 # GitHub API client + stack analysis
│       ├── rate-limit.ts             # Sliding-window rate limiter
│       ├── site.ts                   # All code-configured site content
│       └── utils.ts                  # cn (tailwind-merge), date, slug helpers
├── public/
│   ├── images/projects/              # 8 generated portfolio covers (JPEG)
│   └── og-image.jpg                  # 1200×630 social sharing image
├── drizzle/                          # Generated SQL migrations + metadata
├── scripts/
│   └── seed.mjs                      # Idempotent content seed (17 projects,
│                                    #   2 articles, settings)
├── .env.example                      # All environment variable names + docs
├── .gitignore                        # Protects secrets and build output
├── drizzle.config.ts                 # Drizzle Kit config (reads DATABASE_URL)
├── eslint.config.mjs                 # ESLint (next/core-web-vitals)
├── next.config.ts                    # Next.js config + security headers
├── package.json                      # Dependencies + scripts
├── package-lock.json                 # Reproducible dependency lock
├── postcss.config.mjs                # Tailwind CSS v4 via PostCSS
├── tsconfig.json                     # TypeScript + @/* path alias
├── README.md                         # Full documentation
└── PROJECT_MANIFEST.md               # This file
```

## 2. Pages (10 routes)

| Route | Type | Purpose |
|---|---|---|
| `/` | ISR (5 min) | Homepage: hero + 3D, services, products, verified work, process, tech, pricing, FAQ, CTA |
| `/services` | Static | Six service detail blocks + technology overview |
| `/work` | ISR (5 min) | Source-verified GitHub projects (8 featured + 9 archive) + product concepts |
| `/pricing` | ISR (5 min) | Interactive pricing tabs, estimator, FAQ accordion |
| `/about` | Static | Mission, vision, approach, values, process |
| `/contact` | Dynamic | Query-prefilled project brief form + cached settings |
| `/blog` | ISR (5 min) | Published articles, search, categories |
| `/blog/[slug]` | On-demand ISR | Article rendering (markdown-lite) + related posts |
| `/legal/privacy`, `/legal/terms`, `/legal/cookies` | SSG | Editable legal templates |
| `/admin` | Dynamic, noindex | Password-protected dashboard (7 tabs) |
| 404 | Custom | Branded "hasn't bloomed yet" page |

## 3. API endpoints (10)

| Method | Endpoint | Auth | Function |
|---|---|---|---|
| GET | `/api/health` | Public | App + database healthcheck |
| POST | `/api/contact` | Public, rate-limited | Validate + store project briefs (leads) |
| POST | `/api/track` | Public, rate-limited | Pageview/CTA analytics ingestion |
| GET | `/api/site-settings` | Public, cached 5 min | Public contact email + social links |
| GET/POST/DELETE | `/api/admin/session` | Public/rate-limited | Admin login, logout, session state |
| GET/PATCH | `/api/admin/leads` | Admin | Lead list + status pipeline updates |
| GET/POST/PATCH/DELETE | `/api/admin/content` | Admin | Blog, testimonials, FAQs CRUD + cache invalidation |
| GET/POST/PATCH/DELETE | `/api/admin/github` | Admin | Repository discovery, import, review, removal |
| GET/PUT | `/api/admin/settings` | Admin | Contact email + social links |
| GET | `/api/admin/stats` | Admin | 30-day analytics + 100 recent logs |

## 4. Database (8 tables, PostgreSQL/Neon)

Defined in `src/db/schema.ts`; SQL migrations in `drizzle/`.

| Table | Purpose | Key columns |
|---|---|---|
| `leads` | Contact submissions | name, email, projectType, budget, timeline, message, status (new→won/lost) |
| `posts` | Blog articles | slug (unique), title, content, category, published, featured |
| `testimonials` | Client feedback (hidden until real entries exist) | name, quote, company, published |
| `faqs` | Admin-managed FAQs (fallback defaults in code) | question, answer, sort, published |
| `github_projects` | Source-verified portfolio | githubId (unique), owner/repo, category, summary, image, technologies JSONB, published, featured |
| `events` | Privacy-conscious analytics | type, name, path, referrer (no IPs) |
| `logs` | Activity/security logs | level (info/warn/error/security), message |
| `settings` | Key/value site settings | key, JSONB value |

All tables include UUID primary keys, timestamps, and 8 indexes (created/updated/status/published/featured).

## 5. Environment variables (complete list)

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL/Neon connection string (app + Drizzle Kit) |
| `ADMIN_PASSWORD` | Production | Admin dashboard password (dev fallback: `webloom`) |
| `ADMIN_SECRET` | Production | HMAC secret for admin session cookies (generate: `openssl rand -base64 48`) |
| `GITHUB_TOKEN` | Optional | Fine-grained read-only GitHub token for discovery/private repo inspection |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical origin for SEO/OG/sitemap/robots |

All are documented in `.env.example`. `NODE_ENV` is framework-managed.

## 6. Features included (audit-verified)

- ✅ Interactive Three.js hero (lazy-loaded, mobile-adaptive, reduced-motion aware)
- ✅ CSS software loading animation + hero scene fallback
- ✅ Dark/light theme with persistence + no-flash script
- ✅ Page transitions, scroll reveals, magnetic buttons, custom cursor
- ✅ Pricing tabs (keyboard accessible) + live project estimator
- ✅ Contact form: client+server validation, loading/success/error states, rate limiting
- ✅ Admin: overview analytics, leads pipeline, blog/testimonial/FAQ CRUD, GitHub importer, settings, activity logs
- ✅ GitHub integration: URL import, stack analysis, discovery (with token), publish/feature controls
- ✅ Privacy-conscious first-party analytics (no IPs/fingerprints)
- ✅ Full SEO: metadata, OG/Twitter cards, JSON-LD (Organization, ProfessionalService, FAQ, Article), sitemap, robots
- ✅ Accessibility: skip link, aria-current, roving tabindex, aria-live, reduced-motion support
- ✅ Security: signed HTTP-only sessions, timing-safe compares, rate limiting, input sanitization, security headers
- ✅ Performance: ISR caching, tagged caches with admin invalidation, bounded DB pool, optimized OG image (37 KB)

## 7. Assets

- `public/images/projects/*.jpg` — 8 portfolio covers (160–272 KB each, 1672×941)
- `public/og-image.jpg` — 1200×630 social image (37 KB)
- `src/app/icon.svg` — bloom favicon
- Fonts (Inter, JetBrains Mono) load via `next/font/google` — no local font files needed

## 8. Intentionally NOT included (with reasons)

| Excluded | Reason |
|---|---|
| `.env` (real credentials) | Security — contains live Neon password/admin secrets. Configure from `.env.example`. |
| `node_modules/` | Restored via `npm ci` from `package-lock.json` |
| `.next/` build output | Regenerated by `npm run build` |
| `next-env.d.ts`, `*.tsbuildinfo` | Auto-generated by Next.js |
| Runtime data (leads, events, logs in your live DB) | Operational data, not source. Structure + seed content are included; use your existing Neon database or run migrations + seed. |
| Neon connection string | Secret — never embedded in downloadable source |

**Database data note:** your live Neon database already contains all content. The included `scripts/seed.mjs` reproduces the same content (settings, 2 articles, 17 projects) idempotently on any fresh database — existing rows are never overwritten.

## 9. Quick start

```bash
npm ci                      # install exact dependencies
cp .env.example .env        # configure DATABASE_URL (+ admin secrets)
npx drizzle-kit migrate     # create all 8 tables (or: npx drizzle-kit push)
node scripts/seed.mjs       # optional: seed content (idempotent)
npm run dev                 # http://localhost:3000
```

Production: `npm run build && npm start`
