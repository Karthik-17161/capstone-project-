import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiCamera,
  FiZap,
  FiShield,
  FiCloudRain,
  FiActivity,
  FiTrendingUp,
} from "react-icons/fi";
import { ThreeClient, EarthHero, FarmScene } from "@/three";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { CountUp } from "@/components/CountUp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agri Lens — AI Powered Smart Pest Detection" },
      {
        name: "description",
        content:
          "Protect crops with computer vision, weather intelligence and machine learning. An immersive AI-powered agricultural decision support platform.",
      },
      { property: "og:title", content: "Agri Lens — AI Powered Smart Pest Detection" },
      {
        property: "og:description",
        content: "Computer vision + weather intelligence + ML for modern farms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopBar />
      <Hero />
      <TrustStrip />
      <HeroImage />
      <FarmSection />
      <Features />
      <MetricsStrip />
      <CTA />
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between rounded-2xl glass px-4 py-2.5 md:px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <span className="text-sm font-bold text-primary-foreground">A</span>
            <span className="absolute -inset-0.5 rounded-lg blur-md bg-accent/40 -z-10" />
          </div>
          <span className="font-display font-semibold">Agri Lens</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#farm" className="hover:text-foreground transition-colors">
            Platform
          </a>
          <a href="#metrics" className="hover:text-foreground transition-colors">
            Results
          </a>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-2"
          >
            Sign in
          </Link>
          <Link
            to="/detection"
            className="group inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90 transition-all"
          >
            Try Detection{" "}
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-24">
      <div className="absolute inset-0">
        <ThreeClient
          fallback={
            <div className="absolute inset-0 bg-gradient-to-b from-primary/15 to-background" />
          }
        >
          <EarthHero />
        </ThreeClient>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          Live · 12,842 fields monitored this week
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight text-gradient"
        >
          AI Powered Smart
          <br />
          Pest Detection
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-muted-foreground"
        >
          Protect crops with computer vision, weather intelligence and machine learning. Field-ready
          decisions in seconds — not seasons.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/detection"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90 transition-all"
          >
            <FiCamera className="h-4 w-4" /> Try Detection
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Learn More
          </a>
        </motion.div>

        {/* Floating stat cards */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden lg:block">
          <FloatingStat
            className="left-[6%] top-[-60px]"
            delay={0.6}
            label="Detection accuracy"
            value="97.3%"
            tone="accent"
          />
          <FloatingStat
            className="right-[6%] top-[-10px]"
            delay={0.8}
            label="Risk score"
            value="86%"
            tone="orange"
          />
          <FloatingStat
            className="left-[14%] top-[100px]"
            delay={1.0}
            label="Response time"
            value="< 2s"
            tone="primary"
          />
        </div>
      </div>
    </section>
  );
}

function FloatingStat({
  label,
  value,
  tone,
  className = "",
  delay = 0,
}: {
  label: string;
  value: string;
  tone: "primary" | "accent" | "orange";
  className?: string;
  delay?: number;
}) {
  const glow =
    tone === "primary" ? "glow-primary" : tone === "accent" ? "glow-accent" : "glow-orange";
  const dot = tone === "primary" ? "bg-primary" : tone === "accent" ? "bg-accent" : "bg-orange";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.7 }}
      className={`absolute pointer-events-auto glass ${glow} rounded-2xl px-4 py-3 min-w-[180px] animate-float ${className}`}
    >
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} /> {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </motion.div>
  );
}

