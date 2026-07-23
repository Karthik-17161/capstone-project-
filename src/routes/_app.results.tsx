import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FiMaximize2,
  FiDownload,
  FiZoomIn,
  FiClock,
  FiTarget,
  FiActivity,
  FiCalendar,
  FiDroplet,
  FiThermometer,
  FiWind,
  FiShield,
  FiAlertTriangle,
} from "react-icons/fi";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { Badge, severityTone, riskTone } from "@/components/Badge";
import { RiskMeter2D } from "@/components/RiskMeter2D";
import { ThreeClient, RiskGauge3D } from "@/three";
import { detection, weather, crop, recommendation } from "@/data/app";

export const Route = createFileRoute("/_app/results")({
  head: () => ({
    meta: [
      { title: "Detection Results · Agri Lens" },
      {
        name: "description",
        content:
          "AI-powered pest detection results with risk scoring, weather context, and treatment recommendations.",
      },
      { property: "og:title", content: "Detection Results · Agri Lens" },
      {
        property: "og:description",
        content: "AI-powered pest detection results with risk and treatment recommendations.",
      },
    ],
  }),
  component: Results,
});

const IMG = "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1400&q=80";

function Results() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-1">
            Detection · {detection.detectedAt}
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-gradient">
            {detection.pest} identified with {detection.confidence}% confidence
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            <em>{detection.scientific}</em> · {crop.name} · {crop.stage} stage · Day {crop.planted}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/detection" className="rounded-xl glass px-4 py-2 text-sm hover:bg-white/10">
            New scan
          </Link>
          <Link
            to="/recommendations"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90"
          >
            Treatment plan
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        {/* LEFT: image with boxes */}
        <GlassCard className="p-3">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            <img
              src={IMG}
              alt="Detected crop"
              className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Bounding boxes */}
            {[
              { l: 22, t: 30, w: 18, h: 14, c: 97 },
              { l: 55, t: 20, w: 14, h: 12, c: 94 },
              { l: 40, t: 55, w: 20, h: 16, c: 91 },
              { l: 70, t: 60, w: 12, h: 10, c: 88 },
            ].map((b, i) => (
              <div
                key={i}
                className="absolute rounded-md border-2 border-accent glow-accent"
                style={{ left: `${b.l}%`, top: `${b.t}%`, width: `${b.w}%`, height: `${b.h}%` }}
              >
                <span className="absolute -top-6 left-0 text-[10px] font-mono bg-accent text-accent-foreground rounded px-1.5 py-0.5">
                  whitefly · {b.c}%
                </span>
              </div>
            ))}
            <div className="absolute top-3 right-3 flex gap-2">
              <button
                className="h-9 w-9 grid place-items-center rounded-lg glass hover:bg-white/20"
                aria-label="Zoom"
              >
                <FiZoomIn className="h-4 w-4" />
              </button>
              <button
                className="h-9 w-9 grid place-items-center rounded-lg glass hover:bg-white/20"
                aria-label="Fullscreen"
              >
                <FiMaximize2 className="h-4 w-4" />
              </button>
              <button
                className="h-9 w-9 grid place-items-center rounded-lg glass hover:bg-white/20"
                aria-label="Download"
              >
                <FiDownload className="h-4 w-4" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge tone="accent">
                <FiTarget className="h-3 w-3" /> {detection.boxes} boxes
              </Badge>
              <Badge tone={severityTone(detection.severity)}>{detection.severity} severity</Badge>
              <Badge tone="muted">{detection.lifeStage}</Badge>
            </div>
          </div>
        </GlassCard>

        {/* RIGHT: report */}
        <div className="space-y-6">
          <GlassCard glow={riskTone(detection.riskScore) === "danger" ? "orange" : "accent"}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  Risk level
                </div>
                <div className="font-display text-2xl font-semibold mt-1">
                  {detection.riskLevel}
                </div>
              </div>
              <Badge tone={riskTone(detection.riskScore)}>{detection.riskScore}% risk</Badge>
            </div>
            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full transition-[width] duration-1000"
                style={{
                  width: `${detection.riskScore}%`,
                  background: `linear-gradient(90deg, #7CB342 0%, #FFD54F 50%, #FF9800 75%, #e53935 100%)`,
                }}
              />
            </div>
            <div className="mt-1 flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat icon={<FiTarget />} label="Pest" value={detection.pest} />
            <MiniStat icon={<FiActivity />} label="Confidence" value={`${detection.confidence}%`} />
            <MiniStat icon={<FiAlertTriangle />} label="Severity" value={detection.severity} />
            <MiniStat icon={<FiClock />} label="Life stage" value={detection.lifeStage} />
          </div>

          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-semibold">Environmental context</h3>
              <Badge tone="accent">Live</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <MiniStat icon={<FiThermometer />} label="Temp" value={`${weather.now.temp}°C`} />
              <MiniStat icon={<FiDroplet />} label="Humidity" value={`${weather.now.humidity}%`} />
              <MiniStat icon={<FiWind />} label="Wind" value={`${weather.now.wind} km/h`} />
              <MiniStat
                icon={<FiCalendar />}
                label="Day"
                value={`${crop.planted} since planting`}
              />
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Risk breakdown */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <GlassCard>
          <div className="flex flex-col items-center">
            <SectionHeader eyebrow="Risk Score" title="Composite crop risk" />
            <div className="relative w-full max-w-[280px] aspect-square">
              <ThreeClient fallback={<RiskMeter2D value={detection.riskScore} size={260} />}>
                <RiskGauge3D value={detection.riskScore} />
              </ThreeClient>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display text-5xl font-semibold text-orange">
                    {detection.riskScore}%
                  </div>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-1">
                    {detection.riskLevel} risk
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-display text-lg font-semibold mb-4">Contributing factors</h3>
          <div className="space-y-4">
            {detection.factors.map((f) => (
              <div key={f.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground">{f.label}</span>
                  <span className="font-medium">{f.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-1000"
                    style={{
                      width: `${f.value}%`,
                      background: `linear-gradient(90deg, var(--primary), var(--accent))`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recommendation preview */}
      <GlassCard glow="primary">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-accent">
              Recommended action
            </div>
            <h3 className="font-display text-2xl font-semibold mt-1">
              {recommendation.name} · {recommendation.dosage}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-2xl">{recommendation.reason}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone="orange">
              <FiShield className="h-3 w-3" /> {recommendation.type}
            </Badge>
            <Badge tone="accent">
              <FiClock className="h-3 w-3" /> Spray within {recommendation.sprayWithin}
            </Badge>
          </div>
        </div>
        <Link
          to="/recommendations"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90"
        >
          See full plan & alternatives
        </Link>
      </GlassCard>
    </div>
  );
}

function MiniStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-white/5 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-display text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}
