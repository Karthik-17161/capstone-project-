import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, type ReactNode } from "react";

// Load R3F chunks only on the client — three.js touches window at import time.
export function ThreeClient({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ClientOnly>
  );
}

export const EarthHero = lazy(() => import("./DroneScene"));
export const FarmScene = lazy(() => import("./FarmScene"));
export const RiskGauge3D = lazy(() => import("./RiskGauge3D"));
