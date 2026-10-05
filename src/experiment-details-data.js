/**
 * PhysiX • Scientific Laboratory Manual & Theoretical Data Repository
 * 
 * Provides rigorous academic specifications, formulas, procedures, and observation
 * guides for PhysiX virtual physics experiments.
 */

export const EXPERIMENT_DETAILS = {
  projectile: {
    id: "projectile",
    title: "2D Projectile Motion Virtual Laboratory",
    category: "Classical Mechanics & Ballistic Kinematics",
    shortDescription: "Analyze 2D parabolic trajectories, maximum apex heights, airtime duration, and horizontal landing ranges under variable gravitational acceleration.",
    difficulty: "Undergraduate / AP Physics",
    duration: "45 Minutes",
    engine: "Matter.js 2D Newtonian Kinematics",
    accentColor: "#38bdf8",
    aim: `<p class="manual-aim-text">To investigate the two-dimensional kinematic motion of a projectile fired at an initial elevation angle θ and launch speed v₀ in a gravitational field, to verify that horizontal and vertical motions are independent, and to determine how launch parameters affect the maximum apex height (H<sub>max</sub>), total flight duration (T), and horizontal ground range (R).</p>`,
    theory: `
      <div class="theory-block">
        <h3>1. Principle of Physical Independence</h3>
        <p>A projectile is any object projected into space with an initial velocity and subsequently subject solely to the force of gravity and (optionally) air resistance. According to Galilean invariance and Newtonian mechanics, two-dimensional projectile motion can be resolved into two mutually independent, orthogonal component motions:</p>
        <ul class="manual-list">
          <li><strong>Horizontal Motion (x-axis):</strong> In the absence of aerodynamic drag, no horizontal force acts on the projectile (F<sub>x</sub> = 0). Thus, horizontal acceleration a<sub>x</sub> = 0, and the horizontal velocity remains strictly uniform throughout flight:
            <div class="math-callout">v<sub>x</sub>(t) = v₀ · cos(θ) = constant</div>
          </li>
          <li><strong>Vertical Motion (y-axis):</strong> The projectile experiences a continuous, downward gravitational acceleration (a<sub>y</sub> = −g). The vertical velocity decreases uniformly until reaching zero at the peak apex, reversing direction as it descends:
            <div class="math-callout">v<sub>y</sub>(t) = v₀ · sin(θ) − g · t</div>
          </li>
        </ul>
      </div>

      <div class="theory-block">
        <h3>2. Derivation of Parabolic Trajectory Equation</h3>
        <p>Let the projectile be launched from an initial coordinate (d₀, h₀) with speed v₀ at angle θ to the horizontal plane. The parametric displacement equations as a function of elapsed time t are:</p>
        <div class="math-callout">x(t) = d₀ + (v₀ · cos θ) · t &nbsp;⟹&nbsp; t = (x − d₀) / (v₀ · cos θ)</div>
        <div class="math-callout">y(t) = h₀ + (v₀ · sin θ) · t − ½ g · t²</div>
        <p>Substituting t into the vertical displacement equation yields the Cartesian trajectory equation:</p>
        <div class="math-callout formula-highlight">y(x) = h₀ + (x − d₀) · tan(θ) − [g · (x − d₀)²] / [2 · v₀² · cos²(θ)]</div>
        <p>Because this equation is quadratic in x with a negative second-degree coefficient (−g / [2v₀² cos²θ]), the geometric path traced by the projectile is an exact downward-opening <strong>parabola</strong>.</p>
      </div>

      <div class="theory-block">
        <h3>3. Condition for Maximum Range</h3>
        <p>For a level terrain launch (h₀ = 0), setting y = 0 yields the horizontal range R = (v₀² · sin 2θ) / g. Differentiating R with respect to θ and setting dR/dθ = 0 gives:</p>
        <div class="math-callout">d/dθ [sin(2θ)] = 2 cos(2θ) = 0 &nbsp;⟹&nbsp; 2θ = 90° &nbsp;⟹&nbsp; θ = 45°</div>
        <p>When launching from an elevated cliff or platform (h₀ &gt; 0), the optimal angle for maximum range decreases below 45° according to θ<sub>opt</sub> = arcsin( 1 / √(2 + 2gh₀ / v₀²) ).</p>
      </div>
    `,
    howToPerform: `
      <div class="steps-container">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-info">
            <h4>Launch the Virtual Laboratory</h4>
            <p>Click the <strong>Start Simulator</strong> button above to open the 2D Projectile Motion interactive simulation canvas and Control Deck.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-info">
            <h4>Configure Launch Velocity (v₀) & Angle (θ)</h4>
            <p>Use the <strong>Initial Velocity (v₀)</strong> slider to set speed between 10.0 m/s and 50.0 m/s. Adjust the <strong>Launch Angle (θ)</strong> slider from 0° to 90°. Notice the real-time cannon elevation tilt and trajectory preview guide.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-info">
            <h4>Select Gravitational Environment</h4>
            <p>Choose your planetary gravitation preset (Earth g = 9.8 m/s², Moon 1.6 m/s², or Mars 3.7 m/s²) or drag the gravity slider to test custom planetary fields.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-info">
            <h4>Execute the Ballistic Launch</h4>
            <p>Press the red <strong>FIRE CANNON</strong> button. Watch the projectile launch in real-time with animated velocity vector components (v<sub>x</sub>, v<sub>y</sub>), gravitational deceleration, and parabolic breadcrumb trail.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">5</div>
          <div class="step-info">
            <h4>Analyze Telemetry Readouts</h4>
            <p>Examine the digital telemetry displays for <strong>Flight Time (t<sub>flight</sub>)</strong>, <strong>Max Apex Height (H<sub>max</sub>)</strong>, <strong>Total Range (R)</strong>, and <strong>Impact Velocity (v<sub>f</sub>)</strong>.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">6</div>
          <div class="step-info">
            <h4>Log Data into Scientific Observation Table</h4>
            <p>Click <strong>Record Observation</strong> to commit the trial data. The table automatically calculates theoretical values and the percentage error (% Error) between computational physics and mathematical formulation.</p>
          </div>
        </div>
      </div>
    `,
    procedure: `
      <ol class="manual-ordered-list">
        <li><strong>Apparatus Setup:</strong> Set up the ballistic launcher on a level datum. Ensure the launcher elevation scale reads accurately and initial height is set to h₀ = 0.0 m.</li>
        <li><strong>Varying Launch Angle at Constant Speed:</strong> Fix the initial velocity at v₀ = 30.0 m/s and gravitational acceleration at g = 9.8 m/s² (Earth).</li>
        <li>Set the launch angle θ = 15.0°. Fire the projectile and measure the horizontal landing distance R.</li>
        <li>Increment the launch angle in 15° steps: θ = 30.0°, 45.0°, 60.0°, 75.0°. Measure and record R, H<sub>max</sub>, and T for each trial.</li>
        <li>Observe and compare the ranges for complementary angle pairs ({15°, 75°} and {30°, 60°}).</li>
        <li><strong>Varying Initial Velocity at Constant Angle:</strong> Fix the launch angle at θ = 45.0°. Set initial velocity to v₀ = 10.0 m/s. Measure the horizontal range R.</li>
        <li>Repeat the launch for velocities v₀ = 20.0, 30.0, 40.0, 50.0 m/s. Plot R versus v₀² to verify linear dependency.</li>
        <li><strong>Varying Platform Elevation:</strong> Raise initial platform height to h₀ = 15.0 m. Fire at θ = 45.0° and measure the new range and touchdown impact speed v<sub>f</sub>.</li>
      </ol>
    `,
    formulas: `
      <div class="formula-card-grid">
        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Total Time of Flight (T)</span>
            <span class="f-unit">Seconds [s]</span>
          </div>
          <div class="f-eq">T = [v₀ · sin(θ) + √(v₀² · sin²θ + 2gh₀)] / g</div>
          <p class="f-desc">When launch height h₀ = 0, simplifies to T = (2 · v₀ · sin θ) / g. Represents the duration from cannon departure to ground contact.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Maximum Apex Height (H<sub>max</sub>)</span>
            <span class="f-unit">Meters [m]</span>
          </div>
          <div class="f-eq">H<sub>max</sub> = h₀ + (v₀² · sin²θ) / (2g)</div>
          <p class="f-desc">The maximum vertical altitude achieved when vertical velocity v<sub>y</sub> = 0. Independent of horizontal velocity component.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Horizontal Range (R)</span>
            <span class="f-unit">Meters [m]</span>
          </div>
          <div class="f-eq">R = d₀ + (v₀ · cos θ) · T</div>
          <p class="f-desc">For level ground (h₀ = 0), R = (v₀² · sin 2θ) / g. Yields the total horizontal displacement traversed.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Impact Touchdown Velocity (v<sub>f</sub>)</span>
            <span class="f-unit">Meters / Second [m/s]</span>
          </div>
          <div class="f-eq">v<sub>f</sub> = √(v₀² + 2gh₀)</div>
          <p class="f-desc">Derived from conservation of mechanical energy (E<sub>i</sub> = E<sub>f</sub>). Demonstrates that impact speed is independent of launch angle when air resistance is neglected.</p>
        </div>
      </div>
    `,
    observations: `
      <div class="obs-table-wrap">
        <table class="manual-obs-table">
          <thead>
            <tr>
              <th>Trial</th>
              <th>Launch Angle (θ)</th>
              <th>Initial Speed (v₀)</th>
              <th>Flight Time (T)</th>
              <th>Max Apex (H<sub>max</sub>)</th>
              <th>Range (R)</th>
              <th>Physical Behavior Observed</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>15.0°</td>
              <td>30.0 m/s</td>
              <td>1.58 s</td>
              <td>3.08 m</td>
              <td>45.92 m</td>
              <td>Low trajectory, short flight time, moderate range</td>
            </tr>
            <tr>
              <td>2</td>
              <td>30.0°</td>
              <td>30.0 m/s</td>
              <td>3.06 s</td>
              <td>11.48 m</td>
              <td>79.53 m</td>
              <td>Parabolic arc, substantial range expansion</td>
            </tr>
            <tr>
              <td>3</td>
              <td>45.0°</td>
              <td>30.0 m/s</td>
              <td>4.33 s</td>
              <td>22.96 m</td>
              <td>91.84 m</td>
              <td>Maximum horizontal range achieved on level ground</td>
            </tr>
            <tr>
              <td>4</td>
              <td>60.0°</td>
              <td>30.0 m/s</td>
              <td>5.30 s</td>
              <td>34.44 m</td>
              <td>79.53 m</td>
              <td>Equal range to 30° trial, significantly higher apex</td>
            </tr>
            <tr>
              <td>5</td>
              <td>75.0°</td>
              <td>30.0 m/s</td>
              <td>5.91 s</td>
              <td>42.84 m</td>
              <td>45.92 m</td>
              <td>Equal range to 15° trial, long airtime</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="obs-notes">
        <h4>Key Experimental Takeaways:</h4>
        <ul class="manual-list">
          <li><strong>Complementary Angle Invariance:</strong> Angles summing to 90° (such as 30° and 60°) achieve identical theoretical horizontal ranges (R) because sin(2θ) = sin(2(90° − θ)).</li>
          <li><strong>Velocity Scaling:</strong> Range scales quadratically with initial launch velocity (R ∝ v₀²). Doubling speed quadruples the maximum range.</li>
          <li><strong>Gravitational Inversion:</strong> In weaker gravity (e.g. Moon g = 1.6 m/s²), airtime and range expand by a factor of approximately 6.12 compared to Earth.</li>
        </ul>
      </div>
    `,
    result: `
      <div class="result-box">
        <h4>Experimental Conclusions:</h4>
        <ol class="manual-ordered-list">
          <li>The trajectory of a projectile launched under uniform gravitational acceleration is strictly parabolic in the absence of aerodynamic friction.</li>
          <li>For a level launch plane (h₀ = 0), the maximum horizontal range R<sub>max</sub> occurs precisely at a launch angle of θ = 45.0°.</li>
          <li>Complementary launch angles produce equal horizontal ranges, with the steeper angle producing higher apex altitude and extended airtime.</li>
          <li>The simulated kinematics results from the PhysiX computational engine agree with analytical theoretical equations with less than 0.2% numerical variance.</li>
        </ol>
      </div>
    `
  },

  optical: {
    id: "optical",
    title: "Determination of Numerical Aperture of an Optical Fibre",
    category: "Fiber Optics & Optoelectronic Waveguides",
    shortDescription: "Measure the output divergence cone, numerical aperture (NA), and acceptance angle of an optical fiber cable on a precision optical bench.",
    difficulty: "Undergraduate STEM Practical",
    duration: "45 Minutes",
    engine: "Waveguide Ray Tracing & Conical Divergence Solver",
    accentColor: "#00f0ff",
    aim: `<p class="manual-aim-text">To determine the Numerical Aperture (NA) and maximum Acceptance Angle (θ<sub>a</sub>) of a step-index multimode optical fibre cable by measuring the divergence diameter of the output laser beam spot at varying distances on a calibrated optical bench.</p>`,
    theory: `
      <div class="theory-block">
        <h3>1. Waveguide Architecture & Total Internal Reflection (TIR)</h3>
        <p>An optical fibre is a cylindrical dielectric waveguide consisting of an inner <strong>core</strong> with refractive index n₁ surrounded by an outer <strong>cladding</strong> with refractive index n₂, such that n₁ &gt; n₂. Optical transmission through the fibre is governed by the phenomenon of <strong>Total Internal Reflection (TIR)</strong> occurring at the core-cladding boundary.</p>
        <p>When light enters the core from the external medium (air, n₀ ≈ 1.0), it refracts at the entrance facet and strikes the core-cladding interface at an angle φ. If φ equals or exceeds the critical angle φ<sub>c</sub> given by:</p>
        <div class="math-callout">sin(φ<sub>c</sub>) = n₂ / n₁</div>
        <p>the ray undergoes repeated total internal reflections, remaining trapped inside the core and propagating down the length of the cable.</p>
      </div>

      <div class="theory-block">
        <h3>2. Acceptance Angle & Numerical Aperture Derivation</h3>
        <p>Applying Snell's Law at the input air-core interface for a ray entering at the maximum acceptance angle θ<sub>a</sub>:</p>
        <div class="math-callout">n₀ · sin(θ<sub>a</sub>) = n₁ · sin(r) = n₁ · sin(90° − φ<sub>c</sub>) = n₁ · cos(φ<sub>c</sub>) = n₁ · √(1 − sin²φ<sub>c</sub>)</div>
        <p>Substituting sin(φ<sub>c</sub>) = n₂ / n₁:</p>
        <div class="math-callout formula-highlight">n₀ · sin(θ<sub>a</sub>) = n₁ · √(1 − n₂² / n₁²) = √(n₁² − n₂²)</div>
        <p>For an external medium of air (n₀ = 1.0), the light-gathering capacity of the fibre is defined as the <strong>Numerical Aperture (NA)</strong>:</p>
        <div class="math-callout formula-highlight">NA = sin(θ<sub>a</sub>) = √(n₁² − n₂²)</div>
      </div>

      <div class="theory-block">
        <h3>3. Spot Divergence Measurement Principle</h3>
        <p>Because the optical path is reversible, light emerging from the fiber output tip diverges into a solid cone whose semi-angle is equal to the acceptance angle θ<sub>a</sub>. When projected onto a perpendicular target screen at distance L, the spot diameter W relates trigonometrically to L and θ<sub>a</sub>:</p>
        <div class="math-callout">tan(θ<sub>a</sub>) = (W / 2) / L = W / (2L)</div>
        <p>Expressing sin(θ<sub>a</sub>) in terms of tan(θ<sub>a</sub>):</p>
        <div class="math-callout formula-highlight">NA = sin(θ<sub>a</sub>) = [W / 2L] / √[1 + (W / 2L)²] = W / √(4L² + W²)</div>
      </div>
    `,
    howToPerform: `
      <div class="steps-container">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-info">
            <h4>Start the Optical Bench Laboratory</h4>
            <p>Click <strong>Start Simulator</strong> to load the high-precision virtual optical bench, optical fiber trainer kit, and measurement jig.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-info">
            <h4>Power On the Laser Diode Source</h4>
            <p>Turn on the <strong>DC Laboratory Power Switch</strong>, then activate the <strong>650nm Red Laser Diode</strong>. Verify that the transmitter LED indicator turns red.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-info">
            <h4>Inspect Fiber Patchcord Connections</h4>
            <p>Confirm the fiber cable SMA connector is plugged into the transmitter output port and the receiving tip is mounted securely in the micrometer translation jig.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-info">
            <h4>Adjust Screen Distance (L)</h4>
            <p>Use the <strong>Lead-Screw Translation Slider</strong> to adjust the distance between the fiber tip and the concentric circle target screen from 5.0 mm to 35.0 mm.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">5</div>
          <div class="step-info">
            <h4>Match Concentric Target Circles</h4>
            <p>Observe the projected red laser spot diameter on the target screen. Select concentric ring buttons (Ring 1 = 10 mm to Ring 6 = 35 mm) to match the expanding beam perimeter.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">6</div>
          <div class="step-info">
            <h4>Record Observations & Compute NA</h4>
            <p>When the spot aligns with the target ring, observe the "PERFECT RING MATCH" readout and click <strong>Record Observation</strong> to record the reading in the telemetry data table.</p>
          </div>
        </div>
      </div>
    `,
    procedure: `
      <ol class="manual-ordered-list">
        <li><strong>Apparatus Assembly:</strong> Mount the optical fibre cable on the optical bench. Connect one end to the 650 nm semiconductor laser output and fix the receiving end into the calibrated measurement jig facing the concentric target screen.</li>
        <li><strong>Bench Alignment:</strong> Ensure the axis of the optical fibre output is strictly normal to the plane of the white target screen.</li>
        <li><strong>Initial Positioning:</strong> Set the distance between the fibre tip and target screen to L = 10.0 mm using the precision lead-screw micrometer scale.</li>
        <li><strong>Spot Diameter Measurement:</strong> Turn on the laser source. Measure the diameter W of the red circular illumination spot where intensity drops to the concentric reference boundary.</li>
        <li><strong>Stepwise Distance Increments:</strong> Increase distance L in steps of 5.0 mm (L = 15.0, 20.0, 25.0, 30.0 mm). For each distance, measure the corresponding spot diameter W.</li>
        <li><strong>Computation:</strong> For each measurement pair (L, W), calculate the Numerical Aperture using NA = W / √(4L² + W²) and the acceptance angle using θ<sub>a</sub> = arcsin(NA).</li>
        <li><strong>Graphical Method:</strong> Plot a graph of Spot Diameter (W) on the y-axis against Distance (L) on the x-axis. Find the linear slope m = ΔW / ΔL, and compute NA = m / √(4 + m²).</li>
      </ol>
    `,
    formulas: `
      <div class="formula-card-grid">
        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Experimental NA Formula</span>
            <span class="f-unit">Dimensionless</span>
          </div>
          <div class="f-eq">NA = W / √(4L² + W²)</div>
          <p class="f-desc">Where W is the light spot diameter (mm) and L is the distance from the fibre tip to the target screen (mm).</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Acceptance Angle (θ<sub>a</sub>)</span>
            <span class="f-unit">Degrees [°]</span>
          </div>
          <div class="f-eq">θ<sub>a</sub> = arcsin(NA) = arctan(W / 2L)</div>
          <p class="f-desc">The half-angle of the cone within which light rays are accepted and guided through total internal reflection.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Theoretical Refractive NA</span>
            <span class="f-unit">Dimensionless</span>
          </div>
          <div class="f-eq">NA = √(n₁² − n₂²) = n₁ · √(2Δ)</div>
          <p class="f-desc">Where n₁ is core index, n₂ is cladding index, and Δ = (n₁ − n₂) / n₁ is the fractional index difference.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Solid Acceptance Angle (Ω)</span>
            <span class="f-unit">Steradians [sr]</span>
          </div>
          <div class="f-eq">Ω = π · sin²(θ<sub>a</sub>) = π · (NA)²</div>
          <p class="f-desc">Quantifies the total solid angle of the light-gathering acceptance cone in three-dimensional space.</p>
        </div>
      </div>
    `,
    observations: `
      <div class="obs-table-wrap">
        <table class="manual-obs-table">
          <thead>
            <tr>
              <th>Trial</th>
              <th>Distance L (mm)</th>
              <th>Target Ring</th>
              <th>Spot Diameter W (mm)</th>
              <th>Calculated NA</th>
              <th>Acceptance Angle θ<sub>a</sub></th>
              <th>Fidelity Match</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>10.5 mm</td>
              <td>Ring 1</td>
              <td>10.0 mm</td>
              <td>0.430</td>
              <td>25.5°</td>
              <td>Concentric spot alignment</td>
            </tr>
            <tr>
              <td>2</td>
              <td>15.2 mm</td>
              <td>Ring 2</td>
              <td>15.0 mm</td>
              <td>0.443</td>
              <td>26.3°</td>
              <td>Spot perimeter matches ring 2</td>
            </tr>
            <tr>
              <td>3</td>
              <td>20.4 mm</td>
              <td>Ring 3</td>
              <td>20.0 mm</td>
              <td>0.440</td>
              <td>26.1°</td>
              <td>Linear divergence verification</td>
            </tr>
            <tr>
              <td>4</td>
              <td>25.1 mm</td>
              <td>Ring 4</td>
              <td>25.0 mm</td>
              <td>0.446</td>
              <td>26.5°</td>
              <td>Consistent numerical aperture</td>
            </tr>
            <tr>
              <td>5</td>
              <td>30.0 mm</td>
              <td>Ring 5</td>
              <td>30.0 mm</td>
              <td>0.447</td>
              <td>26.6°</td>
              <td>Near-field divergence equilibrium</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="obs-notes">
        <h4>Key Experimental Takeaways:</h4>
        <ul class="manual-list">
          <li><strong>Linear Spot Expansion:</strong> As screen distance L increases, the spot diameter W increases proportionally with constant cone slope W / (2L) = tan(θ<sub>a</sub>).</li>
          <li><strong>Invariant Numerical Aperture:</strong> The calculated value of NA remains invariant across distance changes, demonstrating that Numerical Aperture is an intrinsic physical constant of the optical waveguide.</li>
        </ul>
      </div>
    `,
    result: `
      <div class="result-box">
        <h4>Experimental Conclusions:</h4>
        <ol class="manual-ordered-list">
          <li>The Numerical Aperture (NA) of the multimode step-index optical fibre was experimentally determined to be NA = 0.44 ± 0.02.</li>
          <li>The maximum Acceptance Angle of the fibre was determined to be θ<sub>a</sub> = 26.2° ± 0.5°.</li>
          <li>The linear relationship between screen distance and beam spot diameter confirms the conical divergence model of light propagation emerging from dielectric optical fibres.</li>
        </ol>
      </div>
    `
  },

  "colour-sensor": {
    id: "colour-sensor",
    title: "Study of Colour Sensor & Spectral Photodiode Response",
    category: "Sensors, Optoelectronic Devices & Instrumentation",
    shortDescription: "Characterize spectral photodiode channel selection (S2/S3), frequency scaling (S0/S1), and RGB color identification with the TCS3200 sensor.",
    difficulty: "Undergraduate Instrumentation Practical",
    duration: "45 Minutes",
    engine: "TCS3200 Optoelectronic Converter & Spectral Decomposition Solver",
    accentColor: "#10b981",
    aim: `<p class="manual-aim-text">To investigate the operational principles, spectral sensitivity, programmable frequency scaling, and RGB color identification accuracy of the TCS3200 programmable light-to-frequency optoelectronic sensor using sample swatches at varying calibrated distances.</p>`,
    theory: `
      <div class="theory-block">
        <h3>1. TCS3200 Sensor Architecture</h3>
        <p>The TCS3200 is a monolithic CMOS optoelectronic converter that integrates a configurable array of silicon photodiodes and an internal current-to-frequency converter. The sensor active area comprises an 8 × 8 matrix of 64 photodiodes:</p>
        <ul class="manual-list">
          <li><strong>16 Red Filter Photodiodes:</strong> Peak spectral transmission at λ ≈ 650 nm.</li>
          <li><strong>16 Green Filter Photodiodes:</strong> Peak spectral transmission at λ ≈ 540 nm.</li>
          <li><strong>16 Blue Filter Photodiodes:</strong> Peak spectral transmission at λ ≈ 470 nm.</li>
          <li><strong>16 Clear Photodiodes:</strong> Unfiltered broadband response across 300 nm − 1050 nm.</li>
        </ul>
        <p>Interleaving the filtered photodiodes across the matrix eliminates the effect of non-uniform irradiance distribution across the sensor package.</p>
      </div>

      <div class="theory-block">
        <h3>2. Light-to-Frequency Conversion Principle</h3>
        <p>When photons with energy hν strike the photodiode depletion region, electron-hole pairs are generated via the internal photoelectric effect. The resulting photocurrent I<sub>ph</sub> is directly proportional to incident optical irradiance P<sub>opt</sub> and wavelength λ:</p>
        <div class="math-callout">I<sub>ph</sub> = R(λ) · P<sub>opt</sub> = (η · q · λ / [h · c]) · P<sub>opt</sub></div>
        <p>The internal current-to-frequency oscillator converts this photocurrent into a 50% duty-cycle square wave whose frequency f<sub>out</sub> is linearly proportional to the detected optical irradiance:</p>
        <div class="math-callout formula-highlight">f<sub>out</sub> = k · I<sub>ph</sub> ∝ P<sub>opt</sub></div>
      </div>

      <div class="theory-block">
        <h3>3. Programmable Control Logic (S0-S3)</h3>
        <p>The device is controlled through four digital logic pins:</p>
        <ul class="manual-list">
          <li><strong>Frequency Scaling Pins (S0, S1):</strong> Scale output frequency to match microcontroller counter bandwidth (Power Down, 2%, 20%, 100%).</li>
          <li><strong>Photodiode Filter Selection Pins (S2, S3):</strong> Dynamically select which channel of the photodiode matrix connects to the converter:
            <br><code>(0,0) = Red</code> | <code>(0,1) = Blue</code> | <code>(1,0) = Clear</code> | <code>(1,1) = Green</code>.
          </li>
        </ul>
      </div>

      <div class="theory-block">
        <h3>4. Color Coordinate Normalization & Inverse-Square Law</h3>
        <p>By measuring the frequency across the three primary channels (f<sub>R</sub>, f<sub>G</sub>, f<sub>B</sub>), normalized chromaticity coordinates are computed:</p>
        <div class="math-callout formula-highlight">r = f<sub>R</sub> / (f<sub>R</sub> + f<sub>G</sub> + f<sub>B</sub>), &nbsp; g = f<sub>G</sub> / (f<sub>R</sub> + f<sub>G</sub> + f<sub>B</sub>), &nbsp; b = f<sub>B</sub> / (f<sub>R</sub> + f<sub>G</sub> + f<sub>B</sub>)</div>
        <p>Furthermore, reflected radiant intensity E decreases quadratically with distance d according to the Inverse-Square Law:</p>
        <div class="math-callout">E(d) ∝ 1 / d² &nbsp;⟹&nbsp; f<sub>out</sub>(d) ∝ 1 / d²</div>
      </div>
    `,
    howToPerform: `
      <div class="steps-container">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-info">
            <h4>Start the Color Sensor Laboratory</h4>
            <p>Click <strong>Start Simulator</strong> to load the virtual TCS3200 sensor platform, digital power supply, and sample carousel.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-info">
            <h4>Power On the Sensor & LED Array</h4>
            <p>Toggle the <strong>DC Laboratory Power Switch</strong> to ON (5.0V rail). Turn on the <strong>White LED Illumination Ring</strong> to uniformly illuminate test samples.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-info">
            <h4>Set Frequency Scaling (S0/S1)</h4>
            <p>Set the frequency scaling selector to 20% (standard for laboratory microcontrollers) or 100% for high-resolution analysis.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-info">
            <h4>Select Sample Color Swatch</h4>
            <p>Choose a color swatch from the sample carousel (Red, Green, Blue, Yellow, Cyan, Magenta, White, or Black) and place it on the target holder.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">5</div>
          <div class="step-info">
            <h4>Cycle Through Filter Channels (S2/S3)</h4>
            <p>Click through the <strong>Red</strong>, <strong>Green</strong>, <strong>Blue</strong>, and <strong>Clear</strong> filter channel buttons. Observe how the output square wave frequency responds to the swatch's spectral reflectance.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">6</div>
          <div class="step-info">
            <h4>Adjust Distance Slider & Record Telemetry</h4>
            <p>Use the <strong>Distance (d)</strong> slider between 5 mm and 50 mm to observe the inverse-square frequency decay. Click <strong>Record Observation</strong> to log the 4-channel spectral profile and reconstructed Hex color.</p>
          </div>
        </div>
      </div>
    `,
    procedure: `
      <ol class="manual-ordered-list">
        <li><strong>Sensor Power & White Balance Calibration:</strong> Connect the sensor module to a stabilized 5.0V DC power supply. Position a pure white calibration card at a distance of d = 20.0 mm.</li>
        <li>Select the Clear channel (S2=1, S3=0) and adjust frequency scaling to 20% to avoid counter overflow.</li>
        <li>Record the maximum calibration baseline frequencies for Red, Green, Blue, and Clear channels.</li>
        <li><strong>Sample Testing:</strong> Replace the white calibration card with a primary Red sample swatch.</li>
        <li>Measure and record the output frequency for Red (f<sub>R</sub>), Green (f<sub>G</sub>), Blue (f<sub>B</sub>), and Clear (f<sub>clear</sub>) channels.</li>
        <li>Repeat the multi-channel frequency measurements for Green, Blue, Yellow, and Cyan sample swatches.</li>
        <li><strong>Distance Response Test:</strong> Fix the Red swatch and keep the Red channel active (S2=0, S3=0).</li>
        <li>Vary distance d from 10.0 mm to 50.0 mm in 10.0 mm steps. Record output frequency f<sub>out</sub> at each distance and plot f<sub>out</sub> versus 1/d².</li>
      </ol>
    `,
    formulas: `
      <div class="formula-card-grid">
        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Optoelectronic Current (I<sub>ph</sub>)</span>
            <span class="f-unit">Microamperes [μA]</span>
          </div>
          <div class="f-eq">I<sub>ph</sub> = (η · q · λ / [h · c]) · P<sub>opt</sub></div>
          <p class="f-desc">Where η is quantum efficiency, q is electronic charge, h is Planck's constant, and P<sub>opt</sub> is incident optical power.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Frequency Output (f<sub>out</sub>)</span>
            <span class="f-unit">Kilohertz [kHz]</span>
          </div>
          <div class="f-eq">f<sub>out</sub> = k<sub>s</sub> · (I<sub>ph</sub> / C<sub>int</sub>)</div>
          <p class="f-desc">Direct linear current-to-frequency relationship modulated by frequency scaling factor k<sub>s</sub> (2%, 20%, 100%).</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Normalized Chromaticity Coordinate (r, g, b)</span>
            <span class="f-unit">Dimensionless [0 - 1]</span>
          </div>
          <div class="f-eq">r = f<sub>R</sub> / (f<sub>R</sub> + f<sub>G</sub> + f<sub>B</sub>), &nbsp; g = f<sub>G</sub> / (f<sub>R</sub> + f<sub>G</sub> + f<sub>B</sub>)</div>
          <p class="f-desc">Normalizes color component ratios, eliminating dependence on ambient illumination variations.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Inverse-Square Law (E)</span>
            <span class="f-unit">Watts / Meter² [W/m²]</span>
          </div>
          <div class="f-eq">E(d) = I₀ / d² &nbsp;⟹&nbsp; f<sub>out</sub>(d) ∝ 1 / d²</div>
          <p class="f-desc">Quantifies the decay of detected optical irradiance as distance from the reflective target increases.</p>
        </div>
      </div>
    `,
    observations: `
      <div class="obs-table-wrap">
        <table class="manual-obs-table">
          <thead>
            <tr>
              <th>Target Swatch</th>
              <th>Red Ch (f<sub>R</sub>)</th>
              <th>Green Ch (f<sub>G</sub>)</th>
              <th>Blue Ch (f<sub>B</sub>)</th>
              <th>Clear Ch (f<sub>clr</sub>)</th>
              <th>Dominant Channel</th>
              <th>Match Fidelity</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Red (#E11D48)</td>
              <td>14.2 kHz</td>
              <td>3.8 kHz</td>
              <td>4.1 kHz</td>
              <td>22.1 kHz</td>
              <td>Red Channel Dominant</td>
              <td>98.2%</td>
            </tr>
            <tr>
              <td>Green (#10B981)</td>
              <td>3.5 kHz</td>
              <td>15.6 kHz</td>
              <td>5.2 kHz</td>
              <td>24.3 kHz</td>
              <td>Green Channel Dominant</td>
              <td>96.8%</td>
            </tr>
            <tr>
              <td>Blue (#2563EB)</td>
              <td>3.1 kHz</td>
              <td>4.9 kHz</td>
              <td>16.8 kHz</td>
              <td>24.8 kHz</td>
              <td>Blue Channel Dominant</td>
              <td>97.4%</td>
            </tr>
            <tr>
              <td>White (#F8FAFC)</td>
              <td>16.5 kHz</td>
              <td>17.1 kHz</td>
              <td>18.0 kHz</td>
              <td>51.6 kHz</td>
              <td>Balanced High Output</td>
              <td>99.1%</td>
            </tr>
            <tr>
              <td>Black (#0F172A)</td>
              <td>1.2 kHz</td>
              <td>1.1 kHz</td>
              <td>1.4 kHz</td>
              <td>3.7 kHz</td>
              <td>Minimal Dark Frequency</td>
              <td>95.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="obs-notes">
        <h4>Key Experimental Takeaways:</h4>
        <ul class="manual-list">
          <li><strong>Spectral Selectivity:</strong> Under pure colored swatches, the matching filtered photodiode channel exhibits a 3x to 4x higher frequency output than non-matching channels.</li>
          <li><strong>Distance Decay (1/d²):</strong> As sample distance increases from 10 mm to 30 mm, frequency decreases by approximately 88.9%, conforming to the inverse-square propagation law.</li>
        </ul>
      </div>
    `,
    result: `
      <div class="result-box">
        <h4>Experimental Conclusions:</h4>
        <ol class="manual-ordered-list">
          <li>The TCS3200 sensor successfully transduces spectral optical irradiance into proportional square-wave frequencies with linear optoelectronic response.</li>
          <li>Digital filter selection via S2 and S3 logic pins cleanly isolates Red, Green, Blue, and broadband Clear irradiance.</li>
          <li>Normalized RGB chromaticity ratios identify sample surface colors with &gt;96% recognition fidelity across variable distance offsets.</li>
        </ol>
      </div>
    `
  },

  sandbox: {
    id: "sandbox",
    title: "Physics Sandbox & 2D Kinematics Playground",
    category: "Newtonian Mechanics & Computational Physics",
    shortDescription: "Interactive 2D physics sandbox: spawn rigid bodies, test momentum conservation, elastic/inelastic collisions, and modulate celestial gravity.",
    difficulty: "All Levels STEM Practical",
    duration: "45 Minutes",
    engine: "Matter.js Velocity Verlet Rigid-Body Engine",
    accentColor: "#a855f7",
    aim: `<p class="manual-aim-text">To investigate Newtonian rigid-body mechanics, conservation of linear momentum, coefficient of restitution (e), and the exchange between kinetic and gravitational potential energy in an interactive computational 2D physics environment.</p>`,
    theory: `
      <div class="theory-block">
        <h3>1. Newton's Laws & Rigid-Body Dynamics</h3>
        <p>In computational physics, a rigid body is an idealized solid object in which deformation is neglected. Motion is governed by Newton's Second Law for translational and rotational dynamics:</p>
        <div class="math-callout">F = dp/dt = m · a, &nbsp; τ = I · α</div>
        <p>where F is the resultant external force, m is inertial mass, a is linear acceleration, τ is torque, I is mass moment of inertia, and α is angular acceleration.</p>
      </div>

      <div class="theory-block">
        <h3>2. Conservation of Linear Momentum</h3>
        <p>For a closed system of interacting rigid bodies subject to zero net external horizontal force, total linear momentum is strictly conserved across all collision regimes:</p>
        <div class="math-callout formula-highlight">∑ p<sub>before</sub> = ∑ p<sub>after</sub> &nbsp;⟹&nbsp; m₁ · u₁ + m₂ · u₂ = m₁ · v₁ + m₂ · v₂</div>
      </div>

      <div class="theory-block">
        <h3>3. Coefficient of Restitution (e) & Collision Kinematics</h3>
        <p>The elasticity of a collision along the line of impact is characterized by the <strong>Coefficient of Restitution (e)</strong>, defined as the ratio of relative separation speed to relative approach speed:</p>
        <div class="math-callout formula-highlight">e = −(v₂<sub>n</sub> − v₁<sub>n</sub>) / (u₂<sub>n</sub> − u₁<sub>n</sub>)</div>
        <ul class="manual-list">
          <li><strong>e = 1.0 (Perfectly Elastic):</strong> Total mechanical kinetic energy is conserved (∑ KE<sub>i</sub> = ∑ KE<sub>f</sub>).</li>
          <li><strong>0 &lt; e &lt; 1.0 (Inelastic):</strong> Kinetic energy is partially dissipated into thermal and vibrational modes.</li>
          <li><strong>e = 0.0 (Completely Inelastic):</strong> Bodies coalesce and move with a single common velocity.</li>
        </ul>
      </div>

      <div class="theory-block">
        <h3>4. Mechanical Energy Conservation</h3>
        <p>In a conservative gravitational field with zero non-conservative dissipative forces:</p>
        <div class="math-callout formula-highlight">E<sub>total</sub> = KE + PE = ½ m v² + m g y = constant</div>
      </div>
    `,
    howToPerform: `
      <div class="steps-container">
        <div class="step-card">
          <div class="step-badge">1</div>
          <div class="step-info">
            <h4>Start the Physics Sandbox</h4>
            <p>Click <strong>Start Simulator</strong> to load the interactive 2D canvas, rigid-body spawner, and telemetry analyzer.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">2</div>
          <div class="step-info">
            <h4>Spawn Dynamic Objects</h4>
            <p>Click <strong>Spawn Ball</strong> or <strong>Spawn Crate</strong> to add rigid bodies into the simulation space. Adjust their mass, size, and friction parameters.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">3</div>
          <div class="step-info">
            <h4>Interact via Mouse Fling & Impulse</h4>
            <p>Click and drag any object on the canvas with your mouse to apply live directional velocity impulse vectors and fling bodies against walls or obstacles.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">4</div>
          <div class="step-info">
            <h4>Modulate Planetary Gravitation</h4>
            <p>Switch between celestial gravity presets: <strong>Earth (9.8 m/s²)</strong>, <strong>Moon (1.6 m/s²)</strong>, <strong>Mars (3.7 m/s²)</strong>, <strong>Zero-G (0 m/s²)</strong>, or <strong>Inverted Gravity</strong>.</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">5</div>
          <div class="step-info">
            <h4>Analyze Live Kinematics Telemetry</h4>
            <p>Observe the telemetry counters for live body count, instantaneous velocity components (v<sub>x</sub>, v<sub>y</sub>), kinetic energy (KE), and gravitational potential energy (PE).</p>
          </div>
        </div>
        <div class="step-card">
          <div class="step-badge">6</div>
          <div class="step-info">
            <h4>Pause & Step Simulation Frames</h4>
            <p>Use the <strong>Pause</strong> and <strong>Step Frame</strong> buttons to freeze high-velocity collision events and inspect exact collision impulses.</p>
          </div>
        </div>
      </div>
    `,
    procedure: `
      <ol class="manual-ordered-list">
        <li><strong>Free-Fall Energy Conservation:</strong> Clear the canvas. Set gravity to Earth (g = 9.8 m/s²) and restitution to e = 0.8.</li>
        <li>Spawn a ball at height y₁ = 300 px. Record the initial potential energy PE<sub>i</sub> and kinetic energy KE<sub>i</sub> = 0.</li>
        <li>Release the ball and observe energy transformation from potential to kinetic as altitude decreases.</li>
        <li><strong>Head-On Elastic Collision Test:</strong> Set restitution to e = 1.0 and contact friction to μ = 0.</li>
        <li>Spawn two balls of equal mass (m₁ = m₂ = 1.0 kg). Keep Ball 2 stationary and fling Ball 1 directly into Ball 2.</li>
        <li>Record pre-collision and post-collision velocities to verify complete velocity transfer.</li>
        <li><strong>Zero-Gravity Inertia Test:</strong> Select Zero-G (g = 0 m/s²). Fling an object horizontally.</li>
        <li>Confirm that the object moves in a straight path with constant velocity, validating Newton's First Law.</li>
      </ol>
    `,
    formulas: `
      <div class="formula-card-grid">
        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Linear Momentum (p)</span>
            <span class="f-unit">Kilogram Meter / Second [kg·m/s]</span>
          </div>
          <div class="f-eq">p = m · v</div>
          <p class="f-desc">Vector quantity representing the quantity of motion in an object.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Restitution (e)</span>
            <span class="f-unit">Dimensionless [0 - 1]</span>
          </div>
          <div class="f-eq">e = −(v₂ − v₁) / (u₂ − u₁) = √(h<sub>rebound</sub> / h<sub>drop</sub>)</div>
          <p class="f-desc">Quantifies energy elasticity in normal impacts between colliding bodies.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Kinetic Energy (KE)</span>
            <span class="f-unit">Joules [J]</span>
          </div>
          <div class="f-eq">KE = ½ m v² + ½ I ω²</div>
          <p class="f-desc">Includes translational kinetic energy and rotational kinetic energy.</p>
        </div>

        <div class="manual-formula-card">
          <div class="f-header">
            <span class="f-title">Collision Impulse (J)</span>
            <span class="f-unit">Newton Seconds [N·s]</span>
          </div>
          <div class="f-eq">J = ∫ F dt = Δp = m(v − u)</div>
          <p class="f-desc">The instantaneous force-time integral acting during contact impact.</p>
        </div>
      </div>
    `,
    observations: `
      <div class="obs-table-wrap">
        <table class="manual-obs-table">
          <thead>
            <tr>
              <th>Simulation Case</th>
              <th>Gravity Setting</th>
              <th>Restitution (e)</th>
              <th>Kinematic Behavior Observed</th>
              <th>Conservation Verified</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Free Bounce (Earth)</td>
              <td>9.8 m/s²</td>
              <td>1.0</td>
              <td>Continuous rebound to exact release height</td>
              <td>Energy fully conserved</td>
            </tr>
            <tr>
              <td>Damped Bounce</td>
              <td>9.8 m/s²</td>
              <td>0.5</td>
              <td>Successive apex heights decay by (0.5)² = 0.25</td>
              <td>Momentum conserved at impact</td>
            </tr>
            <tr>
              <td>Zero-G Drift</td>
              <td>0.0 m/s²</td>
              <td>1.0</td>
              <td>Constant linear translation in straight line</td>
              <td>Newton's 1st Law verified</td>
            </tr>
            <tr>
              <td>Equal Mass Collision</td>
              <td>0.0 m/s²</td>
              <td>1.0</td>
              <td>Moving ball stops dead; target departs at equal speed</td>
              <td>100% velocity transfer</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="obs-notes">
        <h4>Key Experimental Takeaways:</h4>
        <ul class="manual-list">
          <li><strong>Energy-Momentum Duality:</strong> While linear momentum is conserved in all collision scenarios, kinetic energy is only conserved when e = 1.0.</li>
          <li><strong>Gravitational Invariance of Inertia:</strong> Inertial mass resists acceleration identically regardless of whether gravity is set to Earth, Moon, or Zero-G.</li>
        </ul>
      </div>
    `,
    result: `
      <div class="result-box">
        <h4>Experimental Conclusions:</h4>
        <ol class="manual-ordered-list">
          <li>Total linear momentum is conserved during all 2D rigid-body collision interactions in the physics sandbox.</li>
          <li>The coefficient of restitution directly dictates kinetic energy loss and rebound apex decay.</li>
          <li>In zero-gravity environments, objects preserve uniform rectilinear motion, validating Newton's First Law of Motion.</li>
        </ol>
      </div>
    `
  }
};
