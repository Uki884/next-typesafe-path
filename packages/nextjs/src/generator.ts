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
    const appRoutes = await appScanner();
    const pagesRoutes = await pagesScanner();
    const allRoutes = [...appRoutes, ...pagesRoutes];

    // .d.tsファイルの生成
    const dtsContent = createFileContent(allRoutes, "dts");
    await writeToFile(dtsContent, `${options.outDir}/index.d.ts`);

    // .jsファイルの生成
    const jsContent = createFileContent(allRoutes, "js");
    await writeToFile(jsContent, `${options.outDir}/index.js`);
  } catch (error) {
    console.error("Error generating types:", error);
  }
}
