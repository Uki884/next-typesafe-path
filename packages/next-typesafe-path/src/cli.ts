#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "path";
import chokidar from "chokidar";
import { program } from "commander";
import { generateTypes } from "./generator";

const findRootDir = (startDir: string = process.cwd()): string => {
  if (existsSync(path.join(startDir, "package.json"))) {
    return startDir;
  }

  const parentDir = path.dirname(startDir);
  if (parentDir === startDir) {
    return process.cwd();
  }

  return findRootDir(parentDir);
};

program
  .name("next-typesafe-path")
  .description("Generate type-safe path for Next.js")
  .option("-w, --watch", "Watch for file changes and regenerate types")
  .option(
    "--trailing-slash <boolean>",
    "Enable trailing slash in generated routes",
    "true",
  )
  .option(
    "-c, --config-dir <path>",
    "Directory to the config file",
    "./",
  )
  .action(
    async (options: {
      trailingSlash: "true" | "false";
      watch: boolean;
      configDir: string;
    }) => {
      const findDirectory = (baseName: string): string | null => {
        const rootPath = path.resolve(process.cwd(), baseName);
        const srcPath = path.resolve(process.cwd(), "src", baseName);
        if (existsSync(rootPath)) return rootPath;
        if (existsSync(srcPath)) return srcPath;
        return null;
      };

      const appDir = findDirectory("app") || "";
      const pagesDir = findDirectory("pages") || "";
      const trailingSlash = options.trailingSlash === "true";
      const configDir = options.configDir || ".";

      console.log('configDir', options);

      if (!appDir && !pagesDir) {
        console.error(
          "Error: Neither 'app' nor 'pages' directory found in root or src directory",
        );
        process.exit(1);
      }

      const config = {
        appDir,
        pagesDir,
        options: {
          trailingSlash,
          configDir,
        },
      };

      console.log('config', config);

      let timeoutId: NodeJS.Timeout | null = null;
      const debouncedGenerate = () => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
          try {
            await generateTypes(config);
          } catch (error) {
            if (!options.watch) process.exit(1);
          }
        }, 1000);
      };

      debouncedGenerate();

      console.log("==================================");
      console.log("✨ Generating routes types...");
      console.log("🚀 by next-typesafe-path");
      console.log("==================================");

      if (options.watch) {
        const targetDirs = [appDir, pagesDir].filter((dir) => dir);

        const watcher = chokidar.watch(targetDirs, {
          ignored: /(^|[\/\\])\../,
          persistent: true,
          ignoreInitial: true,
          usePolling: false,
          awaitWriteFinish: true,
        });

        watcher
          .on("add", () => debouncedGenerate())
          .on("unlink", () => debouncedGenerate())
          .on("unlinkDir", () => debouncedGenerate())
          .on("change", () => debouncedGenerate());
      }
    },
  );

program.parse();
