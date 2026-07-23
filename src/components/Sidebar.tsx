import { Link, useRouterState } from "@tanstack/react-router";
import { FiGrid, FiCamera, FiClock, FiCloud, FiZap, FiUser, FiLogOut } from "react-icons/fi";
import { motion } from "framer-motion";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/detection", label: "Pest Detection", icon: FiCamera },
  { to: "/results", label: "Results", icon: FiZap },
  { to: "/history", label: "History", icon: FiClock },
  { to: "/weather", label: "Weather", icon: FiCloud },
  { to: "/recommendations", label: "Recommendations", icon: FiZap },
  { to: "/profile", label: "Profile", icon: FiUser },
] as const;

export function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 border-r border-glass-border px-4 py-6 gap-1">
      <div className="px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground">
        Workspace
      </div>
      {items.map((it) => {
        const active = pathname === it.to;
        const Icon = it.icon;
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            {active && (
              <motion.span
                layoutId="side-active"
                className="absolute inset-0 rounded-xl bg-primary/15 border border-primary/30"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <Icon className="relative z-10 h-4 w-4" />
            <span className="relative z-10 font-medium">{it.label}</span>
          </Link>
        );
      })}
      <div className="mt-auto">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
        >
          <FiLogOut className="h-4 w-4" /> Sign out
        </Link>
      </div>
    </aside>
  );
}
