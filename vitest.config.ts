import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: the app build inlines five art plates into one HTML
// file, none of which a jsdom test run needs, and the test environment should not inherit the
// single-file plugin or the pages base path.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
