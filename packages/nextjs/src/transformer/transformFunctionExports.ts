import { FileContentOption } from "../types";
import { createRouteDefinition } from "./routes/createRouteDefinition";
import { createRoutePaths } from "./routes/createRoutePaths";
import { createSafeRoute } from "./routes/createSafeRoute";

export const transformFunctionExports = (options: FileContentOption) => {
  const routePaths = createRoutePaths(options);
  const routeDefinitions = options.routes.map((route) => createRouteDefinition({ route, config: options.config }));
  const safeRoute = createSafeRoute();

  return `
export type SafeRoutePath = ${routePaths};

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];
${safeRoute}

export const safeRoutes = {
${routeDefinitions.join(",\n")}
} as const;`;
};
