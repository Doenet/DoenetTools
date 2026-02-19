/**
 * Inline style strings for dynamically generated newsletter HTML
 * (Used in generate-newsletter.astro for client-side HTML generation)
 */

export const newsletterStyles = {
  // Top-level newsletter layout styles
  newsletterTable:
    "width: 600px; margin: 0 auto; border-collapse: collapse; font-family: sans-serif;",
  newsletterHeaderCell:
    "padding: 1em; background: #ffffff; border-bottom: 3px solid #0066cc;",
  newsletterHeaderTable: "width: 100%; border-collapse: collapse;",
  newsletterHeaderLeftCell: "text-align: left; vertical-align: bottom;",
  newsletterHeaderDateText:
    "font-size: 1.2em; color: #666; font-family: sans-serif;",
  newsletterHeaderRightCell: "text-align: right; vertical-align: bottom;",
  newsletterLogoImage:
    "height: 50px; width: auto; display: inline-block; margin: 0 0 -12px 0;",
  newsletterSpacerCell: "height: 2em;",
  newsletterFooterTable:
    "width: 600px; margin: 2em auto 0 auto; border-collapse: collapse; font-family: sans-serif;",
  newsletterFooterCell:
    "padding: 1.5em 1em; text-align: center; background: #f8f9fa; border-top: 1px solid #e0e0e0;",
  newsletterFooterText:
    "margin: 0; font-size: 0.85em; color: #666; font-family: sans-serif;",
  newsletterFooterLink: "color: #0066cc; text-decoration: underline;",

  // Download/copy wrapper styles
  wrapperBody:
    "margin: 0; padding: 0; font-family: sans-serif; font-size: 18px; background-color: #f5f5f5;",
  wrapperOuterTable: "margin: 0; padding: 0;",
  wrapperOuterCell: "padding: 20px 0;",
  wrapperInnerTable: "width: 600px; background-color: #ffffff;",

  // Table and cell styles
  table:
    "width: 600px; margin: 0 auto 2em auto; border-collapse: collapse; table-layout: fixed;",
  headerCell:
    "padding: 1.5em 0.75em 0.5em 0.75em; background: #ffffff; border: none; border-radius: 0; word-break: break-word; overflow-wrap: anywhere;",
  cell: "padding: 1.5em 0.75em; background: #ffffff; border: none; border-radius: 0; word-break: break-word; overflow-wrap: anywhere;",
  separator:
    "width: 600px; margin: 0 auto 2em auto; border-collapse: collapse;",
  separatorCell: "height: 2px; background: #c0c0c0;",
  heroImage:
    "max-width: 100%; height: auto; display: block; margin: 0 0 1em 0; border-radius: 4px;",

  // Text styles
  title:
    "margin: 0 0 0.25em 0; font-size: 28px; line-height: 1.3; color: #1a1a1a; font-family: sans-serif;",
  titleLink: "color: #1a1a1a; text-decoration: none; font-size: 28px;",
  meta: "margin: 0 0 1em 0; font-size: 16px; color: #666; font-style: italic; font-family: sans-serif;",
  description:
    "margin: 0 0 1em 0; font-size: 18px; line-height: 1.6; color: #555; font-family: sans-serif;",
  body: "margin: 0 0 1em 0; font-family: sans-serif; font-size: 18px; line-height: 1.6; color: #333; word-break: break-word; overflow-wrap: anywhere;",

  // Excerpt element styles
  paragraph:
    "margin: 0 0 1em 0; line-height: 1.6; color: #333; font-size: 18px;",
  heading1:
    "margin: 1.5em 0 0.5em 0; line-height: 1.3; color: #1a1a1a; font-size: 32px;",
  heading2:
    "margin: 1.5em 0 0.5em 0; line-height: 1.3; color: #1a1a1a; font-size: 28px;",
  heading3:
    "margin: 1.5em 0 0.5em 0; line-height: 1.3; color: #1a1a1a; font-size: 24px;",
  heading4:
    "margin: 1.5em 0 0.5em 0; line-height: 1.3; color: #1a1a1a; font-size: 20px;",
  link: "color: #0066cc; text-decoration: underline; font-size: 18px;",
  list: "margin: 0 0 1em 0; padding-left: 2em; font-size: 18px;",
  listItem: "margin: 0 0 0.5em 0; line-height: 1.6; font-size: 18px;",
  codeBlock:
    "background: #f5f5f5; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0; font-size: 16px;",
  codeInline:
    "background: #f5f5f5; padding: 0.2em 0.4em; border-radius: 3px; font-family: monospace; font-size: 16px;",
  blockquote:
    "border-left: 4px solid #ddd; padding-left: 1em; margin: 1em 0; color: #666; font-size: 18px;",
  image: "max-width: 100%; height: auto; display: block; margin: 1em 0;",

  // Button styles
  buttonWrap: "margin: 1.5em 0 0 0; font-family: sans-serif; font-size: 18px;",
  button:
    "display: inline-block; padding: 0.6em 1.2em; background: #0066cc; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 500; font-size: 18px;",
};
