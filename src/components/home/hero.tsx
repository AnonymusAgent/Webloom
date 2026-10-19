"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { HERO } from "@/lib/site";
import { Button } from "@/components/ui";
import { EASE } from "@/components/motion";

function HeroSceneFallback() {
  return (
    <div className="hero-scene-fallback" aria-hidden="true">
      <span className="hero-scene-fallback__glow" />
      <span className="hero-scene-fallback__ring hero-scene-fallback__ring--one" />
      <span className="hero-scene-fallback__ring hero-scene-fallback__ring--two" />
      <span className="hero-scene-fallback__ring hero-scene-fallback__ring--three" />
      <span className="hero-scene-fallback__node hero-scene-fallback__node--one" />
      <span className="hero-scene-fallback__node hero-scene-fallback__node--two" />
      <span className="hero-scene-fallback__code"><i /><i /><i /></span>
    </div>
  );
}

const Hero3D = dynamic(() => import("@/components/hero3d"), {
  ssr: false,
  loading: () => <HeroSceneFallback />,
});

export default function Hero() {
  const reduce = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // Keep the animated scene as progressive enhancement for capable desktop devices.
    // Mobile, reduced-motion and coarse-pointer visitors get the CSS visual only.
    if (reduce || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let idle: number | undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => setSceneReady(true), { timeout: 2500 });
      } else {
        timer = setTimeout(() => setSceneReady(true), 1800);
      }
    });
    observer.observe(document.querySelector("#home-hero")!);
    return () => {
      observer.disconnect();
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, [reduce]);

  return (
    <section id="home-hero" className="relative flex min-h-svh flex-col overflow-hidden" aria-label="Intro">
      {/* halo + grid backdrop */}
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

      {/* 3d scene — inert to pointer so text stays selectable */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {sceneReady && !reduce ? <Hero3D /> : <HeroSceneFallback />}
      </div>

      {/* content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-5 pt-32 pb-24 text-center sm:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-line bg-card px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          <span className="font-mono text-[0.68rem] tracking-[0.2em] text-mut uppercase">
            Software · Design · Engineering
          </span>
        </motion.p>

        <h1 className="max-w-5xl text-balance text-[clamp(2.35rem,6.4vw,5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {HERO.headline}
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
          className="mt-7 max-w-xl text-pretty text-base leading-relaxed text-mut sm:text-lg"
        >
          {HERO.sub}
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button href={HERO.primary.href} size="lg" track="hero_start_project">
            {HERO.primary.label}
          </Button>
          <Button href={HERO.secondary.href} variant="secondary" size="lg" track="hero_explore_work">
            {HERO.secondary.label}
          </Button>
        </motion.div>
      </div>

      {/* scroll hint */}
      <motion.a
        href="#capabilities"
        aria-label="Scroll to content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-mut transition-colors hover:text-ink sm:flex"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.25em] uppercase">Scroll</span>
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </motion.a>

      {/* bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        style={{ background: "linear-gradient(to top, var(--bg), transparent)" }}
      />
    </section>
  );
}
