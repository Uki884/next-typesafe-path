import { createRouteDefinition } from "../transformer/createRouteDefinition";
import { createRoutePaths } from "../transformer/createRoutePaths";
import { FileContentOption } from "../types";

export const createTypeDefinitionContent = ({
  routes,
  options,
}: FileContentOption): string => {
  const routePaths = createRoutePaths({ routes, options });
  const routeDefinitions: { path: string; definition: string }[] = [];
  for (const route of routes) {
    const result = createRouteDefinition({ route, options });
    if (Array.isArray(result)) {
      routeDefinitions.push(...result);
    } else if (result) {
      routeDefinitions.push(result);
    }
  }

  const content = `// This file is auto-generated from next-typesafe-path
// DO NOT EDIT DIRECTLY

declare module "@@@next-typesafe-path" {
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  type SearchParamsConfig = import("${options.configDir}/next-typesafe-path.config").SearchParams;
  type SearchParams = IsSearchParams<SearchParamsConfig> extends true ? SearchParamsConfig : { [key: string]: never };
  type ExportedQuery<T> = IsSearchParams<T> extends true
    ? { [K in keyof T]: T[K] } | SearchParams
    : SearchParams;
  type RoutePath = ${routePaths}

  interface RouteList {
${routeDefinitions
        .map(({ path, definition }) => {
          return `    "${path}": ${definition}`;
        })
        .join(",\n")}
  }
}
`;

  return content;
};
