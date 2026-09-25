"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import type { Faq, Log, Post, Testimonial } from "@/db/schema";
import { POST_CATEGORIES } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import {
  AdButton,
  AdField,
  Toggle,
  EmptyState,
  PanelCard,
  adInput,
  levelColor,
} from "@/components/admin/admin-ui";

async function api(resource: string, method = "GET", body?: unknown) {
  const res = await fetch(`/api/admin/content?resource=${resource}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
  return res.json();
}

/* ---------------------------------- posts ---------------------------------- */

type PostForm = {
  id?: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  published: boolean;
  featured: boolean;
};

const emptyPost: PostForm = {
  title: "",
  slug: "",
  category: "Technology",
  excerpt: "",
  content: "",
  published: false,
  featured: false,
};

export function PostsPanel() {
  const [items, setItems] = useState<Post[] | null>(null);
  const [form, setForm] = useState<PostForm | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const data = await api("posts");
    setItems(data.items);
  }, []);

  useEffect(() => {
    load().catch(() => setItems([]));
  }, [load]);

  async function save() {
    if (!form) return;
    setBusy(true);
    setError("");
    try {
      if (form.id) await api("posts", "PATCH", form);
      else await api("posts", "POST", form);
      setForm(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await api("posts", "DELETE", { id });
    await load();
  }

  if (form) {
    return (
      <PanelCard>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{form.id ? "Edit post" : "New post"}</h3>
          <AdButton variant="ghost" onClick={() => setForm(null)}>
            <X className="h-4 w-4" /> Cancel
          </AdButton>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdField label="Title *">
            <input className={adInput} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </AdField>
          <AdField label="Slug (auto if empty)">
            <input className={adInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </AdField>
          <AdField label="Category">
            <select className={adInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {POST_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </AdField>
          <AdField label="Excerpt">
            <input className={adInput} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          </AdField>
        </div>
        <AdField label="Content — supports ## headings, - lists, > quotes, blank-line paragraphs" className="mt-4">
          <textarea
            className={adInput + " min-h-56 font-mono text-[0.8rem]"}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </AdField>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Published" />
          <Toggle checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} label="Featured" />
          <span className="ml-auto flex items-center gap-3">
            {error && <span className="text-xs text-red-400">{error}</span>}
            <AdButton onClick={save} disabled={busy || form.title.trim().length === 0}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save post
            </AdButton>
          </span>
        </div>
      </PanelCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <AdButton onClick={() => setForm(emptyPost)}>
          <Plus className="h-4 w-4" /> New post
        </AdButton>
      </div>
      {!items ? (
        <p className="py-10 text-center text-sm text-mut">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="No posts yet" blurb="Publish your first insight — the blog section on the site appears automatically once a published post exists." />
      ) : (
        items.map((p) => (
          <PanelCard key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold tracking-tight">{p.title}</p>
              <p className="mt-1 text-xs text-mut">
                {p.category} · {formatDate(p.createdAt)} ·{" "}
                <span className={p.published ? "text-brand" : "text-amber-400"}>
                  {p.published ? "Published" : "Draft"}
                </span>
                {p.featured && " · Featured"}
              </p>
            </div>
            <AdButton variant="ghost" onClick={() => setForm({ ...p, content: p.content })}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </AdButton>
            <AdButton variant="danger" onClick={() => remove(p.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </AdButton>
          </PanelCard>
        ))
      )}
    </div>
  );
}

/* ------------------------------- testimonials ------------------------------ */

type TestimonialForm = {
  id?: string;
  name: string;
  company: string;
  position: string;
  project: string;
  quote: string;
  published: boolean;
};

export function TestimonialsPanel() {
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [form, setForm] = useState<TestimonialForm | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await api("testimonials");
    setItems(data.items);
  }, []);
  useEffect(() => {
    load().catch(() => setItems([]));
  }, [load]);

  async function save() {
    if (!form) return;
    setBusy(true);
    try {
      if (form.id) await api("testimonials", "PATCH", form);
      else await api("testimonials", "POST", form);
      setForm(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await api("testimonials", "DELETE", { id });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.8rem] text-mut">
          The testimonials section on the site stays hidden until a published testimonial exists —
          no fabricated quotes, ever.
        </p>
        <AdButton onClick={() => setForm({ name: "", company: "", position: "", project: "", quote: "", published: true })}>
          <Plus className="h-4 w-4" /> Add
        </AdButton>
      </div>

      {form && (
        <PanelCard>
          <div className="grid gap-4 sm:grid-cols-2">
            <AdField label="Client name *">
              <input className={adInput} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </AdField>
            <AdField label="Company">
              <input className={adInput} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            </AdField>
            <AdField label="Position">
              <input className={adInput} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
            </AdField>
            <AdField label="Project">
              <input className={adInput} value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} />
            </AdField>
          </div>
          <AdField label="Testimonial *" className="mt-4">
            <textarea className={adInput + " min-h-28"} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
          </AdField>
          <div className="mt-5 flex items-center gap-6">
            <Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Published" />
            <span className="ml-auto flex gap-3">
              <AdButton variant="ghost" onClick={() => setForm(null)}>Cancel</AdButton>
              <AdButton
                onClick={save}
                disabled={busy || form.name.trim().length === 0 || form.quote.trim().length === 0}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </AdButton>
            </span>
          </div>
        </PanelCard>
      )}

      {!items ? (
        <p className="py-10 text-center text-sm text-mut">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="No testimonials yet" blurb="When a real client shares feedback, add it here and it will appear on the homepage." />
      ) : (
        items.map((t) => (
          <PanelCard key={t.id} className="rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold tracking-tight">
                  {t.name}
                  {(t.position || t.company) && (
                    <span className="ml-2 text-xs font-normal text-mut">
                      {[t.position, t.company].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-mut">“{t.quote}”</p>
                <p className="mt-1.5 text-xs">
                  <span className={t.published ? "text-brand" : "text-amber-400"}>
                    {t.published ? "Published" : "Hidden"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                <AdButton variant="ghost" onClick={() => setForm({ id: t.id, name: t.name, company: t.company ?? "", position: t.position ?? "", project: t.project ?? "", quote: t.quote, published: t.published })}>
                  <Pencil className="h-3.5 w-3.5" />
                </AdButton>
                <AdButton variant="danger" onClick={() => remove(t.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </AdButton>
              </div>
            </div>
          </PanelCard>
        ))
      )}
    </div>
  );
}

/* ----------------------------------- faqs ----------------------------------- */

type FaqForm = { id?: string; question: string; answer: string; sort: number; published: boolean };

export function FaqsPanel() {
  const [items, setItems] = useState<Faq[] | null>(null);
  const [form, setForm] = useState<FaqForm | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const data = await api("faqs");
    setItems(data.items);
  }, []);
  useEffect(() => {
    load().catch(() => setItems([]));
  }, [load]);

  async function save() {
    if (!form) return;
    setBusy(true);
    try {
      if (form.id) await api("faqs", "PATCH", form);
      else await api("faqs", "POST", form);
      setForm(null);
      await load();
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    await api("faqs", "DELETE", { id });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-[0.8rem] text-mut">
          If no FAQs exist here, the site shows Webloom&apos;s built-in default answers. Any FAQs
          you add replace the defaults.
        </p>
        <AdButton onClick={() => setForm({ question: "", answer: "", sort: 0, published: true })}>
          <Plus className="h-4 w-4" /> Add
        </AdButton>
      </div>

      {form && (
        <PanelCard>
          <AdField label="Question *">
            <input className={adInput} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
          </AdField>
          <AdField label="Answer *" className="mt-4">
            <textarea className={adInput + " min-h-28"} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} />
          </AdField>
          <div className="mt-5 flex flex-wrap items-center gap-6">
            <AdField label="Sort order" className="w-28">
              <input
                type="number"
                className={adInput}
                value={form.sort}
                onChange={(e) => setForm({ ...form, sort: Number(e.target.value) || 0 })}
              />
            </AdField>
            <Toggle checked={form.published} onChange={(v) => setForm({ ...form, published: v })} label="Published" />
            <span className="ml-auto flex gap-3">
              <AdButton variant="ghost" onClick={() => setForm(null)}>Cancel</AdButton>
              <AdButton
                onClick={save}
                disabled={busy || form.question.trim().length === 0 || form.answer.trim().length === 0}
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
              </AdButton>
            </span>
          </div>
        </PanelCard>
      )}

      {!items ? (
        <p className="py-10 text-center text-sm text-mut">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="Default FAQs active" blurb="The site is showing its built-in FAQ set. Add custom FAQs here to take over." />
      ) : (
        items.map((f) => (
          <PanelCard key={f.id} className="rounded-2xl p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold tracking-tight">{f.question}</p>
                <p className="mt-1.5 line-clamp-2 text-sm text-mut">{f.answer}</p>
                <p className="mt-1.5 text-xs">
                  <span className={f.published ? "text-brand" : "text-amber-400"}>
                    {f.published ? "Published" : "Hidden"}
                  </span>
                  <span className="text-mut"> · sort {f.sort}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <AdButton variant="ghost" onClick={() => setForm({ id: f.id, question: f.question, answer: f.answer, sort: f.sort, published: f.published })}>
                  <Pencil className="h-3.5 w-3.5" />
                </AdButton>
                <AdButton variant="danger" onClick={() => remove(f.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </AdButton>
              </div>
            </div>
          </PanelCard>
        ))
      )}
    </div>
  );
}

/* --------------------------------- settings --------------------------------- */

type SettingsState = { contactEmail: string; socials: { label: string; href: string }[] };

export function SettingsPanel() {
  const [state, setState] = useState<SettingsState | null>(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setState(d.settings))
      .catch(() => setState({ contactEmail: "", socials: [] }));
  }, []);

  async function save() {
    if (!state) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (!state) return <p className="py-10 text-center text-sm text-mut">Loading…</p>;

  return (
    <PanelCard className="max-w-2xl">
      <h3 className="text-lg font-semibold tracking-tight">Site settings</h3>
      <p className="mt-1.5 text-[0.8rem] text-mut">
        These values update the live site — contact email and social links shown in the footer and
        contact page.
      </p>

      <AdField label="Contact email" className="mt-6">
        <input
          className={adInput}
          value={state.contactEmail}
          onChange={(e) => setState({ ...state, contactEmail: e.target.value })}
        />
      </AdField>

      <div className="mt-6">
        <p className="mb-2 text-[0.72rem] font-medium text-mut">
          Social links (only listed links appear on the site — add real, owned profiles only)
        </p>
        <div className="space-y-2">
          {state.socials.map((s, i) => (
            <div key={i} className="flex gap-2">
              <select
                className={adInput + " w-32"}
                value={s.label}
                onChange={(e) =>
                  setState({
                    ...state,
                    socials: state.socials.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                  })
                }
              >
                {["GitHub", "Instagram", "Facebook", "LinkedIn", "X"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
              <input
                className={adInput}
                placeholder="https://…"
                value={s.href}
                onChange={(e) =>
                  setState({
                    ...state,
                    socials: state.socials.map((x, j) => (j === i ? { ...x, href: e.target.value } : x)),
                  })
                }
              />
              <AdButton
                variant="danger"
                onClick={() => setState({ ...state, socials: state.socials.filter((_, j) => j !== i) })}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </AdButton>
            </div>
          ))}
        </div>
        <AdButton
          variant="ghost"
          className="mt-3"
          onClick={() => setState({ ...state, socials: [...state.socials, { label: "GitHub", href: "" }] })}
        >
          <Plus className="h-3.5 w-3.5" /> Add link
        </AdButton>
      </div>

      <div className="mt-7 flex items-center gap-3">
        <AdButton onClick={save} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save settings
        </AdButton>
        {saved && <span className="text-xs text-brand">Saved — live on the site now.</span>}
        {error && <span className="text-xs text-red-400">{error}</span>}
      </div>
    </PanelCard>
  );
}

/* ----------------------------------- logs ----------------------------------- */

export function LogsPanel({ logs }: { logs: Log[] }) {
  if (logs.length === 0) {
    return <EmptyState title="No activity yet" blurb="Form submissions, logins and security events will be listed here as they happen." />;
  }
  return (
    <div className="space-y-2.5">
      {logs.map((l) => (
        <div key={l.id} className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-card px-4 py-3">
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[0.62rem] uppercase ${levelColor(l.level)}`}>
            {l.level}
          </span>
          <p className="min-w-0 flex-1 truncate text-sm">{l.message}</p>
          <span className="font-mono text-[0.66rem] text-mut">
            {new Date(l.createdAt).toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
