import path from "path";
import fs from "fs/promises";

async function fileExists(filepath: string) {
  try {
    return (await fs.lstat(filepath)).isFile();
  } catch (e) {
    return false;
  }
}

export const createGlobalSearchParamsFile = async (
  outDir: string,
): Promise<void> => {
  const typesPath = path.join(outDir, "./types.ts");

  if (await fileExists(typesPath)) {
    return;
  }

  const defaultContent = `
import { createSearchParams } from "@safe-routes/nextjs";
/**
 * Global search parameters that will be applied to all routes
 */
export const $SearchParams = createSearchParams(() => ({
  // Add your global search parameters here
  // locale: p.enumOr(["en", "ja"] as const, "en"),
})).passthrough();
`;

  await fs.writeFile(typesPath, defaultContent, "utf8");
  console.log(`Created default types.ts at ${typesPath}`);
};
