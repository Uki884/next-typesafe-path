import { RouteSegment } from "../../../types";
import { toCamelCase } from "../../../utils";

export const generateFunctionName = (segments: RouteSegment[]): string => {
  const fullPath = segments.map((segment) => segment.parsed).join("/");

  return toCamelCase(fullPath);
};
