import type { HTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({
  children,
  className = "",
  glow,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  glow?: "primary" | "accent" | "orange";
}) {
  const glowClass =
    glow === "primary"
      ? "glow-primary"
      : glow === "accent"
        ? "glow-accent"
        : glow === "orange"
          ? "glow-orange"
          : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      className={`glass rounded-2xl p-5 ${glowClass} ${className}`}
      {...(rest as object)}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-2">{eyebrow}</div>
      )}
      <h2 className="text-2xl md:text-3xl font-semibold text-gradient">{title}</h2>
      {sub && <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{sub}</p>}
    </div>
  );
}
