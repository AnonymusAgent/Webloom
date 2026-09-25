# Webloom

**Digital products, built beautifully.**

Webloom is a production-oriented company website for a premium software and digital product studio. It presents Webloom as an end-to-end partner for websites, mobile applications, SaaS platforms, AI products, UI/UX, and custom business software.

The application includes a public marketing website, interactive pricing and project estimation, a PostgreSQL-backed contact workflow, privacy-conscious first-party analytics, a blog, configurable testimonials and FAQs, and a password-protected administration dashboard.

> This README describes the repository as currently implemented. It intentionally distinguishes between database-managed content and content that still requires a code change and deployment.

---

## Table of contents

1. [Feature overview](#feature-overview)
2. [Technology stack](#technology-stack)
3. [Architecture](#architecture)
4. [Project structure](#project-structure)
5. [Route inventory](#route-inventory)
6. [Prerequisites](#prerequisites)
7. [Environment variables](#environment-variables)
8. [Local setup](#local-setup)
9. [Database](#database)
10. [Admin dashboard](#admin-dashboard)
11. [Content management](#content-management)
12. [Contact and lead workflow](#contact-and-lead-workflow)
13. [Analytics](#analytics)
14. [SEO and social sharing](#seo-and-social-sharing)
15. [Theme, motion, and 3D](#theme-motion-and-3d)
16. [Accessibility](#accessibility)
17. [Security](#security)
18. [Development commands](#development-commands)
19. [Validation and testing](#validation-and-testing)
20. [Production deployment](#production-deployment)
21. [Backups and operations](#backups-and-operations)
22. [Known boundaries and production recommendations](#known-boundaries-and-production-recommendations)
23. [Troubleshooting](#troubleshooting)

---

## Feature overview

### Public website

- Premium dark-first visual system with a persistent light mode
- Responsive sticky navigation and full-screen mobile menu
- Interactive Three.js hero bloom with particles, orbital rings, and glass UI panels
- Mouse and scroll response on desktop
- Reduced 3D complexity on mobile
- `prefers-reduced-motion` support throughout the site
- Service, product, work, process, technology, pricing, FAQ, and conversion sections
- Dedicated Services, Work, Pricing, About, Contact, Blog, and Legal pages
- Source-verified GitHub project portfolio with eight original product covers and a supporting repository archive
- Honest project labels: **Source verified**, **Webloom Product**, or **Product Concept**
- Testimonials hidden unless genuine published entries exist
- Homepage insights hidden unless published articles exist
- Custom branded 404 and global error states

### Pricing and conversion

- Interactive tabs for Websites, Mobile Apps, Custom Software, and SaaS
- Starting-price packages rather than misleading fixed quotations
- Client-side project estimator that returns a directional range
- Context-aware contact links that prefill the project brief
- Contact form validation, loading, success, and error states
- PostgreSQL-backed lead storage
- Lead status pipeline in the admin dashboard

### Administration

- Password-protected `/admin` interface
- 30-day page-view, interaction, lead, and conversion summaries
- Popular pages, external referrers, daily traffic chart, and lead status totals
- Lead review and status updates
- Verified GitHub repository inspection, review, refresh, and publication controls
- Blog post create, edit, publish, feature, and delete controls
- Testimonial create, edit, publish/hide, and delete controls
- FAQ create, edit, order, publish/hide, and delete controls
- Contact email and owned social-profile configuration
- System, form, and authentication activity logs

---

## Technology stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2, App Router |
| UI | React 19.2, TypeScript 5.9 |
| Styling | Tailwind CSS 4.1, custom design tokens |
| Motion | Framer Motion 13 |
| 3D | Three.js, React Three Fiber, Drei |
| Icons | Lucide React plus custom SVG brand marks |
| Database | PostgreSQL |
| ORM | Drizzle ORM with `node-postgres` |
| Schema tooling | Drizzle Kit |
| Class utilities | `clsx` and `tailwind-merge` |
| Fonts | Inter and JetBrains Mono via `next/font` |

No external SaaS API is required for the website to run. PostgreSQL stores CMS content, portfolio projects, leads, settings, analytics, and logs. The root layout is intentionally database-independent so it can stream immediately; public settings refresh after hydration and public CMS reads use tagged five-minute caches. GitHub’s REST API is used only when an administrator discovers, imports, or refreshes verified repository projects.

---

## Architecture

The project uses the Next.js App Router and defaults to React Server Components. Interactive pieces are isolated into client components.

### Request and rendering flow

1. `src/app/layout.tsx` defines global metadata, fonts, Organization structured data, and the initial theme script.
2. The layout reads database-backed contact/social settings through `src/lib/data.ts`.
3. `src/components/chrome.tsx` adds the public navigation, footer, analytics tracker, reduced-motion configuration, and desktop cursor.
4. Public pages compose reusable server and client components.
5. Public CMS content is read through tagged five-minute Next.js caches backed by Drizzle/PostgreSQL; admin mutations expire the corresponding tag immediately.
6. The client shell refreshes public contact/social settings from `/api/site-settings` after hydration without blocking the document shell.
7. Browser interactions call route handlers under `src/app/api/`.
8. Admin APIs verify the signed `wl_admin` session cookie before reading or mutating protected data.

### Content model

The application uses two content sources:

- **Code-configured content:** `src/lib/site.ts`
- **Database-managed content:** PostgreSQL tables exposed through `/admin`

This split keeps brand-critical layout content version-controlled while allowing frequently changing content—articles, testimonials, FAQs, contact information, social links, and leads—to be managed without rebuilding.

---

## Project structure

```text
.
├── public/
│   └── og-image.jpg                # Optimized 1200×630 social sharing image
├── src/
│   ├── app/
│   │   ├── about/page.tsx
│   │   ├── admin/page.tsx          # Admin application entry point
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── content/route.ts
│   │   │   │   ├── github/route.ts   # Repository discovery/import/review API
│   │   │   │   ├── leads/route.ts
│   │   │   │   ├── session/route.ts
│   │   │   │   ├── settings/route.ts
│   │   │   │   └── stats/route.ts
│   │   │   ├── contact/route.ts
│   │   │   ├── health/route.ts
│   │   │   └── track/route.ts
│   │   ├── blog/
│   │   │   ├── [slug]/page.tsx
│   │   │   └── page.tsx
│   │   ├── contact/page.tsx
│   │   ├── legal/[doc]/page.tsx
│   │   ├── pricing/page.tsx
│   │   ├── services/page.tsx
│   │   ├── work/page.tsx
│   │   ├── error.tsx               # Global error boundary
│   │   ├── globals.css             # Tokens, themes, utilities, animation CSS
│   │   ├── icon.svg                # Application/favicon icon
│   │   ├── layout.tsx              # Root layout and global metadata
│   │   ├── not-found.tsx           # Custom 404
│   │   ├── page.tsx                # Homepage
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── template.tsx            # Route transition wrapper
│   ├── components/
│   │   ├── admin/                   # Admin shell, CMS panels, GitHub importer
│   │   ├── blog/                    # Blog search/filter UI
│   │   ├── home/                    # Homepage section components
│   │   ├── pricing/                 # Pricing tabs and estimator
│   │   ├── chrome.tsx               # Public shell, tracker, custom cursor
│   │   ├── contact-form.tsx
│   │   ├── faq.tsx
│   │   ├── footer.tsx
│   │   ├── hero3d.tsx
│   │   ├── github-work-section.tsx  # Published source-verified project cards
│   │   ├── motion.tsx               # Shared reveal/magnetic motion primitives
│   │   ├── nav.tsx
│   │   ├── theme.tsx
│   │   ├── tier-card.tsx
│   │   └── ui.tsx                   # Logo, buttons, chips, headings, container
│   ├── db/
│   │   ├── index.ts                 # PostgreSQL pool and Drizzle client
│   │   └── schema.ts                # Eight-table schema
│   └── lib/
│       ├── auth.ts                  # Signed admin session tokens
│       ├── data.ts                  # Server-only data access and analytics queries
│       ├── github.ts                # GitHub URL parser, API client, stack analysis
│       ├── rate-limit.ts            # In-memory sliding-window limiter
│       ├── site.ts                  # Main code-configured content source
│       └── utils.ts
├── .env                             # Local secrets; ignored by Git
├── .env.example                     # Sanitized environment template
├── drizzle/                         # Generated SQL migrations + metadata
├── scripts/
│   └── seed.mjs                     # Idempotent content seed (projects, posts, settings)
├── .gitignore                       # Protects secrets and generated output
├── drizzle.config.ts                # Environment-driven Drizzle Kit config
├── next.config.ts                   # Next.js and security headers
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

Generated directories such as `.next/` and dependency directories such as `node_modules/` are not part of the source architecture.

---

## Route inventory

### Public pages

| Route | Rendering | Purpose |
|---|---|---|
| `/` | ISR, 5 minutes | Homepage with cached FAQs, testimonials, posts, and verified projects |
| `/services` | Static | Detailed services and technology overview |
| `/work` | ISR, 5 minutes | Published source-verified GitHub projects plus clearly labeled product concepts |
| `/pricing` | ISR, 5 minutes | Pricing tabs, estimator, and cached database/default FAQs |
| `/about` | Static | Mission, vision, approach, values, and process |
| `/contact` | Dynamic + cached settings | Query-prefilled project brief and public contact address |
| `/blog` | ISR, 5 minutes | Published posts, search, categories, or an empty state |
| `/blog/[slug]` | On-demand ISR | Cached published article and related articles |
| `/legal/privacy` | Static generation | Editable legal starting template |
| `/legal/terms` | Static generation | Editable legal starting template |
| `/legal/cookies` | Static generation | Editable legal starting template |
| `/admin` | Dynamic, no-index | Protected administration application |
| `/sitemap.xml` | Generated | Static routes plus published articles |
| `/robots.txt` | Generated | Allows public pages; disallows `/admin` and `/api` |
| Unknown routes | 404 | Branded “hasn’t bloomed yet” page |

FAQ content is embedded on the homepage and Pricing page rather than exposed as a separate `/faq` route. Footer FAQ links target `/pricing#faq`.

### API routes

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/health` | Public | Checks application and database health |
| `POST` | `/api/contact` | Public, rate-limited | Validates and stores a project brief |
| `POST` | `/api/track` | Public, rate-limited | Stores page views and named interactions |
| `GET` | `/api/site-settings` | Public, cached | Returns public contact email and owned social links only |
| `GET` | `/api/admin/session` | Public | Returns current admin-session state |
| `POST` | `/api/admin/session` | Public, rate-limited | Authenticates and creates a session cookie |
| `DELETE` | `/api/admin/session` | Public | Clears the admin session cookie |
| `GET` | `/api/admin/leads` | Admin | Returns up to 500 recent leads |
| `PATCH` | `/api/admin/leads` | Admin | Changes a lead status |
| `GET` | `/api/admin/github` | Admin | Lists imported projects and token availability |
| `POST` | `/api/admin/github` | Admin | Discovers token-accessible repositories or imports a specific URL |
| `PATCH` | `/api/admin/github` | Admin | Reviews project copy and changes publish/feature state |
| `DELETE` | `/api/admin/github` | Admin | Removes an imported project from Webloom only |
| `GET` | `/api/admin/content?resource=...` | Admin | Reads posts, testimonials, or FAQs |
| `POST` | `/api/admin/content?resource=...` | Admin | Creates content |
| `PATCH` | `/api/admin/content?resource=...` | Admin | Updates content |
| `DELETE` | `/api/admin/content?resource=...` | Admin | Deletes content |
| `GET` | `/api/admin/settings` | Admin | Reads contact/social settings |
| `PUT` | `/api/admin/settings` | Admin | Updates contact/social settings |
| `GET` | `/api/admin/stats` | Admin | Returns 30-day analytics and 100 recent logs |

Valid `resource` values for the content endpoint are `posts`, `testimonials`, and `faqs`.

---

## Prerequisites

Recommended local environment:

- Node.js 20.9 or newer; Node.js 22 LTS is recommended
- npm 10 or newer
- PostgreSQL 14 or newer, or a managed PostgreSQL provider such as Neon
- A local database named `app_db` or a managed database/branch you control

Check installed versions:

```bash
node --version
npm --version
psql --version
```

---

## Environment variables

Copy the sanitized template, then update `.env` in the project root:

```bash
cp .env.example .env
```

```dotenv
# Local PostgreSQL:
# DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
# Managed Neon direct connection (recommended with this app's bounded pg pool):
DATABASE_URL=postgresql://USER:PASSWORD@DIRECT_HOST/DATABASE?sslmode=require&channel_binding=require
ADMIN_PASSWORD=replace-with-a-long-unique-password
ADMIN_SECRET=replace-with-a-separate-random-signing-secret
# Optional: enables connected-account discovery and private-repository inspection
GITHUB_TOKEN=github_pat_read_only_token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

| Variable | Required | Visibility | Purpose |
|---|---:|---|---|
| `DATABASE_URL` | Yes | Server only | PostgreSQL connection used by the application |
| `ADMIN_PASSWORD` | Production: yes | Server only | Password accepted by `/admin` |
| `ADMIN_SECRET` | Production: yes | Server only | HMAC key used to sign admin session tokens |
| `GITHUB_TOKEN` | Optional | Server only | Enables `/user/repos` discovery and inspection of authorized private repositories |
| `NEXT_PUBLIC_SITE_URL` | Production: yes | Public | Absolute canonical origin used by metadata, Open Graph, sitemap, and robots |

### Important environment notes

- Development falls back to admin password `webloom` and signing secret `webloom-dev-secret`. **Never rely on these defaults in production.**
- Use separate, long values for `ADMIN_PASSWORD` and `ADMIN_SECRET`.
- Changing `ADMIN_SECRET` invalidates existing admin sessions.
- `NEXT_PUBLIC_SITE_URL` must be the final public origin, for example `https://webloom.example`. If it is omitted, generated SEO URLs fall back to `http://localhost:3000`.
- A token is not required to import public repositories by exact URL. Connected-account discovery and private repository inspection require `GITHUB_TOKEN`.
- Prefer a fine-grained, read-only token restricted to the repositories Webloom may inspect. Repository **Metadata: read** is sufficient for discovery; **Contents: read** is needed for README, tree, language, and manifest analysis.
- Arena’s GitHub account connection is not automatically forwarded into this Next.js runtime; configure `GITHUB_TOKEN` separately if connected discovery is required.
- Never expose `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SECRET`, or `GITHUB_TOKEN` with a `NEXT_PUBLIC_` prefix.
- Keep `.env` private and ensure it is ignored by source control in the environment where this repository is hosted.

Generate a signing secret, for example:

```bash
openssl rand -base64 48
```

---

## Local setup

### 1. Install dependencies

For a reproducible install using `package-lock.json`:

```bash
npm ci
```

Use `npm install` when intentionally updating dependencies.

### 2. Start PostgreSQL and create the database

Example with a local PostgreSQL superuser:

```bash
psql -U postgres -c "CREATE DATABASE app_db;"
```

If the database already exists, PostgreSQL will report that and no recreation is needed.

### 3. Configure `.env`

Copy the environment example above and adjust credentials for your PostgreSQL installation.

### 4. Apply the schema

Option A — run the included migrations (recommended; creates all 8 tables):

```bash
npx drizzle-kit migrate
```

Option B — push the schema directly from source:

```bash
npx drizzle-kit push
```

### 5. Seed the content (optional)

Recreates the baseline content — site settings, 2 published articles, and the 17 source-verified GitHub portfolio projects — on any database. Idempotent: existing rows are never overwritten, so admin edits are preserved.

```bash
node scripts/seed.mjs
```

`drizzle.config.ts` loads `.env` and uses the same `DATABASE_URL` as the application. This prevents schema tools from accidentally targeting a hardcoded local database.

For Neon, use the branch’s direct TLS endpoint with this application. The app already uses a bounded `pg` pool, and the direct endpoint preserves the role’s `public` search path consistently. Use the direct endpoint for `npx drizzle-kit push` as well. Neon’s transaction-pooler endpoint can reject startup/session parameters and may reuse altered session state, so only use it when the application is designed around transaction-pooling constraints.

The application pool is intentionally bounded to five connections per runtime instance, uses a five-second connection timeout, closes idle clients after 30 seconds, and enables TCP keepalive. Account for the number of horizontally scaled instances when selecting Neon connection limits.

### 6. Start development

```bash
npm run dev
```

Open:

- Website: `http://localhost:3000`
- Admin: `http://localhost:3000/admin`
- Health: `http://localhost:3000/api/health`

### 7. Add initial content

A fresh database does not require seed data. Default FAQs are supplied from `src/lib/site.ts` until custom FAQs are created.

Use `/admin` to add:

- Blog posts
- Genuine testimonials
- Custom FAQs
- Contact email
- Real social links

The blog route shows a deliberate empty state until a published article exists. The homepage blog section is hidden while empty. Testimonials are hidden everywhere until a genuine published testimonial exists.

---

## Database

### Schema source

The canonical schema is `src/db/schema.ts`. The application contains eight tables:

| Table | Purpose | Important fields |
|---|---|---|
| `leads` | Contact/project submissions | contact details, project type, budget, timeline, message, status, source |
| `posts` | Blog articles | slug, title, excerpt, category, content, published, featured, timestamps |
| `testimonials` | Genuine client feedback | name, company, position, quote, project, published |
| `faqs` | Admin-managed FAQs | question, answer, category, sort order, published |
| `events` | First-party analytics | type, name, path, external referrer, metadata, timestamp |
| `github_projects` | Source-verified portfolio imports | GitHub identity, owner/repo, editorial copy, stack analysis, visibility, stats, publish controls, sync timestamps |
| `logs` | Activity and security records | level, message, context, timestamp |
| `settings` | Key/value site settings | key, JSON value, updated timestamp |

### Lead statuses

The supported workflow is defined in `src/lib/site.ts`:

```text
new → contacted → qualified → proposal → won / lost
```

The stored value for “Proposal Sent” is `proposal`.

### Apply schema changes

After changing `src/db/schema.ts`:

```bash
npx drizzle-kit push
```

For a mature production environment, generate and review formal migrations rather than relying on direct schema push. This repository currently does not include a migration history directory.

### Inspect the database

```bash
psql "$DATABASE_URL"
```

Useful commands inside `psql`:

```sql
\dt
\d leads
SELECT status, count(*) FROM leads GROUP BY status;
SELECT slug, published, featured FROM posts ORDER BY created_at DESC;
```

---

## Admin dashboard

Visit `/admin` and sign in with `ADMIN_PASSWORD`.

### Authentication behavior

- Authentication is a single administrator password, not a multi-user account system.
- Successful login creates the `wl_admin` cookie.
- The cookie is HTTP-only, SameSite=Lax, secure in production, and valid for 12 hours.
- Session payloads are signed with HMAC-SHA256 using `ADMIN_SECRET` (or the password fallback).
- Password comparison uses a timing-safe comparison.
- Login is limited to eight attempts per forwarded IP over 15 minutes per running application process.

### Admin sections

#### Overview

Shows the last 30 days of:

- Page views
- Named interactions
- Contact submissions
- Submission/page-view conversion rate
- Daily page-view chart
- Popular pages
- External traffic sources
- Lead counts by status

#### Leads

- Lists up to 500 newest submissions
- Displays contact information, project type, budget, timeline, and message
- Filters by status
- Updates status without leaving the page

#### GitHub Work

- Imports a specific `https://github.com/OWNER/REPOSITORY` URL; generic `/repos` pages are rejected because they do not identify a repository
- Imports public repositories without authentication and authorized private repositories when `GITHUB_TOKEN` is configured
- Discovers up to 100 non-fork repositories accessible to the configured token via GitHub’s authenticated-user endpoint
- Inspects repository metadata, language byte counts, topics, README content, recursive source-tree filenames, and root `package.json` dependencies
- Infers an editable technology profile from verifiable source information
- Saves every import as an unpublished draft; nothing appears publicly until an administrator reviews and publishes it
- Lets administrators edit the public project name, summary, and live-product URL, then publish or feature the project
- Refreshes source metadata without overwriting curated name/summary copy
- Never exposes a private repository source URL on the public Work page
- Removes a portfolio import without modifying the repository on GitHub

##### Curated AnonymusAgent repository catalogue

The current Webloom deployment contains a source-audited catalogue from `github.com/AnonymusAgent`:

| Presentation | Repository | Verified scope |
|---|---|---|
| Featured | `ChessMastersArena` | Cross-platform chess game, engine integration, four play modes, puzzles, analysis, replay, leaderboard and profiles |
| Featured | `CookPak` | Recipe/creator feed, pantry, meal planning, smart kitchen, Ramadan mode, commerce, subscriptions, wallet, chat and dashboards |
| Featured | `IslamicGuide` | Quran, tafsir, hadith, duas, prayer/Qibla, Hifz, audio, mosque finder, Ramadan/Hajj tools and progress tracking |
| Featured | `Device-Health-Suite` | Mobile hardware inventory, monitoring, sensors, stress tests and supporting Express/Drizzle services |
| Featured | `MediFlow` | Medical billing, practice management, claims, RCM, clinical workflows, reporting and user/audit controls |
| Featured | `PlumberElectric` | Responsive service platform with emergency response, appointments, multilingual content, pricing, blog and admin pages |
| Featured | `RoyalDice` | Cross-platform Ludo-style game with AI and two-to-four player modes |
| Featured | `Wifi-dashboard` | Network status, devices, speed/latency, bandwidth, heatmap, alerts, scanning and router setup |
| Archive | `Medx` | Mobile medical operations and billing companion |
| Archive | `DiagnosticsPro` | Earlier mobile device-diagnostics iteration |
| Archive | `system-sentinel` | Desktop-oriented system monitoring/stress-test dashboard |
| Archive | `ProFix` | Focused home-services booking/marketing iteration |
| Archive | `chess-masters-arena` | Standalone chess-engine/backend prototype with tests and Docker configuration |
| Archive | `Wifi` | Alternative static network-command dashboard iteration |
| Archive | `MyBet` | Sports/casino interface concept; not represented as a live wagering service |
| Archive | `Web-App` | Prompt-led app-builder interface concept; not represented as an active generation backend |
| Archive | `Restaurant-Web` | Responsive multi-page hospitality website concept; concept awards are not presented as Webloom claims |
| Excluded | `AnonymusAgent` | GitHub profile README only; not a software project |

Original portfolio covers are stored under `public/images/projects/`. They are product visualizations based on verified domain/features—not screenshots and not evidence of external client work.

#### Blog

- Create and edit title, slug, category, excerpt, and article content
- Mark articles as published or featured
- Delete articles
- Published articles appear in the blog, sitemap, related-post suggestions, and homepage insights

#### Testimonials

- Manage client name, company, position, project, quote, and publication state
- The public testimonial section is automatically hidden when there are no published entries
- There is currently no image-upload or testimonial-photo field

#### FAQs

- Manage question, answer, sort order, and publication state
- If no published database FAQ exists, the built-in FAQ set from `src/lib/site.ts` is used
- As soon as published custom FAQs exist, they replace the default set on public pages

#### Activity

Shows the 100 most recent stored log records, including form activity, warnings, application errors, and security events.

#### Settings

Currently manages:

- Public contact email
- Owned GitHub, Instagram, Facebook, LinkedIn, and X links

Only valid `http://` or `https://` social URLs are stored. The footer hides the social area when no owned links are configured.

### Logging out

Use the dashboard’s **Log out** button, or send `DELETE /api/admin/session`.

---

## Content management

### Editable without rebuilding

The following content is stored in PostgreSQL and editable in `/admin`:

- Blog posts
- Testimonials
- FAQs
- Verified GitHub project imports and their publication state
- Lead statuses
- Contact email
- Social profile links

### Editable in code

The following content is centralized in `src/lib/site.ts` and requires a deployment after modification:

- Site name, tagline, description, and default contact email
- Navigation
- Hero copy and CTA destinations
- Trust flow and capability categories
- Services and service feature lists
- Products/product concepts and their technology/outcomes
- Existing-product improvement services
- “Why Webloom” principles
- Development process
- Technology categories
- Pricing tiers and features
- Estimator formulas, add-ons, and timeframe multipliers
- Built-in FAQ fallback
- Legal-policy starting templates
- Contact project types, budgets, and timelines
- Lead statuses and blog categories

### Brand and visual customization

| Change | File |
|---|---|
| Color tokens and dark/light themes | `src/app/globals.css` |
| Global fonts and metadata | `src/app/layout.tsx` |
| Logo component | `src/components/ui.tsx` |
| Favicon/application icon | `src/app/icon.svg` |
| Social sharing artwork | `public/og-image.jpg` |
| 3D hero scene | `src/components/hero3d.tsx` |
| Navigation behavior | `src/components/nav.tsx` |
| Footer columns | `src/components/footer.tsx` |
| Per-page SEO metadata | Each route’s `page.tsx` |

### Blog content syntax

The article renderer intentionally supports a safe, small Markdown-like subset:

```text
## Second-level heading

### Third-level heading

- List item one
- List item two

> Block quote

A normal paragraph separated by blank lines.
```

Important limitations:

- Separate blocks with blank lines.
- A list is recognized when its block starts with `- `.
- Inline Markdown such as bold, links, images, code fences, and raw HTML is not rendered as rich markup.
- Article content is rendered as text/React elements rather than injected HTML.

---

## Contact and lead workflow

### Form fields

The public project brief collects:

- Name (required)
- Company
- Email (required)
- Phone
- Project type (required)
- Budget
- Timeline
- Project description (required, minimum 10 characters)

Server-side validation is performed in `src/app/api/contact/route.ts`; client-side validation is not treated as sufficient.

### What happens after submission

1. The browser sends JSON to `POST /api/contact`.
2. The route checks the per-IP rate limit.
3. Input is trimmed and length-limited.
4. Email, project type, budget, and timeline values are validated.
5. The lead is inserted with status `new`.
6. A `lead_created` activity record is written.
7. The admin dashboard can review and progress the lead.

### Email delivery

The current implementation **stores leads in PostgreSQL but does not send an email notification**. The contact email shown on the site is a clickable `mailto:` address. If email alerts are required, integrate a transactional email provider inside the server-side contact route and keep its credentials in server-only environment variables.

### Contact-link prefills

The contact page recognizes these query parameters:

| Example | Behavior |
|---|---|
| `/contact?type=existing` | Selects Existing Product Improvement and seeds the message |
| `/contact?type=combination` | Seeds a combined-product brief |
| `/contact?plan=Business%20Website` | Seeds package interest |
| `/contact?service=web` | Seeds service interest |
| `/contact?ref=estimator` | Seeds an estimator follow-up |
| `/contact?ref=bloom-pos` | Seeds work/product interest |

---

## Analytics

Analytics are first-party and stored in the `events` table.

### Tracked data

- Public page paths
- External document referrer, if present
- Named interactions attached with `data-track`
- Optional event metadata
- Timestamp

### Not stored in analytics

- IP addresses
- Browser fingerprints
- Cross-site identifiers
- Advertising profiles

Admin routes are excluded from page tracking, and same-origin referrers are removed before storage.

### Operational privacy note

IP addresses are used transiently as keys by the in-memory rate limiter. Security logs may store a forwarded IP for failed/successful admin login events and rate-limit events. This is separate from the analytics table and should be reflected in the final reviewed privacy policy and retention rules.

### Dashboard calculations

- Analytics cards use a rolling 30-day window.
- Conversion rate is `contact submissions / page views`.
- Popular pages are grouped by path.
- Traffic sources are grouped by external referrer.

Analytics failures are deliberately non-fatal and never prevent public pages from rendering.

---

## SEO and social sharing

Implemented SEO features include:

- Global title template and descriptions
- Per-page metadata
- Canonical links
- Open Graph and Twitter cards
- Default 1200×630 sharing image
- Organization structured data
- ProfessionalService structured data
- FAQ structured data
- Article structured data
- Generated XML sitemap, including published articles
- Generated robots rules
- Semantic headings and landmarks

### Production SEO checklist

Before launch:

1. Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin.
2. Replace `public/og-image.jpg` if the final brand artwork changes (keep it close to 1200×630 and optimized).
3. Verify all page titles and descriptions against final approved copy.
4. Review legal templates with a qualified professional.
5. Submit `/sitemap.xml` to relevant webmaster tools.
6. Test a public URL in social-sharing debuggers after deployment.

---

## Theme, motion, and 3D

### Theme

- Dark mode is the default.
- The user can switch to light mode from the navigation.
- Preference is stored in local storage as `wl-theme`.
- A small inline script in the root layout applies the stored preference before paint to reduce theme flash.

### Motion

Framer Motion powers:

- Route transitions
- Headline and card reveals
- Pricing-tab transitions
- FAQ accordion transitions
- Process progression
- Magnetic primary buttons

The shared primitives live in `src/components/motion.tsx`.

### 3D hero

The hero scene is dynamically imported on the client and implemented in `src/components/hero3d.tsx`. A matching CSS-only bloom/architecture fallback renders in the initial HTML. WebGL mounting is deferred briefly until the text and controls hydrate, and it is skipped for reduced-motion users.

Performance/accessibility behavior includes:

- Immediate CSS visual while the Three.js chunk loads
- Deferred WebGL work to protect initial interaction and text rendering
- Reduced particle counts and removal of glass panels on mobile
- Device pixel-ratio limits
- `powerPreference: high-performance`
- Inert canvas pointer events so text and controls remain usable
- Window-level pointer tracking for subtle rotation
- Reduced-motion handling

When modifying the 3D scene, preserve these fallbacks and test on low-power mobile devices.

---

## Accessibility

Implemented accessibility measures include:

- Skip-to-content link
- Semantic page landmarks and heading hierarchy
- Keyboard-accessible navigation and forms
- `aria-current` for active navigation items
- Escape-to-close and autofocus for the mobile menu
- Roving keyboard focus for pricing tabs with Arrow, Home, and End keys
- Accessible FAQ expansion state
- Explicit field labels and grouped project-type controls
- Visible focus outlines
- Estimator result announced with `aria-live`
- Decorative graphics marked as hidden from assistive technology
- Reduced-motion support in CSS, Framer Motion, custom cursor, and 3D behavior
- Responsive, touch-friendly controls

When adding components, test keyboard-only use, 200% zoom, screen-reader labels, contrast, and reduced-motion behavior.

---

## Security

### Current controls

- Server-only database and authentication modules
- HTTP-only signed admin session cookie
- SameSite=Lax session policy
- Secure cookie flag in production
- Timing-safe password and token signature comparisons
- Server-side input validation and length limits
- Parameterized database operations through Drizzle
- Protected admin data endpoints
- Login and form rate limiting
- Admin, form, and security event logging
- Admin and API routes blocked in `robots.txt`
- `X-Content-Type-Options: nosniff`
- Arena-compatible framing behavior (no global `X-Frame-Options: DENY`, because the managed preview uses an iframe)
- `Referrer-Policy: strict-origin-when-cross-origin`
- Restrictive camera, microphone, geolocation, and payment permissions policy
- Next.js `X-Powered-By` header disabled

### Production security checklist

- Set strong `ADMIN_PASSWORD` and independent `ADMIN_SECRET` values.
- If used, scope `GITHUB_TOKEN` to read-only metadata/contents access for only the necessary repositories; rotate or revoke it when no longer needed.
- Serve only over HTTPS.
- Restrict database network access and require TLS where supported.
- Use a non-superuser database role with only necessary privileges.
- Keep dependencies updated and review `npm audit` findings rather than applying breaking upgrades blindly.
- Add retention/cleanup policies for leads, analytics, and logs.
- Add a Content Security Policy after finalizing all asset and service origins; set `frame-ancestors` to the final allowed custom-domain/admin-preview origins rather than using a global `X-Frame-Options: DENY` that blocks Arena's iframe preview.
- Replace the in-memory rate limiter for multi-instance deployments.
- Consider multi-user authentication, 2FA, CSRF hardening, and audit attribution if the admin grows beyond one trusted operator.
- Do not treat `robots.txt` as access control; actual admin protection is the session check.

---

## Development commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the compiled production server |
| `npm run lint` | Run ESLint across the repository |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npx next typegen` | Generate Next.js route types |
| `npx drizzle-kit migrate` | Apply the included SQL migrations (`drizzle/`) |
| `npx drizzle-kit generate` | Generate a new migration after schema changes |
| `npx drizzle-kit push` | Synchronize the configured PostgreSQL schema directly |
| `node scripts/seed.mjs` | Seed baseline content (idempotent; preserves existing rows) |

Do not edit `next-env.d.ts`; Next.js generates it.

---

## Validation and testing

Run the complete validation sequence before deployment:

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run lint
npm run build
```

With the production server running, verify health:

```bash
curl -i http://localhost:3000/api/health
```

A healthy response resembles:

```json
{
  "status": "ok",
  "db": "up",
  "time": "2026-01-01T00:00:00.000Z"
}
```

The health route returns HTTP `503` when the database query fails.

### Manual regression checklist

#### Public pages

- [ ] Home, Services, Work, Pricing, About, Contact, Blog, and Legal pages return 200
- [ ] Unknown route returns the branded 404
- [ ] Published article renders and unknown/draft article returns 404
- [ ] Header and footer links work at mobile and desktop widths
- [ ] Theme choice survives a reload
- [ ] 3D scene does not prevent text selection or button interaction
- [ ] Reduced-motion mode removes nonessential motion

#### Pricing and contact

- [ ] Pricing tabs work by pointer and keyboard
- [ ] `/pricing#apps`, `#software`, and `#saas` activate correctly
- [ ] Estimator range updates and is described as non-binding
- [ ] Contact prefills are correct for plan/service/ref links
- [ ] Required field validation is understandable
- [ ] Successful submission appears in Admin → Leads
- [ ] Invalid payloads return 400 and excessive requests return 429

#### Admin

- [ ] Invalid password fails and valid password creates a session
- [ ] Admin endpoints return 401 without the cookie
- [ ] Lead status updates persist
- [ ] Blog draft is hidden; published post appears and enters sitemap
- [ ] Empty testimonials remain hidden publicly
- [ ] Custom FAQs replace fallback FAQs only when published
- [ ] Contact email and real social links update the public site
- [ ] Logout clears the session

#### SEO/security

- [ ] Canonicals, Open Graph image, and structured data use the production URL
- [ ] `/sitemap.xml` and `/robots.txt` are valid
- [ ] Security headers appear on responses
- [ ] `X-Powered-By` is absent

---

## Production deployment

The project can run on any Node.js platform that supports Next.js and can reach a persistent PostgreSQL database.

### Build and start

```bash
npm ci
npm run build
npm run start
```

Before starting the application in a new environment, apply the database schema using an approved deployment step.

### Required deployment configuration

1. Provision PostgreSQL.
2. Set `DATABASE_URL`.
3. Set a strong `ADMIN_PASSWORD`.
4. Set an independent random `ADMIN_SECRET`.
5. Optionally set a read-only `GITHUB_TOKEN` for connected discovery/private repository inspection.
6. Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin.
7. Apply the database schema.
8. Build and deploy.
9. Verify `/api/health`, `/sitemap.xml`, an article route, the contact flow, GitHub import/review, and `/admin`.

### Reverse proxies

Rate limiting reads the first value from `x-forwarded-for`. Configure the hosting proxy to set and sanitize that header correctly; do not trust arbitrary client-supplied forwarding headers at the public edge.

### Serverless and horizontal scaling

The current limiter is process-local. On serverless or multi-instance deployments:

- limits reset when an instance restarts,
- separate instances do not share counters,
- traffic may bypass the intended global request ceiling.

Use a shared Redis/KV-backed limiter for robust distributed enforcement.

### Caching, streaming, and dynamic routes

- The root layout performs no database query, so navigation, theme, fonts, and the route-loading fallback can stream immediately even when Neon is waking.
- Home, Work, Pricing, Blog, article content, FAQs, testimonials, projects, and public settings use tagged five-minute caches.
- Admin content, settings, and GitHub mutations call `revalidateTag(..., { expire: 0 })`, so the next public request reads fresh data.
- Home, Work, Pricing, and Blog use five-minute ISR; article slugs use on-demand ISR.
- Contact remains dynamic because CTA query parameters prefill each visitor's form, but its settings lookup is cached.
- Admin and write APIs remain fully dynamic and authenticated where required.
- `src/app/loading.tsx` provides a CSS-only Webloom software/architecture loader during real route waits.
- Services, About, legal pages, robots, and the application icon are statically generated where possible.

---

## Backups and operations

### Database backup

```bash
pg_dump --format=custom --file=webloom-backup.dump "$DATABASE_URL"
```

### Restore

```bash
pg_restore --clean --if-exists --no-owner --dbname="$DATABASE_URL" webloom-backup.dump
```

Test restore procedures in a non-production environment before relying on them.

### Operational checks

- Monitor `/api/health` from an external uptime service.
- Review Admin → Activity for errors and security warnings.
- Review contact submissions and lead statuses regularly.
- Back up PostgreSQL on an automated schedule.
- Monitor database size, especially the append-only `events` and `logs` tables.
- Establish explicit retention periods for analytics, leads, and security logs.

---

## Known boundaries and production recommendations

The current implementation is complete and functional, but these boundaries should be understood before a larger-scale launch:

1. **Hybrid CMS:** services, portfolio/product concepts, pricing, hero, About copy, process, technology, and legal templates are not editable from `/admin`; they live in `src/lib/site.ts`.
2. **No email notifications:** contact submissions are stored in PostgreSQL. No transactional email provider is configured.
3. **Single-admin authentication:** there are no user accounts, roles, password reset flow, or 2FA.
4. **Process-local rate limiting:** suitable as a basic single-instance control, not distributed infrastructure.
5. **No media upload system:** blog and testimonial admin forms do not upload images or files.
6. **Markdown-lite articles:** no full Markdown parser, rich-text editor, raw HTML, inline links, or inline image syntax.
7. **Legal templates need review:** Privacy, Terms, and Cookie pages are explicitly starting templates, not legal advice.
8. **Direct schema push:** no versioned migration history is included yet.
9. **No Content Security Policy yet:** core security headers are present; add CSP once final third-party origins are known.
10. **First-party analytics are basic:** unique visitors are not identified; “visitors” in the admin UI represent page-view activity, not deduplicated people.
11. **Manual GitHub synchronization:** repository imports/refreshes are administrator-triggered; no webhook currently updates projects after every GitHub push.

Recommended next integrations, when needed:

- Transactional email for lead alerts and acknowledgements
- Shared Redis/KV rate limiting
- Versioned Drizzle migrations
- Object storage and image processing for CMS media
- Multi-user authentication and 2FA
- Error-monitoring service
- GitHub webhook refresh with signature verification
- Content Security Policy
- Data retention automation

---

## Troubleshooting

### `DATABASE_URL is required`

The application imports the database client during server rendering. Confirm `.env` exists in the project root and restart the server after changing it.

### Database connection refused

Check that PostgreSQL is running, the host/port are correct, and the database exists:

```bash
psql "$DATABASE_URL" -c "select 1;"
```

### Tables do not exist

Apply the schema with the included migrations (or `npx drizzle-kit push`):

```bash
npx drizzle-kit migrate
```

Also confirm `drizzle.config.ts` can read `.env` and that `DATABASE_URL` targets the intended database/branch.

### Neon connects but tables are not visible

- Confirm the application and Drizzle use the same Neon project, branch, database, and role.
- Keep the role search path on `public`; for example: `ALTER ROLE your_role IN DATABASE your_database SET search_path = public;`.
- Do not shell-source an unquoted connection string containing `&`. Pass it through the process environment or quote it as one value.
- Restart the application after changing the URL so its PostgreSQL pool opens clean connections.

### Admin password does not work

- Confirm `ADMIN_PASSWORD` is set in the running server environment.
- Restart after changing environment variables.
- Wait for the 15-minute window if repeated failures triggered the process-local limit, or restart the development server.
- Clear the `wl_admin` cookie if testing changed secrets.

### Generated links use localhost

Set the production value before building/deploying:

```dotenv
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

Then rebuild. This value affects metadata, Open Graph, sitemap, and robots output.

### Blog is empty

Create a post in `/admin`, enable **Published**, and save. Draft posts are intentionally excluded from public routes and the sitemap.

### Testimonials do not appear

This is intentional when there are no genuine published entries. Add a real testimonial in `/admin` and ensure **Published** is enabled.

### Default FAQs still appear

The built-in FAQ set remains active until at least one published database FAQ exists. Publish custom FAQs to replace the fallback set.

### Contact form succeeds but no email arrives

That is expected in the current architecture. The submission is stored in Admin → Leads; email delivery is not integrated.

### GitHub import says the URL is not a repository

Use the canonical form `https://github.com/OWNER/REPOSITORY`. A generic URL such as `https://github.com/repos` is only a signed-in account page and contains no owner/repository identity, so Webloom rejects it rather than attributing unrelated code.

### Connected GitHub discovery is disabled

Set a server-only `GITHUB_TOKEN` and restart the application. Arena’s account integration does not automatically inject credentials into this runtime. Public repositories can still be imported individually without a token.

### A private repository cannot be inspected

Ensure the fine-grained token is authorized for that exact repository and grants Metadata read and Contents read permissions. Organization policies may also require approval or SSO authorization.

### GitHub API returns 401, 403, or a rate-limit error

Check token validity, repository access, organization authorization, and GitHub API rate limits. The importer logs failures in Admin → Activity but never exposes the token in browser responses.

### 3D or animation performance is poor

- Test a production build rather than development mode.
- Verify the browser is using hardware acceleration.
- Reduce particle/panel counts in `src/components/hero3d.tsx`.
- Test with reduced motion and mobile breakpoints.
- Preserve the existing device-pixel-ratio and mobile complexity limits.

### Health endpoint reports 503

`/api/health` performs a real database query. Check PostgreSQL connectivity, credentials, TLS requirements, and connection limits.

---

## Brand rule

Do not add fabricated clients, testimonials, awards, company history, team members, partnerships, project counts, revenue figures, or outcomes. Webloom should feel established because of the quality and clarity of the product—not unsupported claims.

**Minimal interface. Maximum impression.**

**Webloom — Digital products, built beautifully.**
