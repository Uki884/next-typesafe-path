import { RouteFunctionDefinition } from "../types";
import { createRouteDefinition } from "./routes/createRouteDefinition";
import { createRoutePaths } from "./routes/createRoutePaths";
import { createSafeRoute } from "./routes/createSafeRoute";

export const transformFunctionExports = (routes: RouteFunctionDefinition[]) => {
  const routePaths = createRoutePaths(routes);
  const routeDefinitions = routes.map((route) => createRouteDefinition(route));
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
