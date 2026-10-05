/**
 * PhysiX • Cinematic Premium Physics Laboratory Startup & Loading Screen
 * 
 * Strict Single-Axis Central Layout:
 * 1. PhysiX Atom Core Centerpiece with Mathematically Locked Electron Kinematics
 * 2. Dominant Brand Typography & Clear Subtitle Hierarchy
 * 3. High-Precision Minimal Telemetry Bar & Status Updates
 * 4. Fast, Smooth Transition into the Laboratory
 */

export function initSplashScreen(onComplete) {
  const splashEl = document.getElementById("physix-splash");
  if (!splashEl) {
    if (typeof onComplete === "function") onComplete();
    return;
  }

  // Respect prefers-reduced-motion: if reduced motion is requested, finish immediately
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    splashEl.style.display = "none";
    splashEl.setAttribute("aria-hidden", "true");
    document.body.classList.add("physix-loaded");
    if (typeof onComplete === "function") onComplete();
    return;
  }

  // DOM References
  const progressBar = document.getElementById("splash-progress-bar");
  const statusText = document.getElementById("splash-status-text");
  const statusPct = document.getElementById("splash-status-pct");
  const skipBtn = document.getElementById("splash-skip-btn");
  const canvas = document.getElementById("splash-particle-canvas");

  // SVG Atom Electrons
  const e1 = document.getElementById("splash-electron-1");
  const e2 = document.getElementById("splash-electron-2");
  const e3 = document.getElementById("splash-electron-3");

  let isDismissed = false;
  let animFrameId = null;

  // ----------------------------------------------------
  // 1. Restrained Cosmic Canvas Particle Engine
  // ----------------------------------------------------
  let ctx = null;
  let width = 0;
  let height = 0;

  const STAR_COUNT = 75;
  const starsX = new Float32Array(STAR_COUNT);
  const starsY = new Float32Array(STAR_COUNT);
  const starsSpeed = new Float32Array(STAR_COUNT);
  const starsRadius = new Float32Array(STAR_COUNT);
  const starsAlpha = new Float32Array(STAR_COUNT);
  const starsTwinkleSpeed = new Float32Array(STAR_COUNT);
  const starsColor = new Uint8Array(STAR_COUNT); // 0: cyan, 1: blue-white, 2: purple

  function initStars() {
    for (let i = 0; i < STAR_COUNT; i++) {
      starsX[i] = Math.random() * width;
      starsY[i] = Math.random() * height;
      starsSpeed[i] = Math.random() * 0.15 + 0.05; // very gentle, slow drift
      starsRadius[i] = Math.random() * 1.2 + 0.5;
      starsAlpha[i] = Math.random() * 0.7 + 0.2;
      starsTwinkleSpeed[i] = Math.random() * 0.03 + 0.01;
      starsColor[i] = Math.random() > 0.65 ? 0 : (Math.random() > 0.35 ? 1 : 2);
    }
  }

  if (canvas) {
    ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();

    const onResize = () => {
      if (!canvas || isDismissed) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });
  }

  // ----------------------------------------------------
  // 2. Telemetry Timeline & Calibration Steps
  // ----------------------------------------------------
  const telemetrySteps = [
    { threshold: 0, text: "INITIALIZING CORE..." },
    { threshold: 25, text: "CALIBRATING SIMULATION..." },
    { threshold: 55, text: "LOADING MODULES..." },
    { threshold: 80, text: "QUANTUM STABILIZATION..." },
    { threshold: 95, text: "PHYSIX ONLINE" }
  ];

  const startTime = performance.now();
  const SEQUENCE_DURATION = 1850; // Crisp 1.85s duration
  let lastPct = -1;
  let currentStepIdx = -1;

  // Mathematical Orbital Parameters for SVG Atom
  // Ellipse center = (80, 80), rx = 54, ry = 18
  const cx = 80;
  const cy = 80;
  const rx = 54;
  const ry = 18;

  let orbAngle1 = 0;
  let orbAngle2 = Math.PI * 0.66;
  let orbAngle3 = Math.PI * 1.33;

  let lastFrameTime = performance.now();

  // ----------------------------------------------------
  // 3. Smooth Animation Loop
  // ----------------------------------------------------
  function loop(now) {
    if (isDismissed) return;

    const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
    lastFrameTime = now;

    const elapsed = now - startTime;
    const rawProgress = Math.min(1, elapsed / SEQUENCE_DURATION);
    // Smooth ease-out cubic
    const easeProgress = 1 - Math.pow(1 - rawProgress, 3);
    const pct = Math.round(easeProgress * 100);

    // Advance Electron Angles along strict elliptical paths
    orbAngle1 = (orbAngle1 + 2.4 * dt) % (Math.PI * 2);
    orbAngle2 = (orbAngle2 - 2.8 * dt) % (Math.PI * 2);
    orbAngle3 = (orbAngle3 + 2.1 * dt) % (Math.PI * 2);

    if (e1) {
      e1.setAttribute("cx", (cx + rx * Math.cos(orbAngle1)).toFixed(2));
      e1.setAttribute("cy", (cy + ry * Math.sin(orbAngle1)).toFixed(2));
    }
    if (e2) {
      e2.setAttribute("cx", (cx + rx * Math.cos(orbAngle2)).toFixed(2));
      e2.setAttribute("cy", (cy + ry * Math.sin(orbAngle2)).toFixed(2));
    }
    if (e3) {
      e3.setAttribute("cx", (cx + rx * Math.cos(orbAngle3)).toFixed(2));
      e3.setAttribute("cy", (cy + ry * Math.sin(orbAngle3)).toFixed(2));
    }

    // Telemetry Progress Updates
    if (pct !== lastPct) {
      lastPct = pct;
      if (progressBar) progressBar.style.width = `${pct}%`;
      if (statusPct) statusPct.textContent = `${pct}%`;

      // Status text updates
      for (let i = telemetrySteps.length - 1; i >= 0; i--) {
        if (pct >= telemetrySteps[i].threshold) {
          if (currentStepIdx !== i) {
            currentStepIdx = i;
            if (statusText) statusText.textContent = telemetrySteps[i].text;
          }
          break;
        }
      }
    }

    // Canvas Background Rendering
    if (ctx) {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < STAR_COUNT; i++) {
        // Gentle downward/diagonal motion
        starsY[i] += starsSpeed[i];
        if (starsY[i] > height) {
          starsY[i] = 0;
          starsX[i] = Math.random() * width;
        }

        // Gentle twinkle
        starsAlpha[i] += Math.sin(now * starsTwinkleSpeed[i]) * 0.008;
        const alpha = Math.max(0.15, Math.min(0.85, starsAlpha[i]));

        ctx.fillStyle = starsColor[i] === 0 ? "#38bdf8" : (starsColor[i] === 1 ? "#e0f2fe" : "#c084fc");
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(starsX[i], starsY[i], starsRadius[i], 0, 6.283);
        ctx.fill();
      }
    }

    if (rawProgress < 1) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      setTimeout(finishAndDismiss, 160);
    }
  }

  animFrameId = requestAnimationFrame(loop);

  // ----------------------------------------------------
  // 4. Hardware-Accelerated Smooth Dismissal
  // ----------------------------------------------------
  function finishAndDismiss() {
    if (isDismissed) return;
    isDismissed = true;

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }

    splashEl.classList.add("splash-fade-out");

    if (typeof onComplete === "function") {
      onComplete();
    }

    setTimeout(() => {
      splashEl.style.display = "none";
      splashEl.setAttribute("aria-hidden", "true");
      document.body.classList.add("physix-loaded");
    }, 400);
  }

  // ----------------------------------------------------
  // 5. Interactive Skip Handlers
  // ----------------------------------------------------
  function handleImmediateLaunch() {
    if (isDismissed) return;
    if (progressBar) progressBar.style.width = "100%";
    if (statusPct) statusPct.textContent = "100%";
    if (statusText) statusText.textContent = "PHYSIX SYSTEM ONLINE";
    finishAndDismiss();
  }

  splashEl.addEventListener("click", handleImmediateLaunch, { once: true });

  if (skipBtn) {
    skipBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      handleImmediateLaunch();
    }, { once: true });
  }

  const handleKey = (e) => {
    if (isDismissed) return;
    if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
      e.preventDefault();
      handleImmediateLaunch();
      window.removeEventListener("keydown", handleKey);
    }
  };
  window.addEventListener("keydown", handleKey);
}
