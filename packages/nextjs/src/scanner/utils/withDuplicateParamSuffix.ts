import { RouteSegment } from "../../types";

export const withDuplicateParamSuffix = (segments: RouteSegment[]) => {
  const paramCount: Record<string, number> = {};

  return segments.map((segment) => {
    const { paramName } = segment;

    if (!paramName) {
      return segment;
    }

    // if the parameter appears for the first time, return it as is
    if (!paramCount[paramName]) {
      paramCount[paramName] = 1;
      return segment;
    }

    // if the parameter appears for the second time or more, add a sequential number
    paramCount[paramName]++;
    return {
      ...segment,
      paramName: `${paramName}${paramCount[paramName]}`,
    };
  });
};
