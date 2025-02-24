export const toCamelCase = (str: string): string => {
  return str.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
};
