// convert kebab-case and snake_case to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase());
};
