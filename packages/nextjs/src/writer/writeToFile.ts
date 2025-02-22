import path from "path";
import fs from "fs/promises";

export const writeToFile = async (
  content: string,
  outPath: string,
): Promise<void> => {
  const outDir = path.dirname(outPath);
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outPath, content, "utf-8");
};
