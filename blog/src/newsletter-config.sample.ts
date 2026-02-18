/**
 * Newsletter configuration template
 * Copy this file to newsletter-config.ts and edit for each newsletter
 */

export const newsletterConfig = {
  // Newsletter metadata
  title: "Doenet Newsletter", // Used in page title and download filename
  subtitle: "Welcome! Here are some recent updates from the Doenet project.", // Introductory blurb displayed in header

  // Issue date (hard-coded)
  issueDate: new Date("2026-02-18"),

  // Excerpt marker configuration
  // Posts should include the marker <!-- more -->, {/* more */}, or an element
  // with data-excerpt (e.g., <span data-excerpt style="display:none"></span>)
  // to indicate the end of the clip. If the marker is missing, the full post
  // content is used.
  excerptMarker: "more",

  // Ordered slug list (required)
  // Only posts listed here will be included, in this exact order.
  // Slugs are filenames without .md/.mdx extension.
  manualOrder: [
    // Add more post slugs here in the order you want them
    // Ex: "my-first-post"
  ],
};
