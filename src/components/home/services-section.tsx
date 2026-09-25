import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES } from "@/lib/site";
import { Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function ServicesSection() {
  return (
    <section className="py-24 md:py-36" aria-labelledby="services-h">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal>
            <SectionHead
              index="01"
              kicker="Services"
              title={<span id="services-h">Everything you need to build your digital product.</span>}
              lead="From a single landing page to a complete business platform — one partner for design, engineering and launch."
            />
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/services"
              data-track="services_view_all"
              className="group inline-flex items-center gap-2 text-sm font-medium text-ink"
            >
              All services
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brandink">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 0.09}>
              <Link
                href={`/services#${s.slug}`}
                data-track={`service_${s.slug}`}
                className="card-surface group relative flex h-full flex-col overflow-hidden p-7"
                aria-label={`${s.title} — details`}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 -top-6 font-mono text-[5.5rem] font-bold leading-none text-ink/[0.045] transition-colors duration-500 group-hover:text-brand/10"
                >
                  0{i + 1}
                </span>
                <div className="mb-8 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-elev text-brand transition-all duration-500 group-hover:scale-110 group-hover:border-brand/40">
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="font-mono text-[0.64rem] tracking-[0.2em] text-mut uppercase">{s.tag}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-mut">{s.blurb}</p>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {s.features.slice(0, 4).map((f) => (
                    <li
                      key={f}
                      className="rounded-full border border-line px-2.5 py-0.5 text-[0.68rem] text-mut"
                    >
                      {f}
                    </li>
                  ))}
                  <li className="rounded-full px-2.5 py-0.5 text-[0.68rem] font-medium text-brand">
                    +{s.features.length - 4} more
                  </li>
                </ul>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[0.8rem] font-medium text-mut transition-colors duration-300 group-hover:text-brand">
                  Explore
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
