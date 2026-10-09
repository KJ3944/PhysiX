const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Add Exp 6 Switch Button
const switchBtnTarget = `<button type="button" id="btn-switch-exp-diffraction" class="exp-switch-btn" data-exp="diffraction">`;
const switchBtnAddition = `      <button type="button" id="btn-switch-exp-diode" class="exp-switch-btn" data-exp="diode">
        <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
          <polygon points="6 4 18 12 6 20 6 4" fill="rgba(245, 158, 11, 0.2)"></polygon>
          <line x1="18" y1="4" x2="18" y2="20"></line>
          <line x1="2" y1="12" x2="6" y2="12"></line>
          <line x1="18" y1="12" x2="22" y2="12"></line>
        </svg>
        <span>Exp 6: Diode V-I Characteristics</span>
      </button>
`;

if (!html.includes('id="btn-switch-exp-diode"')) {
  const idx = html.indexOf(switchBtnTarget);
  if (idx !== -1) {
    const endBtnIdx = html.indexOf('</button>', idx) + 9;
    html = html.substring(0, endBtnIdx) + '\n\n' + switchBtnAddition + html.substring(endBtnIdx);
    console.log('Added Exp 6 switch button.');
  } else {
    console.error('Could not find switchBtnTarget');
  }
}

// 2. Add #exp-diode-section right after #exp-diffraction-section
const sectionMarker = '</div><!-- /#exp-diffraction-section -->';
const diodeSectionHtml = `
  <!-- =====================================
       EXPERIMENT 6: DIODE V-I CHARACTERISTICS
  ===================================== -->
  <div id="exp-diode-section" class="exp-section-wrapper hidden">
    <!-- LABORATORY PROCEDURE GUIDE RIBBON -->
    <section class="diode-setup-container">
      <div class="diode-procedure-ribbon">
        <div class="diode-proc-step active" id="diode-step-indicator-1">
          <span class="step-num">1</span>
          <div class="step-details">
            <strong>Bias Mode &amp; Meter Ranges</strong>
            <span>1.5V / 10mA (Fwd) or 30V / 100μA (Rev)</span>
          </div>
        </div>
        <div class="proc-arrow">›</div>
        <div class="diode-proc-step" id="diode-step-indicator-2">
          <span class="step-num">2</span>
          <div class="step-details">
            <strong>Terminal Patching</strong>
            <span>Series Ammeter, Parallel Voltmeter</span>
          </div>
        </div>
        <div class="proc-arrow">›</div>
        <div class="diode-proc-step" id="diode-step-indicator-3">
          <span class="step-num">3</span>
          <div class="step-details">
            <strong>Variable DC Voltage</strong>
            <span>Tunable Potentiometers VF &amp; VR</span>
          </div>
        </div>
        <div class="proc-arrow">›</div>
        <div class="diode-proc-step" id="diode-step-indicator-4">
          <span class="step-num">4</span>
          <div class="step-details">
            <strong>Dynamic V-I Curves</strong>
            <span>1st Quadrant (Fwd) &amp; 3rd Quadrant (Rev)</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN DUAL-WORKSTATION WORKSPACE -->
    <main class="diode-dashboard">

      <!-- LEFT: PHYSICAL APPARATUS CONTROLLER CARD (IMAGE 1 RECREATION) -->
      <section class="diode-chassis-card">
        <!-- 4 Corner Screws -->
        <div class="chassis-screw screw-tl"></div>
        <div class="chassis-screw screw-tr"></div>
        <div class="chassis-screw screw-bl"></div>
        <div class="chassis-screw screw-br"></div>

        <!-- Top Header & Accent Bars -->
        <div class="diode-chassis-header">
          <div class="diode-header-rule"></div>
          <h2 class="diode-chassis-title">P.N JUNCTION DIODE CHARACTERISTICS APPARATUS</h2>
          <div class="diode-header-rule"></div>
          <div class="diode-medallion" title="Vayance Laboratory Instrument">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            <span>VAYANCE</span>
          </div>
        </div>

        <!-- METERS & MASTER ON/OFF ROW -->
        <div class="diode-meters-row">

          <!-- 1. LEFT: VOLTMETER -->
          <div class="analog-meter-housing" id="diode-voltmeter-container">
            <div class="meter-bezel">
              <div class="meter-glass-glare"></div>
              <div class="meter-dial-face">
                <canvas id="diode-vm-canvas" class="meter-canvas" width="336" height="336"></canvas>
              </div>
            </div>
            <!-- Sub-Controls: Terminals & 1.5V / 30V Range Selector -->
            <div class="meter-sub-controls" id="diode-vm-range-box">
              <div class="banana-terminal terminal-red" data-terminal="vm_pos" title="Voltmeter (+) Red Socket">
                <div class="terminal-hole"></div>
              </div>
              <div class="range-switch-box">
                <span class="range-switch-label active" id="lbl-vm-range-15">1.5V</span>
                <div class="physical-toggle toggle-up" id="diode-vm-range-toggle" title="Toggle Voltmeter Range: 1.5V / 30V">
                  <div class="toggle-bat"></div>
                </div>
                <span class="range-switch-label" id="lbl-vm-range-30">30V</span>
              </div>
              <div class="banana-terminal terminal-black" data-terminal="vm_neg" title="Voltmeter (−) Black Socket">
                <div class="terminal-hole"></div>
              </div>
            </div>
          </div>

          <!-- 2. CENTER: ON/OFF SWITCH & PILOT LAMP -->
          <div class="diode-center-panel" id="diode-center-panel">
            <div class="power-switch-labels">
              <span class="power-lbl active" id="lbl-power-off">OFF</span>
              <div class="physical-toggle toggle-up" id="diode-power-toggle" title="Master Power Toggle (OFF / ON)">
                <div class="toggle-bat"></div>
              </div>
              <span class="power-lbl" id="lbl-power-on">ON</span>
            </div>
            <div class="power-pilot-lamp" id="diode-power-lamp" title="Power Status Indicator Lamp"></div>
          </div>

          <!-- 3. RIGHT: AMMETER -->
          <div class="analog-meter-housing" id="diode-ammeter-container">
            <div class="meter-bezel">
              <div class="meter-glass-glare"></div>
              <div class="meter-dial-face">
                <canvas id="diode-am-canvas" class="meter-canvas" width="336" height="336"></canvas>
              </div>
            </div>
            <!-- Sub-Controls: Terminals & 10mA / 100μA Range Selector -->
            <div class="meter-sub-controls" id="diode-am-range-box">
              <div class="banana-terminal terminal-red" data-terminal="am_pos" title="Ammeter (+) Red Socket">
                <div class="terminal-hole"></div>
              </div>
              <div class="range-switch-box">
                <span class="range-switch-label active" id="lbl-am-range-10">10mA</span>
                <div class="physical-toggle toggle-up" id="diode-am-range-toggle" title="Toggle Ammeter Range: 10mA / 100μA">
                  <div class="toggle-bat"></div>
                </div>
                <span class="range-switch-label" id="lbl-am-range-100">100μA</span>
              </div>
              <div class="banana-terminal terminal-black" data-terminal="am_neg" title="Ammeter (−) Black Socket">
                <div class="terminal-hole"></div>
              </div>
            </div>
          </div>

        </div>

        <!-- LOWER CONTROLLER: THREE HORIZONTAL ZONES -->
        <div class="diode-lower-grid">

          <!-- ZONE 1: FORWARD BIAS DC SUPPLY -->
          <div class="lower-box" id="diode-sec-fwd-supply">
            <div class="supply-zone-layout">
              <!-- Rotary Knob VF (0-1.5 V) -->
              <div class="rotary-knob-container">
                <svg class="knob-arc-indicator" viewBox="0 0 100 100">
                  <path d="M 20 80 A 42 42 0 1 1 80 80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4" stroke-linecap="round"/>
                  <path d="M 20 80 A 42 42 0 1 1 80 80" fill="none" stroke="url(#arcGradFwd)" stroke-width="4" stroke-dasharray="190" stroke-dashoffset="50" stroke-linecap="round"/>
                  <defs>
                    <linearGradient id="arcGradFwd" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#38bdf8" />
                      <stop offset="100%" stop-color="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="rotary-knob" id="diode-fwd-knob" title="Forward Bias Voltage Adjustment (VF)">
                  <div class="knob-pointer"></div>
                </div>
                <span class="knob-label-val" id="diode-fwd-knob-val">0.00 V</span>
              </div>

              <!-- DC Output Ports -->
              <div class="dc-output-ports">
                <span class="dc-out-title">+ D.C OUTPUT</span>
                <div class="ports-pair-row">
                  <div class="banana-terminal terminal-red" data-terminal="fwd_out_pos1" title="Forward DC (+) Socket 1"><div class="terminal-hole"></div></div>
                  <div class="banana-terminal terminal-red" data-terminal="fwd_out_pos2" title="Forward DC (+) Socket 2"><div class="terminal-hole"></div></div>
                </div>
                <span class="ports-vert-arrow">↕</span>
                <div class="ports-pair-row">
                  <div class="banana-terminal terminal-black" data-terminal="fwd_out_neg1" title="Forward DC (−) Socket 1"><div class="terminal-hole"></div></div>
                  <div class="banana-terminal terminal-black" data-terminal="fwd_out_neg2" title="Forward DC (−) Socket 2"><div class="terminal-hole"></div></div>
                </div>
              </div>
            </div>
            <div class="lower-box-caption">FORWARD BIAS ( VF ) 0-1.5 VOLTS</div>
          </div>

          <!-- ZONE 2: P-N JUNCTION TERMINALS -->
          <div class="lower-box pn-junction-box">
            <!-- Row 1: Forward Bias Diode -->
            <div>
              <div class="diode-row-mount" id="diode-term-fwd-diode">
                <div class="banana-terminal terminal-red" data-terminal="fwd_diode_p" title="Forward Diode Anode (P)"><div class="terminal-hole"></div></div>
                <span class="terminal-lbl red-txt">P</span>
                <div class="diode-schematic-symbol">
                  <svg width="40" height="18" viewBox="0 0 40 18">
                    <line x1="0" y1="9" x2="14" y2="9" stroke="#ef4444" stroke-width="2"/>
                    <polygon points="14,2 26,9 14,16" fill="#ef4444" stroke="#ffffff" stroke-width="1"/>
                    <line x1="26" y1="2" x2="26" y2="16" stroke="#ffffff" stroke-width="2.5"/>
                    <line x1="26" y1="9" x2="40" y2="9" stroke="#64748b" stroke-width="2"/>
                  </svg>
                </div>
                <span class="terminal-lbl black-txt">N</span>
                <div class="banana-terminal terminal-black" data-terminal="fwd_diode_n" title="Forward Diode Cathode (N)"><div class="terminal-hole"></div></div>
              </div>
              <div class="diode-row-title">FORWARD BIAS</div>
            </div>

            <!-- Row 2: Reverse Bias Diode -->
            <div>
              <div class="diode-row-mount" id="diode-term-rev-diode">
                <div class="banana-terminal terminal-black" data-terminal="rev_diode_n" title="Reverse Diode Cathode (N)"><div class="terminal-hole"></div></div>
                <span class="terminal-lbl black-txt">N</span>
                <div class="diode-schematic-symbol">
                  <svg width="40" height="18" viewBox="0 0 40 18">
                    <line x1="0" y1="9" x2="14" y2="9" stroke="#64748b" stroke-width="2"/>
                    <line x1="14" y1="2" x2="14" y2="16" stroke="#ffffff" stroke-width="2.5"/>
                    <polygon points="26,2 14,9 26,16" fill="#38bdf8" stroke="#ffffff" stroke-width="1"/>
                    <line x1="26" y1="9" x2="40" y2="9" stroke="#ef4444" stroke-width="2"/>
                  </svg>
                </div>
                <span class="terminal-lbl red-txt">P</span>
                <div class="banana-terminal terminal-red" data-terminal="rev_diode_p" title="Reverse Diode Anode (P)"><div class="terminal-hole"></div></div>
              </div>
              <div class="diode-row-title" style="color:#a855f7;">REVERSE BIAS</div>
            </div>
          </div>

          <!-- ZONE 3: REVERSE BIAS DC SUPPLY -->
          <div class="lower-box" id="diode-sec-rev-supply">
            <div class="supply-zone-layout">
              <!-- DC Output Ports -->
              <div class="dc-output-ports">
                <span class="dc-out-title">+ D.C OUTPUT</span>
                <div class="ports-pair-row">
                  <div class="banana-terminal terminal-red" data-terminal="rev_out_pos1" title="Reverse DC (+) Socket 1"><div class="terminal-hole"></div></div>
                  <div class="banana-terminal terminal-red" data-terminal="rev_out_pos2" title="Reverse DC (+) Socket 2"><div class="terminal-hole"></div></div>
                </div>
                <span class="ports-vert-arrow">↕</span>
                <div class="ports-pair-row">
                  <div class="banana-terminal terminal-black" data-terminal="rev_out_neg1" title="Reverse DC (−) Socket 1"><div class="terminal-hole"></div></div>
                  <div class="banana-terminal terminal-black" data-terminal="rev_out_neg2" title="Reverse DC (−) Socket 2"><div class="terminal-hole"></div></div>
                </div>
              </div>

              <!-- Rotary Knob VR (0-30 V) -->
              <div class="rotary-knob-container">
                <svg class="knob-arc-indicator" viewBox="0 0 100 100">
                  <path d="M 20 80 A 42 42 0 1 1 80 80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4" stroke-linecap="round"/>
                  <path d="M 20 80 A 42 42 0 1 1 80 80" fill="none" stroke="url(#arcGradRev)" stroke-width="4" stroke-dasharray="190" stroke-dashoffset="50" stroke-linecap="round"/>
                  <defs>
                    <linearGradient id="arcGradRev" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#38bdf8" />
                      <stop offset="100%" stop-color="#c084fc" />
                    </linearGradient>
                  </defs>
                </svg>
                <div class="rotary-knob" id="diode-rev-knob" title="Reverse Bias Voltage Adjustment (VR)">
                  <div class="knob-pointer"></div>
                </div>
                <span class="knob-label-val" id="diode-rev-knob-val" style="color:#c084fc;">0.0 V</span>
              </div>
            </div>
            <div class="lower-box-caption">REVERSE BIAS ( VR ) 0-30 VOLTS</div>
          </div>

        </div>

        <!-- SVG WIRING OVERLAY CANVAS -->
        <svg id="diode-wire-canvas" class="diode-wires-overlay"></svg>

        <!-- WIRING TOOLBAR & CIRCUIT STATUS -->
        <div class="diode-wire-toolbar">
          <div class="wire-action-btns">
            <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-auto-fwd">
              ⚡ Auto Connect Forward
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-auto-rev">
              🔄 Auto Connect Reverse
            </button>
            <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-clear-wires">
              ✕ Clear Wires
            </button>
          </div>
          <div class="circuit-status-pill status-warning" id="diode-circuit-status">
            <span>●</span> <span id="diode-status-text">Open Circuit — Connect Banana Cables</span>
          </div>
        </div>
      </section>

      <!-- RIGHT: SCIENTIFIC WORKSTATIONS (GRAPHS, LOGBOOK, CHALLENGES) -->
      <section class="diode-workstation-panel">

        <!-- 1. DUAL LIVE CANVAS GRAPHS -->
        <div class="workstation-sub-card" id="diode-graphs-card">
          <div class="sub-card-header">
            <h3>
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
                <path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path>
              </svg>
              Scientific V-I Characteristic Curves
            </h3>
            <div class="graphs-tabs-bar">
              <button type="button" class="graph-tab-btn active" id="diode-tab-graph-fwd">Forward Bias (1st Quad)</button>
              <button type="button" class="graph-tab-btn" id="diode-tab-graph-rev">Reverse Bias (3rd Quad)</button>
            </div>
          </div>

          <!-- Forward Graph Viewport (1st Quadrant) -->
          <div id="diode-fwd-graph-container" class="graph-canvas-container" id="diode-fwd-graph-card">
            <canvas id="diode-fwd-graph-canvas" width="560" height="290"></canvas>
          </div>

          <!-- Reverse Graph Viewport (3rd Quadrant) -->
          <div id="diode-rev-graph-container" class="graph-canvas-container hidden" id="diode-rev-graph-card">
            <canvas id="diode-rev-graph-canvas" width="560" height="290"></canvas>
          </div>

          <div class="graph-scale-legend">
            <span>Fwd: X (1 cm = 0.1 V) • Y (1 cm = 1 mA)</span>
            <span>Rev: X (1 cm = 2 V) • Y (1 cm = 10 μA)</span>
          </div>
        </div>

        <!-- 2. OBSERVATIONS LOGBOOK WORKSTATION -->
        <div class="workstation-sub-card">
          <div class="sub-card-header">
            <h3>
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Observation Tables &amp; Telemetry
            </h3>
            <div class="obs-tabs-bar">
              <button type="button" class="obs-tab-btn active" id="diode-tab-obs-fwd">Forward Bias Log</button>
              <button type="button" class="obs-tab-btn" id="diode-tab-obs-rev">Reverse Bias Log</button>
            </div>
          </div>

          <!-- Least Count Strips -->
          <div class="least-count-strip" id="diode-lc-strip-fwd">
            <span class="lc-item">Voltmeter Least Count: <strong>0.025 V</strong> (1.5 V / 60 div)</span>
            <span class="lc-item">Milliammeter Least Count: <strong>0.2 mA</strong> (10 mA / 50 div)</span>
          </div>
          <div class="least-count-strip hidden" id="diode-lc-strip-rev">
            <span class="lc-item">Voltmeter Least Count: <strong>0.5 V</strong> (30 V / 60 div)</span>
            <span class="lc-item">Microammeter Least Count: <strong>2 μA = 0.002 mA</strong> (100 μA / 50 div)</span>
          </div>

          <!-- Table -->
          <div class="obs-table-scroll">
            <table class="diode-obs-table" id="diode-obs-table">
              <thead>
                <tr>
                  <th style="width: 50px;">S.No.</th>
                  <th id="th-diode-voltage">Forward Voltage Vf (Volt)</th>
                  <th id="th-diode-current">Forward Current If (mA)</th>
                  <th style="width: 45px;">Action</th>
                </tr>
              </thead>
              <tbody id="diode-obs-tbody">
                <!-- Dynamically populated -->
              </tbody>
            </table>
          </div>

          <!-- Actions -->
          <div class="obs-actions-bar">
            <div style="display:flex; gap:8px;">
              <button type="button" class="btn btn-primary btn-sm" id="diode-btn-record">
                Record Observation
              </button>
              <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-clear-obs">
                Clear Table
              </button>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-export-pdf" style="border-color:#38bdf8; color:#38bdf8;">
              Export PDF Report
            </button>
          </div>
        </div>

        <!-- 3. CHALLENGES CARD -->
        <div class="workstation-sub-card challenges-card">
          <div class="sub-card-header">
            <h3>
              <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
              </svg>
              Semiconductor Diode Challenges
            </h3>
            <button type="button" class="btn btn-secondary btn-sm" id="diode-btn-reset-exp">
              Reset Apparatus
            </button>
          </div>
          <div class="diode-challenges-list" id="diode-challenges-list">
            <!-- Dynamically populated -->
          </div>
        </div>

      </section>

    </main>
  </div><!-- /#exp-diode-section -->
`;

