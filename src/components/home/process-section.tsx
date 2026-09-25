"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { PROCESS } from "@/lib/site";
import { Button, Container, SectionHead } from "@/components/ui";
import { Reveal } from "@/components/motion";

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.75", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section className="relative py-24 md:py-36" aria-labelledby="process-h">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHead
                index="06"
                kicker="Process"
                title={<span id="process-h">From idea to launch.</span>}
                lead="A clear, transparent way of working. You always know what's happening, what's next and why."
              />
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-9">
                <Button href="/contact" variant="secondary" track="process_start">
                  Discuss your project
                </Button>
              </div>
            </Reveal>
          </div>

          <div ref={ref} className="relative">
            {/* track */}
            <span aria-hidden="true" className="absolute left-[7px] top-2 bottom-2 w-px bg-line" />
            {!reduce && (
              <motion.span
                aria-hidden="true"
                className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-brand"
                style={{ scaleY: progress }}
              />
            )}
            <ol className="space-y-2">
              {PROCESS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.04} y={20}>
                  <li className="group relative flex gap-7 rounded-2xl p-5 transition-colors duration-500 hover:bg-card sm:gap-10 sm:p-6">
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[1px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-bg transition-colors duration-500 ${
                        i === 0 ? "bg-brand ring-4 ring-brand/20" : "bg-line2 group-hover:bg-brand"
                      }`}
                    />
                    <span className="w-12 shrink-0 pt-0.5 text-right font-mono text-sm text-brand">
                      {step.n}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
                      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-mut">{step.blurb}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
