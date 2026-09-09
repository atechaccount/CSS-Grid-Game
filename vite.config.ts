import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Public path of the production GitHub Pages site at https://atechaccount.github.io/CSS-Grid-Game/. */
const productionPagesBasePath = "/CSS-Grid-Game/";

/**
 * Public path the build should assume, overridable so a pull request preview can be
 * published under /CSS-Grid-Game/pr-preview/pr-<number>/ instead of the production root.
 */
const skydockBasePath = process.env.SKYDOCK_BASE_PATH || productionPagesBasePath;

/**
 * Sandboxed preview environments (which reach the dev server through a *.e2b.app proxy host) run
 * `npm run dev`, which loads vite.config.sandbox.ts — a gitignored override merged on top of this
 * file that binds 0.0.0.0 and allows the preview host. The tracked config stays deployable.
 */
export default defineConfig(({ command }) => ({
  // The dev server always serves from the root; only builds are deployed under a subpath.
  base: command === "build" ? skydockBasePath : "/",
  plugins: [react(), tailwindcss(), viteSingleFile()],
  server: {
    port: 5420,
    strictPort: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
}));
