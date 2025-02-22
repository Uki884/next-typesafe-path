import { RouteSegment } from "../../types";

export const withDuplicateParamSuffix = (segments: RouteSegment[]) => {
  const paramCount: Record<string, number> = {};

  return segments.map((segment) => {
    const { paramName } = segment;

    if (!paramName) {
      return segment;
    }

    // 初めて出現した場合はそのまま返す
    if (!paramCount[paramName]) {
      paramCount[paramName] = 1;
      return segment;
    }

    // 2回目以降の出現の場合、連番を付与
    paramCount[paramName]++;
    return {
      ...segment,
      paramName: `${paramName}${paramCount[paramName]}`,
    };
  });
};
