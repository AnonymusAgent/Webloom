import { Wrench } from "lucide-react";
import { IMPROVE } from "@/lib/site";
import { Button, Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function ImproveSection() {
  return (
    <section className="py-24 md:py-36" aria-labelledby="improve-h">
      <Container>
        <div className="card-surface relative overflow-hidden rounded-[2rem] p-8 sm:p-12 lg:p-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "var(--halo)" }}
          />
          <div className="relative grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <Reveal>
                <p className="kicker mb-5 flex items-center gap-3">
                  <Wrench className="h-3.5 w-3.5" />
                  Existing products
                </p>
              </Reveal>
              <Reveal delay={0.08}>
                <h2
                  id="improve-h"
                  className="text-balance text-[clamp(1.9rem,4vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.02em]"
                >
                  Already have a product? Make it better.
                </h2>
              </Reveal>
              <Reveal delay={0.16}>
                <p className="mt-5 max-w-md text-pretty text-base leading-relaxed text-mut">
                  {IMPROVE.blurb} We audit, fix, redesign and extend — then hand you back a product
                  that feels new.
                </p>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="mt-8">
                  <Button
                    href="/contact?type=existing"
                    track="improve_cta"
                  >
                    {IMPROVE.cta}
                  </Button>
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <ul className="flex flex-wrap gap-2">
                {IMPROVE.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line bg-elev/50 px-4 py-2 text-[0.8rem] text-mut transition-all duration-300 hover:border-brand/40 hover:text-ink"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
