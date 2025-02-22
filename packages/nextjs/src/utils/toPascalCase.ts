export const toPascalCase = (str: string): string => {
  return str.charAt(0).toUpperCase() + toCamelCase(str.slice(1));
};
