import { RouteFunctionDefinition } from "../../generator/createRouteFunction";
import { convertPathToParamFormat } from "./createRoutePaths";

export const createRouteDefinition = (
  route: RouteFunctionDefinition,
  type: "js" | "dts",
) => {
  const path =
    route.routeSegments.length === 0
      ? `"/"`
      : `"/${convertPathToParamFormat(route.routeSegments)}/"`;

  if (type === "dts") {
    return `${path}: {
      params: ${createParamsType(route)},
      searchParams: ${route.searchParamsType}
    }`;
  }

  return `${path}: {
    params: {},
    searchParams: {}
  }`;
};

const createParamsType = (route: RouteFunctionDefinition) => {
  if (!route.routeSegments.some((s) => s.isDynamic)) {
    return "Record<string, never>";
  }

  const params = route.routeSegments
    .filter((s) => s.isDynamic)
    .map((s) => {
      switch (s.dynamicType) {
        case "catch-all":
          return `${s.paramName}: string[] | number[]`;
        case "optional-catch-all":
          return `${s.paramName}?: string[] | number[]`;
        default:
          return `${s.paramName}: string | number`;
      }
    })
    .join(", ");

  return `{ ${params} }`;
};
