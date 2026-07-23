import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------- Sunrise sky dome ---------- */
function SkyDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          uHorizon: { value: new THREE.Color("#f5a25a") },
          uMid: { value: new THREE.Color("#8a4a3a") },
          uZenith: { value: new THREE.Color("#0a1f18") },
        },
        vertexShader: `
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uHorizon;
          uniform vec3 uMid;
          uniform vec3 uZenith;
          varying vec3 vPos;
          void main() {
            float h = normalize(vPos).y;
            vec3 c1 = mix(uHorizon, uMid, smoothstep(0.0, 0.35, h));
            vec3 c2 = mix(c1, uZenith, smoothstep(0.35, 0.9, h));
            gl_FragColor = vec4(c2, 1.0);
          }
        `,
      }),
    [],
  );
  return (
    <mesh>
      <sphereGeometry args={[60, 32, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/* ---------- Sun disc with soft glow ---------- */
function Sun() {
  return (
    <group position={[-10, 4.2, -18]}>
      {/* soft halo */}
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[14, 14]} />
        <meshBasicMaterial
          color="#ffd090"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[7, 7]} />
        <meshBasicMaterial
          color="#ffe0a8"
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <circleGeometry args={[1.4, 32]} />
        <meshBasicMaterial color="#fff2c9" toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- Volumetric fog layers ---------- */
function FogLayers() {
  const refs = useRef<THREE.Mesh[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((m, i) => {
      if (m) m.position.x = ((t * (0.15 + i * 0.05)) % 12) - 6;
    });
  });
  const layers = [
    { z: -12, y: 0.6, opacity: 0.35, tint: "#e8b085" },
    { z: -8, y: 0.9, opacity: 0.28, tint: "#f5c9a0" },
    { z: -5, y: 0.4, opacity: 0.22, tint: "#c9dccb" },
  ];
  return (
    <group>
      {layers.map((l, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={[0, l.y, l.z]}
          rotation={[0, 0, 0]}
        >
          <planeGeometry args={[36, 3, 1, 1]} />
          <meshBasicMaterial
            color={l.tint}
            transparent
            opacity={l.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Wind-animated crop field (tapered blade planes) ---------- */
function CropSea({
  area = [26, 22],
  count = 5000,
  offsetZ = 0,
  color = ["#0b2a12", "#c98a3a"] as [string, string],
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const matrices = useMemo(() => {
    const arr: THREE.Matrix4[] = [];
    const dummy = new THREE.Object3D();
    const [W, D] = area;
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * W;
      const z = -Math.random() * D + offsetZ;
      const s = 0.6 + Math.random() * 0.9;
      dummy.position.set(x, 0, z);
      dummy.rotation.y = Math.random() * Math.PI;
      dummy.scale.set(1, s, 1);
      dummy.updateMatrix();
      arr.push(dummy.matrix.clone());
    }
    return arr;
  }, [area, count, offsetZ]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uBase: { value: new THREE.Color(color[0]) },
          uTip: { value: new THREE.Color(color[1]) },
        },
        vertexShader: `
          uniform float uTime;
          varying float vY;
          void main() {
            vY = position.y;
            vec4 world = instanceMatrix * vec4(position, 1.0);
            float sway = sin(uTime * 1.6 + world.x * 0.35 + world.z * 0.5) * 0.18 * pow(max(position.y, 0.0), 1.4);
            world.x += sway;
            world.z += sway * 0.5;
            gl_Position = projectionMatrix * modelViewMatrix * world;
          }
        `,
        fragmentShader: `
          uniform vec3 uBase;
          uniform vec3 uTip;
          varying float vY;
          void main() {
            vec3 c = mix(uBase, uTip, clamp(vY / 1.1, 0.0, 1.0));
            gl_FragColor = vec4(c, 1.0);
          }
        `,
      }),
    [color],
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
        count,
      ]}
    >
      <planeGeometry args={[0.06, 1.1, 1, 3]} />
      <primitive ref={matRef} object={material} attach="material" />
    </instancedMesh>
  );
}

/* ---------- Distant silhouettes ---------- */
function Horizon() {
  return (
    <group position={[0, 0, -18]}>
      {/* ridge */}
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[60, 1.6]} />
        <meshBasicMaterial color="#1a2418" />
      </mesh>
      {/* barn */}
      <group position={[6, 0.9, 0.1]}>
        <mesh>
          <boxGeometry args={[2.2, 1.2, 0.1]} />
          <meshBasicMaterial color="#0d130f" />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[1.3, 0.7, 4]} />
          <meshBasicMaterial color="#0d130f" />
        </mesh>
      </group>
      {/* silos */}
      <mesh position={[8.4, 1.2, 0.1]}>
        <cylinderGeometry args={[0.35, 0.35, 1.9, 12]} />
        <meshBasicMaterial color="#0d130f" />
      </mesh>
      <mesh position={[9.1, 1.4, 0.1]}>
        <cylinderGeometry args={[0.4, 0.4, 2.2, 12]} />
        <meshBasicMaterial color="#0d130f" />
      </mesh>
      {/* windmill */}
      <group position={[-7, 1.1, 0.1]}>
        <mesh>
          <boxGeometry args={[0.12, 2.2, 0.12]} />
          <meshBasicMaterial color="#0d130f" />
        </mesh>
        <WindmillBlades />
      </group>
      {/* farmhouse */}
      <group position={[-11, 0.9, 0.1]}>
        <mesh>
          <boxGeometry args={[1.6, 1.2, 0.1]} />
          <meshBasicMaterial color="#0d130f" />
        </mesh>
        <mesh position={[0, 0.9, 0]}>
          <coneGeometry args={[1.1, 0.7, 4]} />
          <meshBasicMaterial color="#0d130f" />
        </mesh>
      </group>
    </group>
  );
}

function WindmillBlades() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.5;
  });
  return (
    <group ref={ref} position={[0, 0.9, 0.05]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
          <planeGeometry args={[0.08, 0.9]} />
          <meshBasicMaterial color="#0d130f" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Path ---------- */
function Path() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.2, 0.005, -6]}>
      <planeGeometry args={[1.6, 22]} />
      <meshBasicMaterial color="#5a3c22" transparent opacity={0.55} />
    </mesh>
  );
}

