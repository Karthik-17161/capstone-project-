## Goal

Replace the two existing 3D scenes on the landing page with new ones inspired by the uploaded references:

1. **Hero (`src/three/EarthHero.tsx`)** → replaced by a **DroneScene**: a stylized drone flying above green crop rows, emitting animated scanning beams / radar rings that visually "connect" upward to a floating AI dashboard HUD.
2. **Farm section (`src/three/FarmScene.tsx`)** → replaced by a **CinematicFarm**: warm sunrise lighting, volumetric fog, wind-animated crop fields, distant silhouettes (barn/silo/windmill), drifting light motes.

Landing page structure, copy, glass HUD chips, palette tokens, and all other routes stay untouched. Only the two 3D modules and their in-scene overlays change.

---

## 1. DroneScene (replaces EarthHero)

New file `src/three/DroneScene.tsx`, exported from `src/three/index.tsx` under the existing `EarthHero` name so `routes/index.tsx` needs no import change (or we rename the export and update the one import — same effect, one-line diff).

Scene contents:

- **Ground plane** of instanced crop tufts in tight rows (dense `InstancedMesh` of small cone/blade geometry, ~2–3k instances) with a vertex-shader wind sway (sin(time + worldX*k)).
- **Row grid** with a subtle darker soil stripe between rows, receding into fog toward the horizon.
- **Drone model** built from primitives (central body box, 4 arms, 4 spinning rotors as thin cylinders, small gimbal camera sphere with red LED). Hovers with gentle bob (`sin(t)`), slow forward/side drift, rotors spin fast.
- **Scanning beams**: downward cone (semi-transparent green additive) from the drone's camera onto the crops, plus 2–3 expanding radar rings on the ground where the beam lands (ring geometry, scale + fade loop).
- **Uplink beam**: thin vertical beam + traveling data-packet dots going up from the drone to a floating HUD panel (a `<Html>` or plain plane) positioned upper-right — labeled "AI Dashboard · Live" with a couple of pulsing stat lines. Kept minimal so it reads as connection, not clutter.
- **Atmosphere**: `fog` in bg color, low sunrise-tinted directional light, hemisphere light, faint particle motes.
- Camera: slight parallax on pointer move (already the pattern in the project); `dpr={[1,2]}`, `frameloop="always"` for smooth rotors.

All colors pulled from existing tokens (`--color-primary`, `--color-accent`, `--color-orange`, `--color-bg`). No hardcoded hex outside the three material props that already use hex.

## 2. CinematicFarm (replaces FarmScene)

Rewrite `src/three/FarmScene.tsx` in place:

- **Sunrise sky**: large gradient backdrop sphere (custom shader: horizon orange → zenith deep green-teal) + low sun disc with soft bloom-like sprite (additive plane, no postprocessing dependency to keep bundle lean).
- **Volumetric fog**: layered semi-transparent horizontal fog planes at varying depths with slow horizontal drift, plus scene `fog` for depth falloff. Gives the "god ray" impression without needing `@react-three/postprocessing` (avoids adding a new dep).
- **Crop fields**: two large instanced fields of tall wheat/corn blades (thin tapered planes, double-sided, alpha-less), wind sway via vertex shader driven by `uTime` and world position; density falls off with distance.
- **Distant silhouettes**: low-poly barn, silo pair, and windmill as dark near-black shapes on the horizon ridge (matches reference mood without literal Unreal realism — we stay stylized-cinematic, feasible in R3F at 60fps).
- **Light motes**: `Points` with additive blending drifting upward, catching the sunrise tint (like the glowing orbs in the reference).
- **Path**: subtle lighter strip cutting through the fields toward the sun for depth composition.
- Camera slow dolly-in / gentle orbit on a small radius; `frameloop="always"`.

## 3. Wiring

- `src/three/index.tsx`: update the lazy exports so `EarthHero` resolves to the new `DroneScene` module and `FarmScene` resolves to the rewritten file. The landing page keeps using `<EarthHero />` and `<FarmScene />` names — no changes to `src/routes/index.tsx`.
- Both scenes remain lazy-loaded behind the existing `<ClientOnly>` wrapper (SSR safety preserved).
- No new npm dependencies. Uses only `three`, `@react-three/fiber`, `@react-three/drei` already installed.

## 4. Performance

- Instanced meshes for all crop geometry.
- Shader-based wind (single uniform update per frame) instead of per-mesh JS rotation.
- Limit total draw calls to < ~20 per scene.
- `dpr={[1, 2]}`, pixel-ratio-capped; pause via existing IntersectionObserver pattern in `ThreeClient` if present, otherwise `frameloop="demand"` on the farm scene when idle.

## 5. Out of scope

- No changes to copy, layout, other routes, palette, HUD chip content, or the FloatingStat cards on the hero.
- No real drone GLTF asset — built from primitives to keep bundle small and stay offline-safe.
- No postprocessing pass (bloom/god-rays faked with additive sprites).

## Files touched

- `src/three/DroneScene.tsx` (new)
- `src/three/FarmScene.tsx` (rewritten)
- `src/three/index.tsx` (update lazy imports; keep `EarthHero` export name pointing at DroneScene)
- `src/three/EarthHero.tsx` (delete, or keep as a thin re-export during transition — will delete)
