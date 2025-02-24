import fs from "fs/promises";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { createFileContent } from "./writer/createFileContent";
import { writeToFile } from "./writer/writeToFile";

type Options = {
  appDir: string;
  pagesDir: string;
  outDir: string;
};

export async function generateTypes(options: Options) {
  try {
    await fs.mkdir(options.outDir, { recursive: true });
    const appScanner = createAppScanner({ inputDir: options.appDir, outDir: options.outDir });
    const pagesScanner = createPagesScanner({ inputDir: options.pagesDir, outDir: options.outDir });

    const appRoutes = appScanner ? await appScanner() : [];
    const pagesRoutes = pagesScanner ? await pagesScanner() : [];
    const allRoutes = [...appRoutes, ...pagesRoutes];

    // generate TypeScript source file
    const content = createFileContent(allRoutes);
    await writeToFile(content, `${options.outDir}/index.ts`);
  } catch (error) {
    console.error("Error generating types:", error);
  }
}
