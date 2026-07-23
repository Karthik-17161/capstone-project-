import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GlassCard, SectionHeader } from "@/components/GlassCard";
import { Badge, severityTone, riskTone } from "@/components/Badge";
import { history } from "@/data/app";
import { FiSearch, FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export const Route = createFileRoute("/_app/history")({
  head: () => ({
    meta: [
      { title: "History · Agri Lens" },
      {
        name: "description",
        content: "Every scan, spray and outcome — searchable, filterable, exportable.",
      },
      { property: "og:title", content: "History · Agri Lens" },
      {
        property: "og:description",
        content: "Every scan, spray and outcome — searchable and exportable.",
      },
    ],
  }),
  component: History,
});

const PAGE = 6;

function History() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "completed">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return history.filter((h) => {
      const matchQ =
        !q || `${h.crop} ${h.pest} ${h.treatment}`.toLowerCase().includes(q.toLowerCase());
      const matchF =
        filter === "all" ||
        (filter === "high" && h.risk >= 70) ||
        (filter === "completed" && h.status === "Completed");
      return matchQ && matchF;
    });
  }, [q, filter]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE));
  const rows = filtered.slice((page - 1) * PAGE, page * PAGE);

  function exportCSV() {
    const header = "Date,Crop,Pest,Severity,Risk,Treatment,Status\n";
    const body = filtered
      .map((r) => [r.date, r.crop, r.pest, r.severity, r.risk, r.treatment, r.status].join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "detections.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="History"
        title="Detection log"
        sub="Every scan, every action, every outcome — kept in one place."
      />

      <GlassCard className="p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-white/5 px-3 py-2 flex-1 min-w-[220px]">
            <FiSearch className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(1);
              }}
              placeholder="Search crop, pest, treatment…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="flex gap-1 rounded-xl border border-glass-border bg-white/5 p-1">
            {(["all", "high", "completed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                className={`px-3 py-1.5 text-xs rounded-lg capitalize transition ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f === "all" ? "All" : f === "high" ? "High risk" : "Completed"}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm hover:bg-white/10"
          >
            <FiDownload className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-muted-foreground">
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3 pr-4">Crop</th>
                <th className="pb-3 pr-4">Pest</th>
                <th className="pb-3 pr-4">Severity</th>
                <th className="pb-3 pr-4">Risk</th>
                <th className="pb-3 pr-4">Treatment</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{r.date}</td>
                  <td className="py-3 pr-4">{r.crop}</td>
                  <td className="py-3 pr-4 font-medium">{r.pest}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={severityTone(r.severity)}>{r.severity}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full"
                          style={{
                            width: `${r.risk}%`,
                            background:
                              r.risk >= 80
                                ? "var(--destructive)"
                                : r.risk >= 60
                                  ? "var(--orange)"
                                  : "var(--accent)",
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium">{r.risk}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">{r.treatment}</td>
                  <td className="py-3">
                    <Badge tone={r.status === "Completed" ? "leaf" : "accent"}>{r.status}</Badge>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">
                    No results.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {filtered.length} entries · page {page} of {pages}
          </div>
          <div className="flex gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 grid place-items-center rounded-lg glass disabled:opacity-40 hover:bg-white/10"
            >
              <FiChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="h-9 w-9 grid place-items-center rounded-lg glass disabled:opacity-40 hover:bg-white/10"
            >
              <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
