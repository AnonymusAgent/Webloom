/**
 * Webloom database seed.
 *
 * Recreates the application's baseline content on top of the schema created
 * by `npx drizzle-kit push` or `npx drizzle-kit migrate`:
 *   - site settings (contact email, owned social links)
 *   - 2 published insight articles
 *   - 20 source-verified GitHub portfolio projects
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
// Shared with the public portfolio fallback; no database credentials in this file.
import PROJECTS from "../src/lib/verified-projects.json" with { type: "json" };

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
        p.githubUrl || `https://github.com/AnonymusAgent/${p.repo}`, p.language,
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
