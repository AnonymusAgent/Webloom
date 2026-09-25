"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const adInput =
  "w-full rounded-xl border border-line bg-elev/60 px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-mut/50 focus:border-brand/60";

export function AdField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-[0.72rem] font-medium text-mut">{label}</span>
      {children}
    </label>
  );
}

export function AdButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  type = "button",
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-[0.8rem] font-semibold transition-all disabled:opacity-50",
        variant === "primary" && "bg-brand text-brandink hover:shadow-[0_6px_20px_-6px_var(--brand)]",
        variant === "ghost" && "border border-line text-mut hover:border-line2 hover:text-ink",
        variant === "danger" && "border border-red-400/30 text-red-400 hover:bg-red-400/10",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2.5 text-[0.8rem] text-mut transition-colors hover:text-ink"
    >
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full border transition-colors",
          checked ? "border-brand bg-brand/20" : "border-line2 bg-card"
        )}
      >
        <span
          className={cn(
            "absolute h-3.5 w-3.5 rounded-full transition-all",
            checked ? "left-[18px] bg-brand" : "left-1 bg-mut"
          )}
        />
      </span>
      {label}
    </button>
  );
}

export function EmptyState({ title, blurb }: { title: string; blurb: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line2 px-6 py-14 text-center">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1.5 max-w-xs text-[0.8rem] leading-relaxed text-mut">{blurb}</p>
    </div>
  );
}

export function PanelCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-3xl border border-line bg-card p-5 sm:p-7", className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-card p-6">
      <p className="font-mono text-[0.62rem] tracking-[0.18em] text-mut uppercase">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      {sub && <p className="mt-1 text-[0.72rem] text-mut">{sub}</p>}
    </div>
  );
}

export function levelColor(level: string) {
  switch (level) {
    case "security":
      return "text-amber-400 border-amber-400/30 bg-amber-400/10";
    case "error":
      return "text-red-400 border-red-400/30 bg-red-400/10";
    case "warn":
      return "text-orange-400 border-orange-400/30 bg-orange-400/10";
    default:
      return "text-brand border-brand/30 bg-brand/10";
  }
}
