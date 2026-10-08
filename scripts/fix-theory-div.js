import fs from 'fs';

let html = fs.readFileSync('index.html', 'utf8');

const oldSnippet = `          <div class="formula-block" style="margin-top:14px;">
            <h4>Theoretical Foundations & Wave Optics</h4>
            <ul style="color:#94a3b8; font-size:12.5px; line-height:1.6; padding-left:18px;">
              <li><strong>Fraunhofer Multi-Slit Interference:</strong> When a plane monochromatic laser wavefront strikes a transmission grating having $N$ rulings per mm, each slit acts as a coherent secondary Huygens emitter.</li>
              <li><strong>Condition for Principal Maxima ($d\\sin\\theta = n\\lambda$):</strong> Constructive interference occurs at angles $\\theta$ where the path difference between light from adjacent slits equals an integral multiple of the wavelength $n\\lambda$, where $n = 0, \\pm 1, \\pm 2, \\dots$ is the spectral order.</li>
              <li><strong>Grating Element Pitch ($d = 10^{-3} / N$):</strong> Because rulings are specified per millimeter, multiplying by $10^{-3}$ converts the slit spacing $d$ into SI meters ($m$), allowing direct calculation of optical wavelength in meters or nanometers ($1\\text{ nm} = 10^{-9}\\text{ m}$).</li>
              <li><strong>Detector Screen Fringe Offset ($y = L \\tan\\theta$):</strong> On a flat detector screen aligned at focal distance $L$, the spatial position $y$ of the $n$-th diffraction peak from the central beam datum satisfies $\\tan\\theta = y / L$.</li>
            </ul>
          </div>

        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
        <div id="theory-pane-exp6" class="theory-pane hidden">`;

const newSnippet = `          <div class="formula-block" style="margin-top:14px;">
            <h4>Theoretical Foundations & Wave Optics</h4>
            <ul style="color:#94a3b8; font-size:12.5px; line-height:1.6; padding-left:18px;">
              <li><strong>Fraunhofer Multi-Slit Interference:</strong> When a plane monochromatic laser wavefront strikes a transmission grating having $N$ rulings per mm, each slit acts as a coherent secondary Huygens emitter.</li>
              <li><strong>Condition for Principal Maxima ($d\\sin\\theta = n\\lambda$):</strong> Constructive interference occurs at angles $\\theta$ where the path difference between light from adjacent slits equals an integral multiple of the wavelength $n\\lambda$, where $n = 0, \\pm 1, \\pm 2, \\dots$ is the spectral order.</li>
              <li><strong>Grating Element Pitch ($d = 10^{-3} / N$):</strong> Because rulings are specified per millimeter, multiplying by $10^{-3}$ converts the slit spacing $d$ into SI meters ($m$), allowing direct calculation of optical wavelength in meters or nanometers ($1\\text{ nm} = 10^{-9}\\text{ m}$).</li>
              <li><strong>Detector Screen Fringe Offset ($y = L \\tan\\theta$):</strong> On a flat detector screen aligned at focal distance $L$, the spatial position $y$ of the $n$-th diffraction peak from the central beam datum satisfies $\\tan\\theta = y / L$.</li>
            </ul>
          </div>
        </div>

        <!-- TAB 6: DIODE V-I CHARACTERISTICS -->
        <div id="theory-pane-exp6" class="theory-pane hidden">`;

const oldEnd = `            </ul>
          </div>
        </div>

        </div>
      </div>`;

const newEnd = `            </ul>
          </div>
        </div>

      </div>`;

const isCRLF = html.includes('\r\n');
const normalizedHtml = isCRLF ? html.replace(/\r\n/g, '\n') : html;

if (!normalizedHtml.includes(oldSnippet.replace(/\r\n/g, '\n'))) {
  console.error("oldSnippet not found in index.html");
  process.exit(1);
}

let replaced = normalizedHtml.replace(oldSnippet.replace(/\r\n/g, '\n'), newSnippet.replace(/\r\n/g, '\n'));
replaced = replaced.replace(oldEnd.replace(/\r\n/g, '\n'), newEnd.replace(/\r\n/g, '\n'));

if (isCRLF) {
  replaced = replaced.replace(/\n/g, '\r\n');
}

fs.writeFileSync('index.html', replaced, 'utf8');
console.log("Successfully fixed theory pane divs in index.html");
