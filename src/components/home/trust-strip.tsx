import { Fragment } from "react";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, TRUST_FLOW } from "@/lib/site";
import { Container } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function TrustStrip() {
  return (
    <section id="capabilities" aria-label="What Webloom covers" className="border-y border-line py-14">
      <Container>
        <Reveal>
          <ol className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm">
            {TRUST_FLOW.map((step, i) => (
              <Fragment key={step}>
                <li className="flex items-center gap-3">
                  <span className="font-mono text-[0.68rem] text-brand">0{i + 1}</span>
                  <span className="font-medium">{step}</span>
                </li>
                {i < TRUST_FLOW.length - 1 && (
                  <li aria-hidden="true">
                    <ArrowRight className="h-3.5 w-3.5 text-mut" />
                  </li>
                )}
              </Fragment>
            ))}
          </ol>
        </Reveal>
      </Container>

      <div className="marquee-mask mt-12 overflow-hidden">
        <div className="flex w-max animate-marquee gap-3 pr-3">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span
              key={`${c}-${i}`}
              aria-hidden={i >= CATEGORIES.length}
              className="inline-flex items-center rounded-full border border-line px-5 py-2 text-sm text-mut transition-colors hover:border-brand/50 hover:text-ink"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
