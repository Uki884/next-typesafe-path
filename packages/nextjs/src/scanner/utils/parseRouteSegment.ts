import { RouteSegment } from "../../types";
import { toCamelCase } from "../../utils";
import { isDynamicRoute } from "./isDynamicRoute";
import { isPage } from "./isPage";
import { isRouteGroup } from "./isRouteGroup";

const getParamName = (segment: string) => {
  const dynamicType = isDynamicRoute(segment);
  switch (dynamicType) {
    case "catch-all":
      return segment.replace(/\[\.\.\.(.+)\]/, "$1");
    case "optional-catch-all":
      return segment.replace(/\[\[\.\.\.(.+)\]\]/, "$1");
    case "dynamic":
      return segment.replace(/\[(.+)\]/, "$1");
    default:
      return segment;
  }
};

export const parseRouteSegment = ({
  segment,
  parentSegment,
}: {
  segment: string;
  parentSegment?: string;
}): RouteSegment | null => {
  // ignore route group
  if (isRouteGroup(segment)) {
    return null;
  }

  const dynamicType = isDynamicRoute(segment);
  if (!dynamicType) {
    return {
      rawParamName: segment,
      paramName: "",
      isDynamic: false,
      dynamicType: false,
      isPage: isPage(segment),
      parentSegment,
    };
  }

  // extract parameter name
  const paramName = dynamicType ? getParamName(segment) : segment;

  return {
    rawParamName: segment,
    paramName: toCamelCase(paramName),
    isDynamic: true,
    dynamicType,
    isPage: isPage(segment),
    parentSegment,
  };
};
