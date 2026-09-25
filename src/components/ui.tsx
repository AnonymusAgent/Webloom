import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion";

/* ---------------------------------- logo ----------------------------------- */

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <g stroke="var(--brand)" strokeWidth="2.4" strokeLinecap="round">
        <ellipse cx="16" cy="16" rx="13" ry="5.6" />
        <ellipse cx="16" cy="16" rx="13" ry="5.6" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="13" ry="5.6" transform="rotate(120 16 16)" />
      </g>
      <circle cx="16" cy="16" r="3.4" fill="var(--brand)" />
    </svg>
  );
}

export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link
      href={href}
      aria-label="Webloom — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="relative inline-flex">
        <LogoMark className="h-6 w-6 transition-transform duration-700 ease-out group-hover:rotate-[120deg]" />
      </span>
      <span className="text-[1.05rem] font-semibold tracking-tight">Webloom</span>
    </Link>
  );
}

/* --------------------------------- buttons ---------------------------------- */

type BtnProps = {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg" | "sm";
  className?: string;
  track?: string;
  arrow?: boolean;
  external?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  track,
  arrow = true,
  external,
  type = "button",
  onClick,
  disabled,
}: BtnProps) {
  const base = cn(
    "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-300 will-change-transform",
    size === "lg" && "px-7 py-3.5 text-[0.95rem]",
    size === "md" && "px-5.5 py-2.5 text-sm",
    size === "sm" && "px-4 py-2 text-[0.8rem]",
    variant === "primary" &&
      "bg-brand text-brandink hover:shadow-[0_8px_30px_-6px_var(--brand)] active:scale-[0.98]",
    variant === "secondary" &&
      "border border-line2 text-ink hover:border-brand hover:text-brand active:scale-[0.98]",
    variant === "ghost" && "text-mut hover:text-ink",
    disabled && "cursor-not-allowed opacity-60",
    className
  );

  const inner = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        {arrow &&
          (external ? (
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          ))}
      </span>
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover/btn:translate-x-full" />
      )}
    </>
  );

  const content = href ? (
    <Link
      href={href}
      data-track={track}
      className={base}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {inner}
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} data-track={track} className={base}>
      {inner}
    </button>
  );

  return variant === "primary" ? <Magnetic strength={0.2}>{content}</Magnetic> : content;
}

/* ------------------------------ section header ----------------------------- */

export function SectionHead({
  index,
  kicker,
  title,
  lead,
  align = "left",
  dark,
}: {
  index?: string;
  kicker: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      <p className="kicker mb-5 flex items-center gap-3" style={align === "center" ? { justifyContent: "center" } : undefined}>
        {index && <span className="text-mut">{index}</span>}
        <span className="inline-block h-px w-8 bg-brand/60" aria-hidden="true" />
        {kicker}
      </p>
      <h2 className="text-balance text-[clamp(1.9rem,4.2vw,3.1rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
        {title}
      </h2>
      {lead && <p className="mt-5 text-pretty text-base leading-relaxed text-mut md:text-lg">{lead}</p>}
    </div>
  );
}

/* ----------------------------------- chip ----------------------------------- */

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-[0.72rem] font-medium text-mut",
        className
      )}
    >
      {children}
    </span>
  );
}

/* ------------------------------ container ----------------------------------- */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>{children}</div>;
}
