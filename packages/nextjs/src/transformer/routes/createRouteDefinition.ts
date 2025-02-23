import { RouteFunctionDefinition } from "../../types";
import { convertPathToParamFormat } from "./createRoutePaths";

export const createRouteDefinition = (
  route: RouteFunctionDefinition,
) => {
  const path =
    route.routeSegments.length === 0
      ? `"/"`
      : `"/${convertPathToParamFormat(route.routeSegments)}/"`;

  return `${path}: {
    params: {} as ${createParamsType(route)},
    // @ts-ignore
    searchParams: {} as ${route.searchParamsType}
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
