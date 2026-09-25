import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/db/schema";
import { formatDate } from "@/lib/utils";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function InsightsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null; // hide when empty

  const [featured, ...rest] = posts;

  return (
    <section className="py-24 md:py-36" aria-labelledby="insights-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="10"
              kicker="Insights"
              title={<span id="insights-h">Notes on building products.</span>}
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/blog"
              data-track="insights_all"
              className="group inline-flex items-center gap-2 text-sm font-medium"
            >
              All insights
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <Link
              href={`/blog/${featured.slug}`}
              data-track={`post_${featured.slug}`}
              className="card-surface group flex h-full flex-col justify-between overflow-hidden rounded-3xl p-8 sm:p-10"
            >
              <div>
                <p className="kicker">{featured.category}</p>
                <h3 className="mt-4 max-w-lg text-balance text-2xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-brand sm:text-3xl">
                  {featured.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-mut">{featured.excerpt}</p>
              </div>
              <div className="mt-10 flex items-center justify-between">
                <span className="font-mono text-[0.68rem] text-mut">{formatDate(featured.createdAt)}</span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </Reveal>
          <div className="flex flex-col gap-5">
            {rest.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={0.08 + i * 0.07}>
                <Link
                  href={`/blog/${p.slug}`}
                  data-track={`post_${p.slug}`}
                  className="card-surface group flex items-center justify-between gap-6 p-6 sm:p-7"
                >
                  <div>
                    <p className="font-mono text-[0.64rem] tracking-[0.2em] text-brand uppercase">
                      {p.category}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-brand">
                      {p.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.66rem] text-mut">{formatDate(p.createdAt)}</p>
                  </div>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
