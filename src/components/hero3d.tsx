"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, RoundedBox, Edges } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------ environment ------------------------------- */

function useEnv() {
  const [mobile, setMobile] = useState(false);
  const [reduce, setReduce] = useState(false);
  const [light, setLight] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 768px)");
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => {
      setMobile(mqMobile.matches);
      setReduce(mqReduce.matches);
      setLight(!document.documentElement.classList.contains("dark"));
    };
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    mqMobile.addEventListener("change", read);
    mqReduce.addEventListener("change", read);
    return () => {
      obs.disconnect();
      mqMobile.removeEventListener("change", read);
      mqReduce.removeEventListener("change", read);
    };
  }, []);

  return { mobile, reduce, light };
}

/* -------------------------------- particles -------------------------------- */

/** Deterministic pseudo-random values keep render output pure and stable. */
function stableRandom(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function Particles({
  count,
  color,
  size,
  opacity,
  radius,
}: {
  count: number;
  color: string;
  size: number;
  opacity: number;
  radius: [number, number];
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius[0] + stableRandom(i * 3 + 1) * (radius[1] - radius[0]);
      const theta = stableRandom(i * 3 + 2) * Math.PI * 2;
      const phi = Math.acos(2 * stableRandom(i * 3 + 3) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ----------------------------- glass ui panels ----------------------------- */

function Panel({
  position,
  rotation,
  size,
  tint,
  light,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  tint: string;
  light: boolean;
}) {
  const [w, h] = size;
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[w, h, 0.045]} radius={0.055} smoothness={4}>
          <meshPhysicalMaterial
            color={light ? "#ffffff" : "#9fb8ab"}
            transparent
            opacity={light ? 0.5 : 0.1}
            roughness={0.15}
            metalness={0.1}
            clearcoat={0.6}
          />
          <Edges color={tint} threshold={20} />
        </RoundedBox>
        {/* faux ui bars */}
        <mesh position={[-w * 0.22, h * 0.28, 0.045]}>
          <boxGeometry args={[w * 0.42, h * 0.07, 0.008]} />
          <meshBasicMaterial color={tint} transparent opacity={0.85} />
        </mesh>
        <mesh position={[-w * 0.13, h * 0.12, 0.045]}>
          <boxGeometry args={[w * 0.6, h * 0.035, 0.008]} />
          <meshBasicMaterial color={light ? "#0d1210" : "#ffffff"} transparent opacity={0.35} />
        </mesh>
        <mesh position={[-w * 0.19, h * 0.0, 0.045]}>
          <boxGeometry args={[w * 0.48, h * 0.035, 0.008]} />
          <meshBasicMaterial color={light ? "#0d1210" : "#ffffff"} transparent opacity={0.22} />
        </mesh>
        <mesh position={[-w * 0.05, -h * 0.24, 0.045]}>
          <boxGeometry args={[w * 0.76, h * 0.3, 0.008]} />
          <meshBasicMaterial color={tint} transparent opacity={0.14} />
        </mesh>
      </group>
    </Float>
  );
}

/* ---------------------------------- bloom ---------------------------------- */

function Bloom({ mobile, reduce, light }: { mobile: boolean; reduce: boolean; light: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ringsRef = useRef<(THREE.Group | null)[]>([]);
  const ptr = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      scroll.current = Math.min(window.scrollY, 1200);
    };
    // window-level tracking keeps the canvas pointer-events:none so hero text
    // stays selectable and CTAs hoverable while the scene still reacts
    const onMove = (e: PointerEvent) => {
      ptr.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const accent = light ? "#0a9e67" : "#5ee0a6";
  const soft = light ? "#0d1210" : "#eef2ee";

  const rings = useMemo(
    () => [
      { r: 1.05, tilt: [Math.PI / 2.15, 0.2, 0], speed: 0.16, op: 0.85, color: accent },
      { r: 1.42, tilt: [Math.PI / 1.9, -0.35, 0.3], speed: -0.12, op: 0.4, color: soft },
      { r: 1.85, tilt: [Math.PI / 2.4, 0.5, -0.2], speed: 0.09, op: 0.5, color: accent },
      { r: 2.3, tilt: [Math.PI / 1.75, 0.15, 0.45], speed: -0.07, op: 0.25, color: soft },
      { r: 2.75, tilt: [Math.PI / 2.05, -0.5, 0.1], speed: 0.05, op: 0.3, color: accent },
    ],
    [accent, soft]
  );

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (!reduce) {
      const tRX = ptr.current.y * -0.16;
      const tRY = ptr.current.x * 0.24;
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, tRX + scroll.current * 0.00012, 0.045);
      g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, tRY, 0.045);
      g.position.y = THREE.MathUtils.lerp(g.position.y, scroll.current * 0.0011, 0.06);
      ringsRef.current.forEach((r, i) => {
        if (r) r.rotation.z += delta * rings[i].speed;
      });
    }
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.012;
    g.scale.setScalar(breathe);
  });

  return (
    <group ref={group}>
      {/* core glow */}
      <mesh>
        <sphereGeometry args={[0.62, 32, 32]} />
        <meshBasicMaterial color={accent} transparent opacity={light ? 0.08 : 0.1} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={light ? 0.35 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight color={accent} intensity={6} distance={9} decay={2} />

      {/* orbit rings */}
      {rings.map((r, i) => (
        <group
          key={i}
          rotation={r.tilt as [number, number, number]}
          ref={(el) => {
            ringsRef.current[i] = el;
          }}
        >
          <mesh>
            <torusGeometry args={[r.r, 0.0075, 8, 160]} />
            <meshBasicMaterial color={r.color} transparent opacity={r.op} />
          </mesh>
          {/* node on ring */}
          <mesh position={[r.r, 0, 0]}>
            <sphereGeometry args={[0.035, 16, 16]} />
            <meshBasicMaterial color={r.color} transparent opacity={0.95} />
          </mesh>
        </group>
      ))}

      {/* glass ui panels */}
      {!mobile && (
        <>
          <Panel position={[-2.55, 0.75, -0.6]} rotation={[0.05, 0.5, 0.06]} size={[1.15, 1.45]} tint={accent} light={light} />
          <Panel position={[2.6, 0.4, -1.0]} rotation={[-0.04, -0.55, -0.05]} size={[1.45, 0.95]} tint={accent} light={light} />
          <Panel position={[1.9, -1.35, 0.4]} rotation={[0.25, -0.35, 0.02]} size={[0.72, 1.35]} tint={accent} light={light} />
        </>
      )}

      {/* particles */}
      <Particles
        count={mobile ? 220 : 640}
        color={accent}
        size={0.028}
        opacity={light ? 0.55 : 0.75}
        radius={[2.4, 4.6]}
      />
      <Particles
        count={mobile ? 120 : 380}
        color={soft}
        size={0.02}
        opacity={light ? 0.3 : 0.4}
        radius={[2.0, 4.2]}
      />

      <Sparkles
        count={mobile ? 18 : 42}
        scale={[7, 4.5, 5]}
        size={2.2}
        speed={0.35}
        color={accent}
        opacity={0.55}
      />
    </group>
  );
}

/* ---------------------------------- scene ---------------------------------- */

export default function Hero3D() {
  const { mobile, reduce, light } = useEnv();
  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 1.8]}
      camera={{ position: [0, 0, 7], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <Bloom mobile={mobile} reduce={reduce} light={light} />
    </Canvas>
  );
}
