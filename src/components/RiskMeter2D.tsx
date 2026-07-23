import { useMemo } from "react";
import { CountUp } from "./CountUp";

function color(v: number) {
  if (v < 35) return "#7CB342";
  if (v < 60) return "#FFD54F";
  if (v < 80) return "#FF9800";
  return "#e53935";
}

export function RiskMeter2D({ value, size = 200 }: { value: number; size?: number }) {
  const r = 80;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const dash = useMemo(() => (clamped / 100) * c * 0.75, [clamped, c]);
  const stroke = color(clamped);
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-[135deg]">
        <defs>
          <linearGradient id="riskgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.7" />
            <stop offset="100%" stopColor={stroke} />
          </linearGradient>
          <filter id="riskglow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="14"
          strokeDasharray={`${c * 0.75} ${c}`}
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="url(#riskgrad)"
          strokeWidth="14"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          filter="url(#riskglow)"
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.2,0.8,0.2,1)" }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-display font-semibold" style={{ color: stroke }}>
            <CountUp to={clamped} />%
          </div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
            Risk score
          </div>
        </div>
      </div>
    </div>
  );
}
