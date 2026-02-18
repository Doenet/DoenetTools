/**
 * Inline style strings for dynamically generated newsletter HTML
 * (Used in generate-newsletter.astro for client-side HTML generation)
 */

export const newsletterStyles = {
  // Table and cell styles
  table:
    "width: 600px; margin: 0 auto 2em auto; border-collapse: collapse; table-layout: fixed;",
  headerCell:
    "padding: 1.5em 0.75em 0.5em 0.75em; background: #ffffff; border: none; border-radius: 0; word-break: break-word; overflow-wrap: anywhere;",
  cell: "padding: 1.5em 0.75em; background: #ffffff; border: none; border-radius: 0; word-break: break-word; overflow-wrap: anywhere;",
  separator:
    "width: 600px; margin: 0 auto 2em auto; border-collapse: collapse;",
  separatorCell: "height: 2px; background: #c0c0c0;",

  // Text styles
  title:
    "margin: 0 0 0.25em 0; font-size: 28px; line-height: 1.3; color: #1a1a1a; font-family: sans-serif;",
  titleLink: "color: #1a1a1a; text-decoration: none; font-size: 28px;",
  meta: "margin: 0 0 1em 0; font-size: 16px; color: #666; font-style: italic; font-family: sans-serif;",
  description:
    "margin: 0 0 1em 0; font-size: 18px; line-height: 1.6; color: #555; font-family: sans-serif;",
  body: "margin: 0 0 1em 0; font-family: sans-serif; font-size: 18px; line-height: 1.6; color: #333; word-break: break-word; overflow-wrap: anywhere;",

  // Button styles
  buttonWrap: "margin: 1.5em 0 0 0; font-family: sans-serif; font-size: 18px;",
  button:
    "display: inline-block; padding: 0.6em 1.2em; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 18px;",
};
