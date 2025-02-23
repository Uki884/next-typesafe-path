import { RouteFunctionDefinition, RouteSegment } from "../../types";

export const convertPathToParamFormat = (segments: RouteSegment[]) => {
  if (segments.length === 0) return "";
  return segments
    .map((segment) => {
      if (!segment.isDynamic) return segment.rawParamName;
      return segment.rawParamName;
    })
    .join("/");
};

export const createRoutePaths = (routes: RouteFunctionDefinition[]) => {
  return routes
    .map((route) => {
      const path = convertPathToParamFormat(route.routeSegments);
      return path ? `"/${path}/"` : `"/"`;
    })
    .join(" | ");
};
