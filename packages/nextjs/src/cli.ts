#!/usr/bin/env node
import path from "path";
import chokidar from "chokidar";
import { program } from "commander";
import { generateTypes } from "./generator";

program
  .name("safe-routes")
  .description("Generate type-safe routes for Next.js")
  .option("-w, --watch", "Watch for file changes")
  .action(async (options) => {
    const appDir = path.resolve(process.cwd(), "app");
    const pagesDir = path.resolve(process.cwd(), "pages");
    const outDtsDir = path.resolve(process.cwd(), "node_modules/.safe-routes");
    const outJsDir = path.resolve(
      process.cwd(),
      "./node_modules/@safe-routes/nextjs/.safe-routes",
    );

    // 初回生成
    await generateTypes({ appDir, outDtsDir, outJsDir, pagesDir });

    // ウォッチモード
    if (options.watch) {
      const watcher = chokidar.watch(appDir, {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: {
          stabilityThreshold: 100,
          pollInterval: 100,
        },
      });

      watcher
        .on("add", () =>
          generateTypes({ appDir, outDtsDir, outJsDir, pagesDir }),
        )
        .on("unlink", () =>
          generateTypes({ appDir, outDtsDir, outJsDir, pagesDir }),
        )
        .on("addDir", () =>
          generateTypes({ appDir, outDtsDir, outJsDir, pagesDir }),
        )
        .on("unlinkDir", () =>
          generateTypes({ appDir, outDtsDir, outJsDir, pagesDir }),
        )
        .on("change", () =>
          generateTypes({ appDir, outDtsDir, outJsDir, pagesDir }),
        );
    }
  });

program.parse();
