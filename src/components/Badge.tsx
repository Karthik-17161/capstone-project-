import type { ReactNode } from "react";

type Tone = "primary" | "accent" | "orange" | "leaf" | "muted" | "danger";

const tones: Record<Tone, string> = {
  primary: "bg-primary/15 text-primary-foreground border-primary/30",
  accent: "bg-accent/15 text-accent-foreground border-accent/30",
  orange: "bg-orange/15 text-orange border-orange/30",
  leaf: "bg-leaf/15 text-leaf border-leaf/30",
  muted: "bg-white/5 text-muted-foreground border-glass-border",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
};

export function Badge({
  tone = "muted",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export function severityTone(s: string): Tone {
  const k = s.toLowerCase();
  if (k === "low") return "leaf";
  if (k === "moderate") return "accent";
  if (k === "high") return "orange";
  if (k === "very high" || k === "critical") return "danger";
  return "muted";
}

export function riskTone(v: number): Tone {
  if (v < 35) return "leaf";
  if (v < 60) return "accent";
  if (v < 80) return "orange";
  return "danger";
}
