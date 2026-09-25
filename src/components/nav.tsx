"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo, LogoMark } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-2.5" : "py-5"
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <nav
            aria-label="Primary"
            className={cn(
              "flex items-center justify-between rounded-2xl px-4 transition-all duration-500 sm:px-5",
              scrolled
                ? "border border-line bg-elev/70 py-2.5 shadow-soft backdrop-blur-xl supports-[backdrop-filter]:bg-elev/60"
                : "border border-transparent bg-transparent py-3"
            )}
          >
            <Logo />

            <ul className="hidden items-center gap-0.5 lg:flex">
              {NAV.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-3.5 py-2 text-[0.83rem] font-medium transition-colors duration-300",
                        active ? "text-ink" : "text-mut hover:text-ink"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="nav-pill"
                          className="absolute inset-0 rounded-full border border-line bg-card"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2.5">
              <ThemeToggle compact />
              <Link
                href="/contact"
                data-track="nav_start_project"
                className="group hidden items-center gap-2 rounded-full bg-brand px-4.5 py-2 text-[0.83rem] font-semibold text-brandink transition-all duration-300 hover:shadow-[0_6px_24px_-6px_var(--brand)] active:scale-[0.97] sm:inline-flex"
              >
                Start a Project
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-line2 lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-bg/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                autoFocus
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-line2"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col justify-center px-8">
              <ul className="space-y-1">
                {NAV.map((item, i) => {
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ delay: 0.06 * i + 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "group flex items-baseline gap-4 py-3 text-4xl font-semibold tracking-tight transition-colors",
                          active ? "text-brand" : "text-ink hover:text-brand"
                        )}
                      >
                        <span className="font-mono text-xs text-mut">0{i + 1}</span>
                        {item.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
            <motion.div
              className="px-8 pb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-4 font-semibold text-brandink"
              >
                Start a Project <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="mt-6 flex items-center justify-between">
                <LogoMark className="h-5 w-5 opacity-60" />
                <p className="text-xs text-mut">Digital products, built beautifully.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
