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
export type RoutePath = ${routePaths};

type RouteParams<T extends RoutePath> = (typeof routes)[T]['params'];
type RouteSearchParams<T extends RoutePath> = (typeof routes)[T]['searchParams'];

${safeRoute}

export declare const routes: {
${routeDefinitions.join(",\n")}
};`;
  }

  return `
export const routes = {
${routeDefinitions.join(",\n")}
};

${safeRoute}`;
};
