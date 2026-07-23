import { createFileRoute, Link } from "@tanstack/react-router";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { CountUp } from "@/components/CountUp";
import { Badge } from "@/components/Badge";
import { DetectionsLine, PestPie } from "@/components/Charts";
import { kpis, weeklyDetections, pestDistribution, alerts, weather } from "@/data/app";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiArrowRight,
  FiCloud,
  FiDroplet,
  FiWind,
  FiThermometer,
} from "react-icons/fi";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Agri Lens" },
      {
        name: "description",
        content: "Real-time overview of detections, risk, weather and field health.",
      },
      { property: "og:title", content: "Dashboard · Agri Lens" },
      {
        property: "og:description",
        content: "Real-time overview of detections, risk, weather and field health.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-accent mb-1">Overview</div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-gradient">
            Good morning, Karthikeya 🌱
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here's what's happening across your 6 fields today.
          </p>
        </div>
        <Link
          to="/detection"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90"
        >
          New Detection <FiArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => {
          const isNum = typeof k.value === "number";
          const positive = k.delta.startsWith("+");
          const glow =
            k.tone === "primary"
              ? "primary"
              : k.tone === "accent"
                ? "accent"
                : k.tone === "orange"
                  ? "orange"
                  : "accent";
          return (
            <GlassCard
              key={k.label}
              glow={glow as "primary" | "accent" | "orange"}
              className="hover-lift"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">
                {k.label}
              </div>
              <div className="mt-2 font-display text-3xl font-semibold">
                {isNum ? <CountUp to={k.value as number} /> : k.value}
              </div>
              <div
                className={`mt-2 inline-flex items-center gap-1 text-xs ${positive ? "text-accent" : "text-orange"}`}
              >
                {positive ? (
                  <FiTrendingUp className="h-3 w-3" />
                ) : (
                  <FiTrendingDown className="h-3 w-3" />
                )}
                {k.delta} vs last week
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Weekly detections</h3>
              <p className="text-xs text-muted-foreground">Rolling 7-day window</p>
            </div>
            <Badge tone="accent">↑ 14% WoW</Badge>
          </div>
          <div className="h-64">
            <DetectionsLine labels={weeklyDetections.labels} values={weeklyDetections.values} />
          </div>
        </GlassCard>
        <GlassCard>
          <h3 className="font-display text-lg font-semibold">Pest distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Top 5 pests this month</p>
          <div className="h-64">
            <PestPie labels={pestDistribution.labels} values={pestDistribution.values} />
          </div>
        </GlassCard>
      </div>

      {/* Alerts + Weather */}
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Recent alerts</h3>
            <Link to="/history" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-white/5">
            {alerts.map((a, i) => (
              <li key={i} className="flex items-center gap-4 py-3">
                <div
                  className={`h-2 w-2 rounded-full ${a.tone === "orange" ? "bg-orange" : a.tone === "accent" ? "bg-accent" : "bg-primary"} animate-pulse`}
                />
                <div className="flex-1 text-sm">{a.text}</div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </li>
            ))}
          </ul>
        </GlassCard>
        <GlassCard glow="accent">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold">Weather now</h3>
            <Link to="/weather" className="text-xs text-accent hover:underline">
              Forecast
            </Link>
          </div>
          <div className="text-xs text-muted-foreground">{weather.now.condition} · Nashik</div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <WMetric icon={<FiThermometer />} label="Temp" value={`${weather.now.temp}°C`} />
            <WMetric icon={<FiDroplet />} label="Humidity" value={`${weather.now.humidity}%`} />
            <WMetric icon={<FiCloud />} label="Rain" value={`${weather.now.rain} mm`} />
            <WMetric icon={<FiWind />} label="Wind" value={`${weather.now.wind} km/h`} />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function WMetric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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
