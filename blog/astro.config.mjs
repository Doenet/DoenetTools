// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  // TODO: Can we make `site` more general?
  // TODO: When moving to `doenet.org`, we will have to migrate our pages
  // and possibly add redirects
  // aka `beta.doenet.org/blog/...` to `doenet.org/blog/...`
  site: "https://beta.doenet.org",
  base: "/blog",
  integrations: [mdx(), sitemap()],
});
