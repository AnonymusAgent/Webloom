"use client";

import { useReducedMotion } from "framer-motion";
import { TECH } from "@/lib/site";
import { Container, SectionHead, LogoMark } from "@/components/ui";
import { Reveal } from "@/components/motion";

const R = 40; // radius % of container

export default function TechSection() {
  const reduce = Boolean(useReducedMotion());

  const nodes = TECH.map((t, i) => {
    const angle = (i / TECH.length) * Math.PI * 2 - Math.PI / 2;
    const x = 50 + Math.cos(angle) * R;
    const y = 50 + Math.sin(angle) * (R * 0.82);
    return { ...t, x, y, angle };
  });

  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="tech-h">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "var(--halo)" }} />
      <Container className="relative">
        <Reveal>
          <SectionHead
            index="07"
            kicker="Technology"
            title={<span id="tech-h">A modern, pragmatic stack.</span>}
            lead="We choose proven technology that fits the product — and we only list what we actually build with."
            align="center"
          />
        </Reveal>

        {/* radial map (desktop) */}
        <Reveal delay={0.15}>
          <div
            className="relative mx-auto mt-16 hidden aspect-[16/10] max-w-4xl select-none lg:block"
            aria-hidden="true"
          >
            {/* links */}
            <svg viewBox="0 0 100 62.5" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              {nodes.map((n, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="31.25"
                  x2={n.x}
                  y2={(n.y / 100) * 62.5}
                  stroke="var(--line2)"
                  strokeWidth="0.12"
                  strokeDasharray="1.2 1.6"
                  className={reduce ? undefined : "animate-[dashmove_3.2s_linear_infinite]"}
                />
              ))}
            </svg>
            <style>{`@keyframes dashmove { to { stroke-dashoffset: -5.6; } }`}</style>

            {/* core */}
            <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-line2 bg-elev shadow-soft">
                <LogoMark className={reduce ? "h-9 w-9" : "h-9 w-9 animate-spin-slower"} />
                <span className="ring-bloom" aria-hidden="true" />
              </div>
            </div>

            {/* nodes */}
            {nodes.map((n, i) => (
              <div
                key={n.title}
                className="group absolute w-36 -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
              >
                <div
                  className={`rounded-2xl border border-line bg-elev/90 p-3 text-center shadow-soft backdrop-blur-sm transition-colors duration-300 hover:border-brand/50 ${
                    reduce ? "" : "animate-float-y"
                  }`}
                  style={{ animationDelay: `${i * 0.55}s` }}
                >
                  <n.icon className="mx-auto h-4 w-4 text-brand" strokeWidth={1.6} />
                  <p className="mt-1.5 text-[0.78rem] font-semibold">{n.title}</p>
                  <p className="mt-0.5 text-[0.62rem] leading-snug text-mut">{n.items.join(" · ")}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* grid (mobile / a11y) */}
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:hidden">
          {TECH.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.04} y={16}>
              <li className="card-surface h-full p-4">
                <t.icon className="h-4.5 w-4.5 text-brand" strokeWidth={1.6} />
                <p className="mt-2.5 text-sm font-semibold">{t.title}</p>
                <p className="mt-1 text-[0.68rem] leading-snug text-mut">{t.items.join(" · ")}</p>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
