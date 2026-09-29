"use client";

import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ChevronDown, Loader2, RotateCcw } from "lucide-react";
import { BUDGETS, PROJECT_TYPES, TIMELINES } from "@/lib/site";
import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion";

export type ContactInitial = {
  projectType?: string;
  message?: string;
};

type Errors = Partial<Record<string, string>>;

const inputCls =
  "w-full rounded-2xl border border-line bg-elev/60 px-4 py-3 text-sm outline-none transition-all duration-300 placeholder:text-mut/60 focus:border-brand/60 focus:bg-elev";

function Field({
  label,
  error,
  errorId,
  required,
  children,
}: {
  label: string;
  error?: string;
  errorId?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-[0.8rem] font-medium">
        <span>
          {label}
          {required && <span className="ml-1 text-brand">*</span>}
        </span>
        {error && <span id={errorId} className="text-[0.7rem] text-red-400">{error}</span>}
      </span>
      {children}
    </label>
  );
}

export default function ContactForm({ initial }: { initial?: ContactInitial }) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: initial?.projectType ?? "",
    budget: "",
    timeline: "",
    message: initial?.message ?? "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const started = useRef(false);

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const onFirstInteract = () => {
    if (started.current) return;
    started.current = true;
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "event", name: "form_start", path: "/contact" }),
      keepalive: true,
    }).catch(() => {});
  };

  function validate(): boolean {
    const e: Errors = {};
    if (form.name.trim().length < 2) e.name = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Valid email required";
    if (!form.projectType) e.projectType = "Select one";
    if (form.message.trim().length < 10) e.message = "Tell us a little more (10+ chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status === "sending") return;
    if (!validate()) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="card-surface flex flex-col items-center p-10 text-center sm:p-14"
        role="status"
      >
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
          className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/12 text-brand"
        >
          <CheckCircle2 className="h-7 w-7" />
        </motion.span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">Brief received.</h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-mut">
          Thank you, {form.name.split(" ")[0]}. We&apos;ll read everything carefully and get back
          to you — usually within one business day.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setForm({ name: "", company: "", email: "", phone: "", projectType: "", budget: "", timeline: "", message: "" });
            started.current = false;
          }}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-mut transition-all hover:border-line2 hover:text-ink"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Send another brief
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      onFocus={onFirstInteract}
      className="card-surface space-y-5 p-7 sm:p-9"
      aria-label="Project brief form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name} errorId="name-error">
          <input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className={cn(inputCls, errors.name && "border-red-400/60")}
            placeholder="Your name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            maxLength={120}
          />
        </Field>
        <Field label="Company" error={errors.company}>
          <input
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            className={inputCls}
            placeholder="Company (optional)"
            autoComplete="organization"
            maxLength={120}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" required error={errors.email} errorId="email-error">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={cn(inputCls, errors.email && "border-red-400/60")}
            placeholder="you@company.com"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            maxLength={160}
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputCls}
            placeholder="Optional"
            autoComplete="tel"
            maxLength={40}
          />
        </Field>
      </div>

      <div>
        <span className="mb-2 flex items-baseline justify-between text-[0.8rem] font-medium" id="wl-pt-label">
          <span>
            Project type
            <span className="ml-1 text-brand">*</span>
          </span>
          {errors.projectType && <span id="project-type-error" className="text-[0.7rem] text-red-400">{errors.projectType}</span>}
        </span>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="wl-pt-label"
          aria-describedby={errors.projectType ? "project-type-error" : undefined}
        >
          {PROJECT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => set("projectType", t)}
              aria-pressed={form.projectType === t}
              className={cn(
                "rounded-full border px-3.5 py-2 text-[0.78rem] transition-all duration-300",
                form.projectType === t
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-line text-mut hover:border-line2 hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Budget">
          <div className="relative">
            <select
              value={form.budget}
              onChange={(e) => set("budget", e.target.value)}
              className={cn(inputCls, "appearance-none pr-10", form.budget === "" ? "text-mut" : "")}
            >
              <option value="">Select budget</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
          </div>
        </Field>
        <Field label="Timeline">
          <div className="relative">
            <select
              value={form.timeline}
              onChange={(e) => set("timeline", e.target.value)}
              className={cn(inputCls, "appearance-none pr-10", form.timeline === "" ? "text-mut" : "")}
            >
              <option value="">Select timeline</option>
              {TIMELINES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mut" />
          </div>
        </Field>
      </div>

      <Field label="Project description" required error={errors.message} errorId="message-error">
        <textarea
          required
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={5}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(inputCls, "resize-none", errors.message && "border-red-400/60")}
          placeholder="What are you building? Who is it for? What should it do?"
          maxLength={4000}
        />
      </Field>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          >
            {serverError || "Couldn't send your brief. Please try again."}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "sending"}
        data-track="form_submit"
        className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 text-sm font-semibold text-brandink transition-all duration-300 hover:shadow-[0_8px_30px_-6px_var(--brand)] active:scale-[0.99] disabled:opacity-70"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Send Project Brief
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
      <p className="text-center text-[0.72rem] leading-relaxed text-mut">
        Your information stays private and is never shared. See our{" "}
        <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
