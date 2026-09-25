import type { Metadata } from "next";
import BlogList from "@/components/blog/blog-list";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { getPosts } from "@/lib/data";
import { POST_CATEGORIES } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Insights — Notes on Building Digital Products",
  description:
    "Webloom insights on web development, mobile apps, SaaS, AI, business software, UI/UX and product development.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  const items = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    featured: p.featured,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <section className="relative overflow-hidden pt-40 pb-24 md:pt-52 md:pb-32">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <Reveal>
          <p className="kicker mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
            Insights
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="max-w-3xl text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Notes on <span className="text-gradient-brand">building products.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut md:text-lg">
            Practical writing about websites, apps, SaaS, AI and the craft of shipping software
            that businesses actually use.
          </p>
        </Reveal>

        <div className="mt-16">
          {items.length === 0 ? (
            <Reveal>
              <div className="card-surface mx-auto max-w-xl p-12 text-center">
                <p className="kicker mb-4">Coming soon</p>
                <p className="text-sm leading-relaxed text-mut">
                  We&apos;re writing our first insights now. When they&apos;re ready, they&apos;ll
                  appear here — and on the homepage. No filler, no placeholder posts.
                </p>
              </div>
            </Reveal>
          ) : (
            <BlogList posts={items} categories={POST_CATEGORIES} />
          )}
        </div>
      </Container>
    </section>
  );
}
