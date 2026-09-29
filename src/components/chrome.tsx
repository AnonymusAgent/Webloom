"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import Nav from "@/components/nav";
import Footer from "@/components/footer";
import type { SiteSettings } from "@/lib/data";

/* ------------------------- analytics & CTA tracking ------------------------ */

export function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const ref = document.referrer;
    let external = "";
    try {
      const referrer = new URL(ref);
      if (referrer.origin !== window.location.origin) external = referrer.origin;
    } catch {
      /* omit an empty or invalid referrer */
    }
    const t = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "pageview", path: pathname, referrer: external }),
        keepalive: true,
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: globalThis.MouseEvent) {
      const el = (e.target as HTMLElement)?.closest?.("[data-track]");
      if (!el) return;
      const name = el.getAttribute("data-track") || "cta_click";
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "event", name, path: window.location.pathname, meta: {} }),
        keepalive: true,
      }).catch(() => {});
    }
    document.addEventListener("click", onClick, { passive: true });
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

/* -------------------------------- cursor ----------------------------------- */

function CustomCursor() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.style.cssText =
      "position:fixed;z-index:9999;width:6px;height:6px;border-radius:50%;background:var(--brand);pointer-events:none;top:0;left:0;transform:translate(-50%,-50%);";
    ring.style.cssText =
      "position:fixed;z-index:9998;width:34px;height:34px;border-radius:50%;border:1.5px solid var(--line2);pointer-events:none;top:0;left:0;transform:translate(-50%,-50%);transition:width .25s,height .25s,border-color .25s,opacity .3s;";
    document.body.append(dot, ring);

    let tx = -100, ty = -100, rx = -100, ry = -100, raf = 0, visible = false;

    const move = (e: globalThis.MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = "1"; ring.style.opacity = "1"; }
      dot.style.transform = `translate(${tx - 3}px, ${ty - 3}px)`;
      const interactive = (e.target as HTMLElement)?.closest?.("a,button,[role=button],input,select,textarea,label,[data-magnetic]");
      if (interactive) {
        ring.style.width = "52px";
        ring.style.height = "52px";
        ring.style.borderColor = "var(--brand)";
      } else {
        ring.style.width = "34px";
        ring.style.height = "34px";
        ring.style.borderColor = "var(--line2)";
      }
    };

    const loop = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx - 17}px, ${ry - 17}px)`;
      raf = requestAnimationFrame(loop);
    };

    const leave = () => { dot.style.opacity = "0"; ring.style.opacity = "0"; visible = false; };

    dot.style.opacity = "0"; ring.style.opacity = "0";
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
      dot.remove();
      ring.remove();
    };
  }, []);
  return null;
}

/* --------------------------------- chrome ---------------------------------- */

export default function Chrome({
  children,
  settings,
}: {
  children: ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [publicSettings, setPublicSettings] = useState(settings);

  useEffect(() => {
    if (isAdmin) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      fetch("/api/site-settings", { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((value) => {
          if (value?.contactEmail && Array.isArray(value.socials)) {
            setPublicSettings(value);
          }
        })
        .catch(() => {});
    }, 50);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [isAdmin]);

  return (
    <MotionConfig reducedMotion="user">
      <Tracker />
      <CustomCursor />
      {!isAdmin && <Nav />}
      <main id="main">{children}</main>
      {!isAdmin && <Footer settings={publicSettings} />}
    </MotionConfig>
  );
}