if (!html.includes('id="exp-diode-section"')) {
  const idx = html.indexOf(sectionMarker);
  if (idx !== -1) {
    const insertPos = idx + sectionMarker.length;
    html = html.substring(0, insertPos) + '\n\n' + diodeSectionHtml + html.substring(insertPos);
    console.log('Added #exp-diode-section.');
  } else {
    console.error('Could not find sectionMarker');
  }
}

// 3. Update Explorer Modal Catalog Card
const oldCard = `<div class="lab-card coming-lab" data-category="quantum" data-name="I-V Characteristics of PN Junction Diode / Zener Diode / Photo Diode">`;
const newCard = `<div class="lab-card active-lab" data-category="all" data-exp-target="diode" data-name="Diode V-I Characteristics">`;
if (html.includes(oldCard)) {
  html = html.replace(oldCard, newCard);
  console.log('Updated explorer modal catalog card to active.');
}

// 4. Add Help Modal Tab & Pane
const helpTabTarget = `<button type="button" class="help-tab-btn" id="btn-help-tab-exp5">`;
const helpTabAddition = `        <button type="button" class="help-tab-btn" id="btn-help-tab-exp6">
          <svg class="svg-icon svg-icon-sm" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <polygon points="6 4 18 12 6 20 6 4"></polygon>
            <line x1="18" y1="4" x2="18" y2="20"></line>
            <line x1="2" y1="12" x2="6" y2="12"></line>
            <line x1="18" y1="12" x2="22" y2="12"></line>
          </svg>
          <span>Exp 6: Diode V-I Characteristics</span>
        </button>
`;

