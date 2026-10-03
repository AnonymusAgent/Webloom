/**
 * Webloom database seed.
 *
 * Recreates the application's baseline content on top of the schema created
 * by `npx drizzle-kit push` or `npx drizzle-kit migrate`:
 *   - site settings (contact email, owned social links)
 *   - 2 published insight articles
 *   - 17 source-verified GitHub portfolio projects
 *
 * The script is idempotent: existing rows are never overwritten, so any
 * edits made in /admin are preserved when re-running it.
 *
 * Usage:
 *   DATABASE_URL=... node scripts/seed.mjs
 * (or configure .env first — dotenv loads it automatically)
 */
import "dotenv/config";
import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required. Copy .env.example to .env and configure it.");
  process.exit(1);
}

const SETTINGS = [
  {
    key: "contactEmail",
    value: JSON.stringify("webloomofficial@gmail.com"),
  },
  {
    key: "socials",
    value: JSON.stringify([{ label: "GitHub", href: "https://github.com/AnonymusAgent" }]),
  },
];

const POSTS = [
  {
    slug: "how-much-should-a-business-website-cost",
    title: "How much should a business website actually cost?",
    excerpt:
      "A straight answer to the question every client asks first — what drives the price of a website, and what you should expect at each budget level.",
    category: "Web Development",
    featured: true,
    content: `It is the first question almost every client asks, and the industry is oddly bad at answering it. Here is our attempt at a straight one.

## What you are actually paying for

The price of a website is not really about pages. It is about decisions: how much design thinking, engineering depth and iteration your project gets.

- **Design** — is it a template with your logo, or a design built around your brand and customers?
- **Content structure** — does someone help you decide what the site needs to say, or do you get an empty shell?
- **Engineering** — performance, accessibility, SEO foundations, forms that actually reach you.
- **Care** — testing across devices, fixing the small things, being reachable after launch.

## What different budgets typically buy

> A $299 site and a $5,000 site are not the same product with different margins — they are different products.

A starter website gets you online properly: fast, clean, responsive, honest. A business website adds custom design, stronger conversion thinking, a CMS and analytics. A premium build adds advanced interactions, deeper SEO and integration work.

The right budget is the one that matches what the website needs to achieve for your business — a good partner will tell you when you are overspending, too.

## The hidden costs to watch

Cheap quotes often exclude the things that make a website useful: copywriting input, proper forms, performance work, analytics, and post-launch support. Ask what is included before comparing numbers.

## Our approach

We publish starting prices openly and scope every project in writing before work begins. If your budget does not fit what you need, we will say so — and tell you what we would do instead.`,
  },
  {
    slug: "start-with-an-mvp-not-a-monolith",
    title: "Why your business should start with an MVP, not a monolith",
    excerpt:
      "The fastest way to waste a software budget is to build everything at once. Here is the case for starting small and deliberate.",
    category: "Product Development",
    featured: false,
    content: `Every founder we meet has a big vision — and they should. The mistake is trying to build all of it in version one.

## The monolith trap

The all-at-once approach feels efficient: one contract, one build, everything included. In practice it means months of development before a single real user touches the product, by which time half the assumptions baked into the spec have quietly expired.

## What an MVP actually is

An MVP is not a cheap version of your product. It is the smallest version that delivers real value to real users:

- One core problem, solved well
- Real accounts, real data, real payments if that is core to the model
- Enough polish that people trust it
- Analytics so you can see what users actually do

## What you learn

> Three weeks of real users will teach you more than six months of planning.

Which features users ignore. Which workflow they actually follow. What they will pay for. That learning shapes version two — which is where good products are really made.

## When to go bigger first

Internal tools with a fixed, well-understood workflow — a POS replacement, an inventory system — often should be scoped completely, because the requirements are already proven by the business running today. The MVP approach shines for new products with unproven demand.

Not sure which one yours is? That is exactly what a discovery call is for.`,
  },
];

