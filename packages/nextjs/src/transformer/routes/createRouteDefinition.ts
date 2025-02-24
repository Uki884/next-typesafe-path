import { RouteFunctionDefinition } from "../../types";
import { convertPathToParamFormat } from "./createRoutePaths";

export const createRouteDefinition = (
  route: RouteFunctionDefinition,
) => {
  const path =
    route.routeSegments.length === 0
      ? `"/"`
      : `"/${convertPathToParamFormat(route.routeSegments)}/"`;

  // オプショナルキャッチオールルートの場合、ベースパスも追加
  const hasOptionalCatchAll = route.routeSegments.some(
    (s) => s.dynamicType === "optional-catch-all"
  );

  if (hasOptionalCatchAll) {
    const basePath = `"/${route.routeSegments
      .filter(s => s.dynamicType !== "optional-catch-all")
      .map(s => s.rawParamName)
      .join("/")}/"`;

    return `${basePath}: {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ${route.searchParamsType}
},
${path}: {
  params: {} as ${createParamsType(route, true)},
  // @ts-ignore
  searchParams: {} as ${route.searchParamsType}
}`;
}

  return `${path}: {
  params: {} as ${createParamsType(route)},
  // @ts-ignore
  searchParams: {} as ${route.searchParamsType}
}`;
};

const createParamsType = (route: RouteFunctionDefinition, makeRequired = false) => {
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
          return makeRequired
            ? `${s.paramName}: string[] | number[]`
            : `${s.paramName}?: string[] | number[]`;
        default:
          return `${s.paramName}: string | number`;
      }
    })
    .join(", ");

  return `{ ${params} }`;
};
