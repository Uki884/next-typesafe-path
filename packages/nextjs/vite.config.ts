import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: ["src/cli.ts"],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["chokidar", "commander", "path", "fs/promises", "node:fs"],
    },
  },
});
