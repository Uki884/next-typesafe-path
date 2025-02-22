import { RouteSegment } from "../types";
import { generateSearchParamsType } from "./utils/generateSearchParamsType";

export type RouteFunctionDefinition = {
  routeSegments: RouteSegment[];
  searchParamsType: string;
};

export const createRouteFunction = ({
  fullPath,
  segments,
}: {
  fullPath: string;
  segments: RouteSegment[];
}): RouteFunctionDefinition => {
  const searchParamsType = generateSearchParamsType(fullPath);

  if (!segments.length) {
    return {
      routeSegments: segments,
      searchParamsType,
    };
  }

  return {
    routeSegments: segments,
    searchParamsType,
  };
};
