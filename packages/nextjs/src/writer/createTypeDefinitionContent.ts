import { createRouteDefinition } from "../transformer/routes/createRouteDefinition";
import { createRoutePaths } from "../transformer/routes/createRoutePaths";
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

  const content = `// This file is auto-generated from @safe-routes/nextjs
// DO NOT EDIT DIRECTLY

declare module "@@@safe-routes/nextjs" {
  type IsSearchParams<T> = symbol extends keyof T ? false : true;
  type Config = import("${options.outDir}/safe-routes.config").GlobalSearchParams;
  type GlobalSearchParams = IsSearchParams<Config> extends true ? Config : {};
  type ExportedQuery<T> = IsSearchParams<T> extends true
    ? { [K in keyof T]: T[K] } & GlobalSearchParams
    : GlobalSearchParams;
  type SafeRoutePath = ${routePaths}

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