const PROJECTS = [
  { githubId: "1270733036", repo: "ChessMastersArena", slug: "chess-masters-arena-mobile", name: "Chess Masters Arena", category: "Cross-platform Chess Game", summary: "A full mobile chess experience with computer, local two-player, online and training modes; puzzles, move analysis, game replay, leaderboards, player profiles, rewards, timers, an opening book and a custom chess engine.", image: "/images/projects/chess-masters-arena.jpg", language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Zustand","Supabase","Async Storage"], topics: ["mobile-game","chess","cross-platform"], featured: true, pushedAt: "2026-06-16T02:44:25Z", stars: 0 },
  { githubId: "1263918135", repo: "CookPak", slug: "cookpak", name: "CookPak", category: "Food Creator & Commerce App", summary: "A cross-platform cooking ecosystem combining a recipe and video feed with creator uploads, pantry tools, meal planning, a smart-kitchen workspace, Ramadan mode, cart and order tracking, live streams, chat, subscriptions, wallets and creator/admin dashboards.", image: "/images/projects/cookpak.jpg", language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Supabase","Zustand","Async Storage"], topics: ["recipes","creator-platform","mobile-commerce"], featured: true, pushedAt: "2026-06-12T01:38:00Z", stars: 0 },
  { githubId: "1303407349", repo: "IslamicGuide", slug: "islamic-guide", name: "Islamic Guide", category: "Islamic Companion App", summary: "A content-rich mobile Islamic companion covering Quran reading and search, tafsir, hadith collections, duas, prayer times, Qibla, Hifz, audio management, mosque discovery, Ramadan and Hajj guidance, Salah tracking, bookmarks, notes and reading progress.", image: "/images/projects/islamic-guide.jpg", language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Async Storage","Location APIs","Audio"], topics: ["quran","prayer-times","islamic-app"], featured: true, pushedAt: "2026-08-12T23:38:48Z", stars: 0 },
  { githubId: "1154983619", repo: "Device-Health-Suite", slug: "device-health-suite", name: "Device Health Suite", category: "Mobile Device Diagnostics", summary: "A mobile diagnostics suite for hardware inventory, battery and network state, live performance monitoring, sensor readings and stress testing, with reusable metric visualizations, premium feature gates and a supporting Express/Drizzle service layer.", image: "/images/projects/device-health-suite.jpg", language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","React Query","Drizzle ORM","Express","Device APIs"], topics: ["device-health","diagnostics","monitoring"], featured: true, pushedAt: "2026-06-16T22:49:03Z", stars: 0 },
  { githubId: "1227000460", repo: "MediFlow", slug: "mediflow", name: "MediFlow", category: "Medical Billing & Practice SaaS", summary: "A broad medical billing and practice-management web platform spanning patients, scheduling, charge entry, coding, claims, prior authorization, ERA posting, AR management, payments, statements, clinical notes, e-prescribing, reports and user/audit workflows.", image: "/images/projects/mediflow.jpg", language: "TypeScript", tech: ["React","TypeScript","Vite","Tailwind CSS","Supabase","React Query","Chart.js","Stripe"], topics: ["medical-billing","practice-management","revenue-cycle"], featured: true, pushedAt: "2026-05-02T04:38:54Z", stars: 0 },
  { githubId: "1241902146", repo: "PlumberElectric", slug: "plumber-electric", name: "Home Services Platform", category: "Service Business Web Platform", summary: "A responsive plumbing and electrical services platform with separate service journeys, emergency response, appointment booking, transparent pricing, multilingual content, FAQs, testimonials, blog, careers, admin, contact and legal pages.", image: "/images/projects/home-services.jpg", language: "TypeScript", tech: ["React","TypeScript","Vite","React Router","Tailwind CSS","React Hook Form","Zod"], topics: ["home-services","booking","responsive-web"], featured: true, pushedAt: "2026-05-19T23:17:47Z", stars: 0 },
  { githubId: "1284557364", repo: "RoyalDice", slug: "royal-dice", name: "RoyalDice", category: "Cross-platform Board Game", summary: "A polished Ludo-style mobile game with two-to-four player setup, computer opponent modes with selectable difficulty, four-color token movement, animated dice, game state management and dedicated setup, game and results experiences.", image: "/images/projects/royaldice.jpg", language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Zustand","React Native SVG","Async Storage"], topics: ["ludo","board-game","mobile-game"], featured: true, pushedAt: "2026-06-30T01:40:52Z", stars: 0 },
  { githubId: "1132073311", repo: "Wifi-dashboard", slug: "wifi-command", name: "WiFi Command", category: "Network Operations Dashboard", summary: "An enterprise-styled network command center with Wi-Fi health, connected-device inventory, speed and latency metrics, bandwidth and signal charts, coverage heatmaps, activity and alert feeds, router configuration, network scanning and a setup wizard.", image: "/images/projects/wifi-command.jpg", language: "JavaScript", tech: ["JavaScript","HTML","CSS","Chart.js","Responsive Dashboard"], topics: ["wifi","network-monitoring","dashboard"], featured: true, pushedAt: "2026-01-11T09:22:41Z", stars: 0 },
  { githubId: "1227002954", repo: "Medx", slug: "medx-mobile", name: "Medx Mobile", category: "Mobile Medical Operations", summary: "A mobile medical operations companion for patients, appointments, claims, eligibility checks, denial management, AR follow-up, payment posting, patient statements, SOAP notes, billing dashboards and reports.", image: null, language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Supabase","Chart Kit"], topics: ["medical-billing","mobile-health"], featured: false, pushedAt: "2026-05-07T01:03:12Z", stars: 1 },
  { githubId: "1154452667", repo: "DiagnosticsPro", slug: "diagnostics-pro", name: "DiagnosticsPro", category: "Diagnostics App Iteration", summary: "An earlier mobile hardware-diagnostics build with hardware cards, live monitoring, sensor views, reports, settings, stress-test services, premium controls and local storage.", image: null, language: "TypeScript", tech: ["React Native","Expo","TypeScript","Expo Router","Supabase","Async Storage"], topics: ["hardware","diagnostics","mobile"], featured: false, pushedAt: "2026-02-10T12:04:36Z", stars: 0 },
  { githubId: "1154725416", repo: "system-sentinel", slug: "system-sentinel", name: "System Sentinel", category: "System Monitoring Dashboard", summary: "A desktop-oriented monitoring interface with hardware inventory, live CPU/GPU/storage metrics, vendor and operating-system analytics, stress-test controls and an administrative view.", image: null, language: "TypeScript", tech: ["React","TypeScript","Vite","Tailwind CSS","Recharts","Vitest"], topics: ["system-monitoring","hardware","dashboard"], featured: false, pushedAt: "2026-02-10T17:55:28Z", stars: 0 },
  { githubId: "1241901859", repo: "ProFix", slug: "profix", name: "ProFix", category: "Service Website Iteration", summary: "A focused home-services website with plumbing, electrical and emergency service cards, appointment booking, urgency levels, pricing packages, FAQ, trust signals and responsive marketing pages.", image: null, language: "TypeScript", tech: ["React","TypeScript","Vite","React Router","Tailwind CSS","React Hook Form"], topics: ["service-business","booking","marketing-site"], featured: false, pushedAt: "2026-05-18T17:58:25Z", stars: 0 },
  { githubId: "1271685448", repo: "chess-masters-arena", slug: "chess-engine-backend", name: "Chess Engine Backend", category: "Game Engine Prototype", summary: "A standalone JavaScript chess-engine prototype with board representation, move generation, validation, engine orchestration, automated tests and Docker Compose setup — the lower-level foundation explored before the mobile game.", image: null, language: "JavaScript", tech: ["JavaScript","Node.js","Custom Chess Engine","Automated Tests","Docker"], topics: ["chess-engine","game-logic","backend"], featured: false, pushedAt: "2026-06-16T23:36:34Z", stars: 0 },
  { githubId: "1132076664", repo: "Wifi", slug: "wifi-network-command", name: "Network Command Center", category: "Network Dashboard Iteration", summary: "A multi-view network-management prototype covering connected devices, access points, network health, bandwidth usage, alerts, system logs and configuration in a responsive static web interface.", image: null, language: "HTML", tech: ["HTML","CSS","JavaScript","Chart.js","Responsive UI"], topics: ["wifi","network-management","prototype"], featured: false, pushedAt: "2026-01-11T09:25:14Z", stars: 0 },
  { githubId: "1121391808", repo: "MyBet", slug: "mybet", name: "MyBet Interface", category: "Sports Platform Concept", summary: "A sports and casino interface concept with authentication, protected routes, live sports feeds, odds ticker, sports, esports and casino views plus an administrative dashboard. Presented as an interface build, not a live wagering service.", image: null, language: "HTML", tech: ["Next.js","React","JavaScript","Tailwind CSS","Chart.js","Axios"], topics: ["sports-ui","dashboard","concept"], featured: false, pushedAt: "2025-12-22T23:38:00Z", stars: 0 },
  { githubId: "994314771", repo: "Web-App", slug: "clone-it-builder", name: "Clone It Builder", category: "AI Builder Interface Concept", summary: "A responsive frontend concept for a prompt-led web-app builder, with example project briefs, authentication, careers, documentation, privacy and terms experiences. It demonstrates the product interface rather than claiming an active generation backend.", image: null, language: "TypeScript", tech: ["React","TypeScript","Vite","Tailwind CSS","Radix UI","React Router"], topics: ["app-builder","ui-concept","responsive"], featured: false, pushedAt: "2025-06-01T17:20:24Z", stars: 0 },
  { githubId: "994242633", repo: "Restaurant-Web", slug: "la-maison-restaurant", name: "La Maison Restaurant", category: "Hospitality Website Concept", summary: "A responsive multi-page fine-dining website concept with story, chef profile, menu, gallery, signature dishes, private dining and contact experiences. Any awards shown inside the concept are design content, not Webloom claims.", image: null, language: "HTML", tech: ["HTML","CSS","JavaScript","Responsive Design"], topics: ["restaurant","hospitality","website-concept"], featured: false, pushedAt: "2025-06-01T14:40:13Z", stars: 0 },
  { githubId: "1388265326", repo: "Webloom", slug: "webloom", name: "Webloom", category: "Full-Stack Web Platform", summary: "A modern full-stack web platform for building, managing, and deploying scalable web applications with Next.js, React, and TypeScript.", image: null, language: "TypeScript", tech: ["Next.js","React","TypeScript","Tailwind CSS","Drizzle ORM","PostgreSQL","Framer Motion"], topics: [], featured: true, pushedAt: "2026-10-02T23:47:28Z", stars: 0 },
];

const client = new Client({ connectionString: databaseUrl });

async function main() {
  await client.connect();

  for (const s of SETTINGS) {
    await client.query(
      `INSERT INTO public.settings (key, value) VALUES ($1, $2::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [s.key, s.value]
    );
  }

  for (const p of POSTS) {
    await client.query(
      `INSERT INTO public.posts (slug, title, excerpt, category, content, published, featured)
       VALUES ($1,$2,$3,$4,$5,true,$6)
       ON CONFLICT (slug) DO NOTHING`,
      [p.slug, p.title, p.excerpt, p.category, p.content, p.featured]
    );
  }

  for (const p of PROJECTS) {
    await client.query(
      `INSERT INTO public.github_projects
        (github_id, owner, repo, slug, name, category, summary, image, github_url,
         language, topics, technologies, languages, visibility, stars, forks,
         archived, published, featured, pushed_at)
       VALUES ($1,'AnonymusAgent',$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12::jsonb,
               'public',$13,0,false,true,$14,$15)
       ON CONFLICT (github_id) DO NOTHING`,
      [
        p.githubId, p.repo, p.slug, p.name, p.category, p.summary, p.image,
        `https://github.com/AnonymusAgent/${p.repo}`, p.language,
        JSON.stringify(p.topics), JSON.stringify(p.tech),
        JSON.stringify(p.language ? { [p.language]: 1 } : {}),
        p.stars, p.featured, p.pushedAt,
      ]
    );
  }

  const counts = await client.query(
    `SELECT (SELECT count(*) FROM public.github_projects)::int AS projects,
            (SELECT count(*) FROM public.posts)::int AS posts,
            (SELECT count(*) FROM public.settings)::int AS settings`
  );
  console.log("Seed complete:", counts.rows[0]);
  await client.end();
}

main().catch(async (error) => {
  console.error("Seed failed:", error.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
