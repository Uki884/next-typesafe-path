import { RouteSegment } from "../../types";
import { isKebabCase, toCamelCase } from "../../utils";
import { isDynamicRoute } from "./isDynamicRoute";
import { isPage } from "./isPage";
import { isRouteGroup } from "./isRouteGroup";

const getParamName = (segment: string) => {
  const dynamicType = isDynamicRoute(segment);
  let paramName = segment;
  switch (dynamicType) {
    case "catch-all":
      paramName = segment.replace(/\[\.\.\.(.+)\]/, "$1");
      break;
    case "optional-catch-all":
      paramName = segment.replace(/\[\[\.\.\.(.+)\]\]/, "$1");
      break;
    case "dynamic":
      paramName = segment.replace(/\[(.+)\]/, "$1");
      break;
  }
  return paramName;
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
  let paramName = dynamicType ? getParamName(segment) : segment;

  // convert kebab-case to camelCase
  paramName = isKebabCase(paramName) ? toCamelCase(paramName) : paramName;

  return {
    rawParamName: segment,
    paramName,
    isDynamic: true,
    dynamicType,
    isPage: isPage(segment),
    parentSegment,
  };
};
