/**
 * PhysiX • Interactive Deep-Space Scientific Homepage Engine
 * 
 * Features:
 * - Multi-layer cosmic starfield with depth-based parallax
 * - Keplerian orbital trajectories with gravitational lensing deflection
 * - Invisible cursor physics field with soft repulsion & vortex dynamics
 * - Soft radial cursor luminescence (touch-friendly fallback)
 * - Directional specular sheen tracking cursor over PhysiX title
 * - High-precision interactive "Explore Simulations" button with warp transition
 * - Micro-animation initialization lifecycle
 */

export function initHomepage(options = {}) {
  const {
    onExplore = () => {},
    onOpenTerms = () => {},
    onOpenPrivacy = () => {}
  } = options;

  const homeEl = document.getElementById("physix-home");
  const canvas = document.getElementById("home-space-canvas");
  const titleEl = document.querySelector(".home-title");
  const exploreButtons = Array.from(homeEl ? homeEl.querySelectorAll(".btn-explore-simulations") : []);
  const termsButtons = Array.from(document.querySelectorAll("#home-link-terms, .home-link-terms"));
  const privacyButtons = Array.from(document.querySelectorAll("#home-link-privacy, .home-link-privacy"));
  const scrollHint = document.getElementById("home-scroll-hint");

  if (!homeEl || !canvas) {
    console.warn("[Homepage] Elements missing for initialization.");
    return { destroy: () => {} };
  }

  // Smooth scroll depth tracking to modulate cursor intensity deeper into the page
  let currentScrollY = window.scrollY || 0;
  let targetScrollY = currentScrollY;

  const handleScroll = () => {
    targetScrollY = window.scrollY || 0;
  };
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Respect prefers-reduced-motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;

  // ----------------------------------------------------
  // 1. Canvas Context & Resizing
  // ----------------------------------------------------
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();

  // ----------------------------------------------------
  // 2. Cursor State & Physics Field
  // ----------------------------------------------------
  const mouse = {
    x: width / 2,
    y: height / 2,
    targetX: width / 2,
    targetY: height / 2,
    vx: 0,
    vy: 0,
    isHovering: false,
    hasMoved: false
  };

  const handlePointerMove = (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
    mouse.isHovering = true;
    mouse.hasMoved = true;

    // Specular sheen angle on title
    if (titleEl) {
      const rect = titleEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const angleRad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
      const angleDeg = (angleRad * (180 / Math.PI) + 360) % 360;
      titleEl.style.setProperty("--sheen-angle", `${angleDeg}deg`);
    }
  };

  const handlePointerLeave = () => {
    mouse.isHovering = false;
    mouse.targetX = width / 2;
    mouse.targetY = height / 2;
  };

  window.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("pointerleave", handlePointerLeave, { passive: true });

  // ----------------------------------------------------
  // 2b. Deformable Title Letters Setup
  // ----------------------------------------------------
  let letterEls = titleEl ? Array.from(titleEl.querySelectorAll(".home-letter")) : [];
  if (titleEl && letterEls.length === 0) {
    const rawNodes = Array.from(titleEl.childNodes);
    const frag = document.createDocumentFragment();
    rawNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split("").forEach(char => {
          if (char.trim() === "") {
            frag.appendChild(document.createTextNode(char));
          } else {
            const span = document.createElement("span");
            span.className = "home-letter";
            span.textContent = char;
            frag.appendChild(span);
          }
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.classList.add("home-letter");
        frag.appendChild(node);
      }
    });
    titleEl.innerHTML = "";
    titleEl.appendChild(frag);
    letterEls = Array.from(titleEl.querySelectorAll(".home-letter"));
  }

  const letterStates = letterEls.map(el => ({
    el,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    vRot: 0,
    skewX: 0,
    vSkewX: 0,
    scaleX: 1,
    scaleY: 1
  }));

  // ----------------------------------------------------
  // 3. Multi-Depth Cosmic Starfield & Physics Particles
  // ----------------------------------------------------
  const STAR_COUNT = width < 768 ? 90 : 160;
  const stars = [];

  for (let i = 0; i < STAR_COUNT; i++) {
    // Layer 0: Distant micro-stars (slow parallax, zero repulsion)
    // Layer 1: Midground stellar dust (medium parallax, soft deflection)
    // Layer 2: Foreground physics quanta (fast parallax, active repulsion & spring)
    const layer = Math.random() < 0.6 ? 0 : (Math.random() < 0.85 ? 1 : 2);
    const x = Math.random() * width;
    const y = Math.random() * height;

    stars.push({
      x,
      y,
      originX: x,
      originY: y,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: layer === 0 ? Math.random() * 0.9 + 0.5 : (layer === 1 ? Math.random() * 1.4 + 0.8 : Math.random() * 2.2 + 1.2),
      layer,
      alpha: Math.random() * 0.6 + 0.25,
      baseAlpha: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.025 + 0.008,
      twinklePhase: Math.random() * Math.PI * 2,
      // Colors: 0: cyan, 1: cool blue-white, 2: purple-indigo
      color: Math.random() > 0.65 ? 0 : (Math.random() > 0.35 ? 1 : 2)
    });
  }

  // ----------------------------------------------------
  // 4. Mathematical Keplerian Orbital Trajectories
  // ----------------------------------------------------
  const orbits = [
    {
      rx: Math.min(width * 0.42, 540),
      ry: Math.min(height * 0.34, 320),
      tilt: -22 * (Math.PI / 180),
      color: "rgba(56, 189, 248, 0.18)",
      glowColor: "rgba(0, 240, 255, 0.4)",
      satelliteAngle: 0.8,
      speed: 0.18
    },
    {
      rx: Math.min(width * 0.36, 450),
      ry: Math.min(height * 0.26, 240),
      tilt: 38 * (Math.PI / 180),
      color: "rgba(168, 85, 247, 0.16)",
      glowColor: "rgba(168, 85, 247, 0.4)",
      satelliteAngle: 2.4,
      speed: -0.22
    },
    {
      rx: Math.min(width * 0.28, 340),
      ry: Math.min(height * 0.18, 160),
      tilt: 75 * (Math.PI / 180),
      color: "rgba(99, 102, 241, 0.15)",
      glowColor: "rgba(129, 140, 248, 0.45)",
      satelliteAngle: 4.1,
      speed: 0.28
    }
  ];

  // ----------------------------------------------------
  // 5. Main Simulation & Animation Loop
  // ----------------------------------------------------
  let isRunning = true;
  let animFrameId = null;
  let lastTime = performance.now();
  let warpFactor = 1.0;
  let isWarping = false;

  function render(time) {
    if (!isRunning) return;

    const dt = Math.min((time - lastTime) / 1000, 0.08);
    lastTime = time;

    // Smooth cursor interpolation (damping)
    if (!prefersReduced) {
      const prevX = mouse.x;
      const prevY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;
      mouse.vx = mouse.x - prevX;
      mouse.vy = mouse.y - prevY;
    }

    // Touch autonomous Lissajous drift if no cursor input yet
    if (isTouchDevice && !mouse.hasMoved) {
      mouse.targetX = width / 2 + Math.sin(time * 0.0006) * (width * 0.18);
      mouse.targetY = height / 2 + Math.cos(time * 0.0008) * (height * 0.14);
    }

    ctx.clearRect(0, 0, width, height);

    // Smooth scroll position tracking
    currentScrollY += (targetScrollY - currentScrollY) * 0.12;
    const heroH = height || window.innerHeight || 800;
    const scrollRatio = Math.min(Math.max(currentScrollY / heroH, 0), 2.0);
    // Cursor intensity gently eases from 1.0 down to ~0.35 beyond the hero
    const cursorIntensity = Math.max(0.35, 1.0 - scrollRatio * 0.65);
    const parallaxScale = Math.max(0.45, 1.0 - scrollRatio * 0.55);
    const driftScale = Math.max(0.7, 1.0 - scrollRatio * 0.3);

    // Parallax Offsets from center
    const cx = width / 2;
    const cy = height / 2;
    const normX = ((mouse.x - cx) / cx) * parallaxScale;
    const normY = ((mouse.y - cy) / cy) * parallaxScale;

    // A. Soft Cursor Luminescence (Physics Light Field)
    if (!isTouchDevice && mouse.isHovering && !prefersReduced) {
      const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 240);
      glowGrad.addColorStop(0, `rgba(0, 240, 255, ${(0.08 * cursorIntensity).toFixed(4)})`);
      glowGrad.addColorStop(0.4, `rgba(168, 85, 247, ${(0.04 * cursorIntensity).toFixed(4)})`);
      glowGrad.addColorStop(1, "rgba(2, 4, 10, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 240, 0, Math.PI * 2);
      ctx.fill();
    }

    // B. Keplerian Orbital Trajectories with Gravitational Curvature
    for (let oIdx = 0; oIdx < orbits.length; oIdx++) {
      const orb = orbits[oIdx];
      // Parallax center for this orbit
      const orbCenterX = cx + normX * (oIdx + 1) * 8;
      const orbCenterY = cy + normY * (oIdx + 1) * 8;

      // Draw path with Gravitational Lensing Distortion near cursor
      ctx.beginPath();
      const SEGMENTS = 72;
      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        // Unrotated ellipse point
        const px = orb.rx * Math.cos(theta);
        const py = orb.ry * Math.sin(theta);
        // Rotate by tilt
        const cosT = Math.cos(orb.tilt);
        const sinT = Math.sin(orb.tilt);
        let worldX = orbCenterX + (px * cosT - py * sinT);
        let worldY = orbCenterY + (px * sinT + py * cosT);

        // Elastic Spacetime Curvature near Cursor
        if (!prefersReduced && mouse.isHovering) {
          const dx = worldX - mouse.x;
          const dy = worldY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const INFLUENCE = 170;
          if (dist < INFLUENCE && dist > 1) {
            const force = Math.pow(1 - dist / INFLUENCE, 2) * (22 * cursorIntensity);
            worldX += (dx / dist) * force;
            worldY += (dy / dist) * force;
          }
        }

        if (s === 0) ctx.moveTo(worldX, worldY);
        else ctx.lineTo(worldX, worldY);
      }

      ctx.strokeStyle = orb.color;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Satellite Photon on this Orbit
      orb.satelliteAngle = (orb.satelliteAngle + orb.speed * dt * warpFactor) % (Math.PI * 2);
      const satPx = orb.rx * Math.cos(orb.satelliteAngle);
      const satPy = orb.ry * Math.sin(orb.satelliteAngle);
      const satCos = Math.cos(orb.tilt);
      const satSin = Math.sin(orb.tilt);
      const satWorldX = orbCenterX + (satPx * satCos - satPy * satSin);
      const satWorldY = orbCenterY + (satPx * satSin + satPy * satCos);

      // Satellite glow halo
      ctx.beginPath();
      ctx.arc(satWorldX, satWorldY, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = orb.glowColor;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // C. Stars & Particles with Physics Interactions
    for (let i = 0; i < stars.length; i++) {
      const p = stars[i];

      // Layer Parallax Shifts
      const parallaxCoeff = p.layer === 0 ? 8 : (p.layer === 1 ? 18 : 32);
      const targetParallaxX = normX * parallaxCoeff;
      const targetParallaxY = normY * parallaxCoeff;

      // Base drift
      p.originX += p.vx * warpFactor * driftScale;
      p.originY += p.vy * warpFactor * driftScale;

      // Wrap-around viewport
      if (p.originX < 0) p.originX = width;
      if (p.originX > width) p.originX = 0;
      if (p.originY < 0) p.originY = height;
      if (p.originY > height) p.originY = 0;

      // Equilibrium coordinate
      const eqX = p.originX + targetParallaxX;
      const eqY = p.originY + targetParallaxY;

      // Physics Interaction for Foreground & Midground
      if (!prefersReduced && p.layer > 0 && mouse.isHovering) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Subtle, restrained influence radius — gentle enough to feel atmospheric
        const radius = p.layer === 2 ? 80 : 55;

        if (dist < radius && dist > 1) {
          // Gentle repulsion — low magnitude so particles drift, not flee
          const normDx = dx / dist;
          const normDy = dy / dist;
          const repelMag = Math.pow(1 - dist / radius, 2) * (p.layer === 2 ? 12 : 6) * cursorIntensity;

          // Very subtle vortex curl for natural independence
          const curlX = -normDy * repelMag * 0.2;
          const curlY = normDx * repelMag * 0.2;

          p.vx += (normDx * repelMag + curlX) * dt;
          p.vy += (normDy * repelMag + curlY) * dt;
        }
      }

      // Gentle independent micro-drift so particles never fully synchronize
      p.vx += (Math.random() - 0.5) * 0.02 * dt;
      p.vy += (Math.random() - 0.5) * 0.02 * dt;

      // Restoring Spring Force back toward equilibrium
      const springK = p.layer === 2 ? 2.2 : 1.6;
      const damp = 0.88;
      p.vx += (eqX - p.x) * springK * dt;
      p.vy += (eqY - p.y) * springK * dt;
      p.vx *= damp;
      p.vy *= damp;

      // Soft velocity cap to prevent runaway clustering
      const maxVel = p.layer === 2 ? 0.9 : 0.5;
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > maxVel) {
        p.vx = (p.vx / speed) * maxVel;
        p.vy = (p.vy / speed) * maxVel;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Scintillation / Twinkle
      p.twinklePhase += p.twinkleSpeed;
      const alpha = p.baseAlpha + Math.sin(p.twinklePhase) * 0.25;
      const clampedAlpha = Math.max(0.12, Math.min(0.95, alpha));

      // Color Palette
      let colorStr = "rgba(224, 242, 254, "; // White-blue
      if (p.color === 0) colorStr = "rgba(56, 189, 248, "; // Cyan
      else if (p.color === 2) colorStr = "rgba(192, 132, 252, "; // Violet

      ctx.fillStyle = `${colorStr}${clampedAlpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * (isWarping ? 1.5 : 1), 0, Math.PI * 2);
      ctx.fill();
    }

    // D. Interactive Elastic Spacetime Deformation on Title Letters
    if (letterStates.length > 0) {
      const INFLUENCE_DIST = 175;
      const MAX_PUSH = 28;
      const SPRING_K = 9.0;
      const DAMPING = 0.82;

      for (let l = 0; l < letterStates.length; l++) {
        const item = letterStates[l];
        let targetX = 0;
        let targetY = 0;
        let targetRot = 0;
        let targetSkewX = 0;
        let targetScaleX = 1;
        let targetScaleY = 1;

        if (mouse.isHovering && !prefersReduced) {
          const rect = item.el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 - item.x;
          const centerY = rect.top + rect.height / 2 - item.y;

          const dx = centerX - mouse.x;
          const dy = centerY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < INFLUENCE_DIST && dist > 1) {
            const norm = 1 - dist / INFLUENCE_DIST;
            const push = Math.pow(norm, 1.4) * MAX_PUSH * cursorIntensity;
            const ndx = dx / dist;
            const ndy = dy / dist;

            // Elastic repulsion from cursor
            targetX = ndx * push;
            targetY = ndy * push;

            // Angular torque & shear deformation
            targetRot = ndx * ndy * 26 * norm;
            targetSkewX = -ndx * norm * 18;

            // Fluid elongation along repulsion vector
            targetScaleX = 1 + Math.abs(ndx) * norm * 0.2 - Math.abs(ndy) * norm * 0.1;
            targetScaleY = 1 + Math.abs(ndy) * norm * 0.2 - Math.abs(ndx) * norm * 0.1;
          }
        }

        // Spring & Damper integration
        const fx = (targetX - item.x) * SPRING_K;
        const fy = (targetY - item.y) * SPRING_K;
        const fRot = (targetRot - item.rot) * (SPRING_K * 0.9);
        const fSkew = (targetSkewX - item.skewX) * (SPRING_K * 0.9);

        item.vx = (item.vx + fx * dt) * DAMPING;
        item.vy = (item.vy + fy * dt) * DAMPING;
        item.vRot = (item.vRot + fRot * dt) * DAMPING;
        item.vSkewX = (item.vSkewX + fSkew * dt) * DAMPING;

        item.x += item.vx;
        item.y += item.vy;
        item.rot += item.vRot;
        item.skewX += item.vSkewX;
        item.scaleX += (targetScaleX - item.scaleX) * 0.18;
        item.scaleY += (targetScaleY - item.scaleY) * 0.18;

        item.el.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0) rotate(${item.rot.toFixed(2)}deg) skewX(${item.skewX.toFixed(2)}deg) scale(${item.scaleX.toFixed(3)}, ${item.scaleY.toFixed(3)})`;
      }
    }

    animFrameId = requestAnimationFrame(render);
  }

  animFrameId = requestAnimationFrame(render);

  // ----------------------------------------------------
  // 6. Micro-Animation Initialization Sequence
  // ----------------------------------------------------
  requestAnimationFrame(() => {
    // Fast initial frame settling
    setTimeout(() => {
      homeEl.classList.add("is-ready");
    }, 40);
  });


  // ----------------------------------------------------
  // 7. Interactive Physics Buttons & Warp Pulse on Click
  // ----------------------------------------------------
  let isNavigating = false;

  const handleExploreClick = (e) => {
    e.preventDefault();
    if (isNavigating) return;
    isNavigating = true;

    // Create energetic warp pulse effect
    const pulseRing = document.createElement("div");
    pulseRing.className = "home-warp-pulse";
    homeEl.appendChild(pulseRing);

    // Accelerate cosmic particles
    isWarping = true;
    warpFactor = 6.0;

    // Transition homepage out smoothly
    homeEl.classList.add("home-transition-out");

    setTimeout(() => {
      pulseRing.remove();
      if (typeof onExplore === "function") {
        onExplore();
      }
      setTimeout(() => {
        homeEl.classList.remove("home-transition-out");
        isNavigating = false;
        isWarping = false;
        warpFactor = 1.0;
      }, 500);
    }, 420);
  };

  exploreButtons.forEach(btn => {
    btn.addEventListener("click", handleExploreClick);
  });

  // ----------------------------------------------------
  // 8. Footer & Legal Links Handlers
  // ----------------------------------------------------
  const handleTermsClick = (e) => {
    e.preventDefault();
    onOpenTerms();
  };
  const handlePrivacyClick = (e) => {
    e.preventDefault();
    onOpenPrivacy();
  };

  termsButtons.forEach(btn => btn.addEventListener("click", handleTermsClick));
  privacyButtons.forEach(btn => btn.addEventListener("click", handlePrivacyClick));

  // ----------------------------------------------------
  // 9. Scroll Hint Click Handler
  // ----------------------------------------------------
  const handleScrollHintClick = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("home-about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (scrollHint) {
    scrollHint.addEventListener("click", handleScrollHintClick);
  }

  // ----------------------------------------------------
  // 10. IntersectionObserver for Scroll-Triggered Reveals
  // ----------------------------------------------------
  const revealElements = Array.from(homeEl.querySelectorAll(".reveal-on-scroll"));
  let revealObserver = null;

  if (prefersReduced) {
    revealElements.forEach(el => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("is-visible"));
  }

  // ----------------------------------------------------
  // 11. Resize Listener
  // ----------------------------------------------------
  const handleResize = () => {
    resizeCanvas();
    // Update orbit radii dynamically
    orbits[0].rx = Math.min(width * 0.42, 540);
    orbits[0].ry = Math.min(height * 0.34, 320);
    orbits[1].rx = Math.min(width * 0.36, 450);
    orbits[1].ry = Math.min(height * 0.26, 240);
    orbits[2].rx = Math.min(width * 0.28, 340);
    orbits[2].ry = Math.min(height * 0.18, 160);
  };

  window.addEventListener("resize", handleResize, { passive: true });

  // ----------------------------------------------------
  // 12. Public Teardown / Lifecycle Control
  // ----------------------------------------------------
  return {
    destroy: () => {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      exploreButtons.forEach(btn => btn.removeEventListener("click", handleExploreClick));
      termsButtons.forEach(btn => btn.removeEventListener("click", handleTermsClick));
      privacyButtons.forEach(btn => btn.removeEventListener("click", handlePrivacyClick));
      if (scrollHint) scrollHint.removeEventListener("click", handleScrollHintClick);
      if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
      }
    },
    resume: () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        animFrameId = requestAnimationFrame(render);
      }
    }
  };
}
