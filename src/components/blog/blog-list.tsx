"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Reveal } from "@/components/motion";

export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  featured: boolean;
  createdAt: string;
};

export default function BlogList({ posts, categories }: { posts: PostListItem[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      posts.filter((p) => {
        const matchCat = cat === null || p.category === cat;
        const query = q.trim().toLowerCase();
        const matchQ =
          query.length === 0 ||
          p.title.toLowerCase().includes(query) ||
          p.excerpt.toLowerCase().includes(query);
        return matchCat && matchQ;
      }),
    [posts, q, cat]
  );

  const usedCategories = categories.filter((c) => posts.some((p) => p.category === c));

  return (
    <div>
      {/* controls */}
      <Reveal>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search insights…"
              aria-label="Search insights"
              className="w-full rounded-full border border-line bg-elev/60 py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-mut/60 focus:border-brand/60"
            />
          </div>
          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setCat(null)}
              className={cn(
                "whitespace-nowrap rounded-full border px-4 py-2 text-[0.78rem] transition-all",
                cat === null
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line text-mut hover:text-ink"
              )}
            >
              All
            </button>
            {usedCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(cat === c ? null : c)}
                className={cn(
                  "whitespace-nowrap rounded-full border px-4 py-2 text-[0.78rem] transition-all",
                  cat === c ? "border-brand bg-brand/10 text-brand" : "border-line text-mut hover:text-ink"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* grid */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-sm text-mut">Nothing matches that search — try something else.</p>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.07} className="h-full">
              <Link
                href={`/blog/${p.slug}`}
                data-track={`blog_${p.slug}`}
                className="card-surface group flex h-full flex-col p-7"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[0.64rem] tracking-[0.2em] text-brand uppercase">{p.category}</p>
                  {p.featured && (
                    <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[0.62rem] font-semibold text-brand">
                      Featured
                    </span>
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand">
                  {p.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-mut">{p.excerpt}</p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <span className="font-mono text-[0.66rem] text-mut">{formatDate(p.createdAt)}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
