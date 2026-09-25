import { LogoMark } from "@/components/ui";

export default function SoftwareLoader({ compact = false }: { compact?: boolean }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`software-loader ${compact ? "software-loader--compact" : "min-h-svh"}`}
    >
      <div className="software-loader__ambient" aria-hidden="true" />
      <div className="software-loader__visual" aria-hidden="true">
        <span className="software-loader__orbit software-loader__orbit--one">
          <i />
        </span>
        <span className="software-loader__orbit software-loader__orbit--two">
          <i />
        </span>
        <span className="software-loader__orbit software-loader__orbit--three">
          <i />
        </span>
        <span className="software-loader__core">
          <LogoMark className="h-9 w-9" />
        </span>
        <span className="software-loader__panel software-loader__panel--left">
          <i /><i /><i />
        </span>
        <span className="software-loader__panel software-loader__panel--right">
          <i /><i /><i />
        </span>
      </div>

      <div className="relative z-10 mt-8 text-center">
        <p className="font-semibold tracking-tight">WEBLOOM</p>
        <p className="mt-2 font-mono text-[0.62rem] tracking-[0.22em] text-mut uppercase">
          Assembling your experience
        </p>
        <span className="software-loader__progress" aria-hidden="true">
          <i />
        </span>
      </div>
      <span className="sr-only">Loading Webloom</span>
    </div>
  );
}
