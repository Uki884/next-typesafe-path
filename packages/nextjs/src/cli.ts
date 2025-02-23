#!/usr/bin/env node

import path from "path";
import chokidar from "chokidar";
import { existsSync } from 'node:fs';
import { program } from "commander";
import { generateTypes } from "./generator";

program
  .name("safe-routes")
  .description("Generate type-safe routes for Next.js")
  .option("-w, --watch", "Watch for file changes")
  .option("-o, --out-dir <path>", "Output directory")
  .action(async (options) => {

    const findDirectory = (baseName: string): string | null => {
      const rootPath = path.resolve(process.cwd(), baseName);
      const srcPath = path.resolve(process.cwd(), "src", baseName);
      if (existsSync(rootPath)) return rootPath;
      if (existsSync(srcPath)) return srcPath;
      return null;
    };

    const appDir = findDirectory("app") || "";
    const pagesDir = findDirectory("pages") || "";

    if (!appDir && !pagesDir) {
      console.error("Error: Neither 'app' nor 'pages' directory found in root or src directory");
      process.exit(1);
    }

    const outDir = path.resolve(process.cwd(), options.outDir || "node_modules/.safe-routes");

    await generateTypes({
      appDir: appDir || "",
      pagesDir: pagesDir || "",
      outDir,
    });

    if (options.watch) {
      const targetDirs = [appDir, pagesDir].filter((dir) => dir);

      const watcher = chokidar.watch(targetDirs, {
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
