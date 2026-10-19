"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
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
    const refreshSettings = () => {
      fetch("/api/site-settings", { signal: controller.signal })
        .then((response) => (response.ok ? response.json() : null))
        .then((value) => {
          if (value?.contactEmail && Array.isArray(value.socials)) {
            setPublicSettings((current) => {
              const sameSocials = current.socials.length === value.socials.length &&
                current.socials.every((social, index) =>
                  social.label === value.socials[index]?.label && social.href === value.socials[index]?.href
                );
              return current.contactEmail === value.contactEmail && sameSocials ? current : value;
            });
          }
        })
        .catch(() => {});
    };
    // Contact details stay in the initial HTML; refresh admin-managed settings when idle.
    const idle = "requestIdleCallback" in window
      ? window.requestIdleCallback(refreshSettings, { timeout: 2_000 })
      : undefined;
    const timer = idle === undefined ? setTimeout(refreshSettings, 1_200) : undefined;
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      if (timer !== undefined) clearTimeout(timer);
      controller.abort();
    };
  }, [isAdmin]);

  return (
    <>
      <Tracker />
      {!isAdmin && <Nav />}
      <main id="main">{children}</main>
      {!isAdmin && <Footer settings={publicSettings} />}
    </>
  );
}
