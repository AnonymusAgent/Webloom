import { ChevronDown } from "lucide-react";
import { HERO } from "@/lib/site";
import { Button } from "@/components/ui";

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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pt-32 pb-24 text-center sm:px-8">
        <p className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden="true" />
          <span className="font-mono text-[0.68rem] tracking-[0.2em] text-mut uppercase">
            Software · Design · Engineering
          </span>
        </p>

        <h1 className="max-w-5xl text-balance text-[clamp(2.35rem,6.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {HERO.headline}
        </h1>

        <p className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut sm:text-lg">
          {HERO.sub}
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button href={HERO.primary.href} size="lg" track="hero_start_project">
            {HERO.primary.label}
          </Button>
          <Button href={HERO.secondary.href} variant="secondary" size="lg" track="hero_explore_work">
            {HERO.secondary.label}
          </Button>
        </div>
      </div>

      <a
        href="#capabilities"
        aria-label="Scroll to content"
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mut transition-colors hover:text-ink sm:flex"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4" />
      </a>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />
    </section>
  );
}
