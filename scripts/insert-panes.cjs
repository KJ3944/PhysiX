const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const helpPaneHtml = `
        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
        <div id="help-pane-exp6" class="help-pane hidden">
          <div class="help-section">
            <h4>Experiment Overview &amp; Objective</h4>
            <p>Study the voltage-current (V-I) response of a P-N junction semiconductor diode in both Forward Bias (conduction state) and Reverse Bias (blocking state). Observe the cut-in knee voltage ($V_k \\approx 0.65 - 0.7\\text{ V}$ for Silicon) and measure the microampere reverse saturation current.</p>
          </div>

          <div class="help-section">
            <h4>Step-by-Step Laboratory Procedure</h4>
            <div class="help-steps-grid">
              <div class="help-step-item">
                <span class="step-num">Step 1</span>
                <h5>Meter Range Configuration</h5>
                <p>For Forward Bias, select 1.5 V on the voltmeter and 10 mA on the milliammeter. For Reverse Bias, select 30 V and 100 μA.</p>
              </div>
              <div class="help-step-item">
                <span class="step-num">Step 2</span>
                <h5>Interactive Circuit Wiring</h5>
                <p>Connect the ammeter in series with the diode and the voltmeter in parallel across the DC supply, or click <strong>Auto Connect Forward / Reverse</strong>.</p>
              </div>
              <div class="help-step-item">
                <span class="step-num">Step 3</span>
                <h5>Power ON &amp; Voltage Sweep</h5>
                <p>Switch ON the master power toggle. Slowly rotate the rotary voltage potentiometer to sweep DC voltage in calibrated increments.</p>
              </div>
              <div class="help-step-item">
                <span class="step-num">Step 4</span>
                <h5>Record &amp; Plot Curves</h5>
                <p>Click <strong>Record Observation</strong> to log trials into the table. Inspect the dynamic 1st-quadrant and 3rd-quadrant characteristic curves.</p>
              </div>
            </div>
          </div>
        </div>
`;

const helpSplit = '<h5>Isolate Orders &amp; Log</h5>';
const helpIdx = html.indexOf(helpSplit);
if (helpIdx !== -1 && !html.includes('id="help-pane-exp6"')) {
  const paneEnd = html.indexOf('</div>\r\n        </div>', helpIdx);
  const paneEndAlt = html.indexOf('</div>\n        </div>', helpIdx);
  const targetEnd = paneEnd !== -1 ? paneEnd : paneEndAlt;
  if (targetEnd !== -1) {
    const endTag = html.substring(targetEnd).indexOf('</div>\r\n        </div>') === 0 ? '</div>\r\n        </div>'.length : '</div>\n        </div>'.length;
    const insertAt = targetEnd + endTag;
    html = html.substring(0, targetEnd + 6) + '\r\n' + helpPaneHtml + html.substring(targetEnd + 6);
    console.log('Inserted help-pane-exp6');
  }
}

const theorySplit = 'the spatial position $y$ of the $n$-th diffraction peak';
const theoryIdx = html.indexOf(theorySplit);
if (theoryIdx !== -1 && !html.includes('id="theory-pane-exp6"')) {
  const paneEnd = html.indexOf('</div>\r\n        </div>', theoryIdx);
  const paneEndAlt = html.indexOf('</div>\n        </div>', theoryIdx);
  const targetEnd = paneEnd !== -1 ? paneEnd : paneEndAlt;
  if (targetEnd !== -1) {
    const theoryPaneHtml = `
        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
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
    html = html.substring(0, targetEnd + 6) + '\r\n' + theoryPaneHtml + html.substring(targetEnd + 6);
    console.log('Inserted theory-pane-exp6');
  }
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done inserting panes into index.html');