if (!html.includes('id="btn-help-tab-exp6"')) {
  const idx = html.indexOf(helpTabTarget);
  if (idx !== -1) {
    const endBtn = html.indexOf('</button>', idx) + 9;
    html = html.substring(0, endBtn) + '\n' + helpTabAddition + html.substring(endBtn);
    console.log('Added help tab button for exp 6.');
  }
}

const helpPaneTarget = `</div>\n\n      </div>\n    </div>\n  </div>\n\n  <!-- =====================================\n       THEORY & FORMULAS MODAL`;
const helpPaneTargetAlt = `<!-- =====================================\n       THEORY & FORMULAS MODAL`;

const helpPaneHtml = `        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
        <div id="help-pane-exp6" class="help-pane hidden">
          <div class="help-section">
            <h4>Experiment Overview &amp; Objective</h4>
            <p>Study the voltage-current (V-I) response of a P-N junction semiconductor diode in both Forward Bias (conduction state) and Reverse Bias (blocking state). Observe the cut-in knee voltage ($V_k \\approx 0.65 - 0.7\\text{ V}$ for Silicon) and measure the microampere reverse saturation current.</p>
          </div>

          <div class="help-section">
            <h4>Step-by-Step Laboratory Procedure</h4>
            <div class="help-steps-grid">
              <div class="help-step-card">
                <span class="step-num">Step 1</span>
                <h5>Meter Range Configuration</h5>
                <p>For Forward Bias, select 1.5 V on the voltmeter and 10 mA on the milliammeter. For Reverse Bias, select 30 V and 100 μA.</p>
              </div>
              <div class="help-step-card">
                <span class="step-num">Step 2</span>
                <h5>Interactive Circuit Wiring</h5>
                <p>Connect the ammeter in series with the diode and the voltmeter in parallel across the DC supply, or click <strong>Auto Connect Forward / Reverse</strong>.</p>
              </div>
              <div class="help-step-card">
                <span class="step-num">Step 3</span>
                <h5>Power ON &amp; Voltage Sweep</h5>
                <p>Switch ON the master power toggle. Slowly rotate the rotary voltage potentiometer to sweep DC voltage in calibrated increments.</p>
              </div>
              <div class="help-step-card">
                <span class="step-num">Step 4</span>
                <h5>Record &amp; Plot Curves</h5>
                <p>Click <strong>Record Observation</strong> to log trials into the table. Inspect the dynamic 1st-quadrant and 3rd-quadrant characteristic curves.</p>
              </div>
            </div>
          </div>
        </div>
`;

