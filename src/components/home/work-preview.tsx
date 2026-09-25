import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PRODUCTS } from "@/lib/site";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function WorkPreview() {
  return (
    <section className="py-24 md:py-36" aria-labelledby="work-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="05"
              kicker="Selected work"
              title={<span id="work-h">Selected product concepts.</span>}
              lead="A closer look at the kind of products Webloom designs and builds. Labeled honestly — concepts and Webloom products, not fabricated client claims."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/work"
              data-track="work_view_all"
              className="group inline-flex items-center gap-2 text-sm font-medium"
            >
              View all work
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 divide-y divide-line border-y border-line">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05} y={16}>
              <Link
                href={`/work#${p.slug}`}
                data-track={`work_row_${p.slug}`}
                className="group relative flex items-center gap-5 overflow-hidden py-7 transition-all duration-500 sm:gap-8 sm:py-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-card transition-transform duration-500 ease-out group-hover:scale-y-100"
                />
                <span className="relative z-10 hidden w-10 font-mono text-xs text-mut sm:block">
                  0{i + 1}
                </span>
                <span className="relative z-10 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line text-brand transition-all duration-500 group-hover:rotate-6 group-hover:border-brand/40">
                  <p.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <span className="relative z-10 flex-1">
                  <span className="block text-lg font-semibold tracking-tight transition-transform duration-500 group-hover:translate-x-1.5 sm:text-2xl">
                    {p.name}
                  </span>
                  <span className="mt-1 block text-xs text-mut sm:text-sm">{p.category}</span>
                </span>
                <span className="relative z-10 hidden rounded-full border border-line px-3 py-1 text-[0.68rem] text-mut md:block">
                  {p.label}
                </span>
                <span className="relative z-10 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line transition-all duration-500 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
