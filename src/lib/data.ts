import "server-only";
import { unstable_cache } from "next/cache";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  events,
  faqs,
  githubProjects,
  leads,
  logs,
  posts,
  settings,
  testimonials,
} from "@/db/schema";
import { FAQS, SITE } from "@/lib/site";

/* ------------------------------- settings -------------------------------- */

export type SiteSettings = {
  contactEmail: string;
  socials: { label: string; href: string }[];
};

const DEFAULT_SETTINGS: SiteSettings = {
  contactEmail: SITE.email,
  socials: [],
};

function asDate(value: Date | string) {
  return value instanceof Date ? value : new Date(value);
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(settings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return {
      contactEmail: (map.contactEmail as string) || DEFAULT_SETTINGS.contactEmail,
      socials: Array.isArray(map.socials)
        ? (map.socials as SiteSettings["socials"]).filter((s) => s?.href)
        : DEFAULT_SETTINGS.socials,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const getPublicSettings = unstable_cache(
  getSettings,
  ["webloom-public-settings-v1"],
  { revalidate: 300, tags: ["site-settings"] }
);

export async function setSetting(key: string, value: unknown) {
  await db
    .insert(settings)
    .values({ key, value: value as never, updatedAt: new Date() })
    .onConflictDoUpdate({ target: settings.key, set: { value: value as never, updatedAt: new Date() } });
}

/* ------------------------------- content ---------------------------------- */

export type FaqItem = { id: string; question: string; answer: string };

async function readFaqs(): Promise<FaqItem[]> {
  try {
    const rows = await db
      .select()
      .from(faqs)
      .where(eq(faqs.published, true))
      .orderBy(asc(faqs.sort), asc(faqs.createdAt));
    if (rows.length > 0) {
      return rows.map((f) => ({ id: f.id, question: f.question, answer: f.answer }));
    }
  } catch {
    /* fall through to defaults */
  }
  return FAQS.map((f, i) => ({ id: `default-${i}`, question: f.q, answer: f.a }));
}

export const getFaqs = unstable_cache(readFaqs, ["webloom-faqs-v1"], {
  revalidate: 300,
  tags: ["faqs"],
});

async function readTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.published, true))
      .orderBy(desc(testimonials.createdAt));
  } catch {
    return [];
  }
}

const getCachedTestimonials = unstable_cache(
  readTestimonials,
  ["webloom-testimonials-v1"],
  { revalidate: 300, tags: ["testimonials"] }
);

export async function getTestimonials() {
  const rows = await getCachedTestimonials();
  return rows.map((row) => ({
    ...row,
    createdAt: asDate(row.createdAt as Date | string),
  }));
}

/* ---------------------------------- blog ----------------------------------- */

async function readPosts(publishedOnly = true) {
  try {
    const q = db.select().from(posts).orderBy(desc(posts.featured), desc(posts.createdAt));
    const rows = publishedOnly
      ? await db
          .select()
          .from(posts)
          .where(eq(posts.published, true))
          .orderBy(desc(posts.featured), desc(posts.createdAt))
      : await q;
    return rows;
  } catch {
    return [];
  }
}

const getCachedPosts = unstable_cache(readPosts, ["webloom-posts-v1"], {
  revalidate: 300,
  tags: ["posts"],
});

export async function getPosts(publishedOnly = true) {
  const rows = await getCachedPosts(publishedOnly);
  return rows.map((row) => ({
    ...row,
    createdAt: asDate(row.createdAt as Date | string),
    updatedAt: asDate(row.updatedAt as Date | string),
  }));
}

