"use client";

import { useEffect } from "react";
import policy from "@/lib/admin-session-policy.json" with { type: "json" };

// This marker is tab-scoped: closing the admin tab removes it even if a
// browser restores cookies. The server uses the same timeout from policy.
export const ADMIN_IDLE_MS = policy.idleMs;
const TAB_ACTIVITY_KEY = "wl_admin_tab_activity";

export function rememberAdminActivity(now = Date.now()) {
  try {
    sessionStorage.setItem(TAB_ACTIVITY_KEY, String(now));
  } catch {
    // If storage is unavailable, the tab cannot be restored as authenticated.
  }
}

export function readAdminActivity() {
  try {
    const value = Number(sessionStorage.getItem(TAB_ACTIVITY_KEY));
    return Number.isFinite(value) && value > 0 ? value : null;
  } catch {
    return null;
  }
}

export function forgetAdminActivity() {
  try {
    sessionStorage.removeItem(TAB_ACTIVITY_KEY);
  } catch {
    /* The server-side token still expires after five minutes. */
  }
}

export function useAdminIdle(active: boolean, onExpire: () => void) {
  useEffect(() => {
    if (!active) return;
    let lastActivity = readAdminActivity();
    if (!lastActivity || Date.now() - lastActivity >= ADMIN_IDLE_MS) {
      onExpire();
      return;
    }

    let mounted = true;
    let timer: number;
    let renewing = false;
    let lastRenewal = 0;

    function expire() {
      if (!mounted) return;
      mounted = false;
      onExpire();
    }

    function scheduleExpiry() {
      window.clearTimeout(timer);
      const remaining = (lastActivity || 0) + ADMIN_IDLE_MS - Date.now();
      if (remaining <= 0) expire();
      else timer = window.setTimeout(expire, remaining);
    }

    async function renew() {
      try {
        const response = await fetch("/api/admin/session", { method: "PATCH", cache: "no-store" });
        if (mounted && !response.ok) expire();
        else if (mounted) lastRenewal = Date.now();
      } catch {
        expire();
      } finally {
        renewing = false;
      }
    }

    function activity() {
      if (!mounted || document.visibilityState === "hidden") return;
      const now = Date.now();
      if (!lastActivity || now - lastActivity >= ADMIN_IDLE_MS) {
        expire();
        return;
      }
      if (now - lastActivity < 500) return;
      lastActivity = now;
      rememberAdminActivity(now);
      scheduleExpiry();
      // No background heartbeat: renew only when the administrator interacts.
      if (!renewing && now - lastRenewal >= 60_000) {
        renewing = true;
        void renew();
      }
    }

    function visibility() {
      if (document.visibilityState !== "visible" || !mounted) return;
      if (!lastActivity || Date.now() - lastActivity >= ADMIN_IDLE_MS) {
        expire();
        return;
      }
      // A suspended tab may have missed a timer; check server expiry without
      // extending it merely because the tab became visible again.
      void fetch("/api/admin/session", { cache: "no-store" })
        .then((response) => response.json())
        .then((data) => { if (mounted && !data.admin) expire(); })
        .catch(expire);
    }

    function pagehide() {
      // Covers tab/browser close and navigation away. A hard reload also logs
      // out, deliberately: an unload cannot be reliably distinguished from close.
      forgetAdminActivity();
      void fetch("/api/admin/session", { method: "DELETE", keepalive: true, cache: "no-store" }).catch(() => {});
    }

    function pageshow() {
      // A restored back-forward-cache page must not resurrect a closed session.
      if (!readAdminActivity()) expire();
    }

    scheduleExpiry();
    for (const event of ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const) {
      window.addEventListener(event, activity, { passive: true });
    }
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("pageshow", pageshow);
    return () => {
      mounted = false;
      window.clearTimeout(timer);
      for (const event of ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const) {
        window.removeEventListener(event, activity);
      }
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("pageshow", pageshow);
    };
  }, [active, onExpire]);
}
