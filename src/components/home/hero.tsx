import { ChevronDown } from "lucide-react";
import { HERO } from "@/lib/site";
import { Button } from "@/components/ui";

const workflow = ["Idea", "Design", "Build", "Launch", "Grow"];

export default function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden" aria-label="Intro">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 90% 65% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div aria-hidden="true" className="hero-orbit pointer-events-none absolute left-1/2 top-[43%] hidden h-[35rem] w-[35rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/10 lg:block" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pt-32 pb-28 text-center sm:px-8 sm:pb-32">
        <p className="hero-enter mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-1.5 [--entrance-delay:0ms]">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          <span className="font-mono text-[0.68rem] tracking-[0.2em] text-mut uppercase">
            Software · Design · Engineering
          </span>
        </p>

        <h1 className="hero-enter max-w-5xl text-balance text-[clamp(2.35rem,6.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em] [--entrance-delay:75ms]">
          {HERO.headline}
        </h1>

        <p className="hero-enter mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut sm:text-lg [--entrance-delay:150ms]">
          {HERO.sub}
        </p>

        <div className="hero-enter mt-10 flex flex-col items-center gap-3 sm:flex-row [--entrance-delay:225ms]">
          <Button href={HERO.primary.href} size="lg" track="hero_start_project">
            {HERO.primary.label}
          </Button>
          <Button href={HERO.secondary.href} variant="secondary" size="lg" track="hero_explore_work">
            {HERO.secondary.label}
          </Button>
        </div>

        <div className="hero-enter mt-14 w-full max-w-3xl border-t border-line pt-5 [--entrance-delay:300ms]" aria-label="Our workflow">
          <ol className="grid grid-cols-5 items-start gap-1 sm:flex sm:items-center sm:justify-between sm:gap-2">
            {workflow.map((step, index) => (
              <li key={step} className="flex flex-col items-center gap-1 font-mono text-[0.65rem] tracking-[0.1em] text-mut uppercase sm:flex-row sm:gap-2.5 sm:text-xs">
                <span className="text-brand">0{index + 1}</span>
                <span>{step}</span>
                {index < workflow.length - 1 && <span aria-hidden="true" className="ml-2 hidden h-px w-5 bg-line2 lg:block" />}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <a
        href="#services"
        aria-label="Scroll to content"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1 text-mut transition-colors hover:text-ink sm:flex"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </a>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40" style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
    </section>
  );
}
