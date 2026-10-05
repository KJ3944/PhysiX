/**
 * PhysiX • Physics Sandbox Engine
 * Modular 2D Newtonian Mechanics Physics Engine
 * Features:
 *  - Newton's Second Law: F_net = m * a
 *  - Semi-implicit Euler numerical integration
 *  - Real-world SI units (kg, m, m/s, m/s², N, J)
 *  - Rigid body shapes: Ball (Circle), Box (Rectangle), Static Platform/Wall
 *  - Elastic & inelastic collisions (Circle-Circle, Circle-Box, Box-Box)
 *  - Coulomb friction (static & kinetic) and contact restitution
 *  - Force vector application (thrust / continuous & impulses)
 *  - Multiple planetary gravity presets
 */

export class PhysicsObject {
  constructor(options = {}) {
    this.id = options.id || `obj_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    this.name = options.name || "Object";
    this.type = options.type || "ball"; // "ball" | "box" | "platform"
    this.isStatic = Boolean(options.isStatic);

    // Physical mass (kg)
    this.mass = this.isStatic ? Infinity : Math.max(0.1, Number(options.mass) || 2.0);
    this.invMass = this.isStatic ? 0 : 1 / this.mass;

    // Position (meters) in world coordinates
    this.x = Number(options.x) || 5.0;
    this.y = Number(options.y) || 5.0;

    // Velocity (m/s)
    this.vx = Number(options.vx) || 0;
    this.vy = Number(options.vy) || 0;

    // Acceleration (m/s²)
    this.ax = 0;
    this.ay = 0;

    // Applied External Force (Newtons)
    this.fx = Number(options.fx) || 0;
    this.fy = Number(options.fy) || 0;

    // Net Force cache (Newtons)
    this.netFx = 0;
    this.netFy = 0;

    // Surface Material Properties
    this.friction = Math.max(0, Math.min(1, options.friction !== undefined ? Number(options.friction) : 0.25));
    this.restitution = Math.max(0, Math.min(1, options.restitution !== undefined ? Number(options.restitution) : (this.type === "ball" ? 0.7 : 0.4)));

    // Geometric Dimensions (meters)
    this.radius = Number(options.radius) || 0.6; // For balls
    this.width = Number(options.width) || 1.2;   // For boxes / platforms
    this.height = Number(options.height) || 1.2; // For boxes / platforms

    // Visual appearance
    this.color = options.color || this.getDefaultColor();

    // Cache initial state for Reset functionality
    this.saveInitialState();
  }

  getDefaultColor() {
    if (this.isStatic) return "#64748b"; // Steel slate
    if (this.type === "ball") return "#00f0ff"; // Plasma Cyan
    return "#ffaa00"; // Solar Amber
  }

  setMass(newMass) {
    if (this.isStatic) return;
    this.mass = Math.max(0.1, Number(newMass) || 1.0);
    this.invMass = 1 / this.mass;
  }

  applyForce(fx, fy) {
    if (this.isStatic) return;
    this.fx += fx;
    this.fy += fy;
  }

  applyImpulse(ix, iy) {
    if (this.isStatic) return;
    this.vx += ix * this.invMass;
    this.vy += iy * this.invMass;
  }

  clearForces() {
    this.fx = 0;
    this.fy = 0;
  }

  getSpeed() {
    if (this.isStatic) return 0;
    return Math.hypot(this.vx, this.vy);
  }

  getKineticEnergy() {
    if (this.isStatic) return 0;
    return 0.5 * this.mass * (this.vx * this.vx + this.vy * this.vy);
  }

  getNetForceMagnitude() {
    if (this.isStatic) return 0;
    return Math.hypot(this.netFx, this.netFy);
  }

  getAABB() {
    if (this.type === "ball") {
      return {
        minX: this.x - this.radius,
        maxX: this.x + this.radius,
        minY: this.y - this.radius,
        maxY: this.y + this.radius
      };
    } else {
      const hw = this.width / 2;
      const hh = this.height / 2;
      return {
        minX: this.x - hw,
        maxX: this.x + hw,
        minY: this.y - hh,
        maxY: this.y + hh
      };
    }
  }

  saveInitialState() {
    this.initialState = {
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      fx: this.fx,
      fy: this.fy,
      mass: this.mass,
      friction: this.friction,
      restitution: this.restitution,
      radius: this.radius,
      width: this.width,
      height: this.height,
      color: this.color
    };
  }

  reset() {
    if (!this.initialState) return;
    this.x = this.initialState.x;
    this.y = this.initialState.y;
    this.vx = this.initialState.vx;
    this.vy = this.initialState.vy;
    this.fx = this.initialState.fx;
    this.fy = this.initialState.fy;
    this.ax = 0;
    this.ay = 0;
    this.netFx = 0;
    this.netFy = 0;
    this.mass = this.initialState.mass;
    this.invMass = this.isStatic ? 0 : 1 / this.mass;
    this.friction = this.initialState.friction;
    this.restitution = this.initialState.restitution;
    this.radius = this.initialState.radius;
    this.width = this.initialState.width;
    this.height = this.initialState.height;
  }
}

export class PhysicsWorld {
  constructor(options = {}) {
    // Planetary Gravity (m/s² downwards)
    this.gravity = options.gravity !== undefined ? Number(options.gravity) : 9.81;
    this.gravityEnabled = options.gravityEnabled !== false;

    // Simulation bounds in meters
    this.bounds = {
      xMin: 0.4,
      xMax: 19.6,
      yMin: 0.6, // Ground surface level
      yMax: 11.2
    };

    this.objects = [];
    this.time = 0;
    this.substeps = 6; // Iterative stability substeps
  }

  setGravity(g) {
    this.gravity = Math.max(0, Number(g) || 0);
  }

  addObject(obj) {
    if (obj instanceof PhysicsObject) {
      this.objects.push(obj);
      return obj;
    }
    const newObj = new PhysicsObject(obj);
    this.objects.push(newObj);
    return newObj;
  }

  removeObject(id) {
    const idx = this.objects.findIndex(o => o.id === id);
    if (idx !== -1) {
      this.objects.splice(idx, 1);
    }
  }

  getObject(id) {
    return this.objects.find(o => o.id === id);
  }

  clear() {
    this.objects = [];
    this.time = 0;
  }

  saveAllInitialStates() {
    this.objects.forEach(obj => obj.saveInitialState());
  }

  reset() {
    this.time = 0;
    this.objects.forEach(obj => obj.reset());
  }

  /**
   * Physics Integration Step
   * Semi-implicit Euler method with iterative collision resolution
   */
  step(dt) {
    if (dt <= 0) return;

    // Divide dt across substeps for numerical stability & tunneling prevention
    const subDt = dt / this.substeps;

    for (let s = 0; s < this.substeps; s++) {
      this.subStep(subDt);
    }

    this.time += dt;
  }

  subStep(dt) {
    const gAcc = this.gravityEnabled ? -this.gravity : 0; // Downwards in Y-up system

    // 1. Calculate Forces and Accelerations (F_net = m * a => a = F_net / m)
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (obj.isStatic) {
        obj.ax = 0;
        obj.ay = 0;
        obj.netFx = 0;
        obj.netFy = 0;
        continue;
      }

      // Net force = External Applied Force + Gravity Force (0, -m*g)
      const fGravY = obj.mass * gAcc;
      obj.netFx = obj.fx;
      obj.netFy = obj.fy + fGravY;

      // Acceleration = F_net / m
      obj.ax = obj.netFx * obj.invMass;
      obj.ay = obj.netFy * obj.invMass;

      // Semi-implicit Euler Velocity update: v = v + a * dt
      obj.vx += obj.ax * dt;
      obj.vy += obj.ay * dt;

      // Small ambient air damping (drag coefficient ~ 0.005)
      obj.vx *= (1 - 0.002 * dt * 60);
      obj.vy *= (1 - 0.002 * dt * 60);
    }

    // 2. Resolve Collisions with World Boundaries & Static Ground
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (obj.isStatic) continue;
      this.resolveWorldBoundaries(obj, dt);
    }

    // 3. Resolve Collisions Between Pairs of Objects
    for (let i = 0; i < this.objects.length; i++) {
      for (let j = i + 1; j < this.objects.length; j++) {
        this.resolveObjectCollision(this.objects[i], this.objects[j], dt);
      }
    }

    // 4. Update Positions: p = p + v * dt
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (obj.isStatic) continue;

      obj.x += obj.vx * dt;
      obj.y += obj.vy * dt;
    }
  }

  /**
   * Collision resolution against world walls and ground floor
   */
  resolveWorldBoundaries(obj, dt) {
    const aabb = obj.getAABB();
    const e = obj.restitution;
    const mu = obj.friction;

    // Ground Floor collision (yMin)
    if (aabb.minY < this.bounds.yMin) {
      const penetration = this.bounds.yMin - aabb.minY;
      obj.y += penetration; // Position projection

      if (obj.vy < 0) {
        // Normal impulse bounce
        obj.vy = -obj.vy * e;
        // Rest contact threshold to avoid micro jitter
        if (Math.abs(obj.vy) < 0.15) {
          obj.vy = 0;
        }

        // Tangential Coulomb friction along the ground
        // Friction deceleration: deltaV = mu * g * dt (or proportional to normal impulse)
        const normalForceAcc = Math.max(0, this.gravity);
        const frictionDecel = mu * normalForceAcc * dt;
        if (Math.abs(obj.vx) <= frictionDecel) {
          obj.vx = 0;
        } else {
          obj.vx -= Math.sign(obj.vx) * frictionDecel;
        }
      }
    }

    // Ceiling collision (yMax)
    if (aabb.maxY > this.bounds.yMax) {
      const penetration = aabb.maxY - this.bounds.yMax;
      obj.y -= penetration;
      if (obj.vy > 0) {
        obj.vy = -obj.vy * e;
      }
    }

    // Left wall collision (xMin)
    if (aabb.minX < this.bounds.xMin) {
      const penetration = this.bounds.xMin - aabb.minX;
      obj.x += penetration;
      if (obj.vx < 0) {
        obj.vx = -obj.vx * e;
        if (Math.abs(obj.vx) < 0.1) obj.vx = 0;
        // Friction on vertical wall
        obj.vy *= Math.max(0, 1 - mu * 0.15);
      }
    }

    // Right wall collision (xMax)
    if (aabb.maxX > this.bounds.xMax) {
      const penetration = aabb.maxX - this.bounds.xMax;
      obj.x -= penetration;
      if (obj.vx > 0) {
        obj.vx = -obj.vx * e;
        if (Math.abs(obj.vx) < 0.1) obj.vx = 0;
        // Friction on vertical wall
        obj.vy *= Math.max(0, 1 - mu * 0.15);
      }
    }
  }

  /**
   * Pairwise collision detection and impulse response
   */
  resolveObjectCollision(a, b, dt) {
    if (a.isStatic && b.isStatic) return;

    if (a.type === "ball" && b.type === "ball") {
      this.collideCircleCircle(a, b, dt);
    } else if (a.type === "ball" && (b.type === "box" || b.type === "platform")) {
      this.collideCircleBox(a, b, dt);
    } else if ((a.type === "box" || a.type === "platform") && b.type === "ball") {
      this.collideCircleBox(b, a, dt);
    } else {
      this.collideBoxBox(a, b, dt);
    }
  }

  /**
   * Circle vs Circle
   */
  collideCircleCircle(a, b, dt) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const distSq = dx * dx + dy * dy;
    const radiusSum = a.radius + b.radius;

    if (distSq >= radiusSum * radiusSum || distSq === 0) return;

    const dist = Math.sqrt(distSq);
    const nx = dx / dist; // Normal pointing from A to B
    const ny = dy / dist;

    const penetration = radiusSum - dist;

    // Positional separation based on inverse mass
    const totalInvMass = a.invMass + b.invMass;
    if (totalInvMass === 0) return;

    const aRatio = a.invMass / totalInvMass;
    const bRatio = b.invMass / totalInvMass;

    a.x -= nx * penetration * aRatio;
    a.y -= ny * penetration * aRatio;
    b.x += nx * penetration * bRatio;
    b.y += ny * penetration * bRatio;

    // Relative velocity: v_rel = v_B - v_A
    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;

    // Velocity along normal
    const velAlongNormal = rvx * nx + rvy * ny;

    // Only resolve if objects are moving towards each other
    if (velAlongNormal > 0) return;

    // Restitution
    const e = Math.min(a.restitution, b.restitution);

    // Normal Impulse scalar J
    const j = -(1 + e) * velAlongNormal / totalInvMass;

    const impulseX = j * nx;
    const impulseY = j * ny;

    a.vx -= impulseX * a.invMass;
    a.vy -= impulseY * a.invMass;
    b.vx += impulseX * b.invMass;
    b.vy += impulseY * b.invMass;

    // Friction impulse along tangent
    const tx = -ny;
    const ty = nx;
    const velAlongTangent = rvx * tx + rvy * ty;
    const mu = Math.sqrt(a.friction * b.friction);
    let jt = -velAlongTangent / totalInvMass;

    // Coulomb friction law: |jt| <= mu * |j|
    const maxFriction = mu * Math.abs(j);
    jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

    const frictionImpulseX = jt * tx;
    const frictionImpulseY = jt * ty;

    a.vx -= frictionImpulseX * a.invMass;
    a.vy -= frictionImpulseY * a.invMass;
    b.vx += frictionImpulseX * b.invMass;
    b.vy += frictionImpulseY * b.invMass;
  }

  /**
   * Circle (A) vs Box/Platform (B)
   */
  collideCircleBox(circle, box, dt) {
    const hw = box.width / 2;
    const hh = box.height / 2;

    // Find closest point on box to circle center
    const closestX = Math.max(box.x - hw, Math.min(circle.x, box.x + hw));
    const closestY = Math.max(box.y - hh, Math.min(circle.y, box.y + hh));

    let dx = circle.x - closestX;
    let dy = circle.y - closestY;
    let distSq = dx * dx + dy * dy;

    let nx = 0;
    let ny = 0;
    let penetration = 0;

    // Circle center is inside the box
    if (distSq === 0) {
      // Find shortest ejection axis
      const distLeft = circle.x - (box.x - hw);
      const distRight = (box.x + hw) - circle.x;
      const distBottom = circle.y - (box.y - hh);
      const distTop = (box.y + hh) - circle.y;

      const minDist = Math.min(distLeft, distRight, distBottom, distTop);
      if (minDist === distLeft) {
        nx = -1; ny = 0; penetration = circle.radius + distLeft;
      } else if (minDist === distRight) {
        nx = 1; ny = 0; penetration = circle.radius + distRight;
      } else if (minDist === distBottom) {
        nx = 0; ny = -1; penetration = circle.radius + distBottom;
      } else {
        nx = 0; ny = 1; penetration = circle.radius + distTop;
      }
    } else {
      const dist = Math.sqrt(distSq);
      if (dist >= circle.radius) return;

      nx = dx / dist; // Points from box to circle
      ny = dy / dist;
      penetration = circle.radius - dist;
    }

    const totalInvMass = circle.invMass + box.invMass;
    if (totalInvMass === 0) return;

    const cRatio = circle.invMass / totalInvMass;
    const bRatio = box.invMass / totalInvMass;

    circle.x += nx * penetration * cRatio;
    circle.y += ny * penetration * cRatio;
    box.x -= nx * penetration * bRatio;
    box.y -= ny * penetration * bRatio;

    // Relative velocity: v_rel = v_circle - v_box
    const rvx = circle.vx - box.vx;
    const rvy = circle.vy - box.vy;

    const velAlongNormal = rvx * nx + rvy * ny;
    if (velAlongNormal > 0) return;

    const e = Math.min(circle.restitution, box.restitution);
    const j = -(1 + e) * velAlongNormal / totalInvMass;

    const impulseX = j * nx;
    const impulseY = j * ny;

    circle.vx += impulseX * circle.invMass;
    circle.vy += impulseY * circle.invMass;
    box.vx -= impulseX * box.invMass;
    box.vy -= impulseY * box.invMass;

    // Friction along surface
    const tx = -ny;
    const ty = nx;
    const velAlongTangent = rvx * tx + rvy * ty;
    const mu = Math.sqrt(circle.friction * box.friction);
    let jt = -velAlongTangent / totalInvMass;
    const maxFriction = mu * Math.abs(j);
    jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

    circle.vx += jt * tx * circle.invMass;
    circle.vy += jt * ty * circle.invMass;
    box.vx -= jt * tx * box.invMass;
    box.vy -= jt * ty * box.invMass;
  }

  /**
   * Box vs Box (AABB)
   */
  collideBoxBox(a, b, dt) {
    const hwA = a.width / 2;
    const hhA = a.height / 2;
    const hwB = b.width / 2;
    const hhB = b.height / 2;

    const dx = b.x - a.x;
    const dy = b.y - a.y;

    const overlapX = (hwA + hwB) - Math.abs(dx);
    const overlapY = (hhA + hhB) - Math.abs(dy);

    if (overlapX <= 0 || overlapY <= 0) return;

    let nx = 0;
    let ny = 0;
    let penetration = 0;

    // Collision normal along smallest overlap axis
    if (overlapX < overlapY) {
      nx = dx > 0 ? 1 : -1; // Points from A to B
      ny = 0;
      penetration = overlapX;
    } else {
      nx = 0;
      ny = dy > 0 ? 1 : -1;
      penetration = overlapY;
    }

    const totalInvMass = a.invMass + b.invMass;
    if (totalInvMass === 0) return;

    const aRatio = a.invMass / totalInvMass;
    const bRatio = b.invMass / totalInvMass;

    a.x -= nx * penetration * aRatio;
    a.y -= ny * penetration * aRatio;
    b.x += nx * penetration * bRatio;
    b.y += ny * penetration * bRatio;

    // Relative velocity: v_rel = v_B - v_A
    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;

    const velAlongNormal = rvx * nx + rvy * ny;
    if (velAlongNormal > 0) return;

    const e = Math.min(a.restitution, b.restitution);
    const j = -(1 + e) * velAlongNormal / totalInvMass;

    const impulseX = j * nx;
    const impulseY = j * ny;

    a.vx -= impulseX * a.invMass;
    a.vy -= impulseY * a.invMass;
    b.vx += impulseX * b.invMass;
    b.vy += impulseY * b.invMass;

    // Friction along tangent
    const tx = -ny;
    const ty = nx;
    const velAlongTangent = rvx * tx + rvy * ty;
    const mu = Math.sqrt(a.friction * b.friction);
    let jt = -velAlongTangent / totalInvMass;
    const maxFriction = mu * Math.abs(j);
    jt = Math.max(-maxFriction, Math.min(maxFriction, jt));

    a.vx -= jt * tx * a.invMass;
    a.vy -= jt * ty * a.invMass;
    b.vx += jt * tx * b.invMass;
    b.vy += jt * ty * b.invMass;
  }
}
