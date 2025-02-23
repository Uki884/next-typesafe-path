import path from "path";

export const generateSearchParamsType = (
  fullPath: string,
  outDir: string
): string => {
  // outDirからtargetFileまでの相対パスを計算
  const importPath = path.relative(outDir, fullPath).replace(/\\/g, "/");

  return `import("${importPath}").SearchParams`;
};
