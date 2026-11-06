-- WEBLOOM / NEON: insert missing baseline rows into the existing neondb database.
-- Paste/run this entire script in Neon SQL Editor as one execution. No password needed here.
-- Insert-only: preserves existing rows, unpublished choices and admin edits.
-- Does not synthesize leads, events, logs, FAQs or testimonials.
-- Do NOT run the initial Drizzle migration on a populated database.
-- If ANY statement errors, run ROLLBACK in the same SQL session before retrying.
-- If the schema guard fails, stop: review missing tables/columns separately.
-- Generated from src/lib/verified-projects.json, baseline-content.json and the
-- tracked Drizzle snapshot. To refresh: npm run db:generate-sql

BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

DO $webloom$
BEGIN
  IF current_database() <> 'neondb' THEN
    RAISE EXCEPTION 'Expected neondb. No changes made.';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (VALUES
    ('events', 'id'),
    ('events', 'type'),
    ('events', 'name'),
    ('events', 'path'),
    ('events', 'referrer'),
    ('events', 'meta'),
    ('events', 'created_at'),
    ('faqs', 'id'),
    ('faqs', 'question'),
    ('faqs', 'answer'),
    ('faqs', 'category'),
    ('faqs', 'sort'),
    ('faqs', 'published'),
    ('faqs', 'created_at'),
    ('github_projects', 'id'),
    ('github_projects', 'github_id'),
    ('github_projects', 'owner'),
    ('github_projects', 'repo'),
    ('github_projects', 'slug'),
    ('github_projects', 'name'),
    ('github_projects', 'category'),
    ('github_projects', 'summary'),
    ('github_projects', 'image'),
    ('github_projects', 'github_url'),
    ('github_projects', 'homepage'),
    ('github_projects', 'language'),
    ('github_projects', 'topics'),
    ('github_projects', 'technologies'),
    ('github_projects', 'languages'),
    ('github_projects', 'readme_excerpt'),
    ('github_projects', 'visibility'),
    ('github_projects', 'stars'),
    ('github_projects', 'forks'),
    ('github_projects', 'archived'),
    ('github_projects', 'published'),
    ('github_projects', 'featured'),
    ('github_projects', 'pushed_at'),
    ('github_projects', 'fetched_at'),
    ('github_projects', 'created_at'),
    ('github_projects', 'updated_at'),
    ('leads', 'id'),
    ('leads', 'name'),
    ('leads', 'company'),
    ('leads', 'email'),
    ('leads', 'phone'),
    ('leads', 'project_type'),
    ('leads', 'budget'),
    ('leads', 'timeline'),
    ('leads', 'message'),
    ('leads', 'status'),
    ('leads', 'source'),
    ('leads', 'created_at'),
    ('logs', 'id'),
    ('logs', 'level'),
    ('logs', 'message'),
    ('logs', 'context'),
    ('logs', 'created_at'),
    ('posts', 'id'),
    ('posts', 'slug'),
    ('posts', 'title'),
    ('posts', 'excerpt'),
    ('posts', 'category'),
    ('posts', 'content'),
    ('posts', 'published'),
    ('posts', 'featured'),
    ('posts', 'created_at'),
    ('posts', 'updated_at'),
    ('settings', 'key'),
    ('settings', 'value'),
    ('settings', 'updated_at'),
    ('testimonials', 'id'),
    ('testimonials', 'name'),
    ('testimonials', 'company'),
    ('testimonials', 'position'),
    ('testimonials', 'quote'),
    ('testimonials', 'project'),
    ('testimonials', 'published'),
    ('testimonials', 'created_at')
    ) AS required(table_name, column_name)
    LEFT JOIN information_schema.columns AS actual
      ON actual.table_schema = 'public'
     AND actual.table_name = required.table_name
     AND actual.column_name = required.column_name
    WHERE actual.column_name IS NULL
  ) THEN
    RAISE EXCEPTION 'Webloom schema missing a required table or column. No changes made.';
  END IF;
END
$webloom$;

