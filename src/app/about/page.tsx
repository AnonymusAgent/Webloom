import type { Metadata } from "next";
import { Compass, Eye, Gem, Layers, Target } from "lucide-react";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";
import FinalCta from "@/components/home/final-cta";
import { PROCESS, WHY } from "@/lib/site";

export const metadata: Metadata = {
  title: "About — Strategy + Design + Technology",
  description:
    "Webloom turns ambitious ideas into useful digital products. Simple on the surface, powerful underneath — our philosophy, approach and values.",
  alternates: { canonical: "/about" },
};

const PILLARS = [
  {
    icon: Target,
    title: "Mission",
    blurb: "To give businesses of every size access to software that feels world-class — products designed around how people actually work, not how tools expect them to.",
  },
  {
    icon: Eye,
    title: "Vision",
    blurb: "A digital landscape where the gap between a small business and a technology giant is no longer the quality of their software.",
  },
  {
    icon: Compass,
    title: "Approach",
    blurb: "Understand first, then design, then engineer. Every project moves through discovery, strategy, design, build, testing, launch and growth — deliberately.",
  },
  {
    icon: Gem,
    title: "Values",
    blurb: "Honesty over hype. Craft over speed for its own sake. Long-term thinking over short-term wins. We'd rather say “not yet” than ship something we're not proud of.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-40 pb-20 md:pt-52 md:pb-28">
        <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
        <Container className="relative">
          <Reveal>
            <p className="kicker mb-6 flex items-center gap-3">
              <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
              About Webloom
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="max-w-4xl text-balance text-[clamp(2.6rem,6.5vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              We turn ambitious ideas into{" "}
              <span className="text-gradient-brand">useful digital products.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-mut md:text-lg">
              Webloom is a software and digital product company built around one idea:{" "}
              <span className="font-medium text-ink">strategy, design and technology</span> belong
              in the same room from day one.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* philosophy */}
      <section className="pb-24 md:pb-36" aria-label="Product philosophy">
        <Container>
          <Reveal>
            <div className="card-surface relative overflow-hidden rounded-[2rem] p-10 text-center sm:p-16">
              <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "var(--halo)" }} />
              <p className="kicker relative">Product philosophy</p>
              <p className="relative mx-auto mt-6 max-w-3xl text-balance text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold leading-snug tracking-tight">
                Simple on the surface. <span className="text-brand">Powerful underneath.</span>
              </p>
              <p className="relative mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-mut">
                The best products hide enormous complexity behind interfaces that feel effortless.
                That tension — between engineering depth and human simplicity — is where Webloom
                lives.
              </p>
              <div className="relative mx-auto mt-10 flex max-w-md items-center justify-center gap-3">
                {["Strategy", "Design", "Technology"].map((w, i) => (
                  <span key={w} className="flex items-center gap-3">
                    <span className="text-sm font-medium">{w}</span>
                    {i < 2 && <span className="text-brand">+</span>}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* pillars */}
      <section className="pb-24 md:pb-36" aria-label="Mission, vision, approach, values">
        <Container>
          <div className="grid gap-5 sm:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.1}>
                <div className="card-surface group h-full p-8 sm:p-10">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-line text-brand transition-all duration-500 group-hover:scale-110 group-hover:border-brand/40">
                      <p.icon className="h-5 w-5" strokeWidth={1.6} />
                    </span>
                    <span className="font-mono text-[0.66rem] text-mut">0{i + 1}</span>
                  </div>
                  <h2 className="mt-7 text-xl font-semibold tracking-tight">{p.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-mut">{p.blurb}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* how we think */}
      <section className="pb-24 md:pb-36" aria-label="How we work">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.35fr] lg:gap-20">
            <Reveal>
              <p className="kicker mb-5 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
                How we work
              </p>
              <h2 className="text-balance text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
                A process that keeps everyone honest.
              </h2>
              <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-mut">
                Seven deliberate stages from first conversation to long-term growth. No black
                boxes, no vanishing acts.
              </p>
            </Reveal>
            <ol className="grid gap-3 sm:grid-cols-2">
              {PROCESS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.05} y={16}>
                  <li className="flex h-full items-start gap-4 rounded-2xl border border-line p-5 transition-colors duration-300 hover:border-line2">
                    <span className="font-mono text-xs text-brand">{p.n}</span>
                    <div>
                      <p className="font-semibold tracking-tight">{p.title}</p>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-mut">{p.blurb}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* principles */}
      <section className="pb-10 md:pb-16" aria-label="Principles">
        <Container>
          <Reveal>
            <div className="rounded-[2rem] border border-line p-8 sm:p-12">
              <div className="flex items-center gap-3">
                <Layers className="h-4 w-4 text-brand" />
                <p className="kicker">What you can expect</p>
              </div>
              <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                {WHY.map((w) => (
                  <li key={w.title} className="border-l border-line pl-5">
                    <p className="font-medium tracking-tight">{w.title}</p>
                    <p className="mt-1 text-[0.8rem] leading-relaxed text-mut">{w.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-10 text-center text-sm text-mut">
              Team profiles and company details are managed from the Webloom admin — this page
              stays honest, never fabricated.
            </p>
          </Reveal>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
