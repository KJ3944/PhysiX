/**
 * PhysiX Frontend API Client
 * Seamlessly interfaces with Express.js backend on /api with offline local storage fallback.
 */

const API_BASE = "/api";
const DIRECT_API_BASE = "http://localhost:3001/api";

/**
 * Check if cloud operations are allowed (online mode)
 * Returns false when offline to prevent cloud writes
 */
function isCloudOperationAllowed() {
  return navigator.onLine;
}

async function fetchJson(url, options = {}) {
  // Guard: Prevent cloud operations when offline
  if (!isCloudOperationAllowed()) {
    console.log(`[API Client] Offline mode: Skipping network request to ${url}`);
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // If proxied /api failed, attempt direct connection to Express server on port 3001
    if (url.startsWith("/api")) {
      try {
        const directUrl = url.replace("/api", DIRECT_API_BASE);
        const directRes = await fetch(directUrl, {
          headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
          },
          ...options
        });
        if (directRes.ok) {
          return await directRes.json();
        }
      } catch (directErr) {}
    }
    console.warn(`[API Client] Network request to ${url} failed:`, err.message);
  }
  return null;
}

export const api = {
  // Check backend server health
  async checkHealth() {
    const data = await fetchJson(`${API_BASE}/health`);
    return data && data.status === "ok";
  },

  // Student Profile
  async getProfile(userId = "guest") {
    const res = await fetchJson(`${API_BASE}/profile/${userId}`);
    if (res && res.success && res.profile) {
      // Sync to localStorage
      try {
        localStorage.setItem("physix_user_profile", JSON.stringify(res.profile));
      } catch (e) {}
      return res.profile;
    }
    // Fallback to localStorage
    try {
      const cached = localStorage.getItem("physix_user_profile");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  },

  async saveProfile(userId = "guest", profileData) {
    // Save to local cache first
    try {
      localStorage.setItem("physix_user_profile", JSON.stringify(profileData));
    } catch (e) {}

    const res = await fetchJson(`${API_BASE}/profile`, {
      method: "POST",
      body: JSON.stringify({ userId, profileData })
    });
    return res && res.success ? res.profile : profileData;
  },

  // Telemetry & Stats
  async getTelemetry(userId = "guest") {
    const res = await fetchJson(`${API_BASE}/telemetry/${userId}`);
    if (res && res.success && res.telemetry) {
      try {
        localStorage.setItem("physix_telemetry_stats", JSON.stringify(res.telemetry));
      } catch (e) {}
      return res.telemetry;
    }
    try {
      const cached = localStorage.getItem("physix_telemetry_stats");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  },

  async recordLaunch(userId = "guest", { v0, angleDeg, h0, g }) {
    const res = await fetchJson(`${API_BASE}/telemetry/launch`, {
      method: "POST",
      body: JSON.stringify({ userId, v0, angleDeg, h0, g })
    });
    return res && res.success ? res.telemetry : null;
  },

  async recordFlightComplete(userId = "guest", flightData) {
    const res = await fetchJson(`${API_BASE}/telemetry/flight-complete`, {
      method: "POST",
      body: JSON.stringify({ userId, ...flightData })
    });
    return res && res.success ? res : null;
  },

  // Flight Logs
  async getFlightLogs(userId = "guest") {
    const res = await fetchJson(`${API_BASE}/telemetry/flight-logs/${userId}`);
    if (res && res.success && Array.isArray(res.flightLogs)) {
      try {
        localStorage.setItem("physix_flight_logs", JSON.stringify(res.flightLogs));
      } catch (e) {}
      return res.flightLogs;
    }
    try {
      const cached = localStorage.getItem("physix_flight_logs");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  },

  async clearFlightLogs(userId = "guest") {
    try {
      localStorage.setItem("physix_flight_logs", JSON.stringify([]));
    } catch (e) {}

    const res = await fetchJson(`${API_BASE}/telemetry/flight-logs/${userId}`, {
      method: "DELETE"
    });
    return res && res.success ? res.flightLogs : [];
  },

  // Observations Logbook
  async getObservations(userId = "guest") {
    const res = await fetchJson(`${API_BASE}/telemetry/observations?userId=${userId}`);
    if (res && res.success && Array.isArray(res.observations)) {
      try {
        localStorage.setItem("physix_observations", JSON.stringify(res.observations));
      } catch (e) {}
      return res.observations;
    }
    try {
      const cached = localStorage.getItem("physix_observations");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  },

  async addObservation(userId = "guest", observation) {
    const res = await fetchJson(`${API_BASE}/telemetry/observations`, {
      method: "POST",
      body: JSON.stringify({ userId, observation })
    });
    return res && res.success ? res.observations : null;
  },

  async clearObservations(userId = "guest") {
    try {
      localStorage.setItem("physix_observations", JSON.stringify([]));
    } catch (e) {}
    const res = await fetchJson(`${API_BASE}/telemetry/observations?userId=${userId}`, {
      method: "DELETE"
    });
    return res && res.success ? res.observations : [];
  },

  // XP & Challenges
  async addXp(userId = "guest", amount = 0, reason = "Challenge Complete") {
    const res = await fetchJson(`${API_BASE}/telemetry/xp`, {
      method: "POST",
      body: JSON.stringify({ userId, amount, reason })
    });
    return res && res.success ? res.bonusXp : null;
  },

  // Badges & Achievements
  async getBadges(userId = "guest") {
    const res = await fetchJson(`${API_BASE}/badges/${userId}`);
    if (res && res.success && Array.isArray(res.badges)) {
      try {
        localStorage.setItem("physix_unlocked_badges", JSON.stringify(res.badges));
      } catch (e) {}
      return res.badges;
    }
    try {
      const cached = localStorage.getItem("physix_unlocked_badges");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  },

  async unlockBadge(userId = "guest", badgeId) {
    const res = await fetchJson(`${API_BASE}/badges/unlock`, {
      method: "POST",
      body: JSON.stringify({ userId, badgeId })
    });
    return res && res.success ? res.badges : null;
  },

  // Quiz evaluation
  async submitQuiz(userId = "guest", userAnswers) {
    const res = await fetchJson(`${API_BASE}/quiz/submit`, {
      method: "POST",
      body: JSON.stringify({ userId, userAnswers })
    });
    return res && res.success ? res : null;
  },

  // Kinematics calculations
  async calculateKinematics({ v0, angleDeg, h0, g }) {
    const res = await fetchJson(`${API_BASE}/kinematics/calculate`, {
      method: "POST",
      body: JSON.stringify({ v0, angleDeg, h0, g })
    });
    return res && res.success ? res.results : null;
  },

  async checkTargetHit(userId = "guest", landXMeters, targetXMeters) {
    const res = await fetchJson(`${API_BASE}/kinematics/target-check`, {
      method: "POST",
      body: JSON.stringify({ userId, landXMeters, targetXMeters })
    });
    return res && res.success ? res : null;
  },

  // Vectra AI Physics Copilot
  async sendAiChat({ message, history = [], simulationContext = {} }) {
    if (isCreatorQuestion(message)) {
      return {
        success: true,
        name: "Vectra AI",
        model: "Vectra AI Direct",
        reply: "This is a Project built by four Computer Engineering students Ojas Joshi, Jeshurun Selvakumar, Kshitij Jadhav, Adithya Iyer."
      };
    }

    const res = await fetchJson(`${API_BASE}/ai/chat`, {
      method: "POST",
      body: JSON.stringify({ message, history, simulationContext })
    });
    if (res && res.success && res.reply) {
      return res;
    }

    // Direct Gemini client fallback if backend is offline/unreachable
    const directAi = await tryClientDirectAiChat(message, history, simulationContext);
    if (directAi) {
      return directAi;
    }

    // Client-side physics copilot fallback for GitHub Pages & static hosting
    return {
      success: true,
      name: "Vectra AI",
      model: "Vectra AI (Client-Side Precision Engine)",
      reply: generateClientPhysicsResponse(message, simulationContext)
    };
  },

  async analyzeFlightWithAi({ flightData, simulationContext = {} }) {
    const res = await fetchJson(`${API_BASE}/ai/analyze-flight`, {
      method: "POST",
      body: JSON.stringify({ flightData, simulationContext })
    });
    if (res && res.success && res.analysis) return res.analysis;
    return generateClientFlightAnalysis(flightData || simulationContext);
  },

  async getAiStatus() {
    const res = await fetchJson(`${API_BASE}/ai/status`);
    if (res && res.status === "ready") return res;
    return {
      status: "ready",
      name: "Vectra AI",
      model: "Client Kinematics Core"
    };
  }
};

// Client-Side Physics Intelligence Engine for GitHub Pages & Offline Deployments
const CLIENT_API_KEY = typeof __VECTRA_AI_KEY__ !== "undefined" ? __VECTRA_AI_KEY__ : "";
const CLIENT_CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.1-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
  "gemini-3.7-flash"
];

async function tryClientDirectAiChat(message, history = [], simulationContext = {}) {
  if (!CLIENT_API_KEY || !navigator.onLine) return null;

  for (const model of CLIENT_CANDIDATE_MODELS) {
    try {
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const h of history.slice(-8)) {
          const text = (h.text || h.content || "").trim();
          if (!text) continue;
          const role = h.role === "user" ? "user" : "model";
          if (contents.length > 0 && contents[contents.length - 1].role === role) {
            contents[contents.length - 1].parts[0].text += "\n" + text;
          } else {
            contents.push({ role, parts: [{ text }] });
          }
        }
        while (contents.length > 0 && contents[0].role !== "user") {
          contents.shift();
        }
        if (contents.length > 0 && contents[contents.length - 1].role === "user") {
          if (contents[contents.length - 1].parts[0].text === message) {
            contents.pop();
          }
        }
      }

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const systemPrompt = `You are Vectra AI, an intelligent physics laboratory copilot built into PhysiX.
Answer the user's physics questions conversationally, accurately, and mathematically.
Format equations clearly using standard LaTeX ($...$ for inline, $$...$$ for display equations) or clear mathematical symbols.
Keep explanations intuitive, rigorous, and relevant to classical mechanics, wave optics, or optoelectronics.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${CLIENT_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1400
          }
        })
      });

      const data = await response.json();
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return {
          success: true,
          name: "Vectra AI",
          model,
          reply: data.candidates[0].content.parts[0].text
        };
      }
    } catch (err) {
      // Continue to next model
    }
  }
  return null;
}
function isCreatorQuestion(text = "") {
  const t = text.toLowerCase();
  return (
    t.includes("who built") ||
    t.includes("who made") ||
    t.includes("who created") ||
    t.includes("who developed") ||
    t.includes("who are the owners") ||
    t.includes("who is the owner") ||
    t.includes("who owns") ||
    t.includes("who are the creators") ||
    t.includes("who are the authors") ||
    t.includes("developers of") ||
    t.includes("creators of") ||
    t.includes("team behind") ||
    (t.includes("about the team") || t.includes("about the creators")) ||
    (t.includes("who are you built by") || t.includes("who made this website") || t.includes("who built this website"))
  );
}

function generateClientPhysicsResponse(userMessage = "", context = {}) {
  if (isCreatorQuestion(userMessage)) {
    return "This is a Project built by four Computer Engineering students Ojas Joshi, Jeshurun Selvakumar, Kshitij Jadhav, Adithya Iyer.";
  }

  const msg = userMessage.toLowerCase();

  // General Experiments Catalog & Platform Overview
  if (
    msg.includes("what experiment") ||
    msg.includes("list experiment") ||
    msg.includes("all experiment") ||
    msg.includes("which experiment") ||
    msg.includes("available experiment") ||
    msg.includes("experiments available") ||
    msg.includes("tell me about the experiment") ||
    msg.includes("about the experiments") ||
    msg.includes("experiments in physix") ||
    msg.includes("what labs") ||
    msg.includes("list labs")
  ) {
    return `### PhysiX Virtual Physics Laboratory Catalog

PhysiX hosts **5 fully interactive real-time simulation laboratories** powered by high-precision computational engines:

#### 1. Experiment 1: 2D Projectile Motion Virtual Laboratory (\`#exp-projectile-section\`)
- **Domain**: Classical Newtonian Mechanics & Ballistics
- **Core Physics**: Parabolic trajectory equations $y(x) = h_0 + x\\tan\\theta - \\frac{g x^2}{2 v_0^2 \\cos^2\\theta}$, time of flight $T$, maximum apex $H_{max}$, range $R$, and planetary gravity comparison (Earth, Moon, Mars, Jupiter).
- **Interactive Deck**: Sliders for initial velocity $v_0$ (10–50 m/s), launch angle $\\theta$ (0–90°), platform cliff height $h_0$ (0–100 m), and **Target Challenge Mode**.

#### 2. Experiment 2: Determination of Numerical Aperture of an Optical Fibre (\`#exp-optical-section\`)
- **Domain**: Fiber Optics, Waveguides & Photonics
- **Core Physics**: Acceptance cone geometry, total internal reflection, numerical aperture $NA = \\frac{W}{\\sqrt{4L^2 + W^2}} = \\sin\\theta_a$, and normalized frequency $V$-number.
- **Interactive Deck**: Optical bench with laser source switches, tunable wavelength (650nm, 532nm, 405nm, 850nm), movable screen distance $L$ (1–10 cm), spot diameter measurement $W$, and the **40s Rapid Calibration Challenge**.

#### 3. Experiment 3: Study of Colour Sensor (TCS3200) & Spectral Response (\`#exp-colour-sensor-section\`)
- **Domain**: Optoelectronics, Photodiode Arrays & Colorimetry
- **Core Physics**: Light-to-frequency conversion $f_{out} \\propto I_{ph}$, $8\\times 8$ photodiode matrix, S2/S3 pin filtering (Red, Green, Blue, Clear), S0/S1 scaling (2%, 20%, 100%), inverse-square distance attenuation $E \\propto 1/d^2$, and CIE chromaticity coordinates ($r, g, b$).
- **Interactive Deck**: Calibrated color chips, standoff rail distance slider (5–30 mm), and the **Spectroscopic Detective (Mystery Sample) Challenge**.

#### 4. Experiment 4: Physics Sandbox & 2D Kinematics Playground (\`#exp-sandbox-section\`)
- **Domain**: Newtonian Rigid Body Kinetics & Impulse Mechanics
- **Core Physics**: Matter.js Verlet integration, rigid body collisions, coefficient of restitution $e$, static/kinetic friction, dynamic continuous thrust, and high-impulse kicks ($F = \\Delta p / \\Delta t$).
- **Interactive Deck**: Shape spawners, force arrows, variable gravity slider (0–25 m/s²), Zero-G mode, and challenges (**Newton's Dynamic Thrust**, **High-Impulse Kick**, **Zero-G Inertial Cruise**).

#### 5. Experiment 5: Diffraction Grating Spectrometry Laboratory (\`#exp-diffraction-section\`)
- **Domain**: Wave Optics, Multi-Slit Fraunhofer Interference & Spectroscopy
- **Core Physics**: Grating equation $d\\sin\\theta = m\\lambda$, grating pitch $d = 1/N$, spectral orders $m = 0, \\pm 1, \\pm 2$, maximum observable order $m_{max} = \\lfloor d/\\lambda \\rfloor$, angular dispersion $D = \\frac{m}{d\\cos\\theta}$, and detector fringe displacement $y = L\\tan\\theta$.
- **Interactive Deck**: Dual-canvas optical bench & screen detector, tunable laser wavelength $\\lambda$ (400–700 nm), grating ruling density $N$ (300–1200 lines/mm), screen rail distance $L$ (0.50–2.00 m), and the **Mystery Gas Tube Challenge** (He-Ne 633nm, Argon 488nm, Krypton 568nm).

You can switch between any of these laboratories using the **Explore Labs Hub** or the top lab selector banner!`;
  }

  // Website & Lab Operations Guide
  if (
    msg.includes("how to use") ||
    msg.includes("how do i use") ||
    msg.includes("guide") ||
    msg.includes("help") ||
    msg.includes("operations manual") ||
    msg.includes("how to run") ||
    msg.includes("tutorial") ||
    msg.includes("instructions")
  ) {
    if (context?.experiment === "Diffraction Grating" || msg.includes("diffraction") || msg.includes("grating") || msg.includes("spectrometer") || msg.includes("spectral") || msg.includes("slit")) {
      return `### How to Operate Experiment 5: Diffraction Grating Spectrometry Laboratory

#### Step-by-Step Operating Instructions:
1. **Tune Laser Wavelength ($\\lambda$)**: Use the Monochromatic Laser Wavelength slider (\`#dg-wl-slider\`) to select a wavelength between **400 nm** and **700 nm**, or click one of the quick laser presets:
   - **405nm Violet**
   - **488nm Cyan**
   - **532nm Green**
   - **589nm Sodium Yellow**
   - **633nm He-Ne Red**
2. **Set Grating Density ($N$)**: Adjust the Grating Density slider (\`#dg-density-slider\`) from **300 lines/mm** to **1200 lines/mm** (presets: **300**, **600**, **830**, **1000**, **1200 lines/mm**).
   - Slit pitch $d = \\frac{1}{N \\times 10^3}\\text{ m}$. For $N = 600\\text{ lines/mm}$, $d \\approx 1.667\\ \\mu\\text{m}$.
3. **Position Detector Screen ($L$)**: Adjust the optical bench rail screen slider (\`#dg-screen-slider\`) from **0.50 m** to **2.00 m** (presets: **0.80m**, **1.00m**, **1.20m**, **1.50m**).
4. **Select Diffraction Order ($m$)**: Click the order selector buttons ($m = -2, -1, 0, +1, +2$, or **All**) to isolate specific beams and inspect angular deflection $\\theta$ and screen displacement $y = L\\tan\\theta$.
5. **Record Observations**: Click **Record Observation** (\`#dg-btn-record-obs\`) to log Trial, Nominal $\\lambda$, Density $N$, Pitch $d$, Order $m$, Angle $\\theta$, Screen $L$, Fringe $y$, and Calculated $\\lambda$.
6. **Export Certified Report**: Click **CSV** (\`#dg-btn-export-csv\`) or **PDF** (\`#dg-btn-export-pdf\`) to download your experimental data.

#### Challenges:
- Click **Install Unknown** in the **Mystery Gas Tube Challenge** card to test atomic emission lines (He-Ne 633nm, Argon 488nm, Krypton 568nm) and earn **175 XP**!`;
    }

    if (context?.experiment === "Physics Sandbox" || msg.includes("sandbox") || msg.includes("playground")) {
      return `### How to Operate Experiment 4: Physics Sandbox & 2D Kinematics Playground

#### Step-by-Step Operating Instructions:
1. **Spawn Rigid Bodies**: Use the spawn controls to add circles, boxes, and custom masses onto the 2D physics canvas.
2. **Configure Physical Properties**: Select an object to adjust its mass ($m$), coefficient of restitution ($e$), and surface friction.
3. **Interact in Real-Time**: Click and drag any body to launch or position it in the canvas.
4. **Apply Forces & Impulses**: Use the Control Deck to apply sustained directional thrust ($F$) or instantaneous ballistic kicks ($J = \\Delta p$).
5. **Adjust Celestial Gravity**: Use the gravity slider to simulate environments from Zero-G ($0\\text{ m/s}^2$) up to Jupiter ($24.8\\text{ m/s}^2$).
6. **Complete Challenges**: Unlock bonus XP by completing **Dynamic Thrust** (100 XP), **Ballistic Kick** (125 XP), and **Zero-G Inertial Cruise** (150 XP)!`;
    }

    if (context?.experiment === "Study of Colour Sensor" || msg.includes("colour") || msg.includes("color") || msg.includes("tcs3200")) {
      return `### How to Operate Experiment 3: Study of Colour Sensor (TCS3200)

#### Step-by-Step Operating Instructions:
1. **Turn On Main Power**: Click the **Main Power** button (\`#cs-btn-power-switch\`) to energize the TCS3200 converter IC.
2. **Turn On White LEDs**: Click the **White LEDs** button (\`#cs-btn-illum-switch\`) to turn on the 4x spotlight ring for reflective specimen illumination.
3. **Select Color Swatch**: Click any calibrated color chip (**Red**, **Green**, **Blue**, **Yellow**, **Orange**, **Purple**, **Cyan**, **Magenta**, **White**, **Black**) or choose a custom shade.
4. **Select S2/S3 Filter Channel**:
   - **RED (0,0)**: Measures red spectral irradiance ($\\lambda \\approx 650\\text{ nm}$).
   - **GREEN (1,1)**: Measures green spectral irradiance ($\\lambda \\approx 540\\text{ nm}$).
   - **BLUE (0,1)**: Measures blue spectral irradiance ($\\lambda \\approx 470\\text{ nm}$).
   - **CLEAR (1,0)**: Measures unfiltered broadband irradiance ($350-950\\text{ nm}$).
5. **Adjust Standoff Distance ($d$)**: Drag the slider between **5.0 mm** and **30.0 mm**. (Optimal reading occurs at **10.0–14.0 mm**).
6. **Record & Export**: Click **Record Reading** to save the observation, then click **Export CSV** or **Export PDF Report** to download certified results.

#### Challenges:
- Click **Mystery Sample** (\`#cs-btn-toggle-mystery\`) to launch the **Spectroscopic Detective Challenge** and decode unknown specimen colors for **300 XP**!`;
    }

    if (context?.experiment === "Optical Fibre Numerical Aperture" || msg.includes("optical") || msg.includes("fiber") || msg.includes("fibre") || msg.includes("laser")) {
      return `### How to Operate Experiment 2: Numerical Aperture of an Optical Fibre

#### Step-by-Step Operating Instructions:
1. **Turn On Main Power**: Click the **Main Power** button (\`#of-btn-power-switch\`) in the Trainer Hardware Deck. The green LED will turn ON.
2. **Turn On Laser Source**: Click the **Laser Source** button (\`#of-btn-laser-switch\`). The red LED will illuminate, transmitting laser light through the fiber core.
3. **Select Wavelength**: Choose a laser wavelength chip: **650nm (Red)**, **532nm (Green)**, **405nm (Violet)**, or **850nm (IR)**.
4. **Set Screen Distance ($L$)**: Adjust the **Screen Distance (L)** slider between **1.0 cm** and **10.0 cm** (or click presets: **2.0 cm**, **4.0 cm**, **6.0 cm**, **8.0 cm**, **10.0 cm**).
5. **Measure Spot Diameter ($W$)**: Observe the expanding light circle on the screen and calculate:
   $$NA = \\frac{W}{\\sqrt{4L^2 + W^2}}, \\quad \\theta_a = \\arcsin(NA)$$
6. **Record & Export**: Click **Record Reading** to log telemetry, then click **Export CSV** or **Export PDF Report** to download your lab report.

#### Challenges:
- Click **Start Rapid Calibration** to attempt the **40s Rapid Calibration Challenge** and earn **250 XP** & the *Optics Precisionist* badge!`;
    }

    return `### How to Operate Experiment 1: 2D Projectile Motion Virtual Lab

#### Step-by-Step Operating Instructions:
1. **Set Initial Velocity ($v_0$)**: Drag the velocity slider between **10.0 m/s** and **50.0 m/s** (or use the \`−\` / \`+\` step buttons).
2. **Set Launch Angle ($\\theta$)**: Set the launch angle from **0.0°** (flat horizontal shot) up to **90.0°** (vertical shot).
3. **Set Platform Height ($h_0$)**: Adjust the cannon cliff height from **0.0 m** to **100.0 m**.
4. **Select Gravity ($g$)**: Choose **Earth** ($9.81\\text{ m/s}^2$), **Moon** ($1.62\\text{ m/s}^2$), **Mars** ($3.71\\text{ m/s}^2$), or **Jupiter** ($24.79\\text{ m/s}^2$).
5. **Fire Cannon**: Click the green **LAUNCH PROJECTILE** button or press the **Spacebar** on your keyboard.
6. **Record & Export**: Click **+ Record Observation** to store flight telemetry, or click **Export CSV** / **Export PDF Report** to export certified data.
7. **Reset**: Click **RESET** (or press **[R]**) to clear trajectory trails.

#### Challenges:
- Toggle **Target Challenge Mode** to spawn a landing target and calculate the exact angle needed to score a bullseye for **Student XP**!`;
  }

  // Export Guidance Query
  if (msg.includes("export") || msg.includes("pdf") || msg.includes("csv") || msg.includes("download report") || msg.includes("save data")) {
    return `### Telemetry Data Export Guide by **Vectra AI**

#### 1. Export CSV (Spreadsheet Logbook)
- Click the **Export CSV** button in the Observation Logbook card.
- Automatically compiles all recorded simulation trials into a downloadable \`.csv\` file containing exact numerical parameters (Velocity, Angle, Distance, Output Frequencies, Calculated Values, and Time Stamps).
- Open directly in Microsoft Excel, Google Sheets, or MATLAB for further statistical analysis.

#### 2. Export PDF Report (Certified Laboratory Report)
- Click the **Export PDF Report** button.
- Generates a certified laboratory report including:
  * Student Name, ID, Course, and Timestamp metadata.
  * KPI summary cards ($v_0, \\theta, h_0, g, H_{max}, R, T$ or $NA, \\theta_a, d, f_{out}$ or $\\lambda, N, d, \\theta, y, D$).
  * Analytical governing physics formulas.
  * Formatted tabular log of all recorded observations.
- Ready for printing or academic submission!`;
  }

  // Challenges, Game Mode, XP & Badges Query
  if (
    msg.includes("challenge") ||
    msg.includes("game mode") ||
    /\bxp\b/i.test(msg) ||
    msg.includes("badge") ||
    msg.includes("gamification") ||
    msg.includes("quiz") ||
    msg.includes("mystery")
  ) {
    if (context?.experiment === "Diffraction Grating" || msg.includes("diffraction") || msg.includes("gas tube") || msg.includes("unknown tube")) {
      return `### Diffraction Grating Challenges & Mystery Gas Tube Guide

#### 1. Challenge 1: First-Order Precision (100 XP)
- **Goal**: Align laser to **633 nm** (Red) with $N = 600\\text{ lines/mm}$ and measure first-order angle $\\theta \\approx 22.3^\\circ$.

#### 2. Challenge 2: High-Density Dispersion (125 XP)
- **Goal**: Configure 532 nm (Green) at $N = 1000\\text{ lines/mm}$ to observe wide angular dispersion ($\\theta \\approx 32.1^\\circ$).

#### 3. Challenge 3: Second-Order Resolution (150 XP)
- **Goal**: Isolate second-order maximum ($m = 2$) with $\\lambda = 450\\text{ nm}$ and $N = 600\\text{ lines/mm}$.

#### 4. Challenge 4: Mystery Gas Tube Identification (175 XP)
- **Goal**: Click **Install Unknown** (\`#dg-btn-start-mystery\`). Measure diffraction angle $\\theta$ and calculate unknown emission wavelength:
  $$\\lambda = \\frac{d \\sin\\theta}{m}$$
- Input the computed wavelength in nm and click **Verify** to identify the atomic gas!

#### 5. Challenge 5: Spectroscopy Mastery (200 XP)
- **Goal**: Log at least 4 observation trials across multiple orders and wavelengths into the Observation Table.`;
    }

    return `### PhysiX Gamification, Challenges & XP Guide

#### 1. Target Challenge Mode (Experiment 1: Projectile Motion)
- **Objective**: Hit a randomly placed landing pad at distance $d$.
- **Formula**: Calculate required angle $\\theta$ via $\\sin(2\\theta) = \\frac{d \\cdot g}{v_0^2}$.
- **Reward**: Bonus Student XP and unlocks the *Bullseye Ace* achievement badge.

#### 2. 40s Rapid Calibration Challenge (Experiment 2: Optical Fibre)
- **Objective**: Record 4 distinct distance readings ($L$) with $<2\\%$ experimental error within 40 seconds.
- **Reward**: **250 Student XP** and the *Optics Precisionist* badge.

#### 3. Spectroscopic Detective Challenge (Experiment 3: TCS3200 Colour Sensor)
- **Objective**: Click **Mystery Sample** to load an unknown chemical specimen. Analyze output frequencies across Red, Green, Blue, and Clear filters to determine the exact color hex code.
- **Reward**: **300 Student XP** and the *Spectra Master* badge.

#### 4. Wave Optics & Mystery Gas Tube Challenges (Experiment 5: Diffraction Grating)
- **Objective**: Determine unknown atomic emission lines (He-Ne 633nm, Argon 488nm, Krypton 568nm) via $\\lambda = \\frac{d\\sin\\theta}{m}$ and master multi-slit dispersion.
- **Reward**: **175 Student XP** and wave optics badges.

#### 5. Newtonian Mechanics Challenges (Experiment 4: Physics Sandbox)
- **Dynamic Thrust (100 XP)**, **High-Impulse Kick (125 XP)**, and **Zero-G Inertial Cruise (150 XP)**.

#### 6. Physics Quiz (10 Questions)
- Click **Physics Quiz [10Q]** in the top navigation bar to test your conceptual knowledge across mechanics, wave optics, and sensor electronics to level up your student rank!`;
  }

  // Machine Turn-On / Hardware Switch Specific Queries
  if (
    msg.includes("turn on") ||
    msg.includes("power switch") ||
    msg.includes("turn on machine") ||
    msg.includes("switch on") ||
    msg.includes("start machine") ||
    msg.includes("laser switch") ||
    msg.includes("led switch")
  ) {
    return `### Hardware Power-On Procedures

#### Experiment 2: Optical Bench
1. **Main Power**: Click **Main Power** (\`#of-btn-power-switch\`) to enable the 5V DC power bus. The green LED will glow.
2. **Laser Source**: Click **Laser Source** (\`#of-btn-laser-switch\`) to activate the coherent diode beam. Red LED glows.
*Note*: The laser diode cannot fire if Main Power is turned off.

#### Experiment 3: TCS3200 Colour Sensor
1. **Main Power**: Click **Main Power** (\`#cs-btn-power-switch\`) to supply 5V DC to the internal photodiode array and pulse oscillator.
2. **White LEDs**: Click **White LEDs** (\`#cs-btn-illum-switch\`) to activate the 4-LED spotlight ring for reflective specimen illumination.
*Note*: The LED array requires Main Power to be active.

#### Experiment 5: Diffraction Grating Bench
- The solid-state laser is energized and aligned to the optical bench automatically. Adjust wavelength via \`#dg-wl-slider\` or click preset wavelength buttons (405nm, 488nm, 532nm, 589nm, 633nm).`;
  }

  // Colour Sensor & Tristimulus Colorimetry Calculations
  if (
    context?.experiment === "Study of Colour Sensor" ||
    msg.includes("colour sensor") ||
    msg.includes("color sensor") ||
    msg.includes("tcs3200") ||
    msg.includes("tcs230") ||
    msg.includes("photodiode") ||
    msg.includes("tristimulus") ||
    msg.includes("colorimetry") ||
    msg.includes("spectral filter") ||
    msg.includes("swatch") ||
    msg.includes("scaling")
  ) {
    const d = Number(context?.distanceMm) || 12.0;
    const filter = (context?.filterChannel || "clear").toUpperCase();
    const fOut = Number(context?.outputFrequencyKhz) || 0;
    const fR = Number(context?.freqRed) || 0;
    const fG = Number(context?.freqGreen) || 0;
    const fB = Number(context?.freqBlue) || 0;
    const fC = Number(context?.freqClear) || 0;
    const hex = context?.detectedHex || "#000000";
    const fidelity = context?.matchFidelityPct || 0;

    return `### Vectra AI Theoretical Analysis: Colour Sensor & Spectral Colorimetry

#### 1. Fundamental Optoelectronic Principles
The **TCS3200** color sensor converts spectral light irradiance into a digital square-wave pulse train:
$$I_{ph} = \\eta \\cdot \\frac{q P_{opt} \\lambda}{h c} \\implies f_{out} \\propto I_{ph}$$
- **Micro-Filter Array**: $8 \\times 8$ photodiode matrix (16 Red, 16 Green, 16 Blue, 16 Clear unfiltered silicon photodiodes).
- **Control Multiplexer (S2, S3)**:
  - $S_2=0, S_3=0 \\implies \\text{Red Filter } (\\lambda \\approx 650\\text{ nm})$
  - $S_2=0, S_3=1 \\implies \\text{Blue Filter } (\\lambda \\approx 470\\text{ nm})$
  - $S_2=1, S_3=0 \\implies \\text{Clear / Unfiltered Broadband } (350-950\\text{ nm})$
  - $S_2=1, S_3=1 \\implies \\text{Green Filter } (\\lambda \\approx 540\\text{ nm})$
- **Frequency Scaling (S0, S1)**:
  - $S_0=1, S_1=1 \\implies 100\\% \\text{ Frequency Scale}$
  - $S_0=1, S_1=0 \\implies 20\\% \\text{ Frequency Scale}$
  - $S_0=0, S_1=1 \\implies 2\\% \\text{ Frequency Scale}$
  - $S_0=0, S_1=0 \\implies \\text{Power Down}$

#### 2. Live Laboratory Telemetry
- **Standoff Distance ($d$)**: **${d.toFixed(1)} mm**
- **Selected Channel**: **${filter}** (Active Output $f_{out} = \\mathbf{${fOut.toFixed(1)}\\text{ kHz}}$)
- **Spectral Channel Breakdown**:
  - $f_R = ${fR.toFixed(1)}\\text{ kHz}$ | $f_G = ${fG.toFixed(1)}\\text{ kHz}$ | $f_B = ${fB.toFixed(1)}\\text{ kHz}$ | $f_C = ${fC.toFixed(1)}\\text{ kHz}$
- **Reconstructed Color**: $\\mathbf{${hex}}$ with **${fidelity}% Spectral Fidelity**

#### 3. Tristimulus Normalization Equations
$$r = \\frac{f_R}{f_R + f_G + f_B}, \\quad g = \\frac{f_G}{f_R + f_G + f_B}, \\quad b = \\frac{f_B}{f_R + f_G + f_B}$$
*Physical Insight*: Standoff distance $d$ follows the Inverse-Square Law ($E \\propto 1/d^2$). Optimal detection occurs at $d \\approx 10-14\\text{ mm}$ where reflected illuminance is maximized with minimal shadow vignette.`;
  }

  // Optical Fibre Numerical Aperture Calculations
  if (
    context?.experiment === "Optical Fibre Numerical Aperture" ||
    msg.includes("optical fibre") ||
    msg.includes("optical fiber") ||
    msg.includes("numerical aperture") ||
    msg.includes("acceptance angle") ||
    msg.includes("spot diameter")
  ) {
    const L = Number(context?.distanceL) || 1.5;
    const W = Number(context?.spotDiameterW) || 1.51;
    const denom = Math.sqrt(4 * L * L + W * W);
    const NA = denom > 0 ? W / denom : 0;
    const thetaRad = Math.asin(Math.min(1, Math.max(0, NA)));
    const thetaDeg = (thetaRad * 180) / Math.PI;

    return `### Vectra AI Theoretical Analysis: Numerical Aperture ($NA$)

#### 1. Fundamental Optical Principles
The Numerical Aperture ($NA$) characterizes the light-gathering capability of an optical fiber:
$$NA = \\sin \\theta_{max} = \\sqrt{n_{core}^2 - n_{cladding}^2}$$

Using the experimental laser spot geometry at distance $L = ${L.toFixed(2)}\\text{ cm}$ with spot diameter $W = ${W.toFixed(2)}\\text{ cm}$:
$$NA = \\frac{W}{\\sqrt{4L^2 + W^2}}$$

#### 2. Quantitative Step-by-Step Derivation
1. **Screen Distance ($L$)**: $L = ${L.toFixed(2)}\\text{ cm}$
2. **Emerging Spot Diameter ($W$)**: $W = ${W.toFixed(2)}\\text{ cm}$
3. **Hypotenuse $\\sqrt{4L^2 + W^2}$**: $\\sqrt{4(${L.toFixed(2)})^2 + (${W.toFixed(2)})^2} = ${denom.toFixed(4)}\\text{ cm}$
4. **Calculated Numerical Aperture ($NA$)**:
   $$\\mathbf{NA = \\frac{${W.toFixed(2)}}{${denom.toFixed(4)}} = ${NA.toFixed(4)}}$$
5. **Maximum Acceptance Angle ($\\theta_a$)**:
   $$\\mathbf{\\theta_a = \\arcsin(${NA.toFixed(4)}) = ${thetaDeg.toFixed(2)}^\\circ}$$

*Physical Insight*: In step-index fibers, $NA$ remains strictly invariant with distance $L$ because spot diameter $W$ expands proportionally ($W \\propto 2L \\tan\\theta_a$).`;
  }

  // Mystery Gas Tube Challenge Queries
  if (
    msg.includes("mystery gas") ||
    msg.includes("gas tube") ||
    msg.includes("unknown gas") ||
    msg.includes("mystery tube") ||
    msg.includes("neon") ||
    msg.includes("argon") ||
    msg.includes("krypton") ||
    (msg.includes("mystery") && (context?.experiment === "Diffraction Grating" || msg.includes("diffraction") || msg.includes("tube")))
  ) {
    return `### Mystery Gas Tube Challenge Guide by **Vectra AI**

#### Objective:
Determine the unknown atomic emission wavelength $\\lambda$ of a sealed discharge gas tube using the diffraction grating equation:
$$\\lambda = \\frac{d \\sin\\theta}{m}$$

#### Step-by-Step Solution Procedure:
1. Click **Install Unknown** (\`#dg-btn-start-mystery\`) in the Mystery Gas Tube Challenge Card. An unknown discharge specimen tube is loaded onto the optical bench.
2. Note the Grating Line Density $N$ (e.g. $600\\text{ lines/mm} \\implies d = 1.6667\\ \\mu\\text{m} = 1.6667 \\times 10^{-6}\\text{ m}$).
3. Read the measured diffraction angle $\\theta$ from the Live Telemetry HUD or screen displacement $y$.
4. Calculate unknown wavelength:
   $$\\lambda = \\frac{d \\sin\\theta}{m}$$
5. Convert meters to nanometers ($\\text{nm} = \\text{meters} \\times 10^9$).
6. Enter your computed wavelength (e.g., \`633\`) into the input field (\`#dg-mystery-guess-input\`) and click **Verify** (\`#dg-btn-submit-guess\`) to earn **175 Student XP**!

#### Reference Atomic Gas Discharge Specimens in PhysiX:
| Specimen ID | Atomic Emission Element | True Wavelength ($\\lambda$) | Spectral Color | $\\theta$ at $N=600$ ($m=1$) |
| :--- | :--- | :--- | :--- | :--- |
| **neon** | Helium-Neon (He-Ne) Gas Tube | **$633\\text{ nm}$** | Laser Crimson Red | **$22.32^\\circ$** |
| **argon** | Argon Ion ($Ar^+$) Tube | **$488\\text{ nm}$** | Cyan / Turquoise | **$17.03^\\circ$** |
| **krypton** | Krypton Ion Gas Line | **$568\\text{ nm}$** | Pure Amber Yellow | **$19.93^\\circ$** |`;
  }

  // Experiment 5: Diffraction Grating & Wave Optics Queries
  if (
    context?.experiment === "Diffraction Grating" ||
    msg.includes("diffraction") ||
    msg.includes("grating") ||
    msg.includes("wavelength") ||
    msg.includes("spectrometer") ||
    msg.includes("spectroscopy") ||
    msg.includes("spectral order") ||
    msg.includes("spectral line") ||
    msg.includes("dispersion") ||
    msg.includes("fraunhofer") ||
    msg.includes("fringe") ||
    msg.includes("slit spacing") ||
    msg.includes("lines per mm")
  ) {
    const wl = Number(context?.wavelengthNm || 550);
    const N = Number(context?.linesPerMm || 600);
    const d = context?.gratingSpacingD ? Number(context.gratingSpacingD) : (1 / (N * 1000));
    const dUm = (d * 1e6).toFixed(4);
    const L = Number(context?.screenDistanceM || 1.0);
    const m = context?.selectedOrder === "all" ? 1 : Number(context?.selectedOrder ?? 1);
    const theta = typeof context?.thetaDeg === "number" ? context.thetaDeg : 19.27;
    const yCm = typeof context?.yPosCm === "number" ? context.yPosCm : 34.96;
    const disp = typeof context?.dispersion === "number" ? context.dispersion : 0.635;
    const maxM = Math.floor(d / (wl * 1e-9));

    return `### Vectra AI Theoretical Analysis: Diffraction Grating Spectrometry

#### 1. Governing Fraunhofer Multi-Slit Grating Equation
When monochromatic laser light of wavelength $\\lambda$ passes through a transmission grating with slit spacing (pitch) $d$, coherent waves from each slit interfere constructively to form sharp principal spectral maxima:
$$d \\sin\\theta = m\\lambda \\implies \\lambda = \\frac{d \\sin\\theta}{m}$$
- $d$: Grating ruling spacing (pitch) $= \\frac{1}{N \\times 10^3}\\text{ meters}$ (for $N\\text{ lines/mm}$).
- $\\theta$: Angular deviation of the $m$-th diffraction maximum from the incident beam.
- $m$: Integer spectral diffraction order ($m = 0, \\pm 1, \\pm 2, \\dots$).
- $\\lambda$: Monochromatic light wavelength in meters (or nanometers $\\times 10^{-9}$).

#### 2. Live Laboratory Telemetry & Computed Values
- **Incident Laser Wavelength ($\\lambda$)**: **${wl}\\text{ nm}$** (${wl < 450 ? "Violet" : wl < 495 ? "Cyan/Blue" : wl < 570 ? "Green" : wl < 590 ? "Yellow" : "Red"})
- **Grating Ruling Density ($N$)**: **${N}\\text{ lines/mm}$**
- **Grating Pitch ($d = 1/N$)**: **${dUm}\\ \\mu\\text{m}$** (${d.toExponential(4)}\\text{ m})
- **Optical Bench Screen Distance ($L$)**: **${L.toFixed(2)}\\text{ m}$**
- **Active Spectral Order ($m$)**: **${m > 0 ? "+" + m : m}**
- **Diffraction Angle ($\\theta = \\arcsin(m\\lambda / d)$)**: **${theta.toFixed(2)}^\\circ**
- **Screen Fringe Position ($y = L\\tan\\theta$)**: **${yCm.toFixed(2)}\\text{ cm}$** from central maximum ($m=0$)
- **Maximum Observable Order ($m_{max} = \\lfloor d/\\lambda \\rfloor$)**: **$\\pm ${maxM}**
- **Angular Dispersion ($D = \\frac{m}{d\\cos\\theta}$)**: **${disp.toFixed(4)}\\text{ rad/}\\mu\\text{m}$**

#### 3. Key Theoretical Relationships
- **Fringe Position on Screen**: $y_m = L \\tan\\theta_m$. Measuring distance $y$ on the detector screen directly yields $\\theta = \\arctan(y / L)$.
- **Angular Dispersion ($D$)**:
  $$D = \\frac{d\\theta}{d\\lambda} = \\frac{m}{d \\cos\\theta}$$
  Higher grating density $N$ (smaller pitch $d$) spreads spectral orders wider apart across the screen.
- **Maximum Observable Order ($m_{max}$)**: Because $|\\sin\\theta| \\le 1.0$, the highest theoretical order is:
  $$m_{max} = \\left\\lfloor \\frac{d}{\\lambda} \\right\\rfloor = \\left\\lfloor \\frac{${dUm} \\times 10^{-6}\\text{ m}}{${wl} \\times 10^{-9}\\text{ m}} \\right\\rfloor = \\pm ${maxM}$$
  Orders beyond $\\pm ${maxM}$ are evanescent waves and cannot physically propagate.`;
  }

  // Experiment 4: Physics Sandbox Queries
  if (
    context?.experiment === "Physics Sandbox" ||
    msg.includes("sandbox") ||
    msg.includes("playground") ||
    msg.includes("rigid body") ||
    msg.includes("zero-g") ||
    msg.includes("thrust") ||
    msg.includes("restitution")
  ) {
    return `### Vectra AI Theoretical Analysis: Physics Sandbox & 2D Kinematics

#### 1. Overview & Computational Engine
The **PhysiX Sandbox** is an interactive 2D Newtonian physics playground powered by a custom Verlet numerical integration engine. It allows unconstrained experimentation with rigid body mechanics, collisions, impulses, and celestial gravitational fields.

#### 2. Apparatus & Tools Deck:
- **Object Spawner**: Add Circles, Rectangles, or Polygons to the canvas. Set custom mass ($m$), static friction ($\\mu_s$), kinetic friction ($\\mu_k$), and coefficient of restitution ($e$, bounciness).
- **Interactive Drag & Toss**: Click and fling any rigid body with the mouse or touch interface to impart initial velocity vectors ($v_x, v_y$).
- **Dynamic Continuous Thrust**: Apply sustained directional force ($F$ in Newtons) to test Newton's second law $\\Sigma F = ma$.
- **High-Impulse Ballistic Kick**: Apply instantaneous momentum transfer:
  $$J = \\int F\\, dt = \\Delta p = m(v_f - v_i)$$
- **Gravity & Environment Slider**: Adjust $g$ continuously from $0.0\\text{ m/s}^2$ (Zero-G space station) to $25.0\\text{ m/s}^2$ (Jupiter supergravity).

#### 3. Sandbox Gamification Challenges:
1. **Newton's Dynamic Thrust (100 XP)**: Accelerate a body using continuous thrust force.
2. **High-Impulse Ballistic Kick (125 XP)**: Impart a momentum impulse to launch a mass across the arena.
3. **Zero-G Inertial Cruise (150 XP)**: Enable Zero-G and maintain steady velocity without collision for 3 seconds to demonstrate Newton's first law of inertia.`;
  }

  // 2D Kinematics Projectile Calculations
  const v0 = Number(context?.v0) || 20;
  const angleDeg = Number(context?.angleDeg) || 45;
  const h0 = Number(context?.h0) || 0;
  const g = Number(context?.g) || 9.8;
  const planet = context?.planet || "Earth";

  const rad = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);
  const tApex = v0y > 0 ? v0y / g : 0;
  const hApex = h0 + (v0y > 0 ? (v0y * v0y) / (2 * g) : 0);
  const disc = v0y * v0y + 2 * g * h0;
  const tFlight = disc >= 0 ? (v0y + Math.sqrt(disc)) / g : 0;
  const range = v0x * tFlight;

  return `### Vectra AI Theoretical Analysis: Projectile Kinematics

#### 1. Live Kinematic Context
- **Launch Parameters**: $v_0 = ${v0.toFixed(1)}\\text{ m/s}$, $\\theta = ${angleDeg}^\\circ$, $h_0 = ${h0.toFixed(1)}\\text{ m}$, $g = ${g.toFixed(1)}\\text{ m/s}^2$ (${planet})

#### 2. Vector Component Decomposition
- **Horizontal Velocity Component** ($v_{0x}$):
  $$v_{0x} = v_0 \\cos\\theta = ${v0.toFixed(1)} \\times \\cos(${angleDeg}^\\circ) = \\mathbf{${v0x.toFixed(2)}\\text{ m/s}} \\quad (\\text{Constant})$$
- **Vertical Initial Velocity** ($v_{0y}$):
  $$v_{0y} = v_0 \\sin\\theta = ${v0.toFixed(1)} \\times \\sin(${angleDeg}^\\circ) = \\mathbf{${v0y.toFixed(2)}\\text{ m/s}}$$

#### 3. Exact Trajectory Metrics
1. **Time to Apex ($t_{apex}$)**:
   $$t_{apex} = \\frac{v_{0y}}{g} = \\frac{${v0y.toFixed(2)}}{${g.toFixed(1)}} = \\mathbf{${tApex.toFixed(2)}\\text{ s}}$$
2. **Maximum Altitude ($H_{max}$)**:
   $$H_{max} = h_0 + \\frac{v_{0y}^2}{2g} = ${h0.toFixed(1)} + \\frac{(${v0y.toFixed(2)})^2}{2(${g.toFixed(1)})} = \\mathbf{${hApex.toFixed(2)}\\text{ m}}$$
3. **Total Flight Airtime ($T$)**:
   $$T = \\frac{v_{0y} + \\sqrt{v_{0y}^2 + 2gh_0}}{g} = \\mathbf{${tFlight.toFixed(2)}\\text{ s}}$$
4. **Horizontal Ground Range ($R$)**:
   $$R = v_{0x} \\times T = ${v0x.toFixed(2)} \\times ${tFlight.toFixed(2)} = \\mathbf{${range.toFixed(2)}\\text{ m}}$$

*Theoretical Note*: On ${planet}, gravitational acceleration ($g = ${g.toFixed(1)}\\text{ m/s}^2$) acts strictly downward. At apex, vertical speed is zero while horizontal velocity remains constant at $v_x = ${v0x.toFixed(2)}\\text{ m/s}$.`;
}

function generateClientFlightAnalysis(data = {}) {
  const v0 = Number(data.v0) || 20;
  const angleDeg = Number(data.angleDeg) || 45;
  const h0 = Number(data.h0) || 0;
  const g = Number(data.g) || 9.8;
  const rad = (angleDeg * Math.PI) / 180;
  const v0x = v0 * Math.cos(rad);
  const v0y = v0 * Math.sin(rad);
  const disc = v0y * v0y + 2 * g * h0;
  const tFlight = disc >= 0 ? (v0y + Math.sqrt(disc)) / g : 0;
  const range = v0x * tFlight;
  const hApex = h0 + (v0y * v0y) / (2 * g);

  return `### Flight Telemetry Debrief by **Vectra AI**

#### 1. Experimental Flight Outcome
- **Launch Settings**: $v_0 = ${v0.toFixed(1)}\\text{ m/s}$, $\\theta = ${angleDeg}^\\circ$, $h_0 = ${h0.toFixed(1)}\\text{ m}$, $g = ${g.toFixed(1)}\\text{ m/s}^2$
- **Touchdown Range ($R$)**: **${range.toFixed(2)} meters**
- **Maximum Apex ($H_{max}$)**: **${hApex.toFixed(2)} meters**
- **Flight Duration ($T$)**: **${tFlight.toFixed(2)} seconds**

#### 2. Efficiency & Kinematic Assessment
- Velocity Breakdown: $v_{0x} = ${v0x.toFixed(2)}\\text{ m/s}$, $v_{0y} = ${v0y.toFixed(2)}\\text{ m/s}$
- Optimal Launch Angle for Setup: **45.00 deg** (Maximum Range: **${((v0 * v0) / g).toFixed(2)} m**)`;
}