INSERT INTO public.settings (key, value)
VALUES
  ('contactEmail', '"webloomofficial@gmail.com"'::jsonb),
  ('socials', '[{"label":"GitHub","href":"https://github.com/AnonymusAgent"}]'::jsonb)
ON CONFLICT DO NOTHING;

INSERT INTO public.posts (slug, title, excerpt, category, content, published, featured)
VALUES
  ('how-much-should-a-business-website-cost', 'How much should a business website actually cost?', 'A straight answer to the question every client asks first — what drives the price of a website, and what you should expect at each budget level.', 'Web Development', 'It is the first question almost every client asks, and the industry is oddly bad at answering it. Here is our attempt at a straight one.

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

We publish starting prices openly and scope every project in writing before work begins. If your budget does not fit what you need, we will say so — and tell you what we would do instead.', true, true),
  ('start-with-an-mvp-not-a-monolith', 'Why your business should start with an MVP, not a monolith', 'The fastest way to waste a software budget is to build everything at once. Here is the case for starting small and deliberate.', 'Product Development', 'Every founder we meet has a big vision — and they should. The mistake is trying to build all of it in version one.

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

Not sure which one yours is? That is exactly what a discovery call is for.', true, false)
ON CONFLICT DO NOTHING;

INSERT INTO public.github_projects
  (github_id, owner, repo, slug, name, category, summary, image, github_url,
   homepage, language, topics, technologies, languages, visibility, stars, forks,
   archived, published, featured, pushed_at)
VALUES
  ('1270733036', 'AnonymusAgent', 'ChessMastersArena', 'chess-masters-arena-mobile', 'Chess Masters Arena', 'Cross-platform Chess Game', 'A full mobile chess experience with computer, local two-player, online and training modes; puzzles, move analysis, game replay, leaderboards, player profiles, rewards, timers, an opening book and a custom chess engine.', '/images/projects/chess-masters-arena.jpg', 'https://github.com/AnonymusAgent/ChessMastersArena', NULL, 'TypeScript', '["mobile-game","chess","cross-platform"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Zustand","Supabase","Async Storage"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-06-16T02:44:25Z'::timestamptz),
  ('1263918135', 'AnonymusAgent', 'CookPak', 'cookpak', 'CookPak', 'Food Creator & Commerce App', 'A cross-platform cooking ecosystem combining a recipe and video feed with creator uploads, pantry tools, meal planning, a smart-kitchen workspace, Ramadan mode, cart and order tracking, live streams, chat, subscriptions, wallets and creator/admin dashboards.', '/images/projects/cookpak.jpg', 'https://github.com/AnonymusAgent/CookPak', NULL, 'TypeScript', '["recipes","creator-platform","mobile-commerce"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Supabase","Zustand","Async Storage"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-06-12T01:38:00Z'::timestamptz),
  ('1303407349', 'AnonymusAgent', 'IslamicGuide', 'islamic-guide', 'Islamic Guide', 'Islamic Companion App', 'A content-rich mobile Islamic companion covering Quran reading and search, tafsir, hadith collections, duas, prayer times, Qibla, Hifz, audio management, mosque discovery, Ramadan and Hajj guidance, Salah tracking, bookmarks, notes and reading progress.', '/images/projects/islamic-guide.jpg', 'https://github.com/AnonymusAgent/Noor', NULL, 'TypeScript', '["quran","prayer-times","islamic-app"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Async Storage","Location APIs","Audio"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-08-12T23:38:48Z'::timestamptz),
  ('1154983619', 'AnonymusAgent', 'Device-Health-Suite', 'device-health-suite', 'Device Health Suite', 'Mobile Device Diagnostics', 'A mobile diagnostics suite for hardware inventory, battery and network state, live performance monitoring, sensor readings and stress testing, with reusable metric visualizations, premium feature gates and a supporting Express/Drizzle service layer.', '/images/projects/device-health-suite.jpg', 'https://github.com/AnonymusAgent/Device-Health-Suite', NULL, 'TypeScript', '["device-health","diagnostics","monitoring"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","React Query","Drizzle ORM","Express","Device APIs"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-06-16T22:49:03Z'::timestamptz),
  ('1227000460', 'AnonymusAgent', 'MediFlow', 'mediflow', 'MediFlow', 'Medical Billing & Practice SaaS', 'A broad medical billing and practice-management web platform spanning patients, scheduling, charge entry, coding, claims, prior authorization, ERA posting, AR management, payments, statements, clinical notes, e-prescribing, reports and user/audit workflows.', '/images/projects/mediflow.jpg', 'https://github.com/AnonymusAgent/MediFlow', NULL, 'TypeScript', '["medical-billing","practice-management","revenue-cycle"]'::jsonb, '["React","TypeScript","Vite","Tailwind CSS","Supabase","React Query","Chart.js","Stripe"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-05-02T04:38:54Z'::timestamptz),
  ('1284557364', 'AnonymusAgent', 'RoyalDice', 'royal-dice', 'RoyalDice', 'Cross-platform Board Game', 'A polished Ludo-style mobile game with two-to-four player setup, computer opponent modes with selectable difficulty, four-color token movement, animated dice, game state management and dedicated setup, game and results experiences.', '/images/projects/royaldice.jpg', 'https://github.com/AnonymusAgent/RoyalDice', NULL, 'TypeScript', '["ludo","board-game","mobile-game"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Zustand","React Native SVG","Async Storage"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-06-30T01:40:52Z'::timestamptz),
  ('1132073311', 'AnonymusAgent', 'Wifi-dashboard', 'wifi-command', 'WiFi Command', 'Network Operations Dashboard', 'An enterprise-styled network command center with Wi-Fi health, connected-device inventory, speed and latency metrics, bandwidth and signal charts, coverage heatmaps, activity and alert feeds, router configuration, network scanning and a setup wizard.', '/images/projects/wifi-command.jpg', 'https://github.com/AnonymusAgent/Wifi-dashboard', NULL, 'JavaScript', '["wifi","network-monitoring","dashboard"]'::jsonb, '["JavaScript","HTML","CSS","Chart.js","Responsive Dashboard"]'::jsonb, '{"JavaScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-01-11T09:22:41Z'::timestamptz),
  ('1227002954', 'AnonymusAgent', 'Medx', 'medx-mobile', 'Medx Mobile', 'Mobile Medical Operations', 'A mobile medical operations companion for patients, appointments, claims, eligibility checks, denial management, AR follow-up, payment posting, patient statements, SOAP notes, billing dashboards and reports.', '/images/projects/medx-mobile.jpg', 'https://github.com/AnonymusAgent/Medx', NULL, 'TypeScript', '["medical-billing","mobile-health"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Supabase","Chart Kit"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 1, 0, false, true, false, '2026-05-07T01:03:12Z'::timestamptz),
  ('1154452667', 'AnonymusAgent', 'DiagnosticsPro', 'diagnostics-pro', 'DiagnosticsPro', 'Diagnostics App Iteration', 'An earlier mobile hardware-diagnostics build with hardware cards, live monitoring, sensor views, reports, settings, stress-test services, premium controls and local storage.', '/images/projects/diagnostics-pro.jpg', 'https://github.com/AnonymusAgent/DiagnosticsPro', NULL, 'TypeScript', '["hardware","diagnostics","mobile"]'::jsonb, '["React Native","Expo","TypeScript","Expo Router","Supabase","Async Storage"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, false, '2026-02-10T12:04:36Z'::timestamptz),
  ('1154725416', 'AnonymusAgent', 'system-sentinel', 'system-sentinel', 'System Sentinel', 'System Monitoring Dashboard', 'A desktop-oriented monitoring interface with hardware inventory, live CPU/GPU/storage metrics, vendor and operating-system analytics, stress-test controls and an administrative view.', '/images/projects/system-sentinel.jpg', 'https://github.com/AnonymusAgent/system-sentinel', NULL, 'TypeScript', '["system-monitoring","hardware","dashboard"]'::jsonb, '["React","TypeScript","Vite","Tailwind CSS","Recharts","Vitest"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, false, '2026-02-10T17:55:28Z'::timestamptz),
  ('1241901859', 'AnonymusAgent', 'ProFix', 'profix', 'ProFix', 'Service Business Web Platform', 'A focused home-services website with plumbing, electrical and emergency service cards, appointment booking, urgency levels, pricing packages, FAQ, trust signals and responsive marketing pages.', '/images/projects/profix.jpg', 'https://github.com/AnonymusAgent/ProFix', NULL, 'TypeScript', '["service-business","booking","marketing-site"]'::jsonb, '["React","TypeScript","Vite","React Router","Tailwind CSS","React Hook Form"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-05-18T17:58:25Z'::timestamptz),
  ('1271685448', 'AnonymusAgent', 'chess-masters-arena', 'chess-engine-backend', 'Chess Engine Backend', 'Game Engine Prototype', 'A standalone JavaScript chess-engine prototype with board representation, move generation, validation, engine orchestration, automated tests and Docker Compose setup — the lower-level foundation explored before the mobile game.', '/images/projects/chess-engine-backend.jpg', 'https://github.com/AnonymusAgent/chess-masters-arena', NULL, 'JavaScript', '["chess-engine","game-logic","backend"]'::jsonb, '["JavaScript","Node.js","Custom Chess Engine","Automated Tests","Docker"]'::jsonb, '{"JavaScript":1}'::jsonb, 'public', 0, 0, false, true, false, '2026-06-16T23:36:34Z'::timestamptz),
  ('1132076664', 'AnonymusAgent', 'Wifi', 'wifi-network-command', 'Network Command Center', 'Network Dashboard Iteration', 'A multi-view network-management prototype covering connected devices, access points, network health, bandwidth usage, alerts, system logs and configuration in a responsive static web interface.', '/images/projects/wifi-network-command.jpg', 'https://github.com/AnonymusAgent/Wifi', NULL, 'HTML', '["wifi","network-management","prototype"]'::jsonb, '["HTML","CSS","JavaScript","Chart.js","Responsive UI"]'::jsonb, '{"HTML":1}'::jsonb, 'public', 0, 0, false, true, false, '2026-01-11T09:25:14Z'::timestamptz),
  ('1121391808', 'AnonymusAgent', 'MyBet', 'mybet', 'MyBet Interface', 'Sports Platform Concept', 'A sports and casino interface concept with authentication, protected routes, live sports feeds, odds ticker, sports, esports and casino views plus an administrative dashboard. Presented as an interface build, not a live wagering service.', '/images/projects/mybet-interface.jpg', 'https://github.com/AnonymusAgent/MyBet', NULL, 'HTML', '["sports-ui","dashboard","concept"]'::jsonb, '["Next.js","React","JavaScript","Tailwind CSS","Chart.js","Axios"]'::jsonb, '{"HTML":1}'::jsonb, 'public', 0, 0, false, true, false, '2025-12-22T23:38:00Z'::timestamptz),
  ('994314771', 'AnonymusAgent', 'Web-App', 'clone-it-builder', 'Clone It Builder', 'AI Builder Interface Concept', 'A responsive frontend concept for a prompt-led web-app builder, with example project briefs, authentication, careers, documentation, privacy and terms experiences. It demonstrates the product interface rather than claiming an active generation backend.', '/images/projects/clone-it-builder.jpg', 'https://github.com/AnonymusAgent/Web-App', NULL, 'TypeScript', '["app-builder","ui-concept","responsive"]'::jsonb, '["React","TypeScript","Vite","Tailwind CSS","Radix UI","React Router"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, false, '2025-06-01T17:20:24Z'::timestamptz),
  ('1406597009', 'AnonymusAgent', 'type-arena', 'type-arena', 'Type Arena', 'Competitive Typing Game Platform', 'A responsive web typing-game platform with racing, practice drills, typing tests, progression, themed games and leaderboards.', '/images/projects/type-arena.jpg', 'https://github.com/AnonymusAgent/type-arena', 'https://arena-skill.vercel.app/', 'TypeScript', '["typing-game","practice","racing"]'::jsonb, '["Next.js","React","TypeScript","Tailwind CSS","Drizzle ORM","PostgreSQL"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-11-02T13:53:04Z'::timestamptz),
  ('994242633', 'AnonymusAgent', 'Restaurant-Web', 'la-maison-restaurant', 'La Maison Restaurant', 'Hospitality Website Concept', 'A responsive multi-page fine-dining website concept with story, chef profile, menu, gallery, signature dishes, private dining and contact experiences. Any awards shown inside the concept are design content, not Webloom claims.', '/images/projects/la-maison-restaurant.jpg', 'https://github.com/AnonymusAgent/Restaurant-Web', NULL, 'HTML', '["restaurant","hospitality","website-concept"]'::jsonb, '["HTML","CSS","JavaScript","Responsive Design"]'::jsonb, '{"HTML":1}'::jsonb, 'public', 0, 0, false, true, false, '2025-06-01T14:40:13Z'::timestamptz),
  ('1326109868', 'AnonymusAgent', 'Bloom-AR', 'ar-manager', 'Bloom AR', 'Medical Billing AR Platform', 'A Next.js accounts-receivable workspace for medical billing, with claims review, denials, payments, authorizations, reporting and role-based workflows.', '/images/projects/ar-manager.svg', 'https://github.com/AnonymusAgent/Bloom-AR', 'https://bloomar.vercel.app/', 'TypeScript', '["medical-billing","accounts-receivable","claims"]'::jsonb, '["Next.js","React","TypeScript","PostgreSQL","Drizzle ORM"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-11-03T15:28:36Z'::timestamptz),
  ('1441273336', 'AnonymusAgent', 'bloomrcm', 'bloom-rcm', 'Bloom RCM', 'Medical Billing & RCM Website', 'A Next.js website and admin console for an independent medical billing and revenue-cycle management practice, with service pages, consultation enquiries, content management and protected administrative workflows.', '/images/projects/bloom-rcm.jpg', 'https://github.com/AnonymusAgent/bloomrcm', 'https://bloomrcm.vercel.app/', 'TypeScript', '["medical-billing","revenue-cycle","business-website"]'::jsonb, '["Next.js","React","TypeScript","PostgreSQL","Drizzle ORM"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-11-01T01:45:01Z'::timestamptz),
  ('1445700910', 'AnonymusAgent', 'VELTRIO', 'veltrio', 'VELTRIO', 'Video Streaming & Creator Platform', 'A cinematic video platform for browsing and watching original videos, with search, categories, likes, comments and saved lists; creator uploads and publishing tools, user accounts and a private admin studio.', '/images/projects/veltrio.jpg', 'https://github.com/AnonymusAgent/VELTRIO', 'https://veltrio-new.vercel.app/', 'TypeScript', '["video-streaming","creator-studio","media-platform"]'::jsonb, '["Next.js","React","TypeScript","PostgreSQL","Drizzle ORM","Mux"]'::jsonb, '{"TypeScript":1}'::jsonb, 'public', 0, 0, false, true, true, '2026-11-05T19:22:59Z'::timestamptz)
ON CONFLICT DO NOTHING;

COMMIT;

-- Confirm committed row counts. Conflicting slugs can leave curated_present below 20;
-- do not overwrite those rows automatically; review them in Admin first.
SELECT
  (SELECT count(*) FROM public.github_projects) AS total_projects,
  (SELECT count(*) FROM public.github_projects WHERE github_id IN ('1270733036', '1263918135', '1303407349', '1154983619', '1227000460', '1284557364', '1132073311', '1227002954', '1154452667', '1154725416', '1241901859', '1271685448', '1132076664', '1121391808', '994314771', '1406597009', '994242633', '1326109868', '1441273336', '1445700910')) AS curated_present_of_20,
  (SELECT count(*) FROM public.posts WHERE slug IN ('how-much-should-a-business-website-cost', 'start-with-an-mvp-not-a-monolith')) AS baseline_posts_present_of_2,
  (SELECT count(*) FROM public.settings WHERE key IN ('contactEmail', 'socials')) AS baseline_settings_present_of_2;
