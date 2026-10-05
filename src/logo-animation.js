/**
 * PhysiX • Precision Mathematical Orbital Logo Animation
 * Keeps orbital electrons strictly attached to elliptical Bohr paths:
 * x = cx + rx * cos(angle)
 * y = cy + ry * sin(angle)
 */
export function initPhysixLogoAnimation() {
  const e1 = document.getElementById("nav-electron-1");
  const e2 = document.getElementById("nav-electron-2");
  const e3 = document.getElementById("nav-electron-3");
  if (!e1 || !e2 || !e3) return;

  const cx = 50;
  const cy = 50;
  const rx = 42;
  const ry = 17;

  // Initial angles in radians
  let a1 = 0;
  let a2 = Math.PI * 0.65;
  let a3 = Math.PI * 1.35;

  // Angular velocities (rad/sec) - different speeds and counter-rotation
  const w1 = 1.35;   // Orbit 1: forward
  const w2 = -1.75;  // Orbit 2: counter-rotating
  const w3 = 1.15;   // Orbit 3: forward

  let last = performance.now();
  let animId = null;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;

    a1 = (a1 + w1 * dt) % (Math.PI * 2);
    a2 = (a2 + w2 * dt) % (Math.PI * 2);
    a3 = (a3 + w3 * dt) % (Math.PI * 2);

    // Mathematical orbital positioning:
    // x = centerX + radiusX * cos(angle)
    // y = centerY + radiusY * sin(angle)
    e1.setAttribute("cx", (cx + rx * Math.cos(a1)).toFixed(2));
    e1.setAttribute("cy", (cy + ry * Math.sin(a1)).toFixed(2));

    e2.setAttribute("cx", (cx + rx * Math.cos(a2)).toFixed(2));
    e2.setAttribute("cy", (cy + ry * Math.sin(a2)).toFixed(2));

    e3.setAttribute("cx", (cx + rx * Math.cos(a3)).toFixed(2));
    e3.setAttribute("cy", (cy + ry * Math.sin(a3)).toFixed(2));

    animId = requestAnimationFrame(step);
  }

  animId = requestAnimationFrame(step);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}
