import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · Agri Lens" },
      { name: "description", content: "Sign in to the Agri Lens AI crop intelligence platform." },
      { property: "og:title", content: "Sign in · Agri Lens" },
      {
        property: "og:description",
        content: "Sign in to the Agri Lens AI crop intelligence platform.",
      },
    ],
  }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("farmer@agrisense.ai");
  const [pw, setPw] = useState("••••••••");
  const [remember, setRemember] = useState(true);
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden bg-background text-foreground">
      {/* Left visual */}
      <div className="relative hidden lg:block overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,179,66,0.35),transparent_60%),radial-gradient(circle_at_70%_80%,rgba(46,125,50,0.4),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "saturate(1.05) brightness(0.55)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-background/90" />
        <div className="relative z-10 h-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2.5 w-max">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center text-primary-foreground font-bold">
              A
            </div>
            <span className="font-display text-lg font-semibold">Agri Lens</span>
          </Link>
          <div>
            <h2 className="font-display text-4xl font-semibold text-gradient max-w-md">
              Grow smarter. Spray less. Yield more.
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md">
              Join 12,000+ farms using computer vision and weather intelligence to protect what
              they've planted.
            </p>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="relative flex items-center justify-center p-6 md:p-12">
        <div className="pointer-events-none absolute -top-20 -right-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px]" />
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/dashboard" });
          }}
          className="w-full max-w-md glass rounded-3xl p-8"
        >
          <div className="mb-8 lg:hidden flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent" />
            <span className="font-display font-semibold">Agri Lens</span>
          </div>
          <h1 className="font-display text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Agri Lens account.</p>

          <div className="mt-8 space-y-4">
            <Field icon={<FiMail />} label="Email" type="email" value={email} onChange={setEmail} />
            <Field icon={<FiLock />} label="Password" type="password" value={pw} onChange={setPw} />
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-[var(--accent)]"
              />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <a href="#" className="text-accent hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="mt-6 group w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90 transition-all"
          >
            Sign in{" "}
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <div className="mt-6 text-center text-xs text-muted-foreground">
            New here?{" "}
            <a href="#" className="text-accent hover:underline">
              Request access
            </a>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
      <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-3 py-2.5 focus-within:border-accent/50 focus-within:glow-accent transition-all">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
    </label>
  );
}
