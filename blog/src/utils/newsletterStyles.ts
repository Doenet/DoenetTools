/**
 * Inline style strings for dynamically generated newsletter HTML
 * (Used in generate-newsletter.astro for client-side HTML generation)
 *
 * For Astro components, use the CSS classes from src/styles/newsletter.css instead
 */

export const newsletterStyles = {
  // Table and cell styles
  table:
    "width: 100%; max-width: 600px; margin: 0 auto 2em auto; border-collapse: collapse; table-layout: fixed;",
  cell: "padding: 1.5em; background: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; word-break: break-word; overflow-wrap: anywhere;",
  separator:
    "width: 100%; max-width: 600px; margin: 0 auto 2em auto; border-collapse: collapse;",
  separatorCell: "height: 1px; background: #e0e0e0;",

  // Text styles
  title:
    "margin: 0 0 0.5em 0; font-size: 1.5em; line-height: 1.3; color: #1a1a1a; font-family: sans-serif;",
  titleLink: "color: #1a1a1a; text-decoration: none;",
  meta: "margin: 0 0 1em 0; font-size: 0.9em; color: #666; font-style: italic; font-family: sans-serif;",
  description:
    "margin: 0 0 1em 0; font-size: 1em; line-height: 1.6; color: #555; font-weight: 500; font-family: sans-serif;",
  body: "margin: 0 0 1em 0; font-family: sans-serif; font-size: 1em; line-height: 1.6; color: #333; word-break: break-word; overflow-wrap: anywhere;",

  // Button styles
  buttonWrap: "margin: 1.5em 0 0 0; font-family: sans-serif;",
  button:
    "display: inline-block; padding: 0.6em 1.2em; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500;",
};
