import { defineConfig } from "cypress";
//@ts-expect-error no types
import addAccessibilityTasks from "wick-a11y/accessibility-tasks";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    setupNodeEvents(on) {
      addAccessibilityTasks(on);
    },
  },
});
