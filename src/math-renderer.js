/**
 * PhysiX High-Precision Mathematical & Equation Rendering Engine
 * Powered by KaTeX for academic-standard mathematical typesetting.
 */

import katex from "katex";

// Import KaTeX styles in browser/Vite environment
if (typeof window !== "undefined") {
  try {
    import("katex/dist/katex.min.css");
  } catch (e) {}
}

/**
 * Render a LaTeX expression to HTML using KaTeX
 * @param {string} latex - The LaTeX formula to render
 * @param {boolean} [displayMode=false] - Whether to render as block/display mode
 * @returns {string} - Rendered HTML
 */
export function renderLatex(latex, displayMode = false) {
  if (!latex || typeof latex !== "string") return "";
  let cleaned = latex.trim();
  if (!cleaned) return "";

  // Defensive sanitization: recover escaped backslashes if JS string literals converted them
  cleaned = cleaned
    .replace(/\x0crac/g, "\\frac")
    .replace(/\t(heta|imes|ext|an)/g, "\\t$1")
    .replace(/\n(abla|approx)/g, "\\n$1")
    .replace(/\r(ho)/g, "\\r$1");

  // Ensure plain-text fractions (like 1/2) inside LaTeX are formatted as \frac{num}{den}
  cleaned = cleaned.replace(/(^|[\s(=\-+*])(\d+)\s*\/\s*(\d+)([\s).,;!?\-+]|$)/g, "$1\\frac{$2}{$3}$4");

  try {
    return katex.renderToString(cleaned, {
      displayMode,
      throwOnError: false,
      strict: false,
      trust: false,
      output: "htmlAndMathml"
    });
  } catch (err) {
    console.warn("[MathRenderer] KaTeX render error:", err.message);
    return `<span class="katex-error">${cleaned}</span>`;
  }
}

/**
 * Convert standalone plain-text fractions (e.g. 1/2, 3/4) into KaTeX fraction HTML
 * @param {string} text
 * @returns {string}
 */
export function renderPlainFractions(text) {
  if (!text || typeof text !== "string") return text;
  
  // Replace ½, ⅓, ⅔, ¼, ¾ unicode fractions
  let res = text
    .replace(/½/g, () => renderLatex("\\frac{1}{2}", false))
    .replace(/⅓/g, () => renderLatex("\\frac{1}{3}", false))
    .replace(/⅔/g, () => renderLatex("\\frac{2}{3}", false))
    .replace(/¼/g, () => renderLatex("\\frac{1}{4}", false))
    .replace(/¾/g, () => renderLatex("\\frac{3}{4}", false));

  // Replace standalone numeric fractions like 1/2, 3/4, 5/2 when bounded by word or space,
  // avoiding dates or URLs
  res = res.replace(/(^|[\s(=\-+*])(\d+)\s*\/\s*(\d+)([\s).,;!?\-+]|$)/g, (match, prefix, num, den, suffix) => {
    return `${prefix}${renderLatex(`\\frac{${num}}{${den}}`, false)}${suffix}`;
  });

  return res;
}

/**
 * Replace inline and display LaTeX delimiters in text with rendered KaTeX
 * Delimiters supported:
 *   Display: $$...$$ or \[...\]
 *   Inline:  $...$  or \(...\)
 *
 * @param {string} text
 * @returns {string}
 */
export function renderMathInText(text) {
  if (!text || typeof text !== "string") return text;

  // Protect code blocks before parsing math
  const codeBlocks = [];
  let processed = text.replace(/(```[\s\S]*?```|`[^`]+`)/g, (match) => {
    codeBlocks.push(match);
    return `___CODE_BLOCK_${codeBlocks.length - 1}___`;
  });

  // 1. Display math: $$...$$ or \[...\]
  processed = processed.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => {
    return `<div class="formula-latex display-math">${renderLatex(math, true)}</div>`;
  });
  processed = processed.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => {
    return `<div class="formula-latex display-math">${renderLatex(math, true)}</div>`;
  });

  // 2. Inline math: \(...\)
  processed = processed.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => {
    return renderLatex(math, false);
  });

  // 3. Inline math: $...$ (ensuring not double dollar and not empty)
  processed = processed.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (_, math) => {
    return renderLatex(math, false);
  });

  // 4. Standalone plain-text fractions (e.g. 1/2) in text
  processed = renderPlainFractions(processed);

  // 5. Restore code blocks
  processed = processed.replace(/___CODE_BLOCK_(\d+)___/g, (_, idx) => {
    return codeBlocks[Number(idx)] || "";
  });

  return processed;
}

/**
 * Scan a DOM container and render math equations inside designated elements
 * without modifying unrelated content.
 *
 * @param {HTMLElement|Document} root
 */
export function renderMathInElement(root) {
  if (!root || typeof root.querySelectorAll !== "function") return;

  // 1. Render all formula callouts (.math-callout)
  const mathCallouts = root.querySelectorAll(".math-callout");
  mathCallouts.forEach((el) => {
    if (el.querySelector(".katex")) return; // Already rendered
    const raw = el.textContent.trim();
    if (!raw) return;
    el.innerHTML = renderLatex(raw, true);
  });

  // 2. Render all formula cards (.manual-formula-card .f-eq, .formula-item code)
  const formulaEqs = root.querySelectorAll(".manual-formula-card .f-eq, .formula-item code, .formula-item .f-eq");
  formulaEqs.forEach((el) => {
    if (el.querySelector(".katex")) return;
    const raw = el.textContent.trim();
    if (!raw) return;
    el.innerHTML = renderLatex(raw, false);
  });

  // 3. Render all existing .formula-latex containers
  const formulaLatexEls = root.querySelectorAll(".formula-latex");
  formulaLatexEls.forEach((el) => {
    if (el.querySelector(".katex")) return;
    const raw = el.textContent.trim();
    if (!raw) return;
    el.innerHTML = renderLatex(raw, true);
  });

  // 4. Render any inline $...$ or $$...$$ inside theory descriptions, steps, cards
  const textContainers = root.querySelectorAll(
    ".tutorial-card-desc, .theory-block p, .theory-block li, .formula-block p, .formula-block li, .theory-detail-content p, .theory-detail-content li, .theory-main-body p, .theory-main-body li, .theory-pane p, .theory-pane li, .f-desc, .f-name, .exp-detail-desc, .manual-aim-text, .manual-ordered-list li, .guide-section p, .guide-section li, .help-modal-body p, .help-modal-body li, .help-pane p, .help-pane li, .help-step-desc, .help-callout, .guide-card p"
  );
  textContainers.forEach((el) => {
    if (el.querySelector(".katex")) return;
    const originalHtml = el.innerHTML;
    if (originalHtml.includes("$") || originalHtml.includes("\\(") || originalHtml.includes("\\[") || /½|⅓|⅔|¼|¾|\b\d+\s*\/\s*\d+\b/.test(originalHtml)) {
      el.innerHTML = renderMathInText(originalHtml);
    }
  });
}

// Auto-run on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      renderMathInElement(document.body);
    });
  } else {
    // Already loaded
    setTimeout(() => renderMathInElement(document.body), 0);
  }
}
