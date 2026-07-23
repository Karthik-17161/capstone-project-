import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { user, crop } from "@/data/app";
import { FiEdit3, FiMapPin, FiGrid, FiGlobe, FiBell } from "react-icons/fi";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({
    meta: [
      { title: "Profile · Agri Lens" },
      {
        name: "description",
        content: "Manage your farmer profile, language, notifications and preferences.",
      },
      { property: "og:title", content: "Profile · Agri Lens" },
      { property: "og:description", content: "Manage your farmer profile and preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("agrilens-notification-prefs");
      return saved ? JSON.parse(saved) : { push: true, email: true, sms: false };
    } catch {
      return { push: true, email: true, sms: false };
    }
  });

  useEffect(() => {
    localStorage.setItem("agrilens-notification-prefs", JSON.stringify(prefs));
  }, [prefs]);

  const handlePreferenceChange = (key: keyof typeof prefs, value: boolean, label: string) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    toast.success(`${label} ${value ? "enabled" : "disabled"}`);
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Profile"
        title="Farmer settings"
        sub="Your identity, language and notification preferences."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <GlassCard glow="accent" className="text-center">
          <div className="mx-auto relative h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-accent grid place-items-center text-2xl font-bold text-primary-foreground">
            {user.avatar}
            <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl glass grid place-items-center hover:bg-white/20">
              <FiEdit3 className="h-3.5 w-3.5" />
            </button>
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold">{user.name}</h3>
          <div className="text-sm text-muted-foreground">{user.farm}</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <Chip icon={<FiMapPin />} label={user.location} />
            <Chip icon={<FiGrid />} label={`${user.fields} fields`} />
            <Chip icon={<FiGlobe />} label={user.language} />
          </div>
          <div className="mt-6 rounded-xl border border-glass-border bg-white/5 p-3 text-left text-xs">
            <div className="text-muted-foreground uppercase tracking-widest text-[10px]">
              Current crop
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-medium">
                {crop.name} · {crop.stage}
              </span>
              <span className="text-muted-foreground">Day {crop.planted}</span>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard>
            <h3 className="font-display text-lg font-semibold mb-4">Notifications</h3>
            <div className="space-y-3">
              <Toggle
                icon={<FiBell />}
                label="Push notifications"
                desc="High-risk alerts and spray reminders"
                checked={prefs.push}
                onChange={(v) => handlePreferenceChange("push", v, "Push notifications")}
              />
              <Toggle
                icon={<FiBell />}
                label="Email digest"
                desc="Weekly summary of activity and outcomes"
                checked={prefs.email}
                onChange={(v) => handlePreferenceChange("email", v, "Email digest")}
              />
              <Toggle
                icon={<FiBell />}
                label="SMS alerts"
                desc="Only for very-high risk events"
                checked={prefs.sms}
                onChange={(v) => handlePreferenceChange("sms", v, "SMS alerts")}
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-lg border border-glass-border bg-white/5 px-2 py-2 flex flex-col items-center gap-1">
      <span className="text-accent">{icon}</span>
      <span className="text-[10px] text-muted-foreground text-center leading-tight">{label}</span>
    </div>
  );
}

function Toggle({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl border border-glass-border bg-white/5 p-3 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div className="h-9 w-9 grid place-items-center rounded-lg bg-primary/20 text-accent border border-primary/30">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <div
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{ background: checked ? "var(--accent)" : "rgba(255,255,255,0.1)" }}
      >
        <div
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform shadow-md"
          style={{ transform: checked ? "translateX(20px)" : "translateX(2px)" }}
        />
      </div>
    </div>
  );
}
