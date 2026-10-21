"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import type { ThemeId } from "../../content/site";

interface Scene3DCanvasProps {
  theme: ThemeId;
  /** Scroll progress (0–1) held in a ref so the parent never re-renders on scroll */
  scrollRef: MutableRefObject<number>;
}

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
}

const THEME_PALETTES: Record<
  ThemeId,
  {
    primary: string;
    secondary: string;
    tertiary: string;
    edgeRgb: string;
    coreRgb: string;
    nodeFill: string;
    labelColor: string;
  }
> = {
  "titanium-atelier": {
    primary: "#ff4f00",
    secondary: "#1d4ed8",
    tertiary: "#0f172a",
    edgeRgb: "15, 23, 42",
    coreRgb: "255, 79, 0",
    nodeFill: "#ff4f00",
    labelColor: "rgba(15, 23, 42, 0.78)",
  },
  "aurum-quant": {
    primary: "#e5b869",
    secondary: "#f59e0b",
    tertiary: "#a8a29e",
    edgeRgb: "229, 184, 105",
    coreRgb: "245, 158, 11",
    nodeFill: "#e5b869",
    labelColor: "rgba(229, 184, 105, 0.8)",
  },
};

export function Scene3DCanvas({ theme, scrollRef }: Scene3DCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const themeRef = useRef<ThemeId>(theme);
  const wakeRef = useRef<() => void>(() => {});

  useEffect(() => {
    themeRef.current = theme;
    wakeRef.current();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = mediaQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", onMotionChange);

    let width = window.innerWidth;
    let height = window.innerHeight;
    // DPR capped at 1.5: the scene is soft line-art, so higher density costs GPU for no visible gain
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      wake();
    };

    window.addEventListener("resize", resize);

    // Build Icosahedron vertices (12 vertices)
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices: Vec3[] = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ];

    // Normalize vertices to radius 1
    const baseVertices: Vec3[] = rawVertices.map((v) => {
      const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      return { x: v.x / len, y: v.y / len, z: v.z / len };
    });

    // Build edges between vertices that share the minimum distance
    const edges: [number, number][] = [];
    for (let i = 0; i < baseVertices.length; i++) {
      for (let j = i + 1; j < baseVertices.length; j++) {
        const dx = baseVertices[i].x - baseVertices[j].x;
        const dy = baseVertices[i].y - baseVertices[j].y;
        const dz = baseVertices[i].z - baseVertices[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 1.2) {
          edges.push([i, j]);
        }
      }
    }

    // Inner Octahedron vertices (6 vertices)
    const innerVertices: Vec3[] = [
      { x: 0.52, y: 0, z: 0 },
      { x: -0.52, y: 0, z: 0 },
      { x: 0, y: 0.52, z: 0 },
      { x: 0, y: -0.52, z: 0 },
      { x: 0, y: 0, z: 0.52 },
      { x: 0, y: 0, z: -0.52 },
    ];

    // 3D Starfield particles for Z-depth tunnel effect on scroll
    const stars: StarParticle[] = Array.from({ length: 70 }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1000,
      z: Math.random() * 1000,
      size: Math.random() * 1.8 + 0.6,
      speed: Math.random() * 0.8 + 0.3,
    }));

    // Mouse interaction state
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / Math.max(width, 1) - 0.5) * 2;
      targetMouseY = (e.clientY / Math.max(height, 1) - 0.5) * 2;
      wake();
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    let smoothScroll = scrollRef.current;
    let animId = 0;
    let running = false;
    let lastFrame = 0;
    let frozenTime = 0; // accumulated spin clock (only advances while the idle spin runs)
    const FRAME_MS = 1000 / 30; // 30fps is plenty for a slow ambient backdrop

    // The idle spin only runs while the hero is on screen and the tab is visible.
    // Further down the page the scene only redraws while scroll/mouse easing settles.
    const idleSpinAllowed = () =>
      !reducedMotion && !document.hidden && window.scrollY < window.innerHeight * 1.1;

    const onScroll = () => wake();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onVisibility = () => wake();
    document.addEventListener("visibilitychange", onVisibility);

    const rotate3D = (v: Vec3, rx: number, ry: number, rz: number): Vec3 => {
      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y1 = v.y * cosX - v.z * sinX;
      const z1 = v.y * sinX + v.z * cosX;

      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x2 = v.x * cosY + z1 * sinY;
      const z2 = -v.x * sinY + z1 * cosY;

      // Rotate Z
      const cosZ = Math.cos(rz);
      const sinZ = Math.sin(rz);
      const x3 = x2 * cosZ - y1 * sinZ;
      const y3 = x2 * sinZ + y1 * cosZ;

      return { x: x3, y: y3, z: z2 };
    };

    const render = (time: number) => {
      animId = 0;
      if (time - lastFrame < FRAME_MS) {
        animId = requestAnimationFrame(render);
        return;
      }
      const delta = Math.min(time - lastFrame, 100);
      lastFrame = time;

      const spinning = idleSpinAllowed();
      if (spinning) frozenTime += delta;
      const t = reducedMotion ? 0 : frozenTime * 0.001;
      smoothScroll += (scrollRef.current - smoothScroll) * 0.16;
      mouseX += (targetMouseX - mouseX) * 0.12;
      mouseY += (targetMouseY - mouseY) * 0.12;

      const palette = THEME_PALETTES[themeRef.current];
      ctx.clearRect(0, 0, width, height);

      // Center of the 3D object shifts gracefully from right-center (Hero) to center (Scroll stages)
      const isDesktop = width >= 1024;
      const heroOffsetX = isDesktop ? width * 0.22 : 0;
      const centerShift = Math.max(0, 1 - smoothScroll * 2.2); // 1 at top, 0 by mid-scroll
      const cx = width * 0.5 + heroOffsetX * centerShift + mouseX * 18;
      const cy = height * 0.5 + mouseY * 14;

      // Scale & expansion driven by scroll
      const baseScale = Math.min(width, height) * (isDesktop ? 0.23 : 0.28);
      // As user scrolls into stage 2 (0.35-0.7), the polyhedron expands outward
      const expansionWave = Math.sin(smoothScroll * Math.PI);
      const radius = baseScale * (1 + expansionWave * 0.45 + smoothScroll * 0.15);
      const fov = 700;

      // 1. Render 3D Z-depth Starfield / Spatial Particles
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        // Scroll moves camera forward through Z-space
        const zPos = ((star.z - smoothScroll * 900 - t * 40 * star.speed) % 1000 + 1000) % 1000;
        const perspective = fov / (fov + zPos);
        const sx = width * 0.5 + (star.x + mouseX * -60) * perspective;
        const sy = height * 0.5 + (star.y + mouseY * -60) * perspective;
        const alpha = Math.min(1, (1 - zPos / 1000) * 0.65);

        ctx.beginPath();
        ctx.arc(sx, sy, star.size * perspective * 1.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${palette.edgeRgb}, ${alpha})`;
        ctx.fill();
      }

      // 2. Rotation angles driven by scroll + time + mouse tilt
      const rotX = smoothScroll * Math.PI * 1.8 + t * 0.22 + mouseY * 0.35;
      const rotY = smoothScroll * Math.PI * 2.4 + t * 0.32 + mouseX * 0.45;
      const rotZ = smoothScroll * Math.PI * 0.9 + t * 0.12;

      // 3. Draw 3 Orbital Gyroscope Rings in 3D
      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringRadius = radius * (1.18 + r * 0.18);
        const segments = 64;
        ctx.beginPath();
        for (let s = 0; s <= segments; s++) {
          const angle = (s / segments) * Math.PI * 2;
          const localVec: Vec3 =
            r === 0
              ? { x: Math.cos(angle) * ringRadius, y: Math.sin(angle) * ringRadius, z: 0 }
              : r === 1
                ? { x: Math.cos(angle) * ringRadius, y: 0, z: Math.sin(angle) * ringRadius }
                : { x: 0, y: Math.cos(angle) * ringRadius, z: Math.sin(angle) * ringRadius };

          const rotated = rotate3D(
            localVec,
            rotX * (r % 2 === 0 ? 1 : -0.7),
            rotY * (r === 1 ? -0.8 : 1),
            rotZ
          );
          const scale = fov / (fov + rotated.z + 250);
          const px = cx + rotated.x * scale;
          const py = cy + rotated.y * scale;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = `rgba(${r === 1 ? palette.coreRgb : palette.edgeRgb}, ${0.16 - r * 0.03})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 4. Project Outer Icosahedron Vertices
      const projectedOuter = baseVertices.map((v, idx) => {
        // Individual vertex breathing + scroll morphing
        const pulse = 1 + Math.sin(t * 2 + idx) * 0.04 + expansionWave * 0.12;
        const scaled: Vec3 = {
          x: v.x * radius * pulse,
          y: v.y * radius * pulse,
          z: v.z * radius * pulse,
        };
        const rot = rotate3D(scaled, rotX, rotY, rotZ);
        const pScale = fov / (fov + rot.z + 250);
        return {
          x: cx + rot.x * pScale,
          y: cy + rot.y * pScale,
          z: rot.z,
          scale: pScale,
        };
      });

      // Project Inner Core Vertices (counter-rotating)
      const projectedInner = innerVertices.map((v) => {
        const innerR = radius * (0.85 - expansionWave * 0.15);
        const scaled: Vec3 = {
          x: v.x * innerR,
          y: v.y * innerR,
          z: v.z * innerR,
        };
        const rot = rotate3D(scaled, -rotX * 1.3, -rotY * 1.1, rotZ);
        const pScale = fov / (fov + rot.z + 250);
        return {
          x: cx + rot.x * pScale,
          y: cy + rot.y * pScale,
          z: rot.z,
          scale: pScale,
        };
      });

      // 5. Draw Radial Core Energy Connections (Inner to Outer)
      for (let i = 0; i < projectedInner.length; i++) {
        const innerPt = projectedInner[i];
        const outerPt = projectedOuter[i * 2];
        if (!outerPt) continue;
        ctx.beginPath();
        ctx.moveTo(innerPt.x, innerPt.y);
        ctx.lineTo(outerPt.x, outerPt.y);
        ctx.strokeStyle = `rgba(${palette.coreRgb}, 0.22)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 6. Draw Outer Icosahedron Edges with Z-depth alpha
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        const p1 = projectedOuter[a];
        const p2 = projectedOuter[b];
        const avgZ = (p1.z + p2.z) * 0.5;
        const depthNorm = Math.max(0.12, Math.min(0.85, 0.55 - avgZ / (radius * 2.2)));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(${palette.edgeRgb}, ${depthNorm})`;
        ctx.lineWidth = depthNorm > 0.45 ? 1.6 : 0.9;
        ctx.stroke();

        // Traveling signal packet along edge
        if (!reducedMotion && i % 3 === 0) {
          const progress = ((t * 0.55 + i * 0.17 + smoothScroll * 2) % 1 + 1) % 1;
          const sx = p1.x + (p2.x - p1.x) * progress;
          const sy = p1.y + (p2.y - p1.y) * progress;
          ctx.beginPath();
          ctx.arc(sx, sy, 2.2 * p1.scale, 0, Math.PI * 2);
          ctx.fillStyle = palette.primary;
          ctx.fill();
        }
      }

      // 7. Draw Outer Nodes & Telemetry Coordinates on Front-most Vertices
      const specialistTags = ["AYAN // RAG+BI", "ARSALAN // ML", "HASSAN // WEB", "NAVEED // BRAND"];
      projectedOuter.forEach((pt, idx) => {
        const isFront = pt.z < 0;
        const nodeRadius = (isFront ? 4.2 : 2.4) * pt.scale;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = isFront ? palette.primary : palette.secondary;
        ctx.fill();

        if (isFront) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, nodeRadius * 2.6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${palette.edgeRgb}, 0.28)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Attach floating 3D specialist callouts to 4 primary vertices
        if (idx < 4 && isFront && width > 640) {
          ctx.font = "600 10px ui-monospace, monospace";
          ctx.fillStyle = palette.labelColor;
          ctx.fillText(specialistTags[idx], pt.x + 10, pt.y - 6);
        }
      });

      const settling =
        Math.abs(scrollRef.current - smoothScroll) > 0.0005 ||
        Math.abs(targetMouseX - mouseX) > 0.002 ||
        Math.abs(targetMouseY - mouseY) > 0.002;

      if (!document.hidden && (spinning || settling)) {
        animId = requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    function wake() {
      if (running || document.hidden) return;
      running = true;
      animId = requestAnimationFrame(render);
    }
    wakeRef.current = wake;

    resize();

    return () => {
      cancelAnimationFrame(animId);
      running = false;
      wakeRef.current = () => {};
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      mediaQuery.removeEventListener("change", onMotionChange);
    };
  }, [scrollRef]);

  return (
    <div className="scene3d-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="scene3d-canvas" />
      <div className="scene3d-vignette" />
    </div>
  );
}
