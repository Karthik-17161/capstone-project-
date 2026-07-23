import { createFileRoute } from "@tanstack/react-router";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { recommendation, alternatives, crop } from "@/data/app";
import { FiClock, FiShield, FiAlertTriangle, FiCalendar, FiCheck, FiX } from "react-icons/fi";
import { GiPlantSeed, GiBugNet, GiChemicalDrop, GiHand } from "react-icons/gi";
import { Badge } from "@/components/Badge";

export const Route = createFileRoute("/_app/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations · Agri Lens" },
      {
        name: "description",
        content:
          "AI-recommended treatment plans — organic, biological and chemical — with dosage, timing and safety guidance.",
      },
      { property: "og:title", content: "Recommendations · Agri Lens" },
      {
        property: "og:description",
        content: "Treatment plans with dosage, timing and safety guidance.",
      },
    ],
  }),
  component: Recommendations,
});

const iconMap = { leaf: GiPlantSeed, bug: GiBugNet, shield: GiChemicalDrop, hand: GiHand } as const;

function Recommendations() {
  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Treatment"
        title="Your action plan"
        sub={`Tailored to ${crop.name} · ${crop.stage} stage · Day ${crop.planted}`}
      />

      <GlassCard glow="primary" className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-primary/30 blur-[100px]" />
        <div className="relative grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge tone="orange">
                <FiShield className="h-3 w-3" /> {recommendation.type}
              </Badge>
              <Badge tone="accent">
                <FiClock className="h-3 w-3" /> Spray within {recommendation.sprayWithin}
              </Badge>
              <Badge tone="muted">PHI {recommendation.phi}</Badge>
            </div>
            <h3 className="mt-4 font-display text-3xl font-semibold">{recommendation.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">{recommendation.reason}</p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox label="Dosage" value={recommendation.dosage} />
              <StatBox label="Spray in" value={recommendation.sprayWithin} />
              <StatBox label="PHI" value={recommendation.phi} />
              <StatBox label="Re-inspect" value={recommendation.nextInspection} />
            </div>
          </div>
          <div>
            <h4 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
              Safety
            </h4>
            <ul className="mt-3 space-y-2">
              {recommendation.safety.map((s, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <FiAlertTriangle className="h-4 w-4 text-orange mt-0.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm flex items-start gap-2.5">
              <FiCalendar className="h-4 w-4 text-accent mt-0.5" />
              <span>
                Next inspection in <strong>{recommendation.nextInspection}</strong> — auto-reminder
                set.
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <SectionHeader
        title="Alternative treatments"
        sub="Compare organic, biological and chemical options side by side."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {alternatives.map((a) => {
          const Icon = iconMap[a.icon as keyof typeof iconMap] ?? GiPlantSeed;
          const glow =
            a.type === "Organic"
              ? "accent"
              : a.type === "Chemical"
                ? "orange"
                : a.type === "Biological"
                  ? "primary"
                  : "primary";
          return (
            <GlassCard
              key={a.name}
              glow={glow as "primary" | "accent" | "orange"}
              className="hover-lift"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-xl bg-white/5 border border-glass-border text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-display text-lg font-semibold leading-tight">{a.name}</div>
                  <Badge
                    tone={
                      a.type === "Organic" ? "leaf" : a.type === "Chemical" ? "orange" : "accent"
                    }
                  >
                    {a.type}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-accent mb-1.5">
                    Advantages
                  </div>
                  <ul className="space-y-1">
                    {a.pros.map((p) => (
                      <li key={p} className="flex gap-2 text-sm">
                        <FiCheck className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-widest text-orange mb-1.5 mt-3">
                    Disadvantages
                  </div>
                  <ul className="space-y-1">
                    {a.cons.map((p) => (
                      <li key={p} className="flex gap-2 text-sm">
                        <FiX className="h-4 w-4 text-orange mt-0.5 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 text-xs text-muted-foreground">
                Suitable stage · <span className="text-foreground">{a.stage}</span>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-glass-border bg-white/5 px-3 py-3">
      <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold mt-0.5">{value}</div>
    </div>
  );
}
