import katex from "katex";
import autoRender from "katex/dist/contrib/auto-render.mjs";
import "katex/dist/katex.min.css";

const KATEX_OPTIONS = {
  delimiters: [
    { left: "$$", right: "$$", display: true },
    { left: "\\[", right: "\\]", display: true },
    { left: "$", right: "$", display: false },
    { left: "\\(", right: "\\)", display: false }
  ],
  throwOnError: false,
  errorColor: "#ef4444",
  strict: false,
  trust: true,
  ignoredTags: ["script", "noscript", "style", "textarea", "pre"]
};

/**
 * Renders all math expressions ($...$, $$...$$, \(...\), \[...\]) within a DOM element or subtree.
 * @param {HTMLElement} root - DOM element to render math inside (defaults to document.body)
 */
export function renderMathInDOM(root = document.body) {
  if (!root) return;
  try {
    autoRender(root, KATEX_OPTIONS);
  } catch (err) {
    console.warn("[MathRenderer] autoRender error:", err);
  }
}

/**
 * Replaces $$...$$ and $...$ with KaTeX HTML in a raw string.
 * @param {string} str - Raw string with LaTeX math delimiters
 * @returns {string} String with rendered KaTeX HTML
 */
export function renderMathInString(str) {
  if (!str || typeof str !== "string") return str || "";

  // 1. Block math: $$...$$ or \[...\]
  let result = str.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
    try {
      return `<div class="katex-display">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch (e) {
      return match;
    }
  });

  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (match, expr) => {
    try {
      return `<div class="katex-display">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    } catch (e) {
      return match;
    }
  });

  // 2. Inline math: $...$ or \(...\)
  result = result.replace(/\$([^\$\n]+?)\$/g, (match, expr) => {
    if (!expr.trim()) return match;
    try {
      return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  result = result.replace(/\\\((.+?)\\\)/g, (match, expr) => {
    if (!expr.trim()) return match;
    try {
      return katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    } catch (e) {
      return match;
    }
  });

  return result;
}

/**
 * Shared Markdown formatter with KaTeX math rendering.
 * Extracts math into tokens, parses Markdown, and injects KaTeX HTML.
 * @param {string} markdownText 
 * @returns {string} Rendered HTML
 */
export function formatMarkdownWithMath(markdownText) {
  if (!markdownText) return "";

  // Step 1: Extract and render math into placeholders to protect from markdown regexes
  const mathPlaceholders = [];

  // Block math $$...$$ and \[...\]
  let text = markdownText.replace(/\$\$([\s\S]+?)\$\$/g, (match, expr) => {
    const rendered = `<div class="katex-display formula-latex">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    const idx = mathPlaceholders.push(rendered) - 1;
    return `%%KATEX_MATH_PH_${idx}%%`;
  });

  text = text.replace(/\\\[([\s\S]+?)\\\]/g, (match, expr) => {
    const rendered = `<div class="katex-display formula-latex">${katex.renderToString(expr.trim(), { displayMode: true, throwOnError: false })}</div>`;
    const idx = mathPlaceholders.push(rendered) - 1;
    return `%%KATEX_MATH_PH_${idx}%%`;
  });

  // Inline math $...$ and \(...\)
  text = text.replace(/\$([^\$\n]+?)\$/g, (match, expr) => {
    if (!expr.trim()) return match;
    const rendered = katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    const idx = mathPlaceholders.push(rendered) - 1;
    return `%%KATEX_MATH_PH_${idx}%%`;
  });

  text = text.replace(/\\\((.+?)\\\)/g, (match, expr) => {
    if (!expr.trim()) return match;
    const rendered = katex.renderToString(expr.trim(), { displayMode: false, throwOnError: false });
    const idx = mathPlaceholders.push(rendered) - 1;
    return `%%KATEX_MATH_PH_${idx}%%`;
  });

  // Step 2: Format standard Markdown elements
  text = text
    .replace(/^#### (.*$)/gim, '<h5>$1</h5>')
    .replace(/^### (.*$)/gim, '<h4>$1</h4>')
    .replace(/^## (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code class="font-mono">$1</code>');

  const lines = text.split("\n");
  const formattedLines = [];
  let inList = false;
  let inTable = false;

  for (let line of lines) {
    const trimmed = line.trim();

    // Horizontal Rule
    if (trimmed === "***" || trimmed === "---" || trimmed === "___") {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (inTable) { formattedLines.push("</tbody></table>"); inTable = false; }
      formattedLines.push("<hr />");
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      if (inTable) { formattedLines.push("</tbody></table>"); inTable = false; }
      formattedLines.push(`<blockquote>${trimmed.substring(2)}</blockquote>`);
      continue;
    }

    // Markdown Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (inList) { formattedLines.push("</ul>"); inList = false; }
      const cells = trimmed.split("|").slice(1, -1).map(c => c.trim());
      // Check if separator row
      if (cells.every(c => /^:?-+:?$/.test(c))) {
        continue;
      }
      if (!inTable) {
        formattedLines.push("<table><thead><tr>");
        cells.forEach(c => formattedLines.push(`<th>${c}</th>`));
        formattedLines.push("</tr></thead><tbody>");
        inTable = true;
      } else {
        formattedLines.push("<tr>");
        cells.forEach(c => formattedLines.push(`<td>${c}</td>`));
        formattedLines.push("</tr>");
      }
      continue;
    } else if (inTable) {
      formattedLines.push("</tbody></table>");
      inTable = false;
    }

    // List item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) {
        formattedLines.push("<ul>");
        inList = true;
      }
      formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        formattedLines.push("</ul>");
        inList = false;
      }
      if (trimmed.length > 0) {
        if (!trimmed.startsWith("<h") && !trimmed.startsWith("<div") && !trimmed.startsWith("<blockquote") && !trimmed.startsWith("<table") && !trimmed.startsWith("<hr")) {
          formattedLines.push(`<p>${trimmed}</p>`);
        } else {
          formattedLines.push(trimmed);
        }
      }
    }
  }
  if (inList) formattedLines.push("</ul>");
  if (inTable) formattedLines.push("</tbody></table>");

  let html = formattedLines.join("");

  // Step 3: Restore rendered KaTeX math placeholders
  html = html.replace(/%%KATEX_MATH_PH_(\d+)%%/g, (match, idx) => {
    return mathPlaceholders[Number(idx)] || match;
  });

  return html;
}

/**
 * Automatically initializes math rendering across document.body once DOM is ready.
 */
export function initMathRenderer() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderMathInDOM(document.body));
  } else {
    renderMathInDOM(document.body);
  }
}
