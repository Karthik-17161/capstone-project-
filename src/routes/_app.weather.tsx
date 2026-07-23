import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { FiThermometer, FiDroplet, FiCloudRain, FiWind, FiSun, FiCloud } from "react-icons/fi";
import { weather } from "@/data/app";
import { CountUp } from "@/components/CountUp";

export const Route = createFileRoute("/_app/weather")({
  head: () => ({
    meta: [
      { title: "Weather · Agri Lens" },
      {
        name: "description",
        content:
          "Field-level weather intelligence and 5-day forecast fused into pest risk scoring.",
      },
      { property: "og:title", content: "Weather · Agri Lens" },
      { property: "og:description", content: "Field-level weather and 5-day forecast." },
    ],
  }),
  component: Weather,
});

function Weather() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Weather"
        title="Field-level atmosphere"
        sub="Live conditions and 5-day outlook, tuned for spray planning."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <BigWx
          icon={<FiThermometer />}
          label="Temperature"
          value={weather.now.temp}
          suffix="°C"
          tone="orange"
        />
        <BigWx
          icon={<FiDroplet />}
          label="Humidity"
          value={weather.now.humidity}
          suffix="%"
          tone="accent"
        />
        <BigWx
          icon={<FiCloudRain />}
          label="Rainfall"
          value={weather.now.rain}
          suffix=" mm"
          tone="primary"
        />
        <BigWx
          icon={<FiWind />}
          label="Wind speed"
          value={weather.now.wind}
          suffix=" km/h"
          tone="accent"
        />
      </div>

      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-lg font-semibold">5-day forecast</h3>
          <span className="text-xs text-muted-foreground">Updated 12 min ago</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {weather.forecast.map((d, i) => (
            <div
              key={i}
              className="rounded-2xl border border-glass-border bg-white/5 p-4 text-center hover-lift"
            >
              <div className="text-xs uppercase tracking-widest text-muted-foreground">{d.day}</div>
              <div className="my-3 grid place-items-center h-14">
                {d.cond === "sun" && <FiSun className="h-10 w-10 text-orange animate-float" />}
                {d.cond === "cloud" && (
                  <FiCloud className="h-10 w-10 text-muted-foreground animate-float" />
                )}
                {d.cond === "rain" && (
                  <FiCloudRain className="h-10 w-10 text-accent animate-float" />
                )}
              </div>
              <div className="font-display text-2xl font-semibold">{d.temp}°</div>
              <div className="text-xs text-muted-foreground mt-1">{d.rain}% rain</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function BigWx({
  icon,
  label,
  value,
  suffix,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix: string;
  tone: "primary" | "accent" | "orange";
}) {
  const glow =
    tone === "primary" ? "glow-primary" : tone === "accent" ? "glow-accent" : "glow-orange";
  return (
    <GlassCard className={`hover-lift ${glow}`}>
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="font-display text-4xl font-semibold mt-3">
        <CountUp to={value} />
        {suffix}
      </div>
    </GlassCard>
  );
}
