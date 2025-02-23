#!/usr/bin/env node

import path from "path";
import chokidar from "chokidar";
import { program } from "commander";
import { generateTypes } from "./generator";

program
  .name("safe-routes")
  .description("Generate type-safe routes for Next.js")
  .option("-w, --watch", "Watch for file changes")
  .option("-o, --out-dir <path>", "Output directory")
  .action(async (options) => {
    const appDir = path.resolve(process.cwd(), "app");
    const pagesDir = path.resolve(process.cwd(), "pages");
    const outDir = path.resolve(process.cwd(), options.outDir || "node_modules/.safe-routes");

    // 初回生成
    await generateTypes({
      appDir,
      pagesDir,
      outDir,
    });

    // ウォッチモード
    if (options.watch) {
      const watcher = chokidar.watch([appDir, pagesDir], {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 100,
        },
      });

      watcher
        .on("add", () => generateTypes({ appDir, pagesDir, outDir }))
        .on("unlink", () => generateTypes({ appDir, pagesDir, outDir }))
        .on("addDir", () => generateTypes({ appDir, pagesDir, outDir }))
        .on("unlinkDir", () => generateTypes({ appDir, pagesDir, outDir }))
        .on("change", () => generateTypes({ appDir, pagesDir, outDir }));
    }
  });

program.parse();
