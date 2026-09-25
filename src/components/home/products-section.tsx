"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkle } from "lucide-react";
import Link from "next/link";
import { PRODUCTS, type Product } from "@/lib/site";
import { Container, SectionHead, Chip } from "@/components/ui";
import { Reveal } from "@/components/motion";

function ProductCard({ p }: { p: Product }) {
  return (
    <article className="card-surface group flex h-full w-[86vw] max-w-[560px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl">
      {/* art */}
      <div
        className="relative h-52 overflow-hidden sm:h-60"
        style={{
          background: `linear-gradient(140deg, color-mix(in oklab, var(--brand) 16%, var(--bg2)), var(--bg2) 55%), radial-gradient(80% 120% at 85% 0%, color-mix(in oklab, var(--brand) 22%, transparent), transparent 60%)`,
          filter: `hue-rotate(${p.hue === "160deg" ? "0deg" : p.hue})`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute left-5 top-5">
          <Chip className="border-brand/30 bg-bg/60 text-brand backdrop-blur-sm">
            <Sparkle className="h-3 w-3" />
            {p.label}
          </Chip>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[1.8rem] border border-line2 bg-elev/70 shadow-soft backdrop-blur-md transition-transform duration-700 ease-out group-hover:rotate-[8deg] group-hover:scale-110">
            <p.icon className="h-10 w-10 text-brand" strokeWidth={1.4} />
            <span className="ring-bloom" style={{ animationDelay: "1s" }} aria-hidden="true" />
          </div>
        </div>
        {/* faux app bar, bottom right */}
        <div
          aria-hidden="true"
          className="absolute -bottom-6 right-6 hidden w-44 rotate-[-4deg] rounded-2xl border border-line2 bg-elev/80 p-3 shadow-soft backdrop-blur-md transition-all duration-700 group-hover:-translate-y-2 group-hover:rotate-[-2deg] sm:block"
        >
          <div className="h-1.5 w-2/3 rounded-full bg-brand/60" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-line2" />
          <div className="mt-1.5 h-1.5 w-5/6 rounded-full bg-line2" />
          <div className="mt-2.5 h-6 w-full rounded-lg bg-brand/15" />
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-7">
        <p className="font-mono text-[0.64rem] tracking-[0.2em] text-brand uppercase">{p.category}</p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{p.name}</h3>
        <p className="mt-2.5 text-sm leading-relaxed text-mut">{p.blurb}</p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {p.features.slice(0, 6).map((f) => (
            <li key={f} className="rounded-full border border-line px-2.5 py-1 text-[0.7rem] text-mut">
              {f}
            </li>
          ))}
          {p.features.length > 6 && (
            <li className="rounded-full px-2.5 py-1 text-[0.7rem] font-medium text-brand">
              +{p.features.length - 6} more
            </li>
          )}
        </ul>

        {p.serves && (
          <p className="mt-4 text-[0.72rem] leading-relaxed text-mut">
            <span className="font-medium text-ink">Built for: </span>
            {p.serves.join(" · ")}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5" style={{ marginTop: "auto", paddingTop: "1.25rem" }}>
          <p className="text-[0.8rem] font-medium italic text-mut">“{p.outcome}”</p>
        </div>
        <Link
          href={`/work#${p.slug}`}
          data-track={`product_${p.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-medium text-ink transition-colors hover:text-brand"
        >
          View details
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = () => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 12);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 12);
  };

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const go = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.85, 580), behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-36" aria-labelledby="products-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="02"
              kicker="Featured products"
              title={<span id="products-h">Products we design and engineer.</span>}
              lead="Webloom products and product concepts — real demonstrations of the platforms we know how to build, end to end."
            />
          </Reveal>
          <Reveal delay={0.15} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={!canPrev}
              aria-label="Previous products"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all enabled:hover:border-brand enabled:hover:text-brand disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={!canNext}
              aria-label="Next products"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line transition-all enabled:hover:border-brand enabled:hover:text-brand disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </Reveal>
        </div>
      </Container>

      <Reveal delay={0.1}>
        <div
          ref={scroller}
          onScroll={update}
          className="hide-scrollbar mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8 lg:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
        >
          {PRODUCTS.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
          {/* end card */}
          <Link
            href="/contact"
            data-track="products_cta"
            className="card-surface group flex w-[70vw] max-w-[340px] shrink-0 snap-start flex-col items-start justify-center rounded-3xl p-8"
          >
            <p className="kicker">Your product here</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight">
              Have something to build?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-mut">
              Tell us the idea — we&apos;ll help shape it into a product worth using.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-brandink">
              Start a Project
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
