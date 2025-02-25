import fs from "fs/promises";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { createFileContent } from "./writer/createFileContent";
import { writeToFile } from "./writer/writeToFile";
import { UserConfig } from "./types";

type Options = {
  appDir: string;
  pagesDir: string;
  config: UserConfig;
};

export async function generateTypes({ appDir, pagesDir, config }: Options) {
  try {
    const outDir = config.outDir || ".safe-routes";
    await fs.mkdir(outDir, { recursive: true });
    const appScanner = createAppScanner({ inputDir: appDir, outDir });
    const pagesScanner = createPagesScanner({ inputDir: pagesDir, outDir });

    const appRoutes = appScanner ? await appScanner() : [];
    const pagesRoutes = pagesScanner ? await pagesScanner() : [];
    const allRoutes = [...appRoutes, ...pagesRoutes];

    // generate TypeScript source file
    const content = createFileContent({ routes: allRoutes, config });
    await writeToFile(content, `${outDir}/index.ts`);
    console.log("==================================");
    console.log("✨ Generating routes types...");
    console.log("🚀 by @safe-routes/nextjs");
    console.log("==================================");
  } catch (error) {
    console.error("Error generating types:", error);
  }
}
