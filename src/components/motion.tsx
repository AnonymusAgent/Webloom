import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Static wrapper: content is visible in server HTML and needs no hydration. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return <div className={className}>{children}</div>;
}

export function FadeStagger({
  children,
  className,
}: {
  children: ReactNode[];
  className?: string;
  gap?: number;
}) {
  return <div className={className}>{children.map((child, index) => <Reveal key={index}>{child}</Reveal>)}</div>;
}
