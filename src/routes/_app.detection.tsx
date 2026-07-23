import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { FiUploadCloud, FiCamera, FiX, FiZap } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { GlassCard, SectionHeader } from "@/components/GlassCard";

export const Route = createFileRoute("/_app/detection")({
  head: () => ({
    meta: [
      { title: "Pest Detection · Agri Lens" },
      {
        name: "description",
        content:
          "Upload a crop photo and get instant AI pest identification, risk scoring, and treatment recommendations.",
      },
      { property: "og:title", content: "Pest Detection · Agri Lens" },
      {
        property: "og:description",
        content: "Instant AI pest identification from a single photo.",
      },
    ],
  }),
  component: Detection,
});

const DEMO_IMG = "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=1200&q=80";

function Detection() {
  const nav = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase !== "scanning") return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 2200);
      setProgress(Math.round(t * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setPhase("done");
        setTimeout(() => nav({ to: "/results" }), 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, nav]);

  function handleFile(file: File | null) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setPhase("scanning");
    setProgress(0);
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Detection"
        title="Upload a photo. Get a diagnosis."
        sub="Drop an image, snap one from your camera, or try the demo. Results in under 3 seconds."
      />

      <GlassCard className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!preview && (
            <motion.div
              key="drop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files?.[0] ?? null);
              }}
              className={`relative rounded-2xl border-2 border-dashed transition-all p-10 md:p-16 text-center ${dragging ? "border-accent bg-accent/10 glow-accent" : "border-glass-border bg-white/[0.02]"}`}
            >
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 grid place-items-center animate-float">
                <FiUploadCloud className="h-7 w-7 text-accent" />
              </div>
              <h3 className="font-display text-xl font-semibold">Drag & drop your crop image</h3>
              <p className="text-sm text-muted-foreground mt-2">
                or choose a source below · JPG · PNG · JPEG · max 10 MB
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground glow-primary hover:bg-primary/90"
                >
                  <FiUploadCloud className="h-4 w-4" /> Browse image
                </button>
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2.5 text-sm font-medium hover:bg-white/10"
                >
                  <FiCamera className="h-4 w-4" /> Camera capture
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(DEMO_IMG);
                    setPhase("scanning");
                    setProgress(0);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-accent/40 px-4 py-2.5 text-sm font-medium text-accent hover:bg-accent/10"
                >
                  <FiZap className="h-4 w-4" /> Try demo image
                </button>
              </div>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              {/* floating dust */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full bg-accent/40"
                    style={{
                      left: `${(i * 37) % 100}%`,
                      top: `${(i * 53) % 100}%`,
                      animation: `float ${4 + (i % 5)}s ease-in-out ${(i % 6) * 0.5}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {preview && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 md:grid-cols-[1.2fr_1fr]"
            >
              <div className="relative rounded-2xl overflow-hidden border border-glass-border aspect-[4/3] bg-black">
                <img
                  src={preview}
                  alt="Uploaded crop"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {phase === "scanning" && (
                  <>
                    <div className="absolute inset-x-0 top-0 h-full pointer-events-none">
                      <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-accent to-transparent animate-scan shadow-[0_0_20px_rgba(124,179,66,0.9)]" />
                    </div>
                    <div className="absolute inset-0 pointer-events-none">
                      <svg className="absolute inset-0 w-full h-full opacity-70">
                        {Array.from({ length: 14 }).map((_, i) => (
                          <line
                            key={i}
                            x1={`${(i * 79) % 100}%`}
                            y1={`${(i * 43) % 100}%`}
                            x2={`${(i * 17 + 30) % 100}%`}
                            y2={`${(i * 61 + 20) % 100}%`}
                            stroke="rgba(124,179,66,0.4)"
                            strokeWidth="0.5"
                            style={{ animation: `float 2s ease-in-out ${i * 0.1}s infinite` }}
                          />
                        ))}
                      </svg>
                    </div>
                    <div className="absolute inset-4 border border-accent/60 rounded-xl glow-accent" />
                  </>
                )}
                <button
                  onClick={() => {
                    setPreview(null);
                    setPhase("idle");
                    setProgress(0);
                  }}
                  className="absolute top-3 right-3 h-8 w-8 grid place-items-center rounded-full glass hover:bg-white/20"
                  aria-label="Remove"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-col justify-center">
                <div className="text-[11px] uppercase tracking-[0.2em] text-accent">
                  AI Pipeline
                </div>
                <h3 className="font-display text-2xl font-semibold mt-1">
                  {phase === "scanning" ? "Analyzing your crop…" : "Detection complete"}
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Running vision model · fusing weather signal · scoring risk · matching treatments.
                </p>
                <div className="mt-6 space-y-3">
                  <Step label="Loading image" done={progress > 5} />
                  <Step label="Detecting bounding boxes" done={progress > 30} />
                  <Step label="Classifying pest species" done={progress > 60} />
                  <Step label="Fusing weather + crop stage" done={progress > 85} />
                  <Step label="Generating recommendation" done={progress >= 100} />
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}

function Step({ label, done }: { label: string; done: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span
        className={`h-4 w-4 rounded-full border grid place-items-center ${done ? "bg-accent border-accent" : "border-glass-border"}`}
      >
        {done && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
      </span>
      <span className={done ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </div>
  );
}
