import path from "path";

export const generateSearchParamsType = (fullPath: string): string => {
  const relativePath = path
    .relative(process.cwd(), fullPath)
    .replace(/\\/g, "/");

  const importPath = `../../${relativePath}`;

  return `import("${importPath}").SearchParams`;
};
