import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";


/** Contact / project brief submissions */
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    company: text("company"),
    email: text("email").notNull(),
    phone: text("phone"),
    projectType: text("project_type").notNull(),
    budget: text("budget"),
    timeline: text("timeline"),
    message: text("message").notNull(),
    status: text("status").notNull().default("new"), // new | contacted | qualified | proposal | won | lost
    source: text("source").notNull().default("contact"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("leads_created_idx").on(t.createdAt), index("leads_status_idx").on(t.status)]
);

/** Blog / insights articles */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    category: text("category").notNull().default("Technology"),
    content: text("content").notNull().default(""),
    published: boolean("published").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("posts_published_idx").on(t.published)]
);

/** Testimonials — hidden on the site until real ones exist */
export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  position: text("position"),
  quote: text("quote").notNull(),
  project: text("project"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** FAQs managed from the admin (site falls back to defaults) */
export const faqs = pgTable("faqs", {
  id: uuid("id").defaultRandom().primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category").notNull().default("General"),
  sort: integer("sort").notNull().default(0),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/** Privacy-conscious analytics events (no IPs, no fingerprints) */
export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    type: text("type").notNull(), // pageview | event
    name: text("name"), // cta_click, form_start, pricing_tab, ...
    path: text("path").notNull().default("/"),
    referrer: text("referrer"),
    meta: jsonb("meta"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("events_created_idx").on(t.createdAt), index("events_type_idx").on(t.type)]
);

/** GitHub repositories verified and curated as portfolio projects */
export const githubProjects = pgTable(
  "github_projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    githubId: text("github_id").notNull().unique(),
    owner: text("owner").notNull(),
    repo: text("repo").notNull(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    category: text("category").notNull().default("Software Project"),
    summary: text("summary").notNull().default(""),
    image: text("image"),
    githubUrl: text("github_url").notNull(),
    homepage: text("homepage"),
    language: text("language"),
    topics: jsonb("topics").notNull().default([]),
    technologies: jsonb("technologies").notNull().default([]),
    languages: jsonb("languages").notNull().default({}),
    readmeExcerpt: text("readme_excerpt"),
    visibility: text("visibility").notNull().default("public"),
    stars: integer("stars").notNull().default(0),
    forks: integer("forks").notNull().default(0),
    archived: boolean("archived").notNull().default(false),
    published: boolean("published").notNull().default(false),
    featured: boolean("featured").notNull().default(false),
    pushedAt: timestamp("pushed_at", { withTimezone: true }),
    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("github_projects_published_idx").on(t.published),
    index("github_projects_featured_idx").on(t.featured),
  ]
);

/** System / activity / security logs */
export const logs = pgTable(
  "logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    level: text("level").notNull().default("info"), // info | warn | error | security
    message: text("message").notNull(),
    context: jsonb("context"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("logs_created_idx").on(t.createdAt)]
);

/** Editable site settings (contact email, socials, hero overrides) */
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Lead = typeof leads.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type SiteEvent = typeof events.$inferSelect;
export type GithubProject = typeof githubProjects.$inferSelect;
export type Log = typeof logs.$inferSelect;
