"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Progressive reveal: server HTML and the first paint are always visible.
 * Only off-screen elements are prepared for animation after hydration; a failed
 * script, a fast scroll, or reduced-motion mode never hides important content.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"visible" | "waiting">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    const rect = el.getBoundingClientRect();
    // Do not interrupt content already in view (including anchor navigation).
    if (rect.top < window.innerHeight && rect.bottom > 0) return;
    setPhase("waiting");
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          if (!once && !preference.matches) setPhase("waiting");
          return;
        }
        setPhase("visible");
        if (once) observer.disconnect();
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
    );
    observer.observe(el);
    const onPreferenceChange = () => {
      if (preference.matches) {
        observer.disconnect();
        setPhase("visible");
      }
    };
    preference.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, [once]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={false}
      animate={phase}
      variants={{
        waiting: { opacity: 0, y, transition: { duration: 0 } },
        visible: { opacity: 1, y: 0, transition: { duration: 0.65, delay: Math.min(delay, 0.24), ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeStagger({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode[];
  className?: string;
  gap?: number;
}) {
  return (
    <div className={className}>
      {children.map((child, index) => <Reveal key={index} delay={index * gap}>{child}</Reveal>)}
    </div>
  );
}
