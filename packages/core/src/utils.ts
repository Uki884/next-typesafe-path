import fs from "fs";

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const toCamelCase = (str: string): string => {
  const segments = str.split("/").filter(Boolean);
  return segments
    .map((segment, segmentIndex) => {
      const words = segment.split(/[-_\s]+/);

      return words
        .map((word, wordIndex) => {
          if (segmentIndex === 0 && wordIndex === 0) {
            return word.toLowerCase();
          }
          return capitalizeFirstLetter(word);
        })
        .join("");
    })
    .join("");
};

export const toPascalCase = (str: string): string => {
  const segments = str.split("/").filter(Boolean);
  return segments
    .map((segment) => {
      const words = segment.split(/[-_\s]+/);
      return words.map((word) => capitalizeFirstLetter(word)).join("");
    })
    .join("");
};

export const normalizeRoutePath = (path: string): string => {
  return path
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/^\/|\/$/g, "");
};

export const isDirectory = (path: string) => {
  return fs.statSync(path).isDirectory();
};

/**
 * 文字列がkebab-case形式かどうかを判定
 * @example
 * isKebabCase('kebab-case') // true
 * isKebabCase('kebabCase') // false
 * isKebabCase('Kebab-case') // false
 */
export const isKebabCase = (str: string): boolean => {
  // 小文字とハイフンのみで構成される
  return /^[a-z][a-z0-9-]*[a-z0-9]$/.test(str) && str.includes("-");
};
