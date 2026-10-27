"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ReviewsSection.module.css";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TUNABLE CONFIGURATION CONSTANTS
 * Adjust these knobs to fine-tune the subtlety, scale, and movement.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const CONFIG = {
  // Master intensity multiplier (0 to 1) — start deliberately understated
  INTENSITY: 0.85,

  // Opacities (multiplied by INTENSITY)
  BASE_OPACITY: 0.045,      // Resting particles far from the ring (ambient presence)
  RING_PEAK_OPACITY: 0.20,  // Particles along the organic ring boundary
  INSIDE_RING_OPACITY: 0.08,// Lifted baseline for particles inside the ring
  SHIMMER_AMPLITUDE: 0.018, // Breathing shimmer for resting field

  // Particle size & geometry
  PARTICLE_LENGTH_DESKTOP: 4.5, // Length of small rounded dash (px)
  PARTICLE_WIDTH_DESKTOP: 1.4,  // Stroke width of dash (px)
  PARTICLE_LENGTH_MOBILE: 3.5,  // Smaller dashes on phones
  PARTICLE_WIDTH_MOBILE: 1.2,
  GRID_SPACING_DESKTOP: 32,     // Distance between grid points on desktop
  GRID_SPACING_MOBILE: 44,      // Sparser grid on mobile for battery & performance

  // Ring geometry & dynamics
  RING_BASE_RADIUS: 155,       // Average radius of the organic ring (px)
  RING_THICKNESS: 46,          // Width of the ring illumination band (px)
  RING_PUSH_DISTANCE: 7.5,     // Outward displacement at ring boundary (px)
  CURSOR_LERP_FACTOR: 0.032,   // Delayed, fluid cursor follow easing
  WANDER_SPEED: 0.00065,       // Speed of autonomous drift
  BREATHE_SPEED: 0.0011,       // Speed of organic contour wave / pulse
};

