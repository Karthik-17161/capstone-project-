import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three";

function riskColor(pct: number) {
  if (pct < 35) return new THREE.Color("#7CB342");
  if (pct < 60) return new THREE.Color("#FFD54F");
  if (pct < 80) return new THREE.Color("#FF9800");
  return new THREE.Color("#e53935");
}

function Gauge({ target }: { target: number }) {
  const arcRef = useRef<THREE.Mesh>(null);
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const dur = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(from + (target - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    return { shape };
  }, []);

  const color = riskColor(current);
  const angle = (current / 100) * Math.PI * 1.5;

  // Build ring arc
  const ring = useMemo(() => {
    return new THREE.RingGeometry(1.2, 1.45, 128, 1, Math.PI * 0.75, Math.PI * 1.5);
  }, []);
  const arc = useMemo(() => {
    return new THREE.RingGeometry(1.2, 1.45, 128, 1, Math.PI * 0.75, angle);
  }, [angle]);

  useFrame(({ clock }) => {
    if (arcRef.current) {
      const m = arcRef.current.material as THREE.MeshBasicMaterial;
      m.color = color;
      arcRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.005;
    }
  });

  return (
    <group>
      <mesh geometry={ring}>
        <meshBasicMaterial color="#1a3a2a" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh geometry={arc} ref={arcRef}>
        <meshBasicMaterial color={color} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
      {/* glow */}
      <mesh geometry={arc} position={[0, 0, -0.01]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function RiskGauge3D({ value }: { value: number }) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1} />
      <Gauge target={value} />
    </Canvas>
  );
}