function TrustStrip() {
  const items = [
    "ICAR Verified",
    "USDA Compatible",
    "ISO 27001",
    "GDPR",
    "60 FPS Realtime",
    "40+ Crop Models",
  ];
  return (
    <section className="relative z-10 -mt-10 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="glass rounded-2xl px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-widest text-muted-foreground">
          {items.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroImage() {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden border border-glass-border group"
        >
          {/* Image */}
          <div className="relative aspect-[16/7] md:aspect-[16/6]">
            <img
              src="/nature-robot-hands.png"
              alt="Nature hand meets robot hand — the fusion of agriculture and AI technology"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-accent/20" />
          </div>

          {/* Glassmorphic caption overlay */}
          <div className="absolute bottom-0 inset-x-0 p-6 md:p-10">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-muted-foreground mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Nature × Intelligence
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-semibold text-gradient max-w-2xl">
              Where nature meets artificial intelligence
            </h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-xl">
              Bridging the gap between organic farming wisdom and cutting-edge AI — protecting crops
              with the precision of technology and the gentleness of nature.
            </p>
          </div>

          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-accent/10 via-transparent to-primary/10" />
        </motion.div>
      </div>
    </section>
  );
}

function FarmSection() {
  return (
    <section id="farm" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Immersive Platform"
          title="A living, breathing digital farm"
          sub="Every field, every leaf, every alert — visualized in real time. Fly through your operation, drill into pest hotspots, and act before damage spreads."
        />
        <div
          className="relative rounded-3xl overflow-hidden border border-glass-border"
          style={{ height: 520 }}
        >
          <ThreeClient
            fallback={
              <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-background" />
            }
          >
            <FarmScene />
          </ThreeClient>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-3 pointer-events-none">
            <FarmChip icon={<FiActivity />} label="Field 3 · 12 alerts" tone="orange" />
            <FarmChip icon={<FiCloudRain />} label="Rain in 36h" tone="accent" />
            <FarmChip icon={<FiShield />} label="Auto-treatment queued" tone="primary" />
          </div>
        </div>
      </div>
    </section>
  );
}

function FarmChip({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "primary" | "accent" | "orange";
}) {
  const glow =
    tone === "primary" ? "glow-primary" : tone === "accent" ? "glow-accent" : "glow-orange";
  return (
    <div className={`glass ${glow} rounded-xl px-3 py-2 text-xs flex items-center gap-2`}>
      <span className="text-accent">{icon}</span>
      {label}
    </div>
  );
}

function Features() {
  const items = [
    {
      icon: FiCamera,
      title: "Computer Vision",
      body: "Identify 40+ pests with bounding-box precision from a single photo — 97%+ accuracy in the field.",
    },
    {
      icon: FiCloudRain,
      title: "Weather Intelligence",
      body: "Live temperature, humidity, wind and rain forecasts fused into risk scoring for every field.",
    },
    {
      icon: FiZap,
      title: "Instant Recommendations",
      body: "Get dosage, timing, PHI and safety guidance the moment a pest is detected.",
    },
    {
      icon: FiShield,
      title: "Organic & Chemical",
      body: "Compare treatments across neem oil, biocontrols and precision chemistry — with full trade-offs.",
    },
    {
      icon: FiActivity,
      title: "Field History",
      body: "Every scan, spray and outcome logged into a searchable timeline you can export any time.",
    },
    {
      icon: FiTrendingUp,
      title: "Yield Uplift",
      body: "Farms using Agri Lens report 18% average yield uplift and 34% pesticide reduction.",
    },
  ];
  return (
    <section id="features" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          eyebrow="Capabilities"
          title="The full stack of crop protection"
          sub="Vision, weather, agronomy and action — under one glass roof."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <GlassCard key={i} className="hover-lift">
                <div className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-primary/20 border border-primary/30 text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MetricsStrip() {
  return (
    <section id="metrics" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 md:grid-cols-4">
          {[
            { v: 97.3, s: "%", l: "Detection accuracy" },
            { v: 12842, s: "", l: "Fields monitored" },
            { v: 34, s: "%", l: "Pesticide reduction" },
            { v: 18, s: "%", l: "Avg. yield uplift" },
          ].map((m, i) => (
            <GlassCard key={i} className="text-center hover-lift">
              <div className="font-display text-4xl md:text-5xl font-semibold text-gradient">
                <CountUp to={m.v} decimals={m.v % 1 !== 0 ? 1 : 0} suffix={m.s} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {m.l}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative glass rounded-3xl px-8 py-14 md:px-14 text-center overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-accent/30 blur-[120px]" />
          <h2 className="relative font-display text-3xl md:text-5xl font-semibold text-gradient">
            Ready when your field is.
          </h2>
          <p className="relative mt-4 text-muted-foreground max-w-xl mx-auto">
            Upload a photo. Get a diagnosis, a treatment plan and a spray window — before the sun
            sets on today's problem.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/detection"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90"
            >
              <FiCamera className="h-4 w-4" /> Try Detection
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-medium hover:bg-white/10"
            >
              Open Dashboard <FiArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-glass-border py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent" />
          <span>© 2026 Agri Lens · Cultivated with care</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
