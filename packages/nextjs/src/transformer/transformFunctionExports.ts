import { RouteFunctionDefinition } from "../types";
import { createRouteDefinition } from "./routes/createRouteDefinition";
import { createRoutePaths } from "./routes/createRoutePaths";
import { createSafeRoute } from "./routes/createSafeRoute";

export const transformFunctionExports = (
  routes: RouteFunctionDefinition[],
  type: "js" | "dts" = "js",
) => {
  const routePaths = createRoutePaths(routes);
  const routeDefinitions = routes.map((route) =>
    createRouteDefinition(route, type),
  );
  const safeRoute = createSafeRoute(type);

  if (type === "dts") {
    return `
export type SafeRoutePath = ${routePaths};

type SafeRouteParams<T extends SafeRoutePath> = (typeof routes)[T]['params'];
type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof routes)[T]['searchParams'];

${safeRoute}

export declare const safeRoutes: {
${routeDefinitions.join(",\n")}
};`;
  }

  return `
export const safeRoutes = {
${routeDefinitions.join(",\n")}
};

${safeRoute}`;
};
