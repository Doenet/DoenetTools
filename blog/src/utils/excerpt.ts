/**
 * Utility functions for extracting and processing excerpts from blog post content
 */

/**
 * Extract content up to an HTML comment marker (e.g., <!-- more -->)
 */
export function extractUntilMarker(
  html: string,
  marker: string = "more",
): string {
  const markerPattern = new RegExp(`<!--\\s*${marker}\\s*-->`, "i");
  const match = html.match(markerPattern);

  if (match && match.index !== undefined) {
    return html.substring(0, match.index).trim();
  }

  return html;
}

/**
 * Clean HTML for email compatibility
 * - Remove script tags
 * - Remove style tags (we'll use inline styles instead)
 * - Remove interactive elements that won't work in email
 */
export function cleanForEmail(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Remove scripts
  doc.querySelectorAll("script").forEach((el) => el.remove());

  // Remove style tags (we'll use inline styles)
  doc.querySelectorAll("style").forEach((el) => el.remove());

  // Remove interactive elements that won't work in email
  doc
    .querySelectorAll("button, input, textarea, select, form")
    .forEach((el) => el.remove());

  // Remove any React/MDX components that might have been rendered
  doc.querySelectorAll("[data-astro-cid], [data-component]").forEach((el) => {
    // Keep the element but remove the attributes
    el.removeAttribute("data-astro-cid");
    el.removeAttribute("data-component");
  });

  return doc.body.innerHTML;
}

/**
 * Apply inline styles for email compatibility
 */
export function applyEmailStyles(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Style paragraphs
  doc.querySelectorAll("p").forEach((p) => {
    p.setAttribute(
      "style",
      "margin: 0 0 1em 0; line-height: 1.6; color: #333;",
    );
  });

  // Style headings
  doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((h) => {
    h.setAttribute(
      "style",
      "margin: 1.5em 0 0.5em 0; line-height: 1.3; color: #1a1a1a;",
    );
  });

  // Style links
  doc.querySelectorAll("a").forEach((a) => {
    a.setAttribute("style", "color: #0066cc; text-decoration: underline;");
  });

  // Style lists
  doc.querySelectorAll("ul, ol").forEach((list) => {
    list.setAttribute("style", "margin: 0 0 1em 0; padding-left: 2em;");
  });

  doc.querySelectorAll("li").forEach((li) => {
    li.setAttribute("style", "margin: 0 0 0.5em 0; line-height: 1.6;");
  });

  // Style code blocks
  doc.querySelectorAll("pre").forEach((pre) => {
    pre.setAttribute(
      "style",
      "background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0;",
    );
  });

  doc.querySelectorAll("code").forEach((code) => {
    if (code.parentElement?.tagName !== "PRE") {
      code.setAttribute(
        "style",
        "background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace;",
      );
    }
  });

  // Style blockquotes
  doc.querySelectorAll("blockquote").forEach((bq) => {
    bq.setAttribute(
      "style",
      "border-left: 4px solid #ddd; padding-left: 1em; margin: 1em 0; color: #666;",
    );
  });

  // Style images
  doc.querySelectorAll("img").forEach((img) => {
    img.setAttribute(
      "style",
      "max-width: 100%; height: auto; display: block; margin: 1em 0;",
    );
  });

  return doc.body.innerHTML;
}
