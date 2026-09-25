import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { formatDate } from "@/lib/utils";
import { getPostBySlug, getPosts } from "@/lib/data";
import { SITE } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

/* simple markdown-lite renderer: ## h2, ### h3, - list, > quote, blank-line paragraphs */
function renderContent(content: string) {
  const blocks = content.split(/\n{2,}/);
  return blocks.map((block, i) => {
    const b = block.trim();
    if (!b) return null;
    if (b.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-12 text-2xl font-semibold tracking-tight">
          {b.slice(3)}
        </h2>
      );
    }
    if (b.startsWith("### ")) {
      return (
        <h3 key={i} className="mt-8 text-xl font-semibold tracking-tight">
          {b.slice(4)}
        </h3>
      );
    }
    if (b.startsWith("- ")) {
      return (
        <ul key={i} className="mt-4 space-y-2.5">
          {b.split("\n").map((li, j) => (
            <li key={j} className="flex items-start gap-3 text-mut">
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-brand" />
              <span>{li.replace(/^- /, "")}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (b.startsWith("> ")) {
      return (
        <blockquote
          key={i}
          className="mt-8 border-l-2 border-brand pl-6 text-lg font-medium italic text-ink"
        >
          {b.slice(2)}
        </blockquote>
      );
    }
    return (
      <p key={i} className="mt-6 leading-[1.85] text-mut">
        {b}
      </p>
    );
  });
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const all = await getPosts();
  const related = all.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 2);
  const fallbackRelated = related.length
    ? related
    : all.filter((p) => p.slug !== slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.createdAt.toISOString(),
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="relative overflow-hidden pt-40 pb-24 md:pt-52 md:pb-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-sm text-mut transition-colors hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              All insights
            </Link>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="kicker mt-10">{post.category}</p>
            <h1 className="mt-4 text-balance text-[clamp(2rem,4.6vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
              {post.title}
            </h1>
            <p className="mt-5 font-mono text-xs text-mut">
              {formatDate(post.createdAt)} · {SITE.name}
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-6 border-t border-line pt-4 text-[1.02rem]">{renderContent(post.content)}</div>
          </Reveal>

          {fallbackRelated.length > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-16 border-t border-line pt-10">
                <p className="kicker mb-6">Related reading</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fallbackRelated.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="card-surface group flex items-center justify-between gap-4 p-5"
                    >
                      <div>
                        <p className="font-mono text-[0.62rem] tracking-[0.18em] text-brand uppercase">
                          {r.category}
                        </p>
                        <p className="mt-1.5 text-sm font-semibold leading-snug tracking-tight group-hover:text-brand">
                          {r.title}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-mut transition-all group-hover:text-brand" />
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </div>
      </Container>
    </article>
  );
}
