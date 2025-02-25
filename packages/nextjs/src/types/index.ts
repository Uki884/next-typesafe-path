import { RouteFunctionDefinition } from "./route";

export type { DynamicRouteType, RouteFunctionDefinition, RouteSegment } from "./route";

export type FileContentOption = {
  routes: RouteFunctionDefinition[];
  config: UserConfig;
};

export type UserConfig = {
  trailingSlash: boolean;
  outDir?: string;
  watch?: boolean;
};
