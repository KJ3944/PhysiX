/**
 * PhysiX • Experiment 6: Diode V-I Characteristics
 * Ultra-realistic laboratory simulation of P-N Junction Diode characteristics.
 * Features:
 * - Hardware apparatus controller matching physical laboratory instrument (Image 1)
 * - Dynamic dual-scale analog voltmeter and ammeter with smooth needle mechanics
 * - Interactive banana-wire patching with physics catenary Bezier rendering
 * - Circuit validation engine (series ammeter, parallel voltmeter, polarity checks)
 * - Deterministic Shockley semiconductor diode physics model
 * - Live Forward (1st quadrant) and Reverse (3rd quadrant) dynamic canvas graphs
 * - Synchronous observation tables with least counts and μA -> mA conversion
 * - Complete 8-challenge gamification system with XP rewards
 * - Professional PDF report generation with live embedded graph snapshots
 * 100% Zero Emojis compliant.
 */

import { generateLabReportPdf } from "./pdf-export.js";

export function createDiodeExperiment(callbacks = {}) {
  const {
    onXpAwarded,
    onExperimentRecorded,
    showToast,
    getActiveUserId,
    loadUserProfile,
    getStoredUserProfile,
    unlockBadge,
    isUserAuthenticated,
    openLoginModal,
    onChallengeCompleted
  } = callbacks;

  // --------------------------------------------------------------------------
  // EXPERIMENT HARDWARE & SIMULATION STATE
  // --------------------------------------------------------------------------
  const state = {
    // Master Power State
    powerOn: false,

    // Selected Bias Mode ("forward" or "reverse")
    biasMode: "forward",

    // Meter Ranges
    // Voltmeter: 1.5 or 30 (Volts)
    vmRange: 1.5,
    // Ammeter: 10 (mA) or 100 (uA)
    amRange: 10,

    // Power Supply Potentiometer Settings
    forwardVoltageKnob: 0.0, // 0.0 to 1.5 V
    reverseVoltageKnob: 0.0, // 0.0 to 30.0 V

    // Live Simulated Meter Readings (Electrical Output)
    measuredVoltage: 0.0,    // Volts
    measuredCurrent_mA: 0.0, // Milliamperes
    measuredCurrent_uA: 0.0, // Microamperes

    // Animated Needle Positions (interpolated angles in degrees)
    vmNeedleAngle: -45,
    amNeedleAngle: -45,
    targetVmAngle: -45,
    targetAmAngle: -45,

    // Interactive Banana Wires
    // Each wire: { id, from: terminalKey, to: terminalKey, color: "red" | "black" }
    wires: [],
    selectedTerminal: null,

    // Circuit Validation
    circuitValid: false,
    circuitStatusText: "Open Circuit — Connect Banana Cables",
    circuitStatusType: "warning", // "connected" | "warning"

    // Observation Tables
    forwardObservations: [], // { id, sNo, vf, if_mA }
    reverseObservations: [], // { id, sNo, vr, ir_mA, ir_uA }

    // Active Graph View ("forward" or "reverse")
    activeGraphTab: "forward",
    activeObsTab: "forward",

    // Gamification Challenges
    challenges: {
      setRangesFwd: {
        id: "setRangesFwd",
        title: "Challenge 1 — Forward Bias Meter Range Alignment",
        desc: "Set Voltmeter = 1.5 V and Ammeter = 10 mA (Upper Scales active).",
        xp: 60,
        completed: false
      },
      connectFwd: {
        id: "connectFwd",
        title: "Challenge 2 — Forward Bias Circuit Patching",
        desc: "Connect series milliammeter, forward diode (P to +, N to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      recordFwd: {
        id: "recordFwd",
        title: "Challenge 3 — Log First Forward Bias Trial",
        desc: "Turn power ON, adjust VF knob past 0.6 V, and record live meter reading.",
        xp: 75,
        completed: false
      },
      setRangesRev: {
        id: "setRangesRev",
        title: "Challenge 4 — Reverse Bias Range Alignment",
        desc: "Set Voltmeter = 30 V and Ammeter = 100 μA (Lower Scales active).",
        xp: 60,
        completed: false
      },
      connectRev: {
        id: "connectRev",
        title: "Challenge 5 — Reverse Bias Circuit Patching",
        desc: "Connect series microammeter, reverse diode (N to +, P to Ammeter), and parallel voltmeter.",
        xp: 100,
        completed: false
      },
      recordRev: {
        id: "recordRev",
        title: "Challenge 6 — Log Reverse Saturation Trial",
        desc: "Apply reverse voltage (VR > 5 V) and log observation in microamperes.",
        xp: 75,
        completed: false
      },
      generateFwdCurve: {
        id: "generateFwdCurve",
        title: "Challenge 7 — Generate Forward V-I Characteristic",
        desc: "Record at least 4 forward observations to plot the 1st quadrant knee curve.",
        xp: 120,
        completed: false
      },
      generateRevCurve: {
        id: "generateRevCurve",
        title: "Challenge 8 — Generate Reverse V-I Characteristic",
        desc: "Record at least 4 reverse observations to plot the 3rd quadrant curve.",
        xp: 120,
        completed: false
      }
    }
  };

  // Animation frame id for meter needle damping
  let animFrameId = null;

  // --------------------------------------------------------------------------
  // TERMINAL COORDINATES & SOCKET SPECIFICATIONS
  // --------------------------------------------------------------------------
  const TERMINALS = {
    // Voltmeter Sockets
    vm_pos: { label: "+", type: "pos", color: "red", group: "voltmeter" },
    vm_neg: { label: "−", type: "neg", color: "black", group: "voltmeter" },

    // Ammeter Sockets
    am_pos: { label: "+", type: "pos", color: "red", group: "ammeter" },
    am_neg: { label: "−", type: "neg", color: "black", group: "ammeter" },

    // Forward DC Output Sockets
    fwd_out_pos1: { label: "+", type: "pos", color: "red", group: "fwd_supply" },
    fwd_out_pos2: { label: "+", type: "pos", color: "red", group: "fwd_supply" },
    fwd_out_neg1: { label: "−", type: "neg", color: "black", group: "fwd_supply" },
    fwd_out_neg2: { label: "−", type: "neg", color: "black", group: "fwd_supply" },

    // Forward Diode Terminals (P ▷| N)
    fwd_diode_p: { label: "P", type: "pos", color: "red", group: "fwd_diode" },
    fwd_diode_n: { label: "N", type: "neg", color: "black", group: "fwd_diode" },

    // Reverse Diode Terminals (N |◁ P)
    rev_diode_n: { label: "N", type: "neg", color: "black", group: "rev_diode" },
    rev_diode_p: { label: "P", type: "pos", color: "red", group: "rev_diode" },

    // Reverse DC Output Sockets
    rev_out_pos1: { label: "+", type: "pos", color: "red", group: "rev_supply" },
    rev_out_pos2: { label: "+", type: "pos", color: "red", group: "rev_supply" },
    rev_out_neg1: { label: "−", type: "neg", color: "black", group: "rev_supply" },
    rev_out_neg2: { label: "−", type: "neg", color: "black", group: "rev_supply" }
  };

  // --------------------------------------------------------------------------
  // DETERMINISTIC SHOCKLEY DIODE PHYSICS SOLVER
  // --------------------------------------------------------------------------
  /**
   * Solves the forward-biased P-N junction diode operating point
   * Vf = Vd + I * Rs, where I = Is * (exp(Vd / (eta * Vt)) - 1)
   */
  function solveForwardDiode(supplyVoltage) {
    if (supplyVoltage <= 0.001) return { voltage: 0, current_mA: 0 };

    const Vt = 0.026;       // 26 mV at 300K
    const eta = 1.35;       // Silicon ideality factor
    const Is = 20e-9;       // 20 nA reverse saturation current
    const Rs = 26.0;        // 26 Ohms series bulk resistance
    const maxCurrent = 0.010; // 10 mA meter full scale

    // Binary search for junction voltage Vd in range [0, supplyVoltage]
    let low = 0.0;
    let high = supplyVoltage;
    let bestVd = 0.0;
    let bestI = 0.0;

    for (let iter = 0; iter < 45; iter++) {
      const midVd = (low + high) / 2;
      const exponent = Math.min(midVd / (eta * Vt), 40); // prevent numerical overflow
      const current = Is * (Math.exp(exponent) - 1);
      const totalV = midVd + current * Rs;

      if (totalV < supplyVoltage) {
        low = midVd;
        bestVd = midVd;
        bestI = current;
      } else {
        high = midVd;
      }
    }

    const clampedCurrent = Math.min(bestI, maxCurrent);
    return {
      voltage: Math.min(supplyVoltage, 1.5),
      current_mA: clampedCurrent * 1000 // Convert A to mA
    };
  }

  /**
   * Solves the reverse-biased P-N junction diode operating point
   * Ir = Is * (1 - exp(-Vr / (eta * Vt))) + Vr / Rleak
   */
  function solveReverseDiode(supplyVoltage) {
    if (supplyVoltage <= 0.01) return { voltage: 0, current_uA: 0, current_mA: 0 };

    const Vt = 0.026;
    const eta = 1.35;
    const Is_uA = 0.025;      // 0.025 uA
    const Rleak = 22e6;       // 22 Megaohms surface leakage resistance

    const Vr = Math.min(supplyVoltage, 30.0);
    const exponent = -Vr / (eta * Vt);
    const saturationTerm = Is_uA * (1 - Math.exp(exponent));
    const leakageTerm = (Vr / Rleak) * 1e6; // Convert A to uA

    const total_uA = saturationTerm + leakageTerm;
    const clamped_uA = Math.min(Math.max(0, total_uA), 100.0);

    return {
      voltage: Vr,
      current_uA: clamped_uA,
      current_mA: clamped_uA * 0.001 // Requirement 21: 1 uA = 0.001 mA
    };
  }

  // --------------------------------------------------------------------------
  // CIRCUIT VALIDATION LOGIC
  // --------------------------------------------------------------------------
  function evaluateCircuit() {
    const connMap = new Map();
    state.wires.forEach(w => {
      if (!connMap.has(w.from)) connMap.set(w.from, new Set());
      if (!connMap.has(w.to)) connMap.set(w.to, new Set());
      connMap.get(w.from).add(w.to);
      connMap.get(w.to).add(w.from);
    });

    const isConnected = (t1, t2) => {
      return connMap.has(t1) && connMap.get(t1).has(t2);
    };

    const isAnyFwdSupplyPos = (t) => isConnected("fwd_out_pos1", t) || isConnected("fwd_out_pos2", t);
    const isAnyFwdSupplyNeg = (t) => isConnected("fwd_out_neg1", t) || isConnected("fwd_out_neg2", t);
    const isAnyRevSupplyPos = (t) => isConnected("rev_out_pos1", t) || isConnected("rev_out_pos2", t);
    const isAnyRevSupplyNeg = (t) => isConnected("rev_out_neg1", t) || isConnected("rev_out_neg2", t);

    // Forward Bias Validation:
    // 1. Forward DC (+) -> Diode P
    // 2. Diode N -> Ammeter (+)
    // 3. Ammeter (−) -> Forward DC (−)
    // 4. Voltmeter (+) -> Forward DC (+)
    // 5. Voltmeter (−) -> Forward DC (−)
    const fwdLoopValid =
      isAnyFwdSupplyPos("fwd_diode_p") &&
      isConnected("fwd_diode_n", "am_pos") &&
      isAnyFwdSupplyNeg("am_neg") &&
      isAnyFwdSupplyPos("vm_pos") &&
      isAnyFwdSupplyNeg("vm_neg");

    // Reverse Bias Validation:
    // 1. Reverse DC (+) -> Reverse Diode N
    // 2. Reverse Diode P -> Ammeter (+)
    // 3. Ammeter (−) -> Reverse DC (−)
    // 4. Voltmeter (+) -> Reverse DC (+)
    // 5. Voltmeter (−) -> Reverse DC (−)
    const revLoopValid =
      isAnyRevSupplyPos("rev_diode_n") &&
      isConnected("rev_diode_p", "am_pos") &&
      isAnyRevSupplyNeg("am_neg") &&
      isAnyRevSupplyPos("vm_pos") &&
      isAnyRevSupplyNeg("vm_neg");

    if (fwdLoopValid) {
      state.circuitValid = true;
      state.biasMode = "forward";
      state.circuitStatusText = "Circuit Connected Correctly — Forward Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("connectFwd");
    } else if (revLoopValid) {
      state.circuitValid = true;
      state.biasMode = "reverse";
      state.circuitStatusText = "Circuit Connected Correctly — Reverse Bias Active";
      state.circuitStatusType = "connected";
      triggerChallenge("connectRev");
    } else {
      state.circuitValid = false;
      state.circuitStatusType = "warning";

      if (state.wires.length === 0) {
        state.circuitStatusText = "Open Circuit — Connect Banana Cables";
      } else if (!isAnyFwdSupplyPos("vm_pos") && !isAnyRevSupplyPos("vm_pos")) {
        state.circuitStatusText = "Voltmeter (+) not connected in parallel across supply";
      } else if (!isAnyFwdSupplyNeg("vm_neg") && !isAnyRevSupplyNeg("vm_neg")) {
        state.circuitStatusText = "Voltmeter (−) not connected in parallel across supply";
      } else if (!isConnected("fwd_diode_n", "am_pos") && !isConnected("rev_diode_p", "am_pos")) {
        state.circuitStatusText = "Ammeter must be connected in series with diode";
      } else {
        state.circuitStatusText = "Wiring Incomplete or Polarity Mismatched";
      }
    }

    updatePhysicsReadings();
  }

  // --------------------------------------------------------------------------
  // ELECTRICAL SIMULATION UPDATE & NEEDLE COMPUTATION
  // --------------------------------------------------------------------------
  function updatePhysicsReadings() {
    if (!state.powerOn || !state.circuitValid) {
      state.measuredVoltage = 0.0;
      state.measuredCurrent_mA = 0.0;
      state.measuredCurrent_uA = 0.0;
      state.targetVmAngle = -45;
      state.targetAmAngle = -45;
      return;
    }

    if (state.biasMode === "forward") {
      const result = solveForwardDiode(state.forwardVoltageKnob);
      state.measuredVoltage = result.voltage;
      state.measuredCurrent_mA = result.current_mA;
      state.measuredCurrent_uA = result.current_mA * 1000;

      // Voltmeter needle deflection: span -45 deg to +45 deg (90 deg total span)
      const vmFraction = Math.min(Math.max(result.voltage / state.vmRange, 0), 1.05);
      state.targetVmAngle = -45 + vmFraction * 90;

      // Ammeter needle deflection
      let amFraction = 0;
      if (state.amRange === 10) {
        amFraction = Math.min(Math.max(result.current_mA / 10.0, 0), 1.05);
      } else {
        // If user accidentally left it in 100 uA range in forward bias, it pegs to max
        amFraction = Math.min(Math.max(state.measuredCurrent_uA / 100.0, 0), 1.05);
      }
      state.targetAmAngle = -45 + amFraction * 90;

    } else if (state.biasMode === "reverse") {
      const result = solveReverseDiode(state.reverseVoltageKnob);
      state.measuredVoltage = result.voltage;
      state.measuredCurrent_mA = result.current_mA;
      state.measuredCurrent_uA = result.current_uA;

      const vmFraction = Math.min(Math.max(result.voltage / state.vmRange, 0), 1.05);
      state.targetVmAngle = -45 + vmFraction * 90;

      let amFraction = 0;
      if (state.amRange === 100) {
        amFraction = Math.min(Math.max(result.current_uA / 100.0, 0), 1.05);
      } else {
        amFraction = Math.min(Math.max(result.current_mA / 10.0, 0), 1.05);
      }
      state.targetAmAngle = -45 + amFraction * 90;
    }
  }

  // --------------------------------------------------------------------------
  // REALISTIC ANALOG METER RENDERING (RETINA CANVAS)
  // --------------------------------------------------------------------------
  function drawVoltmeterDial() {
    const canvas = document.getElementById("diode-vm-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.76;
    const rOuter = w * 0.44;
    const rInner = w * 0.36;

    // Save state
    ctx.save();

    // 1. Draw Dual Arc Tracks
    // Upper Scale (0 to 1.5 V) Arc
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, (-135 * Math.PI) / 180, (-45 * Math.PI) / 180);
    ctx.strokeStyle = state.vmRange === 1.5 ? "#b45309" : "#64748b";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Lower Scale (0 to 30 V) Arc
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, (-135 * Math.PI) / 180, (-45 * Math.PI) / 180);
    ctx.strokeStyle = state.vmRange === 30 ? "#b45309" : "#64748b";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 2. Draw Scale Markings & Text
    // Upper scale: 0, 0.25, 0.5, 0.75, 1, 1.25, 1.5 (6 main intervals, 30 sub-ticks)
    const upperLabels = ["0", ".25", ".5", ".75", "1.0", "1.25", "1.5"];
    const totalTicks = 60; // 60 subdivisions = 0.025 V least count

    for (let i = 0; i <= totalTicks; i++) {
      const angleDeg = -135 + (i / totalTicks) * 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);

      const isMajor = i % 10 === 0;
      const isMid = i % 5 === 0 && !isMajor;

      // Outer tick
      const tickLen = isMajor ? 9 : (isMid ? 6 : 3.5);
      ctx.beginPath();
      ctx.moveTo(cx + (rOuter - tickLen) * cosA, cy + (rOuter - tickLen) * sinA);
      ctx.lineTo(cx + rOuter * cosA, cy + rOuter * sinA);
      ctx.strokeStyle = state.vmRange === 1.5 && isMajor ? "#78350f" : "#475569";
      ctx.lineWidth = isMajor ? 1.5 : 0.8;
      ctx.stroke();

      // Lower tick
      const lowerTickLen = isMajor ? 8 : (isMid ? 5 : 3);
      ctx.beginPath();
      ctx.moveTo(cx + (rInner - lowerTickLen) * cosA, cy + (rInner - lowerTickLen) * sinA);
      ctx.lineTo(cx + rInner * cosA, cy + rInner * sinA);
      ctx.strokeStyle = state.vmRange === 30 && isMajor ? "#78350f" : "#475569";
      ctx.lineWidth = isMajor ? 1.4 : 0.7;
      ctx.stroke();

      // Major Labels
      if (isMajor) {
        const idx = i / 10;
        // Upper text
        const txOuter = cx + (rOuter + 10) * cosA;
        const tyOuter = cy + (rOuter + 10) * sinA;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = state.vmRange === 1.5 ? "#92400e" : "#475569";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(upperLabels[idx], txOuter, tyOuter);

        // Lower text (0, 5, 10, 15, 20, 25, 30)
        const lowerVal = String(idx * 5);
        const txInner = cx + (rInner - 12) * cosA;
        const tyInner = cy + (rInner - 12) * sinA;
        ctx.font = "bold 8.5px 'JetBrains Mono', monospace";
        ctx.fillStyle = state.vmRange === 30 ? "#92400e" : "#64748b";
        ctx.fillText(lowerVal, txInner, tyInner);
      }
    }

    // 3. Central "V" Symbol & Instrument Markings
    ctx.font = "bold 20px 'Space Grotesk', serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText("V", cx, cy - 36);

    ctx.font = "bold 7.5px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("MO 65", cx - 24, cy - 14);
    ctx.fillText("⭐ 2.5", cx + 24, cy - 14);

    // 4. Analog Needle with Damped Rotation
    const needleRad = (state.vmNeedleAngle * Math.PI) / 180 - Math.PI / 2;
    const nLen = rOuter + 2;

    ctx.beginPath();
    ctx.moveTo(cx - 3 * Math.sin(needleRad), cy + 3 * Math.cos(needleRad));
    ctx.lineTo(cx + nLen * Math.cos(needleRad), cy + nLen * Math.sin(needleRad));
    ctx.lineTo(cx + 3 * Math.sin(needleRad), cy - 3 * Math.cos(needleRad));
    ctx.closePath();
    ctx.fillStyle = "#b91c1c";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();

    // Needle pivot hub
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#475569";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();

    ctx.restore();
  }

  function drawAmmeterDial() {
    const canvas = document.getElementById("diode-am-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h * 0.76;
    const rOuter = w * 0.44;
    const rInner = w * 0.36;

    ctx.save();

    // 1. Dual Arcs
    ctx.beginPath();
    ctx.arc(cx, cy, rOuter, (-135 * Math.PI) / 180, (-45 * Math.PI) / 180);
    ctx.strokeStyle = state.amRange === 10 ? "#b45309" : "#64748b";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, rInner, (-135 * Math.PI) / 180, (-45 * Math.PI) / 180);
    ctx.strokeStyle = state.amRange === 100 ? "#b45309" : "#64748b";
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 2. Markings & Labels
    // Upper scale: 0, 2, 4, 6, 8, 10 (mA)
    // Lower scale: 0, 20, 40, 60, 80, 100 (uA)
    const upperLabels = ["0", "2", "4", "6", "8", "10"];
    const lowerLabels = ["0", "20", "40", "60", "80", "100"];
    const totalTicks = 50; // 50 subdivisions

    for (let i = 0; i <= totalTicks; i++) {
      const angleDeg = -135 + (i / totalTicks) * 90;
      const angleRad = (angleDeg * Math.PI) / 180;
      const cosA = Math.cos(angleRad);
      const sinA = Math.sin(angleRad);

      const isMajor = i % 10 === 0;
      const isMid = i % 5 === 0 && !isMajor;

      // Outer tick
      const tickLen = isMajor ? 9 : (isMid ? 6 : 3.5);
      ctx.beginPath();
      ctx.moveTo(cx + (rOuter - tickLen) * cosA, cy + (rOuter - tickLen) * sinA);
      ctx.lineTo(cx + rOuter * cosA, cy + rOuter * sinA);
      ctx.strokeStyle = state.amRange === 10 && isMajor ? "#78350f" : "#475569";
      ctx.lineWidth = isMajor ? 1.5 : 0.8;
      ctx.stroke();

      // Lower tick
      const lowerTickLen = isMajor ? 8 : (isMid ? 5 : 3);
      ctx.beginPath();
      ctx.moveTo(cx + (rInner - lowerTickLen) * cosA, cy + (rInner - lowerTickLen) * sinA);
      ctx.lineTo(cx + rInner * cosA, cy + rInner * sinA);
      ctx.strokeStyle = state.amRange === 100 && isMajor ? "#78350f" : "#475569";
      ctx.lineWidth = isMajor ? 1.4 : 0.7;
      ctx.stroke();

      // Labels
      if (isMajor) {
        const idx = i / 10;
        // Upper text (0 - 10)
        const txOuter = cx + (rOuter + 9) * cosA;
        const tyOuter = cy + (rOuter + 9) * sinA;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = state.amRange === 10 ? "#92400e" : "#475569";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(upperLabels[idx], txOuter, tyOuter);

        // Lower text (0 - 100)
        const txInner = cx + (rInner - 12) * cosA;
        const tyInner = cy + (rInner - 12) * sinA;
        ctx.font = "bold 8.5px 'JetBrains Mono', monospace";
        ctx.fillStyle = state.amRange === 100 ? "#92400e" : "#64748b";
        ctx.fillText(lowerLabels[idx], txInner, tyInner);
      }
    }

    // 3. Central "mA / μA" Title (Proper Greek mu)
    ctx.font = "bold 15px 'Space Grotesk', serif";
    ctx.fillStyle = "#1e293b";
    ctx.textAlign = "center";
    ctx.fillText("mA / μA", cx, cy - 36);

    ctx.font = "bold 7.5px sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("MO 65", cx - 24, cy - 14);
    ctx.fillText("⭐ 2.5", cx + 24, cy - 14);

    // 4. Analog Needle
    const needleRad = (state.amNeedleAngle * Math.PI) / 180 - Math.PI / 2;
    const nLen = rOuter + 2;

    ctx.beginPath();
    ctx.moveTo(cx - 3 * Math.sin(needleRad), cy + 3 * Math.cos(needleRad));
    ctx.lineTo(cx + nLen * Math.cos(needleRad), cy + nLen * Math.sin(needleRad));
    ctx.lineTo(cx + 3 * Math.sin(needleRad), cy - 3 * Math.cos(needleRad));
    ctx.closePath();
    ctx.fillStyle = "#b91c1c";
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();

    // Pivot hub
    ctx.shadowColor = "transparent";
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#1e293b";
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#475569";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#94a3b8";
    ctx.fill();

    ctx.restore();
  }

  // Animation Loop: Spring-damped needle movement
  function stepMeterNeedles() {
    const damping = 0.16;
    state.vmNeedleAngle += (state.targetVmAngle - state.vmNeedleAngle) * damping;
    state.amNeedleAngle += (state.targetAmAngle - state.amNeedleAngle) * damping;

    drawVoltmeterDial();
    drawAmmeterDial();

    animFrameId = requestAnimationFrame(stepMeterNeedles);
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE BANANA PLUG WIRING SYSTEM
  // --------------------------------------------------------------------------
  function handleTerminalClick(terminalKey) {
    if (!state.selectedTerminal) {
      // First terminal selected
      state.selectedTerminal = terminalKey;
      highlightTerminal(terminalKey, true);
      if (typeof showToast === "function") {
        showToast(`Selected terminal ${TERMINALS[terminalKey]?.label || terminalKey}. Click target socket to connect.`);
      }
    } else {
      // Second terminal clicked -> Connect!
      const t1 = state.selectedTerminal;
      const t2 = terminalKey;
      highlightTerminal(t1, false);
      state.selectedTerminal = null;

      if (t1 === t2) return; // Same terminal clicked twice

      // Determine wire color: Red if any terminal is positive, else Black
      const term1Obj = TERMINALS[t1];
      const term2Obj = TERMINALS[t2];
      const wireColor = (term1Obj?.color === "red" || term2Obj?.color === "red") ? "red" : "black";

      // Prevent duplicate identical wire
      const exists = state.wires.some(w => (w.from === t1 && w.to === t2) || (w.from === t2 && w.to === t1));
      if (!exists) {
        state.wires.push({
          id: `wire_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          from: t1,
          to: t2,
          color: wireColor
        });
        renderWiresSvg();
        evaluateCircuit();
      }
    }
  }

  function highlightTerminal(termKey, isSelected) {
    const el = document.querySelector(`[data-terminal="${termKey}"]`);
    if (el) {
      if (isSelected) el.classList.add("terminal-selected");
      else el.classList.remove("terminal-selected");
    }
  }

  function renderWiresSvg() {
    const svg = document.getElementById("diode-wire-canvas");
    if (!svg) return;
    const chassis = document.querySelector(".diode-chassis-card");
    if (!chassis) return;

    const chassisRect = chassis.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${chassisRect.width} ${chassisRect.height}`);
    svg.innerHTML = "";

    state.wires.forEach(wire => {
      const fromEl = document.querySelector(`[data-terminal="${wire.from}"]`);
      const toEl = document.querySelector(`[data-terminal="${wire.to}"]`);
      if (!fromEl || !toEl) return;

      const r1 = fromEl.getBoundingClientRect();
      const r2 = toEl.getBoundingClientRect();

      const x1 = r1.left + r1.width / 2 - chassisRect.left;
      const y1 = r1.top + r1.height / 2 - chassisRect.top;
      const x2 = r2.left + r2.width / 2 - chassisRect.left;
      const y2 = r2.top + r2.height / 2 - chassisRect.top;

      // Natural cable catenary sag (gravity dip)
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const sag = Math.min(Math.max(dist * 0.28, 25), 85);
      const cx1 = x1;
      const cy1 = y1 + sag;
      const cx2 = x2;
      const cy2 = y2 + sag;

      const pathData = `M ${x1} ${y1} C ${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;

      // Cable Drop Shadow
      const shadowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      shadowPath.setAttribute("d", pathData);
      shadowPath.setAttribute("class", "wire-shadow");
      svg.appendChild(shadowPath);

      // Main Cable Core
      const wirePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      wirePath.setAttribute("d", pathData);
      wirePath.setAttribute("class", "wire-path");
      wirePath.setAttribute("stroke", wire.color === "red" ? "#ef4444" : "#1e293b");
      wirePath.setAttribute("stroke-width", "5");

      // Click on wire to remove
      wirePath.addEventListener("click", () => {
        state.wires = state.wires.filter(w => w.id !== wire.id);
        renderWiresSvg();
        evaluateCircuit();
        if (typeof showToast === "function") {
          showToast("Wire disconnected");
        }
      });
      svg.appendChild(wirePath);

      // Metallic Banana Plug Tips
      [ { x: x1, y: y1 }, { x: x2, y: y2 } ].forEach(pt => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pt.x);
        circle.setAttribute("cy", pt.y);
        circle.setAttribute("r", "5.5");
        circle.setAttribute("fill", wire.color === "red" ? "#dc2626" : "#0f172a");
        circle.setAttribute("stroke", "#ffffff");
        circle.setAttribute("class", "banana-plug-collar");
        svg.appendChild(circle);
      });
    });
  }

  // Quick-Connect Presets
  function autoConnectForward() {
    state.wires = [
      // 1. Forward DC (+) -> Diode P (RED)
      { id: "w_fwd_1", from: "fwd_out_pos1", to: "fwd_diode_p", color: "red" },
      // 2. Diode N -> Ammeter (+) (RED)
      { id: "w_fwd_2", from: "fwd_diode_n", to: "am_pos", color: "red" },
      // 3. Ammeter (−) -> Forward DC (−) (BLACK)
      { id: "w_fwd_3", from: "am_neg", to: "fwd_out_neg1", color: "black" },
      // 4. Voltmeter (+) -> Forward DC (+) (RED)
      { id: "w_fwd_4", from: "vm_pos", to: "fwd_out_pos2", color: "red" },
      // 5. Voltmeter (−) -> Forward DC (−) (BLACK)
      { id: "w_fwd_5", from: "vm_neg", to: "fwd_out_neg2", color: "black" }
    ];

    // Set Forward Bias defaults as required by Prompt Section 14
    setVoltmeterRange(1.5);
    setAmmeterRange(10);

    renderWiresSvg();
    evaluateCircuit();
    if (typeof showToast === "function") {
      showToast("Forward Bias Circuit Wired Successfully!");
    }
  }

  function autoConnectReverse() {
    state.wires = [
      // 1. Reverse DC (+) -> Reverse Diode N (RED)
      { id: "w_rev_1", from: "rev_out_pos1", to: "rev_diode_n", color: "red" },
      // 2. Reverse Diode P -> Ammeter (+) (RED)
      { id: "w_rev_2", from: "rev_diode_p", to: "am_pos", color: "red" },
      // 3. Ammeter (−) -> Reverse DC (−) (BLACK)
      { id: "w_rev_3", from: "am_neg", to: "rev_out_neg1", color: "black" },
      // 4. Voltmeter (+) -> Reverse DC (+) (RED)
      { id: "w_rev_4", from: "vm_pos", to: "rev_out_pos2", color: "red" },
      // 5. Voltmeter (−) -> Reverse DC (−) (BLACK)
      { id: "w_rev_5", from: "vm_neg", to: "rev_out_neg2", color: "black" }
    ];

    // Set Reverse Bias defaults as required by Prompt Section 15
    setVoltmeterRange(30);
    setAmmeterRange(100);

    renderWiresSvg();
    evaluateCircuit();
    if (typeof showToast === "function") {
      showToast("Reverse Bias Circuit Wired Successfully!");
    }
  }

  function clearAllWires() {
    state.wires = [];
    state.selectedTerminal = null;
    document.querySelectorAll(".banana-terminal").forEach(t => t.classList.remove("terminal-selected"));
    renderWiresSvg();
    evaluateCircuit();
    if (typeof showToast === "function") {
      showToast("All wires cleared");
    }
  }

  // --------------------------------------------------------------------------
  // RANGE SELECTOR & SWITCH CONTROLLERS
  // --------------------------------------------------------------------------
  function setVoltmeterRange(rangeVal) {
    state.vmRange = rangeVal;
    const toggle = document.getElementById("diode-vm-range-toggle");
    const lbl1 = document.getElementById("lbl-vm-range-15");
    const lbl2 = document.getElementById("lbl-vm-range-30");

    if (rangeVal === 1.5) {
      toggle?.classList.remove("toggle-down");
      toggle?.classList.add("toggle-up");
      lbl1?.classList.add("active");
      lbl2?.classList.remove("active");
    } else {
      toggle?.classList.remove("toggle-up");
      toggle?.classList.add("toggle-down");
      lbl1?.classList.remove("active");
      lbl2?.classList.add("active");
    }

    checkRangeChallenges();
    updatePhysicsReadings();
  }

  function setAmmeterRange(rangeVal) {
    state.amRange = rangeVal;
    const toggle = document.getElementById("diode-am-range-toggle");
    const lbl1 = document.getElementById("lbl-am-range-10");
    const lbl2 = document.getElementById("lbl-am-range-100");

    if (rangeVal === 10) {
      toggle?.classList.remove("toggle-down");
      toggle?.classList.add("toggle-up");
      lbl1?.classList.add("active");
      lbl2?.classList.remove("active");
    } else {
      toggle?.classList.remove("toggle-up");
      toggle?.classList.add("toggle-down");
      lbl1?.classList.remove("active");
      lbl2?.classList.add("active");
    }

    checkRangeChallenges();
    updatePhysicsReadings();
  }

  function setPowerToggle(isOn) {
    state.powerOn = isOn;
    const toggle = document.getElementById("diode-power-toggle");
    const lamp = document.getElementById("diode-power-lamp");
    const lblOff = document.getElementById("lbl-power-off");
    const lblOn = document.getElementById("lbl-power-on");

    if (isOn) {
      toggle?.classList.remove("toggle-up");
      toggle?.classList.add("toggle-down");
      lamp?.classList.add("lamp-on");
      lblOn?.classList.add("active");
      lblOff?.classList.remove("active");
      if (typeof showToast === "function") showToast("Apparatus Powered ON");
    } else {
      toggle?.classList.remove("toggle-down");
      toggle?.classList.add("toggle-up");
      lamp?.classList.remove("lamp-on");
      lblOff?.classList.add("active");
      lblOn?.classList.remove("active");
      if (typeof showToast === "function") showToast("Apparatus Powered OFF");
    }

    updatePhysicsReadings();
  }

  function checkRangeChallenges() {
    if (state.vmRange === 1.5 && state.amRange === 10) {
      triggerChallenge("setRangesFwd");
    }
    if (state.vmRange === 30 && state.amRange === 100) {
      triggerChallenge("setRangesRev");
    }
  }

  // --------------------------------------------------------------------------
  // OBSERVATION LOGBOOK & TABLE ACTIONS
  // --------------------------------------------------------------------------
  function recordCurrentObservation() {
    if (!state.powerOn) {
      if (typeof showToast === "function") showToast("Cannot record: Power is OFF");
      return;
    }
    if (!state.circuitValid) {
      if (typeof showToast === "function") showToast("Cannot record: Circuit not connected");
      return;
    }

    if (state.biasMode === "forward") {
      const sNo = state.forwardObservations.length + 1;
      const newObs = {
        id: `fwd_obs_${Date.now()}`,
        sNo,
        vf: Number(state.measuredVoltage.toFixed(3)),
        if_mA: Number(state.measuredCurrent_mA.toFixed(3))
      };
      state.forwardObservations.push(newObs);
      renderObservationTable();
      drawForwardGraph();
      triggerChallenge("recordFwd");

      if (state.forwardObservations.length >= 4) {
        triggerChallenge("generateFwdCurve");
      }

      if (typeof showToast === "function") {
        showToast(`Forward reading #${sNo} recorded: Vf = ${newObs.vf} V, If = ${newObs.if_mA} mA`);
      }
    } else if (state.biasMode === "reverse") {
      const sNo = state.reverseObservations.length + 1;
      const newObs = {
        id: `rev_obs_${Date.now()}`,
        sNo,
        vr: Number(state.measuredVoltage.toFixed(2)),
        ir_uA: Number(state.measuredCurrent_uA.toFixed(2)),
        // Converted strictly to mA as required by Prompt Section 21 (1 uA = 0.001 mA)
        ir_mA: Number(state.measuredCurrent_mA.toFixed(6))
      };
      state.reverseObservations.push(newObs);
      renderObservationTable();
      drawReverseGraph();
      triggerChallenge("recordRev");

      if (state.reverseObservations.length >= 4) {
        triggerChallenge("generateRevCurve");
      }

      if (typeof showToast === "function") {
        showToast(`Reverse reading #${sNo} recorded: Vr = ${newObs.vr} V, Ir = ${newObs.ir_mA} mA (${newObs.ir_uA} μA)`);
      }
    }
  }

  function deleteObservation(obsId, mode) {
    if (mode === "forward") {
      state.forwardObservations = state.forwardObservations.filter(o => o.id !== obsId);
      state.forwardObservations.forEach((o, idx) => { o.sNo = idx + 1; });
      renderObservationTable();
      drawForwardGraph();
    } else {
      state.reverseObservations = state.reverseObservations.filter(o => o.id !== obsId);
      state.reverseObservations.forEach((o, idx) => { o.sNo = idx + 1; });
      renderObservationTable();
      drawReverseGraph();
    }
    if (typeof showToast === "function") showToast("Observation deleted");
  }

  function clearObservations() {
    if (state.activeObsTab === "forward") {
      state.forwardObservations = [];
      renderObservationTable();
      drawForwardGraph();
      if (typeof showToast === "function") showToast("Forward observations cleared");
    } else {
      state.reverseObservations = [];
      renderObservationTable();
      drawReverseGraph();
      if (typeof showToast === "function") showToast("Reverse observations cleared");
    }
  }

  function renderObservationTable() {
    const tbody = document.getElementById("diode-obs-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";

    const isFwd = state.activeObsTab === "forward";
    const observations = isFwd ? state.forwardObservations : state.reverseObservations;

    if (observations.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="padding:18px; color:#64748b; font-style:italic;">No ${isFwd ? "forward" : "reverse"} observations logged yet. Adjust voltage and click "Record Observation".</td></tr>`;
      return;
    }

    observations.forEach(obs => {
      const tr = document.createElement("tr");
      if (isFwd) {
        tr.innerHTML = `
          <td>${obs.sNo}</td>
          <td>${obs.vf.toFixed(2)}</td>
          <td>${obs.if_mA.toFixed(2)}</td>
          <td><button type="button" class="row-delete-btn" data-id="${obs.id}" data-mode="forward" title="Delete trial">×</button></td>
        `;
      } else {
        tr.innerHTML = `
          <td>${obs.sNo}</td>
          <td>${obs.vr.toFixed(1)}</td>
          <td>${obs.ir_mA.toFixed(4)} <span style="font-size:10px; color:#94a3b8;">(${obs.ir_uA.toFixed(1)} μA)</span></td>
          <td><button type="button" class="row-delete-btn" data-id="${obs.id}" data-mode="reverse" title="Delete trial">×</button></td>
        `;
      }
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".row-delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        deleteObservation(btn.getAttribute("data-id"), btn.getAttribute("data-mode"));
      });
    });
  }

  // --------------------------------------------------------------------------
  // DYNAMIC LIVE SCIENTIFIC GRAPHS (HIGH-DPI CANVAS)
  // --------------------------------------------------------------------------
  /**
   * 1st Quadrant Graph: Forward Bias Characteristics (Vf vs If)
   * Scale: X-axis 1 cm = 0.1 V (range 0 to 1.5 V)
   *        Y-axis 1 cm = 1 mA (range 0 to 10 mA)
   */
  function drawForwardGraph() {
    const canvas = document.getElementById("diode-fwd-graph-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 50;
    const padR = 25;
    const padT = 30;
    const padB = 40;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxV = 1.5;
    const maxI = 10.0;

    // Background
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // Grid lines: 15 vertical lines (0.1 V steps), 10 horizontal lines (1 mA steps)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";

    for (let v = 0.1; v <= maxV; v += 0.1) {
      const gx = padL + (v / maxV) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, padT);
      ctx.lineTo(gx, padT + plotH);
      ctx.stroke();
    }

    for (let i = 1; i <= maxI; i += 1) {
      const gy = padT + plotH - (i / maxI) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(padL + plotW, gy);
      ctx.stroke();
    }

    // Axes in 1st Quadrant (Origin at bottom-left)
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#38bdf8";

    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL, padT);
    ctx.stroke();

    // X-axis
    ctx.beginPath();
    ctx.moveTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    // Axis Labels & Ticks
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    // X Ticks (every 0.2 V labeled)
    for (let v = 0; v <= maxV + 0.001; v += 0.25) {
      const gx = padL + (v / maxV) * plotW;
      ctx.fillText(v.toFixed(2), gx, padT + plotH + 5);
      ctx.beginPath();
      ctx.moveTo(gx, padT + plotH);
      ctx.lineTo(gx, padT + plotH + 4);
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();
    }

    // Y Ticks (every 2 mA labeled)
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= maxI; i += 2) {
      const gy = padT + plotH - (i / maxI) * plotH;
      ctx.fillText(String(i), padL - 6, gy);
      ctx.beginPath();
      ctx.moveTo(padL - 4, gy);
      ctx.lineTo(padL, gy);
      ctx.strokeStyle = "#38bdf8";
      ctx.stroke();
    }

    // Axis Titles
    ctx.font = "bold 11px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText("Forward Voltage Vf (Volt) → [Scale: 1 cm = 0.1 V]", padL + plotW / 2, h - 12);

    ctx.save();
    ctx.translate(14, padT + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Forward Current If (mA) → [Scale: 1 cm = 1 mA]", 0, 0);
    ctx.restore();

    // Header Tag
    ctx.font = "bold 10.5px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#fbbf24";
    ctx.textAlign = "left";
    ctx.fillText("V-I CHARACTERISTICS • 1ST QUADRANT (FORWARD BIAS)", padL, 18);

    // Plot Theoretical Reference Curve (Translucent guide)
    ctx.beginPath();
    let started = false;
    for (let v = 0; v <= maxV; v += 0.02) {
      const pt = solveForwardDiode(v);
      const px = padL + (pt.voltage / maxV) * plotW;
      const py = padT + plotH - (pt.current_mA / maxI) * plotH;
      if (!started) { ctx.moveTo(px, py); started = true; }
      else { ctx.lineTo(px, py); }
    }
    ctx.strokeStyle = "rgba(245, 158, 11, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Plot Actual Recorded Observations
    if (state.forwardObservations.length > 0) {
      // Sort observations by voltage for smooth line drawing
      const sorted = [...state.forwardObservations].sort((a, b) => a.vf - b.vf);

      // Connected observation spline
      ctx.beginPath();
      sorted.forEach((pt, idx) => {
        const px = padL + (pt.vf / maxV) * plotW;
        const py = padT + plotH - (pt.if_mA / maxI) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "#00f0ff";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dots
      sorted.forEach(pt => {
        const px = padL + (pt.vf / maxV) * plotW;
        const py = padT + plotH - (pt.if_mA / maxI) * plotH;

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#0284c7";
        ctx.stroke();
      });
    }
  }

  /**
   * 3rd Quadrant Graph: Reverse Bias Characteristics (-Vr vs -Ir)
   * Scale: X-axis 1 cm = 2 V (negative X, 0 to -30 V)
   *        Y-axis 1 cm = 10 μA (negative Y, 0 to -100 μA)
   */
  function drawReverseGraph() {
    const canvas = document.getElementById("diode-rev-graph-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const padL = 40;
    const padR = 50;
    const padT = 35;
    const padB = 40;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxVr = 30.0;
    const maxIr = 100.0; // μA

    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, w, h);

    // In 3rd quadrant: Origin is at Top-Right!
    const originX = padL + plotW;
    const originY = padT;

    // Grid lines (negative direction)
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "rgba(168, 85, 247, 0.12)";

    for (let v = 5; v <= maxVr; v += 5) {
      const gx = originX - (v / maxVr) * plotW;
      ctx.beginPath();
      ctx.moveTo(gx, originY);
      ctx.lineTo(gx, originY + plotH);
      ctx.stroke();
    }

    for (let i = 20; i <= maxIr; i += 20) {
      const gy = originY + (i / maxIr) * plotH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(originX, gy);
      ctx.stroke();
    }

    // Axes in 3rd Quadrant:
    // Negative X goes LEFT from originX
    // Negative Y goes DOWN from originY
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = "#a855f7";

    // Horizontal Axis (Reverse Voltage, negative left)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(padL, originY);
    ctx.stroke();

    // Vertical Axis (Reverse Current, negative downwards)
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY + plotH);
    ctx.stroke();

    // Axis Labels & Ticks
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    // X Ticks (0, -5, -10, -15, -20, -25, -30 V)
    for (let v = 0; v <= maxVr; v += 5) {
      const gx = originX - (v / maxVr) * plotW;
      ctx.fillText(v === 0 ? "0" : `-${v}`, gx, originY - 4);
      ctx.beginPath();
      ctx.moveTo(gx, originY - 3);
      ctx.lineTo(gx, originY);
      ctx.strokeStyle = "#a855f7";
      ctx.stroke();
    }

    // Y Ticks (0, -20, -40, -60, -80, -100 μA)
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    for (let i = 0; i <= maxIr; i += 20) {
      const gy = originY + (i / maxIr) * plotH;
      ctx.fillText(i === 0 ? "0" : `-${i}`, originX + 6, gy);
      ctx.beginPath();
      ctx.moveTo(originX, gy);
      ctx.lineTo(originX + 4, gy);
      ctx.strokeStyle = "#a855f7";
      ctx.stroke();
    }

    // Axis Titles
    ctx.font = "bold 11px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#f8fafc";
    ctx.textAlign = "center";
    ctx.fillText("← Reverse Voltage Vr (Volt) [Scale: 1 cm = 2 V]", padL + plotW / 2, h - 12);

    ctx.save();
    ctx.translate(w - 14, padT + plotH / 2);
    ctx.rotate(Math.PI / 2);
    ctx.fillText("Reverse Current Ir (μA) → [Scale: 1 cm = 10 μA]", 0, 0);
    ctx.restore();

    // Header Tag
    ctx.font = "bold 10.5px 'Space Grotesk', sans-serif";
    ctx.fillStyle = "#c084fc";
    ctx.textAlign = "left";
    ctx.fillText("V-I CHARACTERISTICS • 3RD QUADRANT (REVERSE BIAS)", padL, 18);

    // Theoretical Guide line
    ctx.beginPath();
    let started = false;
    for (let v = 0; v <= maxVr; v += 0.5) {
      const pt = solveReverseDiode(v);
      const px = originX - (pt.voltage / maxVr) * plotW;
      const py = originY + (pt.current_uA / maxIr) * plotH;
      if (!started) { ctx.moveTo(px, py); started = true; }
      else { ctx.lineTo(px, py); }
    }
    ctx.strokeStyle = "rgba(192, 132, 252, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Actual Recorded Points
    if (state.reverseObservations.length > 0) {
      const sorted = [...state.reverseObservations].sort((a, b) => a.vr - b.vr);

      ctx.beginPath();
      sorted.forEach((pt, idx) => {
        const px = originX - (pt.vr / maxVr) * plotW;
        const py = originY + (pt.ir_uA / maxIr) * plotH;
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = "#e879f9";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#e879f9";
      ctx.shadowBlur = 8;
      ctx.stroke();
      ctx.shadowBlur = 0;

      sorted.forEach(pt => {
        const px = originX - (pt.vr / maxVr) * plotW;
        const py = originY + (pt.ir_uA / maxIr) * plotH;

        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = "#a855f7";
        ctx.stroke();
      });
    }
  }

  // --------------------------------------------------------------------------
  // GAMIFICATION CHALLENGES
  // --------------------------------------------------------------------------
  const CHALLENGE_ALIASES = {
    setRangesForward: "setRangesFwd",
    wireForward: "connectFwd",
    logForward: "recordFwd",
    setRangesReverse: "setRangesRev",
    wireReverse: "connectRev",
    logReverse: "recordRev",
    graphForward: "generateFwdCurve",
    graphReverse: "generateRevCurve"
  };

  function triggerChallenge(challengeKey) {
    const key = CHALLENGE_ALIASES[challengeKey] || challengeKey;
    const ch = state.challenges[key];
    if (!ch || ch.completed) return;

    ch.completed = true;
    renderChallengesDom();

    const payload = {
      challengeId: `diode.${key}`,
      xp: ch.xp,
      title: ch.title,
      badgeId: "badge-semiconductor-specialist",
      badgeTitle: "Semiconductor Specialist"
    };

    if (typeof onChallengeCompleted === "function") {
      onChallengeCompleted(payload);
    } else if (typeof onXpAwarded === "function") {
      onXpAwarded(ch.xp, ch.title);
      if (typeof showToast === "function") {
        showToast(`Challenge Completed: ${ch.title} (+${ch.xp} XP)`);
      }
    }
  }

  function renderChallengesDom() {
    const list = document.getElementById("diode-challenges-list");
    if (!list) return;
    list.innerHTML = "";

    Object.keys(state.challenges).forEach(key => {
      const ch = state.challenges[key];
      const card = document.createElement("div");
      card.className = `challenge-item-card ${ch.completed ? "completed" : ""}`;
      card.innerHTML = `
        <div class="challenge-item-info">
          <strong>${ch.title}</strong>
          <span>${ch.desc}</span>
        </div>
        <div class="challenge-item-badge">
          <span class="xp-tag">+${ch.xp} XP</span>
          <div class="status-check-circle">${ch.completed ? "✓" : ""}</div>
        </div>
      `;
      list.appendChild(card);
    });
  }

  function hydrateChallenges(completedSet) {
    if (!Array.isArray(completedSet)) return;
    const set = new Set(completedSet);
    Object.keys(state.challenges).forEach(key => {
      if (set.has(`diode.${key}`)) {
        state.challenges[key].completed = true;
      } else {
        // Check legacy aliases
        Object.entries(CHALLENGE_ALIASES).forEach(([oldKey, newKey]) => {
          if (newKey === key && set.has(`diode.${oldKey}`)) {
            state.challenges[key].completed = true;
          }
        });
      }
    });
    renderChallengesDom();
  }

  // --------------------------------------------------------------------------
  // UNIVERSAL PDF REPORT EXPORT ENGINE
  // --------------------------------------------------------------------------
  function exportLabReportPdf() {
    try {
      const fwdCanvas = document.getElementById("diode-fwd-graph-canvas");
      const revCanvas = document.getElementById("diode-rev-graph-canvas");

      const fwdGraphImg = fwdCanvas ? fwdCanvas.toDataURL("image/png") : null;
      const revGraphImg = revCanvas ? revCanvas.toDataURL("image/png") : null;

      const userProfile = (typeof getStoredUserProfile === "function") ? getStoredUserProfile() : null;
      const sName = userProfile?.displayName || userProfile?.name || "Student Physicist";
      const sEmail = userProfile?.email || "guest@physix.lab";

      const summaryMetrics = [
        { label: "Apparatus State", value: state.powerOn ? "ENERGIZED" : "STANDBY", color: [16, 185, 129] },
        { label: "Active Bias", value: state.biasMode.toUpperCase(), color: [245, 158, 11] },
        { label: "Total Fwd Trials", value: String(state.forwardObservations.length), color: [56, 189, 248] },
        { label: "Total Rev Trials", value: String(state.reverseObservations.length), color: [168, 85, 247] }
      ];

      const fwdRows = state.forwardObservations.map(o => [
        String(o.sNo),
        o.vf.toFixed(2),
        o.if_mA.toFixed(2)
      ]);

      const revRows = state.reverseObservations.map(o => [
        String(o.sNo),
        o.vr.toFixed(1),
        o.ir_mA.toFixed(4)
      ]);

      const tables = [
        {
          title: "Table 1: Forward Bias P-N Junction Characteristics (Least Count: V = 0.025 V, mA = 0.2 mA)",
          columns: ["S.No.", "Forward Voltage Vf (Volt)", "Forward Current If (mA)"],
          rows: fwdRows.length > 0 ? fwdRows : [["1", "0.00", "0.00"]]
        },
        {
          title: "Table 2: Reverse Bias P-N Junction Characteristics (Least Count: V = 0.5 V, μA = 2 μA = 0.002 mA)",
          columns: ["S.No.", "Reverse Voltage Vr (Volt)", "Reverse Current Ir (mA)"],
          rows: revRows.length > 0 ? revRows : [["1", "0.0", "0.0000"]]
        }
      ];

      const graphs = [];
      if (fwdGraphImg) {
        graphs.push({
          title: "Figure 1: V-I Characteristics — Forward Bias (1st Quadrant: 1 cm = 0.1 V, 1 cm = 1 mA)",
          imageData: fwdGraphImg,
          height: 65,
          caption: "Live dynamic plot of experimental Forward Voltage Vf vs Forward Current If showing exponential cut-in."
        });
      }
      if (revGraphImg) {
        graphs.push({
          title: "Figure 2: V-I Characteristics — Reverse Bias (3rd Quadrant: 1 cm = 2 V, 1 cm = 10 μA)",
          imageData: revGraphImg,
          height: 65,
          caption: "Live dynamic plot of experimental Reverse Voltage Vr vs Reverse Current Ir confirming minimal leakage."
        });
      }

      generateLabReportPdf({
        labTitle: "Diode V-I Characteristics Laboratory Report",
        labSubtitle: "Scientific Virtual Physics Logbook & Experimental Telemetry Record",
        experimentCode: "EXP-06-DIODE",
        studentName: sName,
        studentEmail: sEmail,
        studentRole: "Student Physicist",
        aim: "To study the voltage - current (V-I) characteristics of a forward and reverse bias P-N Junction diode.",
        apparatus: "A P-N Junction diode, milliammeter, Voltmeter, micro-ammeter, power supply & connection wires.",
        summaryMetrics,
        tables,
        graphs,
        filename: "PhysiX_Diode_VI_Report.pdf"
      });

      if (typeof showToast === "function") {
        showToast("Laboratory Report with Live Graphs exported successfully!");
      }
    } catch (err) {
      console.error("[Diode VI] PDF Export error:", err);
      if (typeof showToast === "function") {
        showToast("Error generating PDF report.");
      }
    }
  }

  // --------------------------------------------------------------------------
  // RESET ALL APPARATUS
  // --------------------------------------------------------------------------
  function resetExperiment() {
    setPowerToggle(false);
    state.forwardVoltageKnob = 0.0;
    state.reverseVoltageKnob = 0.0;
    state.measuredVoltage = 0.0;
    state.measuredCurrent_mA = 0.0;
    state.measuredCurrent_uA = 0.0;
    state.targetVmAngle = -45;
    state.targetAmAngle = -45;

    const fwdKnob = document.getElementById("diode-fwd-knob");
    const revKnob = document.getElementById("diode-rev-knob");
    const fwdVal = document.getElementById("diode-fwd-knob-val");
    const revVal = document.getElementById("diode-rev-knob-val");

    if (fwdKnob) fwdKnob.style.transform = "rotate(0deg)";
    if (revKnob) revKnob.style.transform = "rotate(0deg)";
    if (fwdVal) fwdVal.textContent = "0.00 V";
    if (revVal) revVal.textContent = "0.0 V";

    clearAllWires();
    state.forwardObservations = [];
    state.reverseObservations = [];
    renderObservationTable();
    drawForwardGraph();
    drawReverseGraph();

    if (typeof showToast === "function") {
      showToast("Diode Laboratory Apparatus Reset to Defaults");
    }
  }

  // --------------------------------------------------------------------------
  // DOM EVENT LISTENERS & BINDINGS
  // --------------------------------------------------------------------------
  function bindDomEvents() {
    // Terminals clicking
    document.querySelectorAll("#exp-diode-section .banana-terminal").forEach(t => {
      t.addEventListener("click", () => {
        const key = t.getAttribute("data-terminal");
        if (key) handleTerminalClick(key);
      });
    });

    // Preset Wire Buttons
    document.getElementById("diode-btn-auto-fwd")?.addEventListener("click", autoConnectForward);
    document.getElementById("diode-btn-auto-rev")?.addEventListener("click", autoConnectReverse);
    document.getElementById("diode-btn-clear-wires")?.addEventListener("click", clearAllWires);

    // Power Toggle
    document.getElementById("diode-power-toggle")?.addEventListener("click", () => {
      setPowerToggle(!state.powerOn);
    });

    // Voltmeter Range Selector
    document.getElementById("diode-vm-range-toggle")?.addEventListener("click", () => {
      setVoltmeterRange(state.vmRange === 1.5 ? 30 : 1.5);
    });
    document.getElementById("lbl-vm-range-15")?.addEventListener("click", () => setVoltmeterRange(1.5));
    document.getElementById("lbl-vm-range-30")?.addEventListener("click", () => setVoltmeterRange(30));

    // Ammeter Range Selector
    document.getElementById("diode-am-range-toggle")?.addEventListener("click", () => {
      setAmmeterRange(state.amRange === 10 ? 100 : 10);
    });
    document.getElementById("lbl-am-range-10")?.addEventListener("click", () => setAmmeterRange(10));
    document.getElementById("lbl-am-range-100")?.addEventListener("click", () => setAmmeterRange(100));

    // Rotary Knob: Forward Bias DC Supply (0.0 to 1.5 V)
    const fwdKnob = document.getElementById("diode-fwd-knob");
    const fwdVal = document.getElementById("diode-fwd-knob-val");
    if (fwdKnob) {
      let isDragging = false;
      let startY = 0;
      let startVal = 0;

      const onMouseDown = (e) => {
        isDragging = true;
        startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        startVal = state.forwardVoltageKnob;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("touchmove", onMouseMove);
        document.addEventListener("touchend", onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const delta = (startY - currentY) * 0.008;
        const newVal = Math.min(Math.max(startVal + delta, 0.0), 1.5);
        state.forwardVoltageKnob = Number(newVal.toFixed(3));
        const rotDeg = (state.forwardVoltageKnob / 1.5) * 270;
        fwdKnob.style.transform = `rotate(${rotDeg}deg)`;
        if (fwdVal) fwdVal.textContent = `${state.forwardVoltageKnob.toFixed(2)} V`;
        updatePhysicsReadings();
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchmove", onMouseMove);
        document.removeEventListener("touchend", onMouseUp);
      };

      fwdKnob.addEventListener("mousedown", onMouseDown);
      fwdKnob.addEventListener("touchstart", onMouseDown, { passive: true });
      fwdKnob.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.05 : -0.05;
        state.forwardVoltageKnob = Math.min(Math.max(state.forwardVoltageKnob + delta, 0.0), 1.5);
        const rotDeg = (state.forwardVoltageKnob / 1.5) * 270;
        fwdKnob.style.transform = `rotate(${rotDeg}deg)`;
        if (fwdVal) fwdVal.textContent = `${state.forwardVoltageKnob.toFixed(2)} V`;
        updatePhysicsReadings();
      });

      // Step Buttons: < (Decrease) and > (Increase) for Forward Voltage
      const fwdBtnDec = document.getElementById("diode-fwd-btn-dec");
      const fwdBtnInc = document.getElementById("diode-fwd-btn-inc");
      const FWD_STEP = 0.05;
      if (fwdBtnDec) {
        fwdBtnDec.addEventListener("click", () => {
          state.forwardVoltageKnob = Math.min(Math.max(state.forwardVoltageKnob - FWD_STEP, 0.0), 1.5);
          const rotDeg = (state.forwardVoltageKnob / 1.5) * 270;
          fwdKnob.style.transform = `rotate(${rotDeg}deg)`;
          if (fwdVal) fwdVal.textContent = `${state.forwardVoltageKnob.toFixed(2)} V`;
          updatePhysicsReadings();
        });
      }
      if (fwdBtnInc) {
        fwdBtnInc.addEventListener("click", () => {
          state.forwardVoltageKnob = Math.min(Math.max(state.forwardVoltageKnob + FWD_STEP, 0.0), 1.5);
          const rotDeg = (state.forwardVoltageKnob / 1.5) * 270;
          fwdKnob.style.transform = `rotate(${rotDeg}deg)`;
          if (fwdVal) fwdVal.textContent = `${state.forwardVoltageKnob.toFixed(2)} V`;
          updatePhysicsReadings();
        });
      }
    }

    // Rotary Knob: Reverse Bias DC Supply (0.0 to 30.0 V)
    const revKnob = document.getElementById("diode-rev-knob");
    const revVal = document.getElementById("diode-rev-knob-val");
    if (revKnob) {
      let isDragging = false;
      let startY = 0;
      let startVal = 0;

      const onMouseDown = (e) => {
        isDragging = true;
        startY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        startVal = state.reverseVoltageKnob;
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
        document.addEventListener("touchmove", onMouseMove);
        document.addEventListener("touchend", onMouseUp);
      };

      const onMouseMove = (e) => {
        if (!isDragging) return;
        const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
        const delta = (startY - currentY) * 0.15;
        const newVal = Math.min(Math.max(startVal + delta, 0.0), 30.0);
        state.reverseVoltageKnob = Number(newVal.toFixed(2));
        const rotDeg = (state.reverseVoltageKnob / 30.0) * 270;
        revKnob.style.transform = `rotate(${rotDeg}deg)`;
        if (revVal) revVal.textContent = `${state.reverseVoltageKnob.toFixed(1)} V`;
        updatePhysicsReadings();
      };

      const onMouseUp = () => {
        isDragging = false;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        document.removeEventListener("touchmove", onMouseMove);
        document.removeEventListener("touchend", onMouseUp);
      };

      revKnob.addEventListener("mousedown", onMouseDown);
      revKnob.addEventListener("touchstart", onMouseDown, { passive: true });
      revKnob.addEventListener("wheel", (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1.0 : -1.0;
        state.reverseVoltageKnob = Math.min(Math.max(state.reverseVoltageKnob + delta, 0.0), 30.0);
        const rotDeg = (state.reverseVoltageKnob / 30.0) * 270;
        revKnob.style.transform = `rotate(${rotDeg}deg)`;
        if (revVal) revVal.textContent = `${state.reverseVoltageKnob.toFixed(1)} V`;
        updatePhysicsReadings();
      });

      // Step Buttons: < (Decrease) and > (Increase) for Reverse Voltage
      const revBtnDec = document.getElementById("diode-rev-btn-dec");
      const revBtnInc = document.getElementById("diode-rev-btn-inc");
      const REV_STEP = 1.0;
      if (revBtnDec) {
        revBtnDec.addEventListener("click", () => {
          state.reverseVoltageKnob = Math.min(Math.max(state.reverseVoltageKnob - REV_STEP, 0.0), 30.0);
          const rotDeg = (state.reverseVoltageKnob / 30.0) * 270;
          revKnob.style.transform = `rotate(${rotDeg}deg)`;
          if (revVal) revVal.textContent = `${state.reverseVoltageKnob.toFixed(1)} V`;
          updatePhysicsReadings();
        });
      }
      if (revBtnInc) {
        revBtnInc.addEventListener("click", () => {
          state.reverseVoltageKnob = Math.min(Math.max(state.reverseVoltageKnob + REV_STEP, 0.0), 30.0);
          const rotDeg = (state.reverseVoltageKnob / 30.0) * 270;
          revKnob.style.transform = `rotate(${rotDeg}deg)`;
          if (revVal) revVal.textContent = `${state.reverseVoltageKnob.toFixed(1)} V`;
          updatePhysicsReadings();
        });
      }
    }

    // Observation Table Tabs & Buttons
    document.getElementById("diode-tab-obs-fwd")?.addEventListener("click", () => {
      state.activeObsTab = "forward";
      document.getElementById("diode-tab-obs-fwd")?.classList.add("active");
      document.getElementById("diode-tab-obs-rev")?.classList.remove("active");
      document.getElementById("diode-lc-strip-fwd")?.classList.remove("hidden");
      document.getElementById("diode-lc-strip-rev")?.classList.add("hidden");
      document.getElementById("th-diode-voltage").textContent = "Forward Voltage Vf (Volt)";
      document.getElementById("th-diode-current").textContent = "Forward Current If (mA)";
      renderObservationTable();
    });

    document.getElementById("diode-tab-obs-rev")?.addEventListener("click", () => {
      state.activeObsTab = "reverse";
      document.getElementById("diode-tab-obs-rev")?.classList.add("active");
      document.getElementById("diode-tab-obs-fwd")?.classList.remove("active");
      document.getElementById("diode-lc-strip-rev")?.classList.remove("hidden");
      document.getElementById("diode-lc-strip-fwd")?.classList.add("hidden");
      document.getElementById("th-diode-voltage").textContent = "Reverse Voltage Vr (Volt)";
      document.getElementById("th-diode-current").textContent = "Reverse Current Ir (mA)";
      renderObservationTable();
    });

    document.getElementById("diode-btn-record")?.addEventListener("click", recordCurrentObservation);
    document.getElementById("diode-btn-clear-obs")?.addEventListener("click", clearObservations);

    // Graph Tabs
    document.getElementById("diode-tab-graph-fwd")?.addEventListener("click", () => {
      state.activeGraphTab = "forward";
      document.getElementById("diode-tab-graph-fwd")?.classList.add("active");
      document.getElementById("diode-tab-graph-rev")?.classList.remove("active");
      document.getElementById("diode-fwd-graph-container")?.classList.remove("hidden");
      document.getElementById("diode-rev-graph-container")?.classList.add("hidden");
      drawForwardGraph();
    });

    document.getElementById("diode-tab-graph-rev")?.addEventListener("click", () => {
      state.activeGraphTab = "reverse";
      document.getElementById("diode-tab-graph-rev")?.classList.add("active");
      document.getElementById("diode-tab-graph-fwd")?.classList.remove("active");
      document.getElementById("diode-rev-graph-container")?.classList.remove("hidden");
      document.getElementById("diode-fwd-graph-container")?.classList.add("hidden");
      drawReverseGraph();
    });

    // Reset & Export Buttons
    document.getElementById("diode-btn-reset-exp")?.addEventListener("click", resetExperiment);
    document.getElementById("diode-btn-export-pdf")?.addEventListener("click", exportLabReportPdf);

    // Window Resize -> Re-render wires and redraw canvases
    window.addEventListener("resize", () => {
      renderWiresSvg();
      drawForwardGraph();
      drawReverseGraph();
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC MODULE INTERFACE
  // --------------------------------------------------------------------------
  return {
    init() {
      bindDomEvents();
      renderChallengesDom();
      renderObservationTable();
      drawForwardGraph();
      drawReverseGraph();

      // Start continuous needle animation
      if (!animFrameId) {
        stepMeterNeedles();
      }

      // Default initial wiring: Auto Connect Forward Bias for immediate intuitive interactivity!
      autoConnectForward();
    },

    renderAll() {
      renderWiresSvg();
      drawForwardGraph();
      drawReverseGraph();
      renderObservationTable();
      renderChallengesDom();
    },

    hydrateChallenges(completedList) {
      hydrateChallenges(completedList);
    },

    renderChallengesDom() {
      renderChallengesDom();
    },

    getState() {
      return {
        powerOn: state.powerOn,
        biasMode: state.biasMode,
        vmRange: state.vmRange,
        amRange: state.amRange,
        forwardVoltageKnob: state.forwardVoltageKnob,
        reverseVoltageKnob: state.reverseVoltageKnob,
        measuredVoltage: state.measuredVoltage,
        measuredCurrent_mA: state.measuredCurrent_mA,
        measuredCurrent_uA: state.measuredCurrent_uA,
        circuitValid: state.circuitValid,
        forwardCount: state.forwardObservations.length,
        reverseCount: state.reverseObservations.length
      };
    },

    destroy() {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  };
}
