import { defineConfig } from "vite";
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: ["src/cli.ts", "src/index.ts"],
      formats: ["es"],
    },
    rollupOptions: {
      external: ["chokidar", "commander", "path", "fs/promises", "node:fs"],
    },
  },
});
