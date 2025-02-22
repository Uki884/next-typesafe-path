import fs from "fs/promises";
import { createAppScanner } from "./scanner/createAppScanner";
import { createPagesScanner } from "./scanner/createPagesScanner";
import { createFileContent } from "./writer/createFileContent";
import { writeToFile } from "./writer/writeToFile";

type Options = {
  appDir: string;
  outDtsDir: string;
  outJsDir: string;
  pagesDir: string;
};

export async function generateTypes(options: Options) {
  try {
    await fs.mkdir(options.outDtsDir, { recursive: true });
    const appScanner = createAppScanner(options.appDir);
    const pagesScanner = createPagesScanner(options.pagesDir);
    const appRoutes = await appScanner();
    const pagesRoutes = await pagesScanner();
    const allRoutes = [...appRoutes, ...pagesRoutes];

    // .d.tsファイルの生成
    const dtsContent = createFileContent(allRoutes, "dts");
    await writeToFile(dtsContent, `${options.outDtsDir}/index.d.ts`);

    // .jsファイルの生成
    const jsContent = createFileContent(allRoutes, "js");
    await writeToFile(jsContent, `${options.outJsDir}/index.js`);
  } catch (error) {
    console.error("Error generating types:", error);
  }
}