async function readPostBySlug(slug: string) {
  try {
    const rows = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

const getCachedPostBySlug = unstable_cache(
  readPostBySlug,
  ["webloom-post-by-slug-v1"],
  { revalidate: 300, tags: ["posts"] }
);

export async function getPostBySlug(slug: string) {
  const row = await getCachedPostBySlug(slug);
  return row
    ? {
        ...row,
        createdAt: asDate(row.createdAt as Date | string),
        updatedAt: asDate(row.updatedAt as Date | string),
      }
    : null;
}

/* -------------------------- verified GitHub work --------------------------- */

async function readGithubProjects(publishedOnly = true) {
  try {
    return publishedOnly
      ? await db
          .select()
          .from(githubProjects)
          .where(eq(githubProjects.published, true))
          .orderBy(
            desc(githubProjects.featured),
            desc(githubProjects.pushedAt),
            desc(githubProjects.updatedAt)
          )
      : await db
          .select()
          .from(githubProjects)
          .orderBy(
            desc(githubProjects.featured),
            desc(githubProjects.pushedAt),
            desc(githubProjects.updatedAt)
          );
  } catch {
    return [];
  }
}

const getCachedGithubProjects = unstable_cache(
  readGithubProjects,
  ["webloom-github-projects-v1"],
  { revalidate: 300, tags: ["github-projects"] }
);

export async function getGithubProjects(publishedOnly = true) {
  const rows = await getCachedGithubProjects(publishedOnly);
  return rows.map((row) => ({
    ...row,
    pushedAt: row.pushedAt ? asDate(row.pushedAt as Date | string) : null,
    fetchedAt: asDate(row.fetchedAt as Date | string),
    createdAt: asDate(row.createdAt as Date | string),
    updatedAt: asDate(row.updatedAt as Date | string),
  }));
}

/* -------------------------------- analytics -------------------------------- */

export async function trackEvent(input: {
  type: "pageview" | "event";
  name?: string;
  path: string;
  referrer?: string;
  meta?: Record<string, unknown>;
}) {
  try {
    await db.insert(events).values({
      type: input.type,
      name: input.name ?? null,
      path: input.path.slice(0, 500),
      referrer: input.referrer ? input.referrer.slice(0, 500) : null,
      meta: input.meta ?? null,
    });
  } catch {
    /* analytics must never break the app */
  }
}

export async function getStats() {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [pv] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(events)
    .where(sql`${events.type} = 'pageview' AND ${events.createdAt} > ${since}`);
  const [ev] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(events)
    .where(sql`${events.type} = 'event' AND ${events.createdAt} > ${since}`);
  const [ld] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(sql`${leads.createdAt} > ${since}`);
  const pages = await db
    .select({ path: events.path, n: sql<number>`count(*)::int` })
    .from(events)
    .where(sql`${events.type} = 'pageview' AND ${events.createdAt} > ${since}`)
    .groupBy(events.path)
    .orderBy(sql`count(*) DESC`)
    .limit(8);
  const referrers = await db
    .select({ ref: events.referrer, n: sql<number>`count(*)::int` })
    .from(events)
    .where(sql`${events.type} = 'pageview' AND ${events.referrer} IS NOT NULL AND ${events.referrer} != '' AND ${events.createdAt} > ${since}`)
    .groupBy(events.referrer)
    .orderBy(sql`count(*) DESC`)
    .limit(6);
  const leadsByStatus = await db
    .select({ status: leads.status, n: sql<number>`count(*)::int` })
    .from(leads)
    .groupBy(leads.status);
  // daily pageviews for sparkline
  const daily = await db
    .select({ day: sql<string>`to_char(${events.createdAt}, 'YYYY-MM-DD')`, n: sql<number>`count(*)::int` })
    .from(events)
    .where(sql`${events.type} = 'pageview' AND ${events.createdAt} > ${since}`)
    .groupBy(sql`1`)
    .orderBy(sql`1`);
  return {
    pageviews: pv?.n ?? 0,
    interactions: ev?.n ?? 0,
    leads: ld?.n ?? 0,
    conversion: pv?.n ? Math.round(((ld?.n ?? 0) / pv.n) * 1000) / 10 : 0,
    pages,
    referrers,
    leadsByStatus,
    daily,
  };
}

/* ---------------------------------- logs ----------------------------------- */

export async function log(level: "info" | "warn" | "error" | "security", message: string, context?: Record<string, unknown>) {
  try {
    await db.insert(logs).values({ level, message, context: context ?? null });
  } catch {
    /* non-fatal */
  }
}
