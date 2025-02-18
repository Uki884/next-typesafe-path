import { RouteSegment } from "../../../types";

export const generateUrlString = (segments: RouteSegment[]): string => {
  return segments
    .map((segment) =>
      segment.isDynamic ? `\${${segment.paramName}}` : segment.original,
    )
    .join("/");
};
