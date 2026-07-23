import { Canvas, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------- Wind-swayed instanced crop tufts ---------- */

function CropFieldStable() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const COUNT = 3600;

  const matrices = useMemo(() => {
    const rows = 36;
    const perRow = 100;
    const spacingX = 0.35;
    const spacingZ = 0.55;
    const arr: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < perRow; i++) {
        const x = (i - perRow / 2) * spacingX + (Math.random() - 0.5) * 0.08;
        const z = (r - rows / 2) * spacingZ + (Math.random() - 0.5) * 0.08;
        const s = 0.7 + Math.random() * 0.6;
        dummy.position.set(x, 0, z);
        dummy.scale.set(1, s, 1);
        dummy.rotation.y = Math.random() * Math.PI;
        dummy.updateMatrix();
        arr.push(dummy.matrix.clone());
      }
    }
    return arr;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          uniform float uTime;
          varying float vY;
          void main() {
            vY = position.y;
            vec4 world = instanceMatrix * vec4(position, 1.0);
            float sway = sin(uTime * 1.4 + world.x * 0.5 + world.z * 0.35) * 0.15 * max(position.y, 0.0);
            world.x += sway;
            world.z += sway * 0.35;
            gl_Position = projectionMatrix * modelViewMatrix * world;
          }
        `,
        fragmentShader: `
          varying float vY;
          void main() {
            vec3 base = vec3(0.18, 0.45, 0.21);
            vec3 tip  = vec3(0.68, 0.92, 0.45);
            vec3 col = mix(base, tip, clamp(vY / 0.6, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
          }
        `,
      }),
    [],
  );

  useFrame((_, dt) => {
    const mesh = meshRef.current;
    if (mesh && !mesh.userData.init) {
      matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.userData.init = true;
    }
    if (matRef.current) matRef.current.uniforms.uTime.value += dt;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[
        undefined as unknown as THREE.BufferGeometry,
        undefined as unknown as THREE.Material,
        COUNT,
      ]}
    >
      <coneGeometry args={[0.09, 0.55, 5]} />
      <primitive ref={matRef} object={material} attach="material" />
    </instancedMesh>
  );
}

/* ---------- Drone ---------- */
function Drone({ children }: { children?: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.z = Math.sin(t * 0.6) * 0.05;
      group.current.rotation.x = Math.cos(t * 0.5) * 0.03;
    }
    rotors.current.forEach((r) => r && (r.rotation.y += 1.2));
  });

  const arms: [number, number][] = [
    [0.55, 0.55],
    [-0.55, 0.55],
    [0.55, -0.55],
    [-0.55, -0.55],
  ];

  return (
    <group ref={group} position={[0, 2.2, 0]}>
      {/* body */}
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.14, 0.35]} />
        <meshStandardMaterial color="#0f1512" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* red accent stripe */}
      <mesh position={[0, 0.001, 0]}>
        <boxGeometry args={[0.62, 0.03, 0.08]} />
        <meshStandardMaterial color="#c23a2a" emissive="#c23a2a" emissiveIntensity={0.4} />
      </mesh>
      {/* gimbal camera */}
      <mesh position={[0, -0.12, 0.05]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color="#111" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.16, 0.13]}>
        <cylinderGeometry args={[0.035, 0.05, 0.05, 16]} />
        <meshStandardMaterial color="#7CB342" emissive="#7CB342" emissiveIntensity={1.5} />
      </mesh>
      {/* LED */}
      <mesh position={[0.28, 0.02, 0.15]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ff4444" toneMapped={false} />
      </mesh>
      {/* arms + rotors */}
      {arms.map(([x, z], i) => (
        <group key={i}>
          <mesh position={[x * 0.5, 0, z * 0.5]} rotation={[0, Math.atan2(z, x), 0]}>
            <boxGeometry args={[0.7, 0.05, 0.06]} />
            <meshStandardMaterial color="#141a17" metalness={0.6} roughness={0.4} />
          </mesh>
          <group
            ref={(el) => {
              if (el) rotors.current[i] = el;
            }}
            position={[x, 0.08, z]}
          >
            <mesh>
              <cylinderGeometry args={[0.32, 0.32, 0.015, 24]} />
              <meshBasicMaterial color="#1a1a1a" transparent opacity={0.35} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.6, 0.02, 0.04]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
          </group>
          {/* rotor hub */}
          <mesh position={[x, 0.08, z]}>
            <cylinderGeometry args={[0.05, 0.05, 0.08, 12]} />
            <meshStandardMaterial color="#0a0f0d" metalness={0.9} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {children}
    </group>
  );
}

function FlightRig() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock, mouse }) => {
    const t = clock.elapsedTime;
    const x = Math.sin(t * 0.22) * 4.6 + mouse.x * 0.45;
    const z = Math.cos(t * 0.16) * 3.8 - 0.7;
    const y = Math.sin(t * 1.35) * 0.08;

    if (group.current) {
      group.current.position.set(x, y, z);
      group.current.rotation.y = Math.sin(t * 0.18) * 0.28;
      group.current.rotation.z = Math.sin(t * 0.32) * 0.08;
    }
  });

  return (
    <group ref={group}>
      <Drone />
      <ScanBeam />
    </group>
  );
}

/* ---------- Scan beam + radar rings ---------- */
function ScanBeam() {
  const coneRef = useRef<THREE.Mesh>(null);
  const rings = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (coneRef.current) {
      const mat = coneRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + Math.sin(t * 3) * 0.06;
    }
    rings.current.forEach((r, i) => {
      if (!r) return;
      const p = ((t + i * 0.9) % 2.7) / 2.7;
      r.scale.setScalar(0.4 + p * 3.2);
      (r.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.55;
    });
  });
  return (
    <group position={[0, 2.05, 0]}>
      {/* downward cone from drone camera */}
      <mesh ref={coneRef} position={[0, -1.05, 0.05]}>
        <coneGeometry args={[1.05, 2.1, 32, 1, true]} />
        <meshBasicMaterial
          color="#7CB342"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* radar rings on ground */}
      <group position={[0, -2.15, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) rings.current[i] = el;
            }}
          >
            <ringGeometry args={[0.55, 0.6, 64]} />
            <meshBasicMaterial
              color="#7CB342"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ---------- Uplink beam + traveling data packets ---------- */
function Uplink() {
  const packets = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    packets.current.forEach((p, i) => {
      if (!p) return;
      const phase = (t * 0.6 + i * 0.33) % 1;
      p.position.y = 2.25 + phase * 2.2;
      p.position.x = 0.1 + phase * 2.3;
      p.position.z = -0.1;
      (p.material as THREE.MeshBasicMaterial).opacity = Math.sin(phase * Math.PI);
    });
  });
  return (
    <group>
      {/* thin diagonal beam from drone to HUD position */}
      <mesh position={[1.25, 3.35, -0.1]} rotation={[0, 0, -Math.atan2(2.2, 2.3)]}>
        <planeGeometry args={[3.2, 0.02]} />
        <meshBasicMaterial
          color="#7CB342"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) packets.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#7CB342" transparent opacity={1} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Floating HUD panel ---------- */
function HUD() {
  return (
    <Html position={[2.4, 4.6, -0.1]} transform distanceFactor={5} occlude={false}>
      <div
        style={{
          width: 220,
          padding: "12px 14px",
          borderRadius: 14,
          background: "rgba(238,251,227,0.72)",
          border: "1px solid rgba(124,179,66,0.35)",
          boxShadow: "0 0 40px rgba(76,145,64,0.25)",
          backdropFilter: "blur(10px)",
          color: "#173b25",
          fontFamily: "'Space Grotesk', Inter, sans-serif",
          transform: "translateZ(0)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            opacity: 0.75,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#7CB342",
              boxShadow: "0 0 8px #7CB342",
            }}
          />
          AI Dashboard · Live
        </div>
        <div style={{ marginTop: 8, fontSize: 22, fontWeight: 600 }}>Field 3 scan</div>
        <div
          style={{
            marginTop: 10,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontSize: 11,
          }}
        >
          <Stat label="Coverage" value="82%" />
          <Stat label="Risk" value="Low" tone="#7CB342" />
          <Stat label="Pests" value="0 / 40" />
          <Stat label="Uplink" value="24 Mb/s" tone="#FF9800" />
        </div>
      </div>
    </Html>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div style={{ padding: "6px 8px", borderRadius: 8, background: "rgba(255,255,255,0.42)" }}>
      <div style={{ fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase", opacity: 0.6 }}>
        {label}
      </div>
      <div style={{ marginTop: 2, fontWeight: 600, color: tone ?? "#173b25" }}>{value}</div>
    </div>
  );
}

/* ---------- Motes ---------- */
function Motes() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 220;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.02;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.03}
        color="#7CB342"
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Ground ---------- */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#d7f5c4" roughness={1} />
    </mesh>
  );
}

export default function DroneScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [4.5, 3.2, 6], fov: 45 }} shadows>
      <color attach="background" args={["#e8f8d8"]} />
      <fog attach="fog" args={["#e8f8d8", 10, 30]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={["#f5ffe2", "#9ed589", 0.55]} />
      <directionalLight position={[6, 10, 4]} intensity={1.1} color="#efffcf" castShadow />
      <Ground />
      <CropFieldStable />
      <FlightRig />
      <Uplink />
      <HUD />
      <Motes />
    </Canvas>
  );
}
