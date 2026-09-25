"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Code2,
  FileText,
  HelpCircle,
  LayoutGrid,
  Loader2,
  Lock,
  LogOut,
  MessageSquareQuote,
  Settings2,
  Users,
} from "lucide-react";
import type { Lead, Log } from "@/db/schema";
import { LEAD_STATUSES } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { Logo } from "@/components/ui";
import { ThemeToggle } from "@/components/theme";
import { EASE } from "@/components/motion";
import GithubProjectsPanel from "@/components/admin/github-projects";
import { AdButton, AdField, EmptyState, PanelCard, StatCard, adInput } from "@/components/admin/admin-ui";
import {
  FaqsPanel,
  LogsPanel,
  PostsPanel,
  SettingsPanel,
  TestimonialsPanel,
} from "@/components/admin/admin-content";

/* ---------------------------------- types ---------------------------------- */

type Stats = {
  pageviews: number;
  interactions: number;
  leads: number;
  conversion: number;
  pages: { path: string; n: number }[];
  referrers: { ref: string | null; n: number }[];
  leadsByStatus: { status: string; n: number }[];
  daily: { day: string; n: number }[];
};

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "leads", label: "Leads", icon: Users },
  { id: "github", label: "GitHub Work", icon: Code2 },
  { id: "posts", label: "Blog", icon: FileText },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "logs", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings2 },
] as const;

/* ---------------------------------- login ---------------------------------- */

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Login failed");
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-5">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="card-surface w-full max-w-sm p-8 sm:p-10"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-brand">
          <Lock className="h-5 w-5" strokeWidth={1.6} />
        </span>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight">Webloom Admin</h1>
        <p className="mt-2 text-sm text-mut">Protected area — enter the admin password.</p>
        <div className="mt-7">
          <AdField label="Password">
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={adInput}
              placeholder="••••••••"
              aria-label="Admin password"
            />
          </AdField>
        </div>
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
        <AdButton type="submit" disabled={busy || password.length === 0} className="mt-6 w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sign in
        </AdButton>
        <p className="mt-5 text-center text-[0.68rem] text-mut">
          Set via the ADMIN_PASSWORD environment variable.
        </p>
      </motion.form>
    </div>
  );
}

/* --------------------------------- overview --------------------------------- */