if (!html.includes('id="help-pane-exp6"')) {
  // Insert before the closing </div> of help-content
  const helpContentEnd = html.indexOf('<!-- =====================================\n       THEORY & FORMULAS MODAL');
  if (helpContentEnd !== -1) {
    const lastDivBeforeTheory = html.lastIndexOf('</div>', helpContentEnd - 10);
    const secondLastDiv = html.lastIndexOf('</div>', lastDivBeforeTheory - 1);
    const thirdLastDiv = html.lastIndexOf('</div>', secondLastDiv - 1);
    html = html.substring(0, thirdLastDiv) + '\n' + helpPaneHtml + '\n        </div>' + html.substring(secondLastDiv);
    console.log('Added help pane for exp 6.');
  }
}

// 5. Add Theory Pane for Exp 6 with IMAGE 2 & IMAGE 3 Circuit Diagrams
const theoryPane5End = '<!-- =====================================\n       PHYSICS QUIZ EVALUATION MODAL';
const theoryPaneHtml = `        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
        <div id="theory-pane-exp6" class="theory-pane hidden">
          <div class="formula-block">
            <h4>Diode V-I Governing Equations</h4>
            <div class="formula-grid">
              <div class="formula-item">
                <span class="f-name">Shockley Diode Equation:</span>
                <code>I = I_0 \\left( e^{\\frac{V}{\\eta V_t}} - 1 \\right)</code>
              </div>
              <div class="formula-item">
                <span class="f-name">Thermal Voltage:</span>
                <code>V_t = \\frac{kT}{q}</code>
              </div>
              <div class="formula-item">
                <span class="f-name">Dynamic (AC) Resistance:</span>
                <code>r_d = \\frac{\\Delta V_f}{\\Delta I_f}</code>
              </div>
              <div class="formula-item">
                <span class="f-name">Static (DC) Resistance:</span>
                <code>R_{dc} = \\frac{V_f}{I_f}</code>
              </div>
            </div>
          </div>

          <div class="formula-block" style="margin-top:14px;">
            <h4>Theoretical Foundations</h4>
            <ul style="color:#94a3b8; font-size:12.5px; line-height:1.6; padding-left:18px;">
              <li><strong>P-N Junction &amp; Barrier Potential ($V_0$):</strong> Electron-hole diffusion across the metallurgical junction creates a depletion region of uncompensated immobile ions, establishing a built-in barrier potential ($V_0 \\approx 0.7\\text{ V}$ for Si).</li>
              <li><strong>Forward Bias:</strong> Applying positive potential to P-type and negative to N-type narrows the depletion region ($V_0 - V$). Above the cut-in knee voltage ($V_k$), majority charge carriers overcome the barrier, leading to exponential current growth.</li>
              <li><strong>Reverse Bias:</strong> Applying negative potential to P-type and positive to N-type widens the depletion region ($V_0 + V_r$). Only thermally generated minority carriers cross the junction, resulting in a tiny, voltage-independent reverse saturation current ($I_0 \\sim \\mu\\text{A}$).</li>
              <li><strong>Quadrant Symmetry:</strong> The forward characteristic lies in the <strong>1st Quadrant</strong> ($+V_f, +I_f$), while the reverse characteristic lies in the <strong>3rd Quadrant</strong> ($-V_r, -I_r$).</li>
            </ul>
          </div>
        </div>
`;

if (!html.includes('id="theory-pane-exp6"')) {
  const quizModalIdx = html.indexOf(theoryPane5End);
  if (quizModalIdx !== -1) {
    const lastDivBeforeQuiz = html.lastIndexOf('</div>', quizModalIdx - 5);
    const secondLast = html.lastIndexOf('</div>', lastDivBeforeQuiz - 1);
    const thirdLast = html.lastIndexOf('</div>', secondLast - 1);
    html = html.substring(0, thirdLast) + '\n' + theoryPaneHtml + '\n        </div>' + html.substring(secondLast);
    console.log('Added theory pane for exp 6.');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html!');
`;

fs.writeFileSync('scripts/patch-index-html.js', CodeContent);