export default function ReviewsBackground({
  containerRef,
  scrollProgressRef,
  isMobile: isMobileProp,
}) {
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = null;
    let isRunning = false;
    let isVisible = false;

    // Theme color target and current values
    let targetRgb = { r: 23, g: 22, b: 22 };
    let currentRgb = { r: 23, g: 22, b: 22 };

    const updateThemeColors = () => {
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark" ||
        document.documentElement.classList.contains("dark");
      targetRgb = isDark ? { r: 254, g: 254, b: 254 } : { r: 23, g: 22, b: 22 };
    };
    updateThemeColors();

    const themeObserver = new MutationObserver(() => {
      updateThemeColors();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    // Check media query preferences
    const prefersReducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Layout dimensions & particles
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isMobile = false;
    let particles = [];

    // Ring position tracking
    let ringPos = { x: 0, y: 0 };
    let targetPos = { x: 0, y: 0 };
    let hasCursor = false;
    let idleTimer = null;
    let startTime = performance.now();

    const initGrid = (w, h) => {
      isMobile = isMobileProp !== undefined ? isMobileProp : (w <= 768);
      const spacing = isMobile
        ? CONFIG.GRID_SPACING_MOBILE
        : CONFIG.GRID_SPACING_DESKTOP;
      const length = isMobile
        ? CONFIG.PARTICLE_LENGTH_MOBILE
        : CONFIG.PARTICLE_LENGTH_DESKTOP;

      const cols = Math.ceil(w / spacing) + 1;
      const rows = Math.ceil(h / spacing) + 1;
      const offsetX = (w - (cols - 1) * spacing) / 2;
      const offsetY = (h - (rows - 1) * spacing) / 2;

      particles = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Slight pseudo-random jitter so it doesn't look like an oppressive mechanical grid
          const jitterX = ((c * 17 + r * 31) % 9 - 4) * 0.7;
          const jitterY = ((c * 23 + r * 19) % 9 - 4) * 0.7;
          const baseX = offsetX + c * spacing + jitterX;
          const baseY = offsetY + r * spacing + jitterY;
          // Organic resting angle
          const restingAngle = Math.sin(c * 0.35 + r * 0.25) * 0.15;

          particles.push({
            baseX,
            baseY,
            restingAngle,
            length,
            phase: (c * 7 + r * 13) % 100,
          });
        }
      }

      if (ringPos.x === 0 && ringPos.y === 0) {
        const initialProgress =
          isMobile && scrollProgressRef ? Math.max(0, Math.min(1, scrollProgressRef.current ?? 0)) : 0;
        const initialY =
          isMobile && scrollProgressRef
            ? h * (0.88 - initialProgress * 0.86)
            : h * 0.5;
        const initialX =
          isMobile && scrollProgressRef
            ? w * 0.5 + Math.sin(initialProgress * Math.PI * 2) * (w * 0.14)
            : w * 0.5;
        ringPos = { x: initialX, y: initialY };
        targetPos = { x: initialX, y: initialY };
      }
    };

    const handleResize = () => {
      const container = containerRef?.current || canvas.parentElement;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newWidth = Math.floor(rect.width);
      const newHeight = Math.floor(rect.height);

      if (newWidth <= 0 || newHeight <= 0) return;

      isMobile = isMobileProp !== undefined ? isMobileProp : (newWidth <= 768);
      // Cap DPR to 1.5 on desktop and 1.0 on mobile to protect fill-rate
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.0 : 1.5);

      if (newWidth !== width || newHeight !== height) {
        width = newWidth;
        height = newHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        initGrid(width, height);
      }

      if (prefersReducedMotion) {
        drawStaticFrame();
      }
    };

    // Pointer events on parent container
    const parent = containerRef?.current || canvas.parentElement;

    const onPointerMove = (e) => {
      if (isMobile || e.pointerType === "touch") return; // Touch/mobile strictly scroll-driven
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      targetPos.x = e.clientX - rect.left;
      targetPos.y = e.clientY - rect.top;
      hasCursor = true;

      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        hasCursor = false;
      }, 2400);
    };

    const onPointerEnter = (e) => {
      if (isMobile || e.pointerType === "touch") return;
      hasCursor = true;
      onPointerMove(e);
    };

    const onPointerLeave = () => {
      hasCursor = false;
      if (idleTimer) clearTimeout(idleTimer);
    };

    if (parent) {
      parent.addEventListener("pointermove", onPointerMove, { passive: true });
      parent.addEventListener("pointerenter", onPointerEnter, { passive: true });
      parent.addEventListener("pointerleave", onPointerLeave, { passive: true });
    }

    // Static frame for reduced motion
    const drawStaticFrame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineWidth = isMobile
        ? CONFIG.PARTICLE_WIDTH_MOBILE
        : CONFIG.PARTICLE_WIDTH_DESKTOP;

      const alpha = CONFIG.BASE_OPACITY * CONFIG.INTENSITY;
      ctx.strokeStyle = `rgba(${targetRgb.r}, ${targetRgb.g}, ${targetRgb.b}, ${alpha.toFixed(3)})`;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const half = p.length * 0.5;
        const cosA = Math.cos(p.restingAngle);
        const sinA = Math.sin(p.restingAngle);

        ctx.beginPath();
        ctx.moveTo(p.baseX - cosA * half, p.baseY - sinA * half);
        ctx.lineTo(p.baseX + cosA * half, p.baseY + sinA * half);
        ctx.stroke();
      }
    };

    // Main render loop
    const tick = (now) => {
      if (!isRunning) return;

      const elapsed = (now - startTime);
      const wanderTime = elapsed * CONFIG.WANDER_SPEED;
      const breatheTime = elapsed * CONFIG.BREATHE_SPEED;

      // Color lerp for ultra-smooth live theme switching
      currentRgb.r += (targetRgb.r - currentRgb.r) * 0.08;
      currentRgb.g += (targetRgb.g - currentRgb.g) * 0.08;
      currentRgb.b += (targetRgb.b - currentRgb.b) * 0.08;
      const r = Math.round(currentRgb.r);
      const g = Math.round(currentRgb.g);
      const b = Math.round(currentRgb.b);

      // Target ring position:
      if (isMobile && scrollProgressRef) {
        // Mobile scroll-specific positioning:
        // - While 1st review is in view (progress 0): ring is at bottom (0.88 * height)
        // - As user scrolls, it continuously ascends up the viewport
        // - Traces a subtle S-curve centered around width * 0.5 without random wandering
        // - While 3rd review leaves viewport (progress 1): ring is at top (0.02 * height) about to leave
        const progress = Math.max(0, Math.min(1, scrollProgressRef.current ?? 0));
        targetPos.x =
          width * 0.5 + Math.sin(progress * Math.PI * 2) * (width * 0.14);
        targetPos.y =
          height * (0.88 - progress * 0.86);
      } else if (!hasCursor) {
        // Desktop autonomous wander when no active cursor
        targetPos.x =
          width * 0.5 +
          Math.sin(wanderTime * 1.1) * (width * 0.32) +
          Math.cos(wanderTime * 0.5) * (width * 0.08);
        targetPos.y =
          height * 0.5 +
          Math.sin(wanderTime * 0.85 + 1.2) * (height * 0.28);
      }

      // Smooth damped follow (0.12 factor on mobile for responsive thumb scroll feel)
      const lerpFactor = isMobile ? 0.12 : CONFIG.CURSOR_LERP_FACTOR;
      ringPos.x += (targetPos.x - ringPos.x) * lerpFactor;
      ringPos.y += (targetPos.y - ringPos.y) * lerpFactor;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.lineWidth = isMobile
        ? CONFIG.PARTICLE_WIDTH_MOBILE
        : CONFIG.PARTICLE_WIDTH_DESKTOP;

      const ringBase = isMobile
        ? CONFIG.RING_BASE_RADIUS * 0.8
        : CONFIG.RING_BASE_RADIUS;
      const ringThick = CONFIG.RING_THICKNESS;
      const intensity = CONFIG.INTENSITY;
      const pushDist = CONFIG.RING_PUSH_DISTANCE;

      // Text center attenuation box (keeps central quote space calm and readable)
      const centerBoxX = width * 0.5;
      const centerBoxY = height * 0.5;
      const textRadiusX = isMobile ? 180 : 340;
      const textRadiusY = isMobile ? 90 : 120;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Vector from ring center to particle
        const dx = p.baseX - ringPos.x;
        const dy = p.baseY - ringPos.y;
        const dist = Math.hypot(dx, dy) || 1;
        const angle = Math.atan2(dy, dx);

        // Organic, breathing ring deformation (never a mechanical circle)
        const organicRadius =
          ringBase +
          Math.sin(angle * 3 + breatheTime * 1.4) * 12 +
          Math.cos(angle * 5 - breatheTime * 0.9) * 8 +
          Math.sin(angle * 2 + breatheTime * 0.5) * 6;

        const delta = dist - organicRadius;
        const absDelta = Math.abs(delta);

        // Ring influence bell curve (0 to 1)
        const ringWeight =
          absDelta < ringThick * 1.5
            ? Math.exp(-(delta * delta) / (2 * (ringThick * 0.5) ** 2))
            : 0;

        // Radial outward push near the ring
        const push = pushDist * ringWeight;
        const px = p.baseX + (dx / dist) * push;
        const py = p.baseY + (dy / dist) * push;

        // Angle tilts tangentially along the ring contour
        const tangentAngle = angle + Math.PI * 0.5;
        const finalAngle =
          p.restingAngle * (1 - ringWeight) + tangentAngle * ringWeight;

        // Base resting shimmer
        const shimmer =
          CONFIG.SHIMMER_AMPLITUDE *
          Math.sin(breatheTime * 1.8 + p.phase * 0.1);

        // Calculate opacity based on ring proximity and inside/outside state
        let alpha = 0;
        if (dist < organicRadius - ringThick * 0.5) {
          // Inside the ring: slightly lifted ambient presence
          alpha =
            CONFIG.INSIDE_RING_OPACITY +
            (CONFIG.RING_PEAK_OPACITY - CONFIG.INSIDE_RING_OPACITY) *
              ringWeight;
        } else {
          // Along ring edge or outside in resting field
          alpha =
            CONFIG.BASE_OPACITY +
            shimmer +
            (CONFIG.RING_PEAK_OPACITY - CONFIG.BASE_OPACITY) * ringWeight;
        }

        // Quote text attenuation: quiet particles directly behind the text
        const normDistX = (px - centerBoxX) / textRadiusX;
        const normDistY = (py - centerBoxY) / textRadiusY;
        const textDist = Math.hypot(normDistX, normDistY);
        const textAttenuation = Math.min(1.0, Math.max(0.3, textDist));

        alpha = Math.max(0, Math.min(1, alpha * intensity * textAttenuation));

        if (alpha < 0.005) continue;

        // Render rounded dash
        const half = (p.length * (1 + ringWeight * 0.35)) * 0.5;
        const cosA = Math.cos(finalAngle);
        const sinA = Math.sin(finalAngle);

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(px - cosA * half, py - sinA * half);
        ctx.lineTo(px + cosA * half, py + sinA * half);
        ctx.stroke();
      }

      animId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (isRunning || prefersReducedMotion) return;
      isRunning = true;
      startTime = performance.now();
      animId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    // IntersectionObserver: render only while section is on screen
    const observerTarget = containerRef?.current || parent;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { rootMargin: "150px" }
    );

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    // Pause when tab is inactive
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopLoop();
      } else if (isVisible) {
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Initial setup
    handleResize();
    setIsLoaded(true);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (observerTarget) {
      resizeObserver.observe(observerTarget);
    }

    return () => {
      stopLoop();
      themeObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (parent) {
        parent.removeEventListener("pointermove", onPointerMove);
        parent.removeEventListener("pointerenter", onPointerEnter);
        parent.removeEventListener("pointerleave", onPointerLeave);
      }
      if (idleTimer) clearTimeout(idleTimer);
      if (observerTarget) {
        observer.unobserve(observerTarget);
        resizeObserver.unobserve(observerTarget);
      }
    };
  }, [containerRef, scrollProgressRef, isMobileProp]);

  return (
    <div
      className={`${styles.bgCanvasWrapper} ${isLoaded ? styles.bgCanvasWrapperLoaded : ""}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.bgCanvas} />
    </div>
  );
}
