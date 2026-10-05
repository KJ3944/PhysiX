/**
 * PhysiX • Sandbox Real-time Telemetry Graphs
 * Canvas-based, GPU-friendly, high-DPI responsive graphing system
 * Traces:
 *  1. Position vs Time (X, Y)
 *  2. Velocity vs Time (Vx, Vy, Speed)
 *  3. Kinetic Energy vs Time (KE)
 */

export class SandboxGraphs {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext("2d") : null;
    this.activeMode = "velocity"; // "position" | "velocity" | "energy"
    this.maxPoints = 150;
    this.history = [];
    this.selectedObjectId = null;

    this.resize();
    window.addEventListener("resize", () => this.resize(), { passive: true });
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = Math.max(260, rect.width);
    this.height = Math.max(160, rect.height || 180);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;

    if (this.ctx) {
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    this.render();
  }

  setMode(mode) {
    this.activeMode = mode;
    this.render();
  }

  setSelectedObject(id) {
    if (this.selectedObjectId !== id) {
      this.selectedObjectId = id;
      this.clear();
    }
  }

  addSample(time, object) {
    if (!object || object.id !== this.selectedObjectId) return;

    this.history.push({
      t: Number(time.toFixed(2)),
      x: object.x,
      y: object.y,
      vx: object.vx,
      vy: object.vy,
      speed: object.getSpeed(),
      ke: object.getKineticEnergy()
    });

    if (this.history.length > this.maxPoints) {
      this.history.shift();
    }

    this.render();
  }

  clear() {
    this.history = [];
    this.render();
  }

  render() {
    if (!this.ctx || !this.canvas) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Background gradient matching Space Theme
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, "rgba(8, 14, 30, 0.95)");
    bgGrad.addColorStop(1, "rgba(4, 7, 18, 0.98)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    const padLeft = 46;
    const padRight = 16;
    const padTop = 26;
    const padBottom = 26;
    const plotW = w - padLeft - padRight;
    const plotH = h - padTop - padBottom;

    // Draw Subtle Grid & Axes
    ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);

    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(w - padRight, y);
      ctx.stroke();
    }

    for (let i = 0; i <= 5; i++) {
      const x = padLeft + (plotW / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padTop);
      ctx.lineTo(x, h - padBottom);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Outer Plot Border
    ctx.strokeStyle = "rgba(56, 189, 248, 0.28)";
    ctx.strokeRect(padLeft, padTop, plotW, plotH);

    // If no history or no object selected
    if (this.history.length < 2) {
      ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
      ctx.font = "12px 'Space Grotesk', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        this.selectedObjectId ? "Waiting for simulation telemetry..." : "Select an object to monitor live graphs",
        w / 2,
        h / 2 + 4
      );
      return;
    }

    // Determine Y range based on active mode
    let traces = [];
    if (this.activeMode === "position") {
      traces = [
        { label: "X Position (m)", color: "#00f0ff", key: "x" },
        { label: "Y Altitude (m)", color: "#f59e0b", key: "y" }
      ];
    } else if (this.activeMode === "velocity") {
      traces = [
        { label: "Speed |v| (m/s)", color: "#10e7a8", key: "speed" },
        { label: "Vx (m/s)", color: "#00f0ff", key: "vx" },
        { label: "Vy (m/s)", color: "#c084fc", key: "vy" }
      ];
    } else {
      traces = [
        { label: "Kinetic Energy (J)", color: "#ff3366", key: "ke" }
      ];
    }

    let minY = Infinity;
    let maxY = -Infinity;

    for (const pt of this.history) {
      for (const tr of traces) {
        const val = pt[tr.key];
        if (val < minY) minY = val;
        if (val > maxY) maxY = val;
      }
    }

    // Add 10% breathing room to min & max
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }
    const span = maxY - minY;
    minY = Math.floor(minY - span * 0.1);
    maxY = Math.ceil(maxY + span * 0.1);

    // Draw Y axis labels
    ctx.fillStyle = "#7dd3fc";
    ctx.font = "10px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const y = padTop + (plotH / 4) * i;
      const val = maxY - ((maxY - minY) / 4) * i;
      ctx.fillText(val.toFixed(1), padLeft - 6, y + 3.5);
    }

    // Draw X time span labels
    const tMin = this.history[0].t;
    const tMax = this.history[this.history.length - 1].t;
    ctx.textAlign = "center";
    ctx.fillText(`${tMin.toFixed(1)}s`, padLeft, h - 8);
    ctx.fillText(`${tMax.toFixed(1)}s`, w - padRight, h - 8);
    ctx.fillText("Time (t)", padLeft + plotW / 2, h - 8);

    // Draw Traces
    for (const tr of traces) {
      ctx.strokeStyle = tr.color;
      ctx.lineWidth = 2;
      ctx.shadowColor = tr.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();

      for (let i = 0; i < this.history.length; i++) {
        const pt = this.history[i];
        const val = pt[tr.key];
        const x = padLeft + (i / (this.history.length - 1)) * plotW;
        const normY = (val - minY) / (maxY - minY);
        const y = padTop + plotH - normY * plotH;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current Value dot
      const lastPt = this.history[this.history.length - 1];
      const lastVal = lastPt[tr.key];
      const dotX = padLeft + plotW;
      const dotY = padTop + plotH - ((lastVal - minY) / (maxY - minY)) * plotH;

      ctx.fillStyle = tr.color;
      ctx.beginPath();
      ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    // Draw Legend at top
    ctx.textAlign = "left";
    let legendX = padLeft;
    for (const tr of traces) {
      const lastVal = this.history[this.history.length - 1][tr.key];
      ctx.fillStyle = tr.color;
      ctx.fillRect(legendX, 8, 10, 10);
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "11px 'Space Grotesk', sans-serif";
      const legendText = `${tr.label}: ${lastVal.toFixed(2)}`;
      ctx.fillText(legendText, legendX + 14, 17);
      legendX += ctx.measureText(legendText).width + 24;
    }
  }
}
