import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { SERVICES, TECH } from "@/lib/site";
import { Button, Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import ImproveSection from "@/components/improve-section";
import FinalCta from "@/components/home/final-cta";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Websites, Apps, SaaS & Custom Software",
  description:
    "Webloom designs and builds websites, mobile apps, SaaS platforms, custom business software, AI-powered products and premium UI/UX design systems.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      {/* header */}
      <section className="relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-28">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
        <Container className="relative">
          <Reveal>
            <p className="kicker mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
              Services
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-4xl text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              One partner, <span className="text-gradient-brand">every layer</span> of your product.
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut md:text-lg">
              Strategy, design and engineering for websites, mobile apps, SaaS platforms, custom
              business software, AI products and design systems.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* detail blocks */}
      <section className="pb-8" aria-label="Service details">
        <Container className="space-y-5">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} y={32}>
              <article
                id={s.slug}
                className="card-surface group scroll-mt-32 rounded-[2rem] p-8 sm:p-12"
              >
                <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
                  <div>
                    <div className="flex items-center gap-4">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-brand transition-all duration-500 group-hover:border-brand/40">
                        <s.icon className="h-5.5 w-5.5" strokeWidth={1.5} />
                      </span>
                      <span className="font-mono text-xs text-mut">0{i + 1}</span>
                    </div>
                    <h2 className="mt-7 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                      {s.title}
                    </h2>
                    <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-mut">
                      {s.blurb}
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <Button
                        href={`/contact?service=${s.slug}`}
                        track={`services_page_${s.slug}`}
                        size="md"
                      >
                        Start with {s.tag}
                      </Button>
                      <Link
                        href={`/pricing#${s.slug === "design" || s.slug === "ai" ? "software" : s.slug === "web" ? "websites" : s.slug === "mobile" ? "apps" : s.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-mut transition-all hover:border-line2 hover:text-ink"
                      >
                        See pricing <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  <div>
                    <p className="kicker mb-5 text-[0.64rem]">What&apos;s included</p>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {s.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 rounded-xl border border-line bg-elev/40 px-3.5 py-2.5 text-sm text-mut transition-colors duration-300 hover:border-line2 hover:text-ink"
                        >
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" strokeWidth={3} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* tech strip */}
      <section className="py-20" aria-label="Technology we use">
        <Container>
          <Reveal>
            <p className="kicker mb-8 text-center">Technology we actually use</p>
          </Reveal>
          <div className="flex flex-wrap justify-center gap-2.5">
            {TECH.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.04} y={14}>
                <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-mut transition-colors hover:border-brand/40 hover:text-ink">
                  <t.icon className="h-3.5 w-3.5 text-brand" />
                  {t.title}
                </span>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <ImproveSection />
      <FinalCta />
    </>
  );
}