function Overview({ stats }: { stats: Stats | null }) {
  if (!stats) return <p className="py-10 text-center text-sm text-mut">Loading…</p>;
  const maxDaily = Math.max(1, ...stats.daily.map((d) => d.n));

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Page views · 30d" value={stats.pageviews.toLocaleString()} />
        <StatCard label="Interactions · 30d" value={stats.interactions.toLocaleString()} sub="CTA clicks, tabs, estimator" />
        <StatCard label="Contact submissions · 30d" value={stats.leads.toLocaleString()} />
        <StatCard label="Conversion rate" value={`${stats.conversion}%`} sub="submissions / page views" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* daily chart */}
        <PanelCard className="lg:col-span-2">
          <p className="mb-5 text-sm font-semibold tracking-tight">Visitors — last 30 days</p>
          {stats.daily.length === 0 ? (
            <p className="py-8 text-center text-xs text-mut">
              Traffic data will appear here as people visit the site.
            </p>
          ) : (
            <div className="flex h-36 items-end gap-1.5" role="img" aria-label="Daily page views chart">
              {stats.daily.map((d) => (
                <div key={d.day} className="group relative flex-1">
                  <div
                    className="w-full rounded-t-md bg-brand/25 transition-all group-hover:bg-brand/60"
                    style={{ height: `${Math.max(4, (d.n / maxDaily) * 140)}px` }}
                  />
                  <span className="pointer-events-none absolute -top-8 left-1/2 z-10 -translate-x-1/2 rounded-md border border-line bg-elev px-2 py-1 font-mono text-[0.6rem] whitespace-nowrap opacity-0 transition-opacity group-hover:opacity-100">
                    {d.day.slice(5)} · {d.n}
                  </span>
                </div>
              ))}
            </div>
          )}
        </PanelCard>

        {/* lead funnel */}
        <PanelCard>
          <p className="mb-5 text-sm font-semibold tracking-tight">Leads by status</p>
          {stats.leadsByStatus.length === 0 ? (
            <p className="py-8 text-center text-xs text-mut">No leads yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.leadsByStatus.map((s) => (
                <li key={s.status} className="flex items-center justify-between text-sm">
                  <span className="text-mut">
                    {LEAD_STATUSES.find((x) => x.id === s.status)?.label ?? s.status}
                  </span>
                  <span className="rounded-full bg-brand/10 px-2.5 py-0.5 font-mono text-[0.7rem] text-brand">
                    {s.n}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelCard>
          <p className="mb-5 text-sm font-semibold tracking-tight">Popular pages</p>
          {stats.pages.length === 0 ? (
            <p className="py-6 text-center text-xs text-mut">No page data yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.pages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate font-mono text-[0.78rem] text-mut">{p.path}</span>
                  <span className="shrink-0 font-medium">{p.n}</span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
        <PanelCard>
          <p className="mb-5 text-sm font-semibold tracking-tight">Traffic sources</p>
          {stats.referrers.length === 0 ? (
            <p className="py-6 text-center text-xs text-mut">
              Referrers appear here when visitors arrive from other sites.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {stats.referrers.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-4 text-sm">
                  <span className="truncate text-[0.78rem] text-mut">{r.ref}</span>
                  <span className="shrink-0 font-medium">{r.n}</span>
                </li>
              ))}
            </ul>
          )}
        </PanelCard>
      </div>
    </div>
  );
}

/* ---------------------------------- leads ----------------------------------- */

const STATUS_COLORS: Record<string, string> = {
  new: "border-brand/40 bg-brand/10 text-brand",
  contacted: "border-sky-400/30 bg-sky-400/10 text-sky-400",
  qualified: "border-violet-400/30 bg-violet-400/10 text-violet-400",
  proposal: "border-amber-400/30 bg-amber-400/10 text-amber-400",
  won: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
  lost: "border-line2 bg-card text-mut",
};

function LeadsPanel() {
  const [items, setItems] = useState<Lead[] | null>(null);
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/leads");
    const data = await res.json();
    setItems(data.leads);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load().catch(() => setItems([]));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  async function setStatus(id: string, status: string) {
    setItems((cur) => cur?.map((l) => (l.id === id ? { ...l, status } : l)) ?? null);
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  if (!items) return <p className="py-10 text-center text-sm text-mut">Loading…</p>;

  const visible = filter === "all" ? items : items.filter((l) => l.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", ...LEAD_STATUSES.map((s) => s.id)].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.75rem] capitalize transition-all ${
              filter === s ? "border-brand bg-brand/10 text-brand" : "border-line text-mut hover:text-ink"
            }`}
          >
            {s === "all" ? "All" : LEAD_STATUSES.find((x) => x.id === s)?.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No leads here yet"
          blurb="Project briefs submitted through the contact form appear here the moment they arrive."
        />
      ) : (
        visible.map((l) => (
          <PanelCard key={l.id} className="rounded-2xl p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-2 font-semibold tracking-tight">
                  {l.name}
                  {l.company && <span className="text-xs font-normal text-mut">· {l.company}</span>}
                </p>
                <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-mut">
                  <a href={`mailto:${l.email}`} className="text-brand hover:underline">
                    {l.email}
                  </a>
                  {l.phone && <span>{l.phone}</span>}
                  <span>{formatDate(l.createdAt)}</span>
                </p>
              </div>
              <select
                value={l.status}
                onChange={(e) => setStatus(l.id, e.target.value)}
                aria-label="Lead status"
                className={`rounded-full border px-3 py-1.5 text-[0.72rem] font-medium outline-none ${STATUS_COLORS[l.status] ?? ""}`}
              >
                {LEAD_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] text-mut">{l.projectType}</span>
              {l.budget && (
                <span className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] text-mut">{l.budget}</span>
              )}
              {l.timeline && (
                <span className="rounded-full border border-line px-2.5 py-1 text-[0.68rem] text-mut">{l.timeline}</span>
              )}
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-mut transition-colors hover:text-ink">
                View message
              </summary>
              <p className="mt-2 rounded-xl border border-line bg-elev/50 p-4 text-sm leading-relaxed text-mut whitespace-pre-wrap">
                {l.message}
              </p>
            </details>
          </PanelCard>
        ))
      )}
    </div>
  );
}

/* ----------------------------------- app ------------------------------------ */

export default function AdminApp() {
  const [status, setStatus] = useState<"loading" | "login" | "ready">("loading");
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setLogs(data.logs);
      }
    } catch {
      /* leave empty */
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setStatus(d.admin ? "ready" : "login"))
      .catch(() => setStatus("login"));
  }, []);

  useEffect(() => {
    if (status !== "ready") return;
    const timer = window.setTimeout(() => {
      void loadStats();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [status, loadStats]);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setStatus("login");
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-brand" />
      </div>
    );
  }

  if (status === "login") {
    return (
      <LoginForm
        onSuccess={() => {
          setStatus("ready");
        }}
      />
    );
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-mono text-[0.62rem] tracking-[0.16em] text-brand uppercase">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <ThemeToggle compact />
            <AdButton variant="ghost" onClick={logout}>
              <LogOut className="h-3.5 w-3.5" /> Log out
            </AdButton>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8">
        <div className="hide-scrollbar -mx-5 flex gap-1.5 overflow-x-auto px-5 pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[0.8rem] font-medium whitespace-nowrap transition-colors ${
                tab === t.id ? "text-brandink" : "text-mut hover:text-ink"
              }`}
            >
              {tab === t.id && (
                <motion.span
                  layoutId="admin-tab"
                  className="absolute inset-0 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <t.icon className="relative z-10 h-3.5 w-3.5" />
              <span className="relative z-10">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {tab === "overview" && <Overview stats={stats} />}
              {tab === "leads" && <LeadsPanel />}
              {tab === "github" && <GithubProjectsPanel />}
              {tab === "posts" && <PostsPanel />}
              {tab === "testimonials" && <TestimonialsPanel />}
              {tab === "faqs" && <FaqsPanel />}
              {tab === "logs" && <LogsPanel logs={logs} />}
              {tab === "settings" && <SettingsPanel />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
