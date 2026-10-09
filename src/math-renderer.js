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

  // Unescape HTML entities that might have been escaped by the browser
  cleaned = cleaned
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&plusmn;/g, "\\pm")
    .replace(/&deg;/g, "^\\circ");

  // Defensive sanitization: recover escaped backslashes if JS string literals converted them
  cleaned = cleaned
    .replace(/\x0crac/g, "\\frac")
    .replace(/\t(heta|imes|ext|an)/g, "\\t$1")
    .replace(/\n(abla|approx)/g, "\\n$1")
    .replace(/\r(ho)/g, "\\r$1")
    .replace(/\f(rac)/g, "\\f$1");

  // Normalize double backslashes before LaTeX commands in JS template literals
  cleaned = cleaned.replace(/\\\\([a-zA-Z]+|[;,!])/g, "\\$1");

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

  // Replace standalone numeric fractions like 1/2, 3/4 when bounded by word or space,
  // avoiding dates (like 2026/02/14) or URLs
  res = res.replace(/(^|[\s(=\-+*])(\d{1,2})\s*\/\s*(\d{1,2})([\s).,;!?\-+]|$)/g, (match, prefix, num, den, suffix) => {
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

  // 3. Inline math: $...$ (ensuring not double dollar, non-empty, and single-line/inline)
  processed = processed.replace(/(?<!\\)\$([^$\n\r]+?)(?<!\\)\$/g, (_, math) => {
    return renderLatex(math, false);
  });

  // 4. Standalone unicode fractions in text
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

  // 2. Render all formula cards (.manual-formula-card .f-eq, .formula-item code, .formula-item .f-eq)
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

  // 4. Render any inline $...$, $$...$$, or \(...\) inside all text-bearing elements
  const candidates = root.querySelectorAll(
    "p, li, td, th, h1, h2, h3, h4, h5, .manual-aim-text, .help-callout, .help-step-desc, .f-name, .f-desc, .exp-detail-desc, .step-info p, .theory-block div, .guide-card p"
  );
  candidates.forEach((el) => {
    if (el.querySelector(".katex")) return;
    // Skip if element contains nested block structures (children will be processed individually)
    if (el.querySelector("p, ul, ol, table, div.math-callout")) return;
    const html = el.innerHTML;
    if (html.includes("$") || html.includes("\\(") || html.includes("\\[") || /½|⅓|⅔|¼|¾/.test(html)) {
      el.innerHTML = renderMathInText(html);
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
