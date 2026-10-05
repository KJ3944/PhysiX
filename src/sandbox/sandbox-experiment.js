/**
 * PhysiX • Experiment 4: Physics Sandbox (Interactive Newtonian Playground)
 * Full interactive physics laboratory with live object controls,
 * force application vectors, real-time telemetry, graphs, and educational feedback.
 */

import { PhysicsWorld, PhysicsObject } from "./physics-engine.js";
import { SandboxGraphs } from "./sandbox-graphs.js";

export function createPhysicsSandboxExperiment(callbacks = {}) {
  const { showToast, onXpAwarded } = callbacks;

  // Sandbox State
  const state = {
    isRunning: false,
    speedMultiplier: 1.0,
    selectedObjectId: null,
    draggedObject: null,
    dragOffset: { x: 0, y: 0 },
    appliedForceMagnitude: 30, // Newtons
    continuousForceDir: null,   // "left" | "right" | "up" | "down" | null
    gravityValue: 9.81,
    scale: 48, // pixels per meter
    worldWidthMeters: 20.0,
    worldHeightMeters: 11.66
  };

  // Instantiate Core Physics World
  const world = new PhysicsWorld({
    gravity: state.gravityValue,
    gravityEnabled: true
  });

  let animFrameId = null;
  let lastTimestamp = 0;
  let graphs = null;

  // DOM Elements cache
  let canvas = null;
  let ctx = null;
  let graphsCanvas = null;

  /**
   * Initialize Sandbox Experiment
   */
  function init() {
    canvas = document.getElementById("sandbox-canvas");
    graphsCanvas = document.getElementById("sandbox-graphs-canvas");

    if (!canvas) return;
    ctx = canvas.getContext("2d");

    // Initialize Telemetry Graphs
    if (graphsCanvas) {
      graphs = new SandboxGraphs(graphsCanvas);
    }

    // Attach Event Listeners
    setupCanvasInteractions();
    setupSimulationControls();
    setupObjectControls();
    setupForceControls();
    setupGravityControls();
    setupPresetControls();
    setupGraphTabControls();

    // Resize handling
    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();

    // Load Default Scenario (1 Ball, 1 Box, 1 Platform)
    loadDefaultScenario();

    // Initial render
    renderCanvas();
    updateUI();
  }

  function handleResize() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cssW = Math.max(320, rect.width);
    const cssH = Math.max(380, Math.min(620, window.innerHeight * 0.58));

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;

    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Update scale (pixels per meter)
    state.scale = cssW / state.worldWidthMeters;
    state.worldHeightMeters = cssH / state.scale;
    world.bounds.xMax = state.worldWidthMeters - 0.4;
    world.bounds.yMax = state.worldHeightMeters - 0.4;

    if (graphs) graphs.resize();
    renderCanvas();
  }

  /**
   * Physics Coordinates to Canvas Pixels Conversion
   */
  function worldToCanvas(wx, wy) {
    const cx = wx * state.scale;
    const cy = (canvas.height / (window.devicePixelRatio || 1)) - (wy * state.scale);
    return { cx, cy };
  }

  function canvasToWorld(cx, cy) {
    const wx = cx / state.scale;
    const wy = ((canvas.height / (window.devicePixelRatio || 1)) - cy) / state.scale;
    return { wx, wy };
  }

  /**
   * Default Sandbox Starting Scenario
   */
  function loadDefaultScenario() {
    world.clear();
    state.isRunning = false;
    state.continuousForceDir = null;

    // Static Ground / Floor Platform
    world.addObject(new PhysicsObject({
      name: "Floor Platform",
      type: "platform",
      isStatic: true,
      x: 10.0,
      y: 0.3,
      width: 19.2,
      height: 0.6,
      color: "#334155"
    }));

    // Dynamic Ball (Cyan)
    const ball = world.addObject(new PhysicsObject({
      name: "Photon Ball",
      type: "ball",
      x: 4.5,
      y: 6.0,
      radius: 0.6,
      mass: 2.0,
      friction: 0.2,
      restitution: 0.75,
      color: "#00f0ff"
    }));

    // Dynamic Box (Solar Amber)
    const box = world.addObject(new PhysicsObject({
      name: "Solar Crate",
      type: "box",
      x: 12.0,
      y: 4.0,
      width: 1.4,
      height: 1.4,
      mass: 5.0,
      friction: 0.35,
      restitution: 0.4,
      color: "#ffaa00"
    }));

    world.saveAllInitialStates();
    selectObject(ball.id);
    if (graphs) graphs.clear();
  }

  /**
   * Canvas Mouse & Touch Interactions (Selection & Drag-to-Reposition)
   */
  function setupCanvasInteractions() {
    if (!canvas) return;

    function getEventPos(e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        cx: clientX - rect.left,
        cy: clientY - rect.top
      };
    }

    function onPointerDown(e) {
      const { cx, cy } = getEventPos(e);
      const { wx, wy } = canvasToWorld(cx, cy);

      // Hit test objects (topmost first)
      let hit = null;
      for (let i = world.objects.length - 1; i >= 0; i--) {
        const obj = world.objects[i];
        if (obj.type === "ball") {
          const dist = Math.hypot(obj.x - wx, obj.y - wy);
          if (dist <= obj.radius * 1.15) {
            hit = obj;
            break;
          }
        } else {
          const hw = obj.width / 2;
          const hh = obj.height / 2;
          if (wx >= obj.x - hw && wx <= obj.x + hw && wy >= obj.y - hh && wy <= obj.y + hh) {
            hit = obj;
            break;
          }
        }
      }

      if (hit) {
        selectObject(hit.id);
        if (!state.isRunning) {
          state.draggedObject = hit;
          state.dragOffset = { x: hit.x - wx, y: hit.y - wy };
          canvas.style.cursor = "grabbing";
        }
      } else {
        selectObject(null);
      }
      renderCanvas();
    }

    function onPointerMove(e) {
      const { cx, cy } = getEventPos(e);
      const { wx, wy } = canvasToWorld(cx, cy);

      if (state.draggedObject && !state.isRunning) {
        state.draggedObject.x = Math.max(world.bounds.xMin + 0.5, Math.min(world.bounds.xMax - 0.5, wx + state.dragOffset.x));
        state.draggedObject.y = Math.max(world.bounds.yMin + 0.5, Math.min(world.bounds.yMax - 0.5, wy + state.dragOffset.y));
        state.draggedObject.saveInitialState();
        renderCanvas();
        updateUI();
        return;
      }

      // Hover feedback
      let isHovering = false;
      for (let i = world.objects.length - 1; i >= 0; i--) {
        const obj = world.objects[i];
        if (obj.type === "ball") {
          if (Math.hypot(obj.x - wx, obj.y - wy) <= obj.radius * 1.15) {
            isHovering = true;
            break;
          }
        } else {
          const hw = obj.width / 2;
          const hh = obj.height / 2;
          if (wx >= obj.x - hw && wx <= obj.x + hw && wy >= obj.y - hh && wy <= obj.y + hh) {
            isHovering = true;
            break;
          }
        }
      }
      canvas.style.cursor = isHovering ? "grab" : "default";
    }

    function onPointerUp() {
      if (state.draggedObject) {
        state.draggedObject = null;
        canvas.style.cursor = "default";
      }
    }

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });
  }

  /**
   * Simulation Controls (Run / Pause / Reset / Speed)
   */
  function setupSimulationControls() {
    const btnRunPause = document.getElementById("btn-sandbox-run");
    const btnReset = document.getElementById("btn-sandbox-reset");
    const speedButtons = document.querySelectorAll(".sandbox-speed-btn");

    btnRunPause?.addEventListener("click", () => {
      toggleRunPause();
    });

    btnReset?.addEventListener("click", () => {
      resetSimulation();
    });

    speedButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        speedButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        state.speedMultiplier = parseFloat(btn.getAttribute("data-speed")) || 1.0;
        if (showToast) showToast(`Simulation Speed: ${state.speedMultiplier}×`);
      });
    });
  }

  function toggleRunPause() {
    state.isRunning = !state.isRunning;
    const btnRunPause = document.getElementById("btn-sandbox-run");
    const runText = btnRunPause?.querySelector(".run-text");
    const runIcon = btnRunPause?.querySelector(".run-icon");

    if (state.isRunning) {
      btnRunPause?.classList.add("btn-active-run");
      if (runText) runText.textContent = "Pause";
      if (runIcon) runIcon.innerHTML = `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>`;
      lastTimestamp = performance.now();
      startLoop();
      if (showToast) showToast("Simulation Running ▶");
    } else {
      btnRunPause?.classList.remove("btn-active-run");
      if (runText) runText.textContent = "Run";
      if (runIcon) runIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;
      stopLoop();
      if (showToast) showToast("Simulation Paused ⏸");
    }
    renderCanvas();
  }

  function resetSimulation() {
    stopLoop();
    state.isRunning = false;
    state.continuousForceDir = null;

    const btnRunPause = document.getElementById("btn-sandbox-run");
    const runText = btnRunPause?.querySelector(".run-text");
    const runIcon = btnRunPause?.querySelector(".run-icon");
    btnRunPause?.classList.remove("btn-active-run");
    if (runText) runText.textContent = "Run";
    if (runIcon) runIcon.innerHTML = `<polygon points="5 3 19 12 5 21 5 3"></polygon>`;

    world.reset();
    if (graphs) graphs.clear();
    renderCanvas();
    updateUI();
    if (showToast) showToast("Sandbox State Reset ↻");
  }

  /**
   * Main Physics & Animation Frame Loop
   */
  function startLoop() {
    if (animFrameId) cancelAnimationFrame(animFrameId);

    function loop(timestamp) {
      if (!state.isRunning) return;

      const deltaMs = Math.min(50, timestamp - (lastTimestamp || timestamp));
      lastTimestamp = timestamp;

      // Real-world fixed simulation step scaled by speed multiplier
      const dt = (deltaMs / 1000) * state.speedMultiplier;

      // Apply continuous directional force if active
      applyContinuousForce();

      // Step physics world
      world.step(dt);

      // Record sample in real-time telemetry graph
      if (graphs && state.selectedObjectId) {
        const selObj = world.getObject(state.selectedObjectId);
        if (selObj) graphs.addSample(world.time, selObj);
      }

      // Render
      renderCanvas();
      updateUI();

      animFrameId = requestAnimationFrame(loop);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  function stopLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  /**
   * Object Adding & Spawning Controls
   */
  function setupObjectControls() {
    const btnAddBall = document.getElementById("btn-add-ball");
    const btnAddBox = document.getElementById("btn-add-box");
    const btnAddPlatform = document.getElementById("btn-add-platform");
    const btnDeleteObject = document.getElementById("btn-delete-selected-obj");

    // Colors palette for dynamic variety
    const dynamicColors = ["#00f0ff", "#ffaa00", "#a855f7", "#10e7a8", "#f43f5e", "#38bdf8"];

    btnAddBall?.addEventListener("click", () => {
      const count = world.objects.filter(o => o.type === "ball").length + 1;
      const color = dynamicColors[(count - 1) % dynamicColors.length];
      const ball = world.addObject(new PhysicsObject({
        name: `Ball ${count}`,
        type: "ball",
        x: 4.0 + (Math.random() * 4.0),
        y: 8.0 + (Math.random() * 2.0),
        radius: 0.6,
        mass: 2.0,
        friction: 0.2,
        restitution: 0.75,
        color: color
      }));
      selectObject(ball.id);
      renderCanvas();
      updateUI();
      if (showToast) showToast(`Added ${ball.name}`);
    });

    btnAddBox?.addEventListener("click", () => {
      const count = world.objects.filter(o => o.type === "box").length + 1;
      const color = dynamicColors[(count) % dynamicColors.length];
      const box = world.addObject(new PhysicsObject({
        name: `Box ${count}`,
        type: "box",
        x: 8.0 + (Math.random() * 4.0),
        y: 7.0 + (Math.random() * 2.0),
        width: 1.2,
        height: 1.2,
        mass: 4.0,
        friction: 0.35,
        restitution: 0.4,
        color: color
      }));
      selectObject(box.id);
      renderCanvas();
      updateUI();
      if (showToast) showToast(`Added ${box.name}`);
    });

    btnAddPlatform?.addEventListener("click", () => {
      const count = world.objects.filter(o => o.type === "platform").length;
      const plat = world.addObject(new PhysicsObject({
        name: `Platform ${count}`,
        type: "platform",
        isStatic: true,
        x: 10.0,
        y: 4.5,
        width: 4.5,
        height: 0.4,
        color: "#475569"
      }));
      selectObject(plat.id);
      renderCanvas();
      updateUI();
      if (showToast) showToast(`Added ${plat.name}`);
    });

    btnDeleteObject?.addEventListener("click", () => {
      if (!state.selectedObjectId) return;
      const obj = world.getObject(state.selectedObjectId);
      if (obj) {
        const name = obj.name;
        world.removeObject(state.selectedObjectId);
        selectObject(world.objects[0]?.id || null);
        renderCanvas();
        updateUI();
        if (showToast) showToast(`Removed ${name}`);
      }
    });

    // Property Inputs / Sliders
    setupPropertyInputs();
  }

  function setupPropertyInputs() {
    const inputMass = document.getElementById("prop-mass");
    const inputFriction = document.getElementById("prop-friction");
    const inputRestitution = document.getElementById("prop-restitution");
    const inputSize = document.getElementById("prop-size");
    const inputVx = document.getElementById("prop-vx");
    const inputVy = document.getElementById("prop-vy");

    inputMass?.addEventListener("input", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj && !obj.isStatic) {
        obj.setMass(parseFloat(e.target.value) || 1.0);
        obj.saveInitialState();
        updateUI();
      }
    });

    inputFriction?.addEventListener("input", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj) {
        obj.friction = parseFloat(e.target.value) || 0;
        obj.saveInitialState();
        updateUI();
      }
    });

    inputRestitution?.addEventListener("input", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj) {
        obj.restitution = parseFloat(e.target.value) || 0;
        obj.saveInitialState();
        updateUI();
      }
    });

    inputSize?.addEventListener("input", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj) {
        const val = parseFloat(e.target.value) || 1.0;
        if (obj.type === "ball") {
          obj.radius = val / 2;
        } else {
          obj.width = val;
          obj.height = val;
        }
        obj.saveInitialState();
        renderCanvas();
        updateUI();
      }
    });

    inputVx?.addEventListener("change", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj && !obj.isStatic) {
        obj.vx = parseFloat(e.target.value) || 0;
        obj.saveInitialState();
        updateUI();
      }
    });

    inputVy?.addEventListener("change", (e) => {
      const obj = world.getObject(state.selectedObjectId);
      if (obj && !obj.isStatic) {
        obj.vy = parseFloat(e.target.value) || 0;
        obj.saveInitialState();
        updateUI();
      }
    });
  }

  /**
   * Force Application System (Directional buttons, magnitude slider, impulse)
   */
  function setupForceControls() {
    const inputForceMag = document.getElementById("input-force-magnitude");
    const btnForceLeft = document.getElementById("btn-force-left");
    const btnForceRight = document.getElementById("btn-force-right");
    const btnForceUp = document.getElementById("btn-force-up");
    const btnForceDown = document.getElementById("btn-force-down");
    const btnImpulse = document.getElementById("btn-apply-impulse");
    const btnClearForce = document.getElementById("btn-clear-forces");

    inputForceMag?.addEventListener("input", (e) => {
      state.appliedForceMagnitude = Math.max(1, parseFloat(e.target.value) || 10);
      const valLabel = document.getElementById("val-force-magnitude");
      if (valLabel) valLabel.textContent = `${state.appliedForceMagnitude.toFixed(0)} N`;
      updateForceDirectionVisual();
    });

    function applyDirectionalForce(dir) {
      const obj = world.getObject(state.selectedObjectId);
      if (!obj || obj.isStatic) {
        if (showToast) showToast("Select a dynamic object first!");
        return;
      }

      state.continuousForceDir = (state.continuousForceDir === dir) ? null : dir;
      updateForceButtonsUI();
      applyContinuousForce();
      renderCanvas();
      updateUI();
    }

    btnForceLeft?.addEventListener("click", () => applyDirectionalForce("left"));
    btnForceRight?.addEventListener("click", () => applyDirectionalForce("right"));
    btnForceUp?.addEventListener("click", () => applyDirectionalForce("up"));
    btnForceDown?.addEventListener("click", () => applyDirectionalForce("down"));

    btnImpulse?.addEventListener("click", () => {
      const obj = world.getObject(state.selectedObjectId);
      if (!obj || obj.isStatic) {
        if (showToast) showToast("Select a dynamic object first!");
        return;
      }

      // Apply directional kick in current direction or to the right by default
      const mag = state.appliedForceMagnitude;
      const pulseDuration = 0.15; // 0.15s kick
      let fx = 0, fy = 0;
      if (state.continuousForceDir === "left") fx = -mag;
      else if (state.continuousForceDir === "right") fx = mag;
      else if (state.continuousForceDir === "up") fy = mag;
      else if (state.continuousForceDir === "down") fy = -mag;
      else fx = mag; // Default rightwards

      obj.applyImpulse(fx * pulseDuration, fy * pulseDuration);
      if (showToast) showToast(`Impulse ${(mag * pulseDuration).toFixed(1)} N·s applied!`);
      renderCanvas();
      updateUI();
    });

    btnClearForce?.addEventListener("click", () => {
      state.continuousForceDir = null;
      world.objects.forEach(o => o.clearForces());
      updateForceButtonsUI();
      renderCanvas();
      updateUI();
      if (showToast) showToast("External forces cleared.");
    });
  }

  function applyContinuousForce() {
    const obj = world.getObject(state.selectedObjectId);
    if (!obj || obj.isStatic) return;

    obj.clearForces();
    if (!state.continuousForceDir) return;

    const F = state.appliedForceMagnitude;
    if (state.continuousForceDir === "left") obj.fx = -F;
    if (state.continuousForceDir === "right") obj.fx = F;
    if (state.continuousForceDir === "up") obj.fy = F;
    if (state.continuousForceDir === "down") obj.fy = -F;
  }

  function updateForceButtonsUI() {
    const btnForceLeft = document.getElementById("btn-force-left");
    const btnForceRight = document.getElementById("btn-force-right");
    const btnForceUp = document.getElementById("btn-force-up");
    const btnForceDown = document.getElementById("btn-force-down");

    btnForceLeft?.classList.toggle("active-force", state.continuousForceDir === "left");
    btnForceRight?.classList.toggle("active-force", state.continuousForceDir === "right");
    btnForceUp?.classList.toggle("active-force", state.continuousForceDir === "up");
    btnForceDown?.classList.toggle("active-force", state.continuousForceDir === "down");
  }

  function updateForceDirectionVisual() {
    if (state.continuousForceDir) {
      applyContinuousForce();
      renderCanvas();
    }
  }

  /**
   * Planetary Gravity Controls & Presets
   */
  function setupGravityControls() {
    const sliderGravity = document.getElementById("sandbox-gravity");
    const valGravity = document.getElementById("val-sandbox-gravity");
    const presetButtons = document.querySelectorAll(".sandbox-planet-btn");

    sliderGravity?.addEventListener("input", (e) => {
      const g = parseFloat(e.target.value) || 0;
      setGravity(g);
      presetButtons.forEach(b => b.classList.remove("active"));
    });

    presetButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        presetButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const g = parseFloat(btn.getAttribute("data-gravity")) || 0;
        setGravity(g);
        if (sliderGravity) sliderGravity.value = g;
        if (showToast) showToast(`Planetary Gravity: ${btn.getAttribute("data-name")} (${g} m/s²)`);
      });
    });
  }

  function setGravity(g) {
    state.gravityValue = g;
    world.setGravity(g);
    const valGravity = document.getElementById("val-sandbox-gravity");
    if (valGravity) valGravity.textContent = `${g.toFixed(2)} m/s²`;
    renderCanvas();
    updateUI();
  }

  /**
   * Preset Scenarios
   */
  function setupPresetControls() {
    const btnPresetFreeFall = document.getElementById("btn-preset-freefall");
    const btnPresetPushBox = document.getElementById("btn-preset-pushbox");
    const btnPresetCollision = document.getElementById("btn-preset-collision");
    const btnPresetFriction = document.getElementById("btn-preset-friction");

    btnPresetFreeFall?.addEventListener("click", () => {
      loadPresetFreeFall();
      if (showToast) showToast("Scenario Loaded: Free Fall under Gravity");
    });

    btnPresetPushBox?.addEventListener("click", () => {
      loadPresetPushBox();
      if (showToast) showToast("Scenario Loaded: Push a Box (F = ma vs Friction)");
    });

    btnPresetCollision?.addEventListener("click", () => {
      loadPresetCollision();
      if (showToast) showToast("Scenario Loaded: Two-Object Kinetic Collision");
    });

    btnPresetFriction?.addEventListener("click", () => {
      loadPresetFriction();
      if (showToast) showToast("Scenario Loaded: Friction Comparison Test");
    });
  }

  function loadPresetFreeFall() {
    resetSimulation();
    world.clear();
    setGravity(9.81);

    // Floor
    world.addObject(new PhysicsObject({
      name: "Ground Surface",
      type: "platform",
      isStatic: true,
      x: 10.0,
      y: 0.3,
      width: 19.2,
      height: 0.6,
      color: "#334155"
    }));

    // Ball dropped from high altitude (8.5m)
    const ball = world.addObject(new PhysicsObject({
      name: "Gravity Sphere",
      type: "ball",
      x: 10.0,
      y: 9.0,
      radius: 0.7,
      mass: 3.0,
      friction: 0.2,
      restitution: 0.8,
      color: "#00f0ff"
    }));

    world.saveAllInitialStates();
    selectObject(ball.id);
    if (graphs) graphs.setMode("position");
    renderCanvas();
    updateUI();
  }

  function loadPresetPushBox() {
    resetSimulation();
    world.clear();
    setGravity(9.81);

    // Floor
    world.addObject(new PhysicsObject({
      name: "Friction Floor",
      type: "platform",
      isStatic: true,
      x: 10.0,
      y: 0.3,
      width: 19.2,
      height: 0.6,
      color: "#334155"
    }));

    // Box with friction
    const box = world.addObject(new PhysicsObject({
      name: "Cargo Crate",
      type: "box",
      x: 3.0,
      y: 1.4,
      width: 1.5,
      height: 1.5,
      mass: 5.0,
      friction: 0.25,
      restitution: 0.3,
      color: "#ffaa00"
    }));

    // Apply continuous horizontal force
    state.appliedForceMagnitude = 35;
    state.continuousForceDir = "right";
    const sliderF = document.getElementById("input-force-magnitude");
    if (sliderF) sliderF.value = 35;
    const valF = document.getElementById("val-force-magnitude");
    if (valF) valF.textContent = "35 N";
    updateForceButtonsUI();

    world.saveAllInitialStates();
    selectObject(box.id);
    if (graphs) graphs.setMode("velocity");
    renderCanvas();
    updateUI();
  }

  function loadPresetCollision() {
    resetSimulation();
    world.clear();
    setGravity(0); // In space zero-gravity to highlight pure elastic momentum

    const ballA = world.addObject(new PhysicsObject({
      name: "Impactor Sphere",
      type: "ball",
      x: 3.5,
      y: 5.5,
      vx: 6.0,
      vy: 0,
      radius: 0.8,
      mass: 4.0,
      friction: 0.05,
      restitution: 1.0,
      color: "#00f0ff"
    }));

    const ballB = world.addObject(new PhysicsObject({
      name: "Target Sphere",
      type: "ball",
      x: 13.0,
      y: 5.5,
      vx: -2.0,
      vy: 0,
      radius: 0.6,
      mass: 2.0,
      friction: 0.05,
      restitution: 1.0,
      color: "#f43f5e"
    }));

    world.saveAllInitialStates();
    selectObject(ballA.id);
    if (graphs) graphs.setMode("velocity");
    renderCanvas();
    updateUI();
  }

  function loadPresetFriction() {
    resetSimulation();
    world.clear();
    setGravity(9.81);

    // Elevated Long Platform
    world.addObject(new PhysicsObject({
      name: "Test Track",
      type: "platform",
      isStatic: true,
      x: 10.0,
      y: 4.5,
      width: 18.0,
      height: 0.5,
      color: "#334155"
    }));

    // Box 1: Low Friction (Teflon / Ice)
    const boxLow = world.addObject(new PhysicsObject({
      name: "Low Friction Crate",
      type: "box",
      x: 2.5,
      y: 5.5,
      vx: 8.0,
      vy: 0,
      width: 1.2,
      height: 1.2,
      mass: 3.0,
      friction: 0.05,
      restitution: 0.2,
      color: "#00f0ff"
    }));

    // Box 2: High Friction (Rubber / Sandpaper)
    const boxHigh = world.addObject(new PhysicsObject({
      name: "High Friction Crate",
      type: "box",
      x: 2.5,
      y: 1.4,
      vx: 8.0,
      vy: 0,
      width: 1.2,
      height: 1.2,
      mass: 3.0,
      friction: 0.65,
      restitution: 0.2,
      color: "#ffaa00"
    }));

    // Ground floor
    world.addObject(new PhysicsObject({
      name: "Ground Floor",
      type: "platform",
      isStatic: true,
      x: 10.0,
      y: 0.3,
      width: 19.2,
      height: 0.6,
      color: "#334155"
    }));

    world.saveAllInitialStates();
    selectObject(boxLow.id);
    if (graphs) graphs.setMode("velocity");
    renderCanvas();
    updateUI();
  }

  /**
   * Graph Tabs (Position / Velocity / Kinetic Energy)
   */
  function setupGraphTabControls() {
    const tabPos = document.getElementById("tab-graph-pos");
    const tabVel = document.getElementById("tab-graph-vel");
    const tabEnergy = document.getElementById("tab-graph-energy");
    const allTabs = [tabPos, tabVel, tabEnergy];

    tabPos?.addEventListener("click", () => {
      allTabs.forEach(t => t?.classList.remove("active"));
      tabPos.classList.add("active");
      if (graphs) graphs.setMode("position");
    });

    tabVel?.addEventListener("click", () => {
      allTabs.forEach(t => t?.classList.remove("active"));
      tabVel.classList.add("active");
      if (graphs) graphs.setMode("velocity");
    });

    tabEnergy?.addEventListener("click", () => {
      allTabs.forEach(t => t?.classList.remove("active"));
      tabEnergy.classList.add("active");
      if (graphs) graphs.setMode("energy");
    });
  }

  function selectObject(id) {
    state.selectedObjectId = id;
    if (graphs) graphs.setSelectedObject(id);
    updateUI();
    renderCanvas();
  }

  /**
   * Real-time Canvas Rendering
   */
  function renderCanvas() {
    if (!ctx || !canvas) return;
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    ctx.clearRect(0, 0, w, h);

    // 1. Deep Space Canvas Background with Atmospheric Vignette
    const bgGrad = ctx.createRadialGradient(w / 2, h * 0.4, 40, w / 2, h * 0.5, w * 0.7);
    bgGrad.addColorStop(0, "#08122c");
    bgGrad.addColorStop(0.55, "#040816");
    bgGrad.addColorStop(1, "#020309");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Coordinate Grid & Measurement Markings (1m and 5m lines)
    ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    for (let m = 1; m < state.worldWidthMeters; m++) {
      const { cx } = worldToCanvas(m, 0);
      ctx.beginPath();
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, h);
      ctx.stroke();
    }

    for (let m = 1; m < state.worldHeightMeters; m++) {
      const { cy } = worldToCanvas(0, m);
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(w, cy);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Major 5m Axis Markers
    ctx.fillStyle = "rgba(125, 211, 252, 0.4)";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "left";
    for (let m = 0; m <= state.worldWidthMeters; m += 2) {
      const { cx, cy } = worldToCanvas(m, 0.15);
      ctx.fillText(`${m}m`, cx + 3, cy - 2);
    }
    for (let m = 2; m <= state.worldHeightMeters; m += 2) {
      const { cx, cy } = worldToCanvas(0.15, m);
      ctx.fillText(`${m}m`, cx + 3, cy - 3);
    }

    // 3. Render Objects
    for (let i = 0; i < world.objects.length; i++) {
      const obj = world.objects[i];
      renderObject(obj);
    }

    // 4. Render Active Simulation Banner Overlays
    renderCanvasHUD(w, h);
  }

  function renderObject(obj) {
    const { cx, cy } = worldToCanvas(obj.x, obj.y);
    const isSelected = (obj.id === state.selectedObjectId);

    ctx.save();

    if (obj.type === "ball") {
      const rPx = obj.radius * state.scale;

      // Drop Shadow
      ctx.shadowColor = obj.color;
      ctx.shadowBlur = isSelected ? 22 : 10;

      // Ball Radial 3D Sphere Gradient
      const sphereGrad = ctx.createRadialGradient(
        cx - rPx * 0.35, cy - rPx * 0.35, rPx * 0.1,
        cx, cy, rPx
      );
      sphereGrad.addColorStop(0, "#ffffff");
      sphereGrad.addColorStop(0.3, obj.color);
      sphereGrad.addColorStop(1, "#030712");

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
      ctx.fill();

      // Border Rim
      ctx.strokeStyle = isSelected ? "#ffffff" : obj.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Selection Halo Brackets
      if (isSelected) {
        drawSelectionReticle(cx, cy, rPx + 7, rPx + 7);
      }

      // Mass label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${obj.mass.toFixed(1)}kg`, cx, cy);

    } else if (obj.type === "box") {
      const wPx = obj.width * state.scale;
      const hPx = obj.height * state.scale;
      const xLeft = cx - wPx / 2;
      const yTop = cy - hPx / 2;

      ctx.shadowColor = obj.color;
      ctx.shadowBlur = isSelected ? 20 : 8;

      // Box Linear Metal Gradient
      const boxGrad = ctx.createLinearGradient(xLeft, yTop, xLeft + wPx, yTop + hPx);
      boxGrad.addColorStop(0, obj.color);
      boxGrad.addColorStop(0.5, "rgba(20, 28, 50, 0.95)");
      boxGrad.addColorStop(1, "#050914");

      ctx.fillStyle = boxGrad;
      ctx.beginPath();
      ctx.roundRect(xLeft, yTop, wPx, hPx, 8);
      ctx.fill();

      ctx.strokeStyle = isSelected ? "#ffffff" : obj.color;
      ctx.lineWidth = isSelected ? 2.5 : 1.5;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center crosshair
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy); ctx.lineTo(cx + 8, cy);
      ctx.moveTo(cx, cy - 8); ctx.lineTo(cx, cy + 8);
      ctx.stroke();

      // Selection Halo
      if (isSelected) {
        drawSelectionReticle(cx, cy, wPx / 2 + 7, hPx / 2 + 7);
      }

      // Mass Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${obj.mass.toFixed(1)}kg`, cx, cy);

    } else if (obj.type === "platform") {
      const wPx = obj.width * state.scale;
      const hPx = obj.height * state.scale;
      const xLeft = cx - wPx / 2;
      const yTop = cy - hPx / 2;

      // Static Platform Steel Body
      const platGrad = ctx.createLinearGradient(xLeft, yTop, xLeft, yTop + hPx);
      platGrad.addColorStop(0, "#475569");
      platGrad.addColorStop(0.3, "#1e293b");
      platGrad.addColorStop(1, "#0f172a");

      ctx.fillStyle = platGrad;
      ctx.beginPath();
      ctx.roundRect(xLeft, yTop, wPx, hPx, 6);
      ctx.fill();

      // Anchor Diagonal Hatching Pattern
      ctx.strokeStyle = "rgba(56, 189, 248, 0.2)";
      ctx.lineWidth = 1.5;
      for (let x = xLeft; x < xLeft + wPx; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, yTop + hPx);
        ctx.lineTo(Math.min(xLeft + wPx, x + 12), yTop);
        ctx.stroke();
      }

      ctx.strokeStyle = isSelected ? "#00f0ff" : "rgba(100, 116, 139, 0.8)";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      // Static Anchor Tag
      ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("ANCHOR [STATIC]", cx, cy + 3);

      if (isSelected) {
        drawSelectionReticle(cx, cy, wPx / 2 + 6, hPx / 2 + 6);
      }
    }

    // 5. Draw Velocity Vector (Cyan Arrow)
    if (!obj.isStatic && (Math.abs(obj.vx) > 0.05 || Math.abs(obj.vy) > 0.05)) {
      const speed = obj.getSpeed();
      const scaleV = Math.min(60, speed * 8); // Scale vector length for visibility
      const vEndX = cx + (obj.vx / speed) * scaleV;
      const vEndY = cy - (obj.vy / speed) * scaleV; // Note Y-flip

      drawArrow(cx, cy, vEndX, vEndY, "#00f0ff", 2, `${speed.toFixed(1)} m/s`);
    }

    // 6. Draw Applied Force Vector (Amber/Red Arrow)
    if (!obj.isStatic && (Math.abs(obj.fx) > 0.1 || Math.abs(obj.fy) > 0.1)) {
      const Fmag = Math.hypot(obj.fx, obj.fy);
      const scaleF = Math.min(80, Math.max(30, Fmag * 1.5));
      const fEndX = cx + (obj.fx / Fmag) * scaleF;
      const fEndY = cy - (obj.fy / Fmag) * scaleF;

      drawArrow(cx, cy, fEndX, fEndY, "#ff3b69", 3, `F = ${Fmag.toFixed(0)}N`);
    }

    ctx.restore();
  }

  /**
   * Helper: Draw Arrow with Glowing Vector Label
   */
  function drawArrow(fromX, fromY, toX, toY, color, width, label) {
    const headLen = 9;
    const angle = Math.atan2(toY - fromY, toX - fromX);

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;

    // Shaft
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    // Arrowhead
    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // Label
    if (label) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, toX + Math.cos(angle) * 14, toY + Math.sin(angle) * 14);
    }

    ctx.restore();
  }

  /**
   * Helper: Cybernetic Selection Reticle
   */
  function drawSelectionReticle(cx, cy, hw, hh) {
    const bracketLen = 8;
    ctx.save();
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2;
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 10;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy - hh + bracketLen);
    ctx.lineTo(cx - hw, cy - hh);
    ctx.lineTo(cx - hw + bracketLen, cy - hh);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(cx + hw - bracketLen, cy - hh);
    ctx.lineTo(cx + hw, cy - hh);
    ctx.lineTo(cx + hw, cy - hh + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(cx - hw, cy + hh - bracketLen);
    ctx.lineTo(cx - hw, cy + hh);
    ctx.lineTo(cx - hw + bracketLen, cy + hh);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cx + hw - bracketLen, cy + hh);
    ctx.lineTo(cx + hw, cy + hh);
    ctx.lineTo(cx + hw, cy + hh - bracketLen);
    ctx.stroke();

    ctx.restore();
  }

  /**
   * Canvas Top HUD Badges
   */
  function renderCanvasHUD(w, h) {
    // Mode badge at top left
    ctx.fillStyle = "rgba(4, 8, 22, 0.85)";
    ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(14, 14, 250, 26, 8);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = state.isRunning ? "#10e7a8" : "#f59e0b";
    ctx.beginPath();
    ctx.arc(26, 27, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 10px 'Orbitron', monospace";
    ctx.textAlign = "left";
    ctx.fillText(
      state.isRunning ? `● RUNNING (${world.time.toFixed(1)}s)` : "● PAUSED / READY",
      36,
      30
    );

    // Coordinate Reference Legend at bottom right
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.fillText("Coordinate Origin: Ground Level (y = 0m)", w - 16, h - 12);
  }

  /**
   * Update HTML UI Panels (Selected Object Inspector, Telemetry, Educational Feedback)
   */
  function updateUI() {
    updateObjectSelectorList();
    updatePropertyInspector();
    updateLiveTelemetry();
    updateEducationalFeedback();
  }

  function updateObjectSelectorList() {
    const listContainer = document.getElementById("sandbox-objects-pills");
    if (!listContainer) return;

    listContainer.innerHTML = "";
    world.objects.forEach(obj => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = `sandbox-obj-pill ${obj.id === state.selectedObjectId ? "active" : ""}`;
      pill.innerHTML = `
        <span class="pill-dot" style="background:${obj.color};"></span>
        <span>${obj.name}</span>
      `;
      pill.addEventListener("click", () => selectObject(obj.id));
      listContainer.appendChild(pill);
    });
  }

  function updatePropertyInspector() {
    const titleEl = document.getElementById("inspector-obj-name");
    const badgeEl = document.getElementById("inspector-obj-type");
    const cardDynamicProps = document.getElementById("inspector-dynamic-props");
    const cardStaticNotice = document.getElementById("inspector-static-notice");

    const inputMass = document.getElementById("prop-mass");
    const valMass = document.getElementById("val-prop-mass");
    const inputFriction = document.getElementById("prop-friction");
    const valFriction = document.getElementById("val-prop-friction");
    const inputRestitution = document.getElementById("prop-restitution");
    const valRestitution = document.getElementById("val-prop-restitution");
    const inputSize = document.getElementById("prop-size");
    const valSize = document.getElementById("val-prop-size");
    const inputVx = document.getElementById("prop-vx");
    const inputVy = document.getElementById("prop-vy");

    const obj = world.getObject(state.selectedObjectId);

    if (!obj) {
      if (titleEl) titleEl.textContent = "No Object Selected";
      if (badgeEl) badgeEl.textContent = "NONE";
      if (cardDynamicProps) cardDynamicProps.classList.add("hidden");
      if (cardStaticNotice) cardStaticNotice.classList.add("hidden");
      return;
    }

    if (titleEl) titleEl.textContent = obj.name;
    if (badgeEl) {
      badgeEl.textContent = obj.isStatic ? "STATIC ANCHOR" : `DYNAMIC ${obj.type.toUpperCase()}`;
      badgeEl.style.color = obj.isStatic ? "#94a3b8" : "#00f0ff";
    }

    if (obj.isStatic) {
      if (cardDynamicProps) cardDynamicProps.classList.add("hidden");
      if (cardStaticNotice) cardStaticNotice.classList.remove("hidden");
    } else {
      if (cardDynamicProps) cardDynamicProps.classList.remove("hidden");
      if (cardStaticNotice) cardStaticNotice.classList.add("hidden");

      if (inputMass) inputMass.value = obj.mass;
      if (valMass) valMass.textContent = `${obj.mass.toFixed(1)} kg`;
      if (inputFriction) inputFriction.value = obj.friction;
      if (valFriction) valFriction.textContent = obj.friction.toFixed(2);
      if (inputRestitution) inputRestitution.value = obj.restitution;
      if (valRestitution) valRestitution.textContent = obj.restitution.toFixed(2);

      const sizeVal = obj.type === "ball" ? (obj.radius * 2) : obj.width;
      if (inputSize) inputSize.value = sizeVal;
      if (valSize) valSize.textContent = `${sizeVal.toFixed(1)} m`;

      if (inputVx && document.activeElement !== inputVx) inputVx.value = obj.vx.toFixed(2);
      if (inputVy && document.activeElement !== inputVy) inputVy.value = obj.vy.toFixed(2);
    }
  }

  function updateLiveTelemetry() {
    const telMass = document.getElementById("tel-mass");
    const telPos = document.getElementById("tel-position");
    const telVel = document.getElementById("tel-velocity");
    const telSpeed = document.getElementById("tel-speed");
    const telAcc = document.getElementById("tel-acceleration");
    const telForce = document.getElementById("tel-net-force");
    const telEnergy = document.getElementById("tel-kinetic-energy");

    const obj = world.getObject(state.selectedObjectId);

    if (!obj) {
      if (telMass) telMass.textContent = "-- kg";
      if (telPos) telPos.textContent = "(--, --) m";
      if (telVel) telVel.textContent = "(--, --) m/s";
      if (telSpeed) telSpeed.textContent = "-- m/s";
      if (telAcc) telAcc.textContent = "(--, --) m/s²";
      if (telForce) telForce.textContent = "-- N";
      if (telEnergy) telEnergy.textContent = "-- J";
      return;
    }

    if (telMass) telMass.textContent = obj.isStatic ? "∞ kg" : `${obj.mass.toFixed(2)} kg`;
    if (telPos) telPos.textContent = `(${obj.x.toFixed(2)}, ${obj.y.toFixed(2)}) m`;
    if (telVel) telVel.textContent = `(${obj.vx.toFixed(2)}, ${obj.vy.toFixed(2)}) m/s`;
    if (telSpeed) telSpeed.textContent = `${obj.getSpeed().toFixed(2)} m/s`;
    if (telAcc) telAcc.textContent = `(${obj.ax.toFixed(2)}, ${obj.ay.toFixed(2)}) m/s²`;
    if (telForce) telForce.textContent = `${obj.getNetForceMagnitude().toFixed(1)} N`;
    if (telEnergy) telEnergy.textContent = `${obj.getKineticEnergy().toFixed(1)} J`;
  }

  function updateEducationalFeedback() {
    const fmaEq = document.getElementById("edu-fma-equation");
    const explText = document.getElementById("edu-explanation-text");

    const obj = world.getObject(state.selectedObjectId);

    if (!obj || obj.isStatic) {
      if (fmaEq) fmaEq.innerHTML = `<span>F<sub>net</sub> = m · a</span> &nbsp;⟺&nbsp; <span>a = F<sub>net</sub> / m</span>`;
      if (explText) explText.textContent = "Select a dynamic body to observe Newton's Second Law in real-time.";
      return;
    }

    const netF = obj.getNetForceMagnitude();
    const mass = obj.mass;
    const acc = Math.hypot(obj.ax, obj.ay);

    if (fmaEq) {
      fmaEq.innerHTML = `
        <span style="color:#ff3b69;">F<sub>net</sub> (${netF.toFixed(1)} N)</span> = 
        <span style="color:#00f0ff;">m (${mass.toFixed(1)} kg)</span> × 
        <span style="color:#10e7a8;">a (${acc.toFixed(2)} m/s²)</span>
      `;
    }

    if (explText) {
      if (state.continuousForceDir) {
        explText.innerHTML = `<strong>Active Force:</strong> An external thrust of ${state.appliedForceMagnitude} N causes an instantaneous acceleration of <strong>${(state.appliedForceMagnitude / mass).toFixed(2)} m/s²</strong>. Doubling mass would halve this acceleration.`;
      } else if (world.gravityEnabled && Math.abs(obj.vy) > 0.1 && obj.y > 0.8) {
        explText.innerHTML = `<strong>Gravitational Kinematics:</strong> Under gravity <em>g = ${world.gravity.toFixed(2)} m/s²</em>, all bodies experience identical downward acceleration regardless of mass!`;
      } else if (Math.abs(obj.vx) > 0.1) {
        explText.innerHTML = `<strong>Friction & Drag:</strong> Kinetic friction opposes the object's velocity, exerting a counter-force that bleeds kinetic energy into thermal dissipation.`;
      } else {
        explText.innerHTML = `<strong>Newton's First Law:</strong> Object is in equilibrium (Net force is balanced by contact normal force). It remains at rest unless acted upon by an unbalanced force.`;
      }
    }
  }

  /**
   * Cleanup
   */
  function destroy() {
    stopLoop();
    window.removeEventListener("resize", handleResize);
  }

  return {
    init,
    renderAll: () => {
      handleResize();
      renderCanvas();
      updateUI();
    },
    destroy
  };
}
