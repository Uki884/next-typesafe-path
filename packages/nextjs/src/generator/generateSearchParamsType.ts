export const generateSearchParamsType = (fullPath: string): string => {
  return `import("${fullPath}").SearchParams`;
};