/* ---------- Ground ---------- */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshStandardMaterial color="#0c2013" roughness={1} />
    </mesh>
  );
}

/* ---------- Drifting light motes ---------- */
function Motes() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 90;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = 0.4 + Math.random() * 2.2;
      arr[i * 3 + 2] = -Math.random() * 12 - 1;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, []);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.position.y = Math.sin(t * 0.3) * 0.2;
      const mat = ref.current.material as THREE.PointsMaterial;
      mat.opacity = 0.6 + Math.sin(t * 0.8) * 0.15;
    }
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.16}
        color="#ffd39a"
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------- Camera dolly ---------- */
function Rig() {
  useFrame(({ camera, clock }) => {
    const t = clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.08) * 0.6;
    camera.position.y = 1.6 + Math.sin(t * 0.12) * 0.05;
    camera.lookAt(-0.5, 1.2, -10);
  });
  return null;
}

export default function FarmScene() {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 1.6, 4], fov: 55 }}>
      <fog attach="fog" args={["#c98a5a", 8, 26]} />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={["#ffd6a0", "#0a1a12", 0.7]} />
      <directionalLight position={[-10, 4, -18]} intensity={1.6} color="#ffb374" />
      <SkyDome />
      <Sun />
      <Ground />
      <Path />
      <Horizon />
      <CropSea area={[26, 20]} count={4200} offsetZ={-1} color={["#0b2a12", "#c98a3a"]} />
      <CropSea area={[30, 24]} count={2500} offsetZ={-6} color={["#0a1f10", "#8a5a2a"]} />
      <FogLayers />
      <Motes />
      <Rig />
    </Canvas>
  );
}
