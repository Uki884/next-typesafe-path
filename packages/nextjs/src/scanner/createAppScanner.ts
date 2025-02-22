import path from "path";
import { readdir, stat } from "fs/promises";
import { RouteFunctionDefinition } from "../generator/createRouteFunction";
import { createRouteFunction } from "../generator/createRouteFunction";
import { RouteSegment } from "../types";
import { isPage } from "./utils/isPage";
import { isRouteGroup } from "./utils/isRouteGroup";
import { parseRouteSegment } from "./utils/parseRouteSegment";
import { withDuplicateParamSuffix } from "./utils/withDuplicateParamSuffix";
import { isIgnoreRoute } from "./utils/isIgnoreRoute";

function getStaticParentPath(segments: RouteSegment[]): string | undefined {
  return segments
    .filter((s) => !s.isDynamic)
    .map((s) => s.rawParamName)
    .join("/");
}

export function createAppScanner(appDir: string) {
  return async function scan({
    currentPath = appDir,
    parentSegments = [],
    accumulatedRoutes = [],
  }: {
    currentPath?: string;
    parentSegments?: RouteSegment[];
    accumulatedRoutes?: RouteFunctionDefinition[];
  } = {}): Promise<RouteFunctionDefinition[]> {
    const items = await readdir(currentPath);

    const routes = [];
    for (const item of items) {
      const fullPath = path.join(currentPath, item);

      // ルートグループの処理
      if (isRouteGroup(item)) {
        const stats = await stat(fullPath);
        if (stats.isDirectory()) {
          // ルートグループ内を再帰的に探索
          routes.push(
            ...(await scan({
              currentPath: fullPath,
              parentSegments,
              accumulatedRoutes: [],
            })),
          );
        }
        continue;
      }

      if (isPage(item)) {
        const segments = parentSegments.filter(Boolean);
        const routeFunctionDefinition = createRouteFunction({
          fullPath,
          segments: withDuplicateParamSuffix(segments),
        });
        routes.push(routeFunctionDefinition);
      } else {
        if (isIgnoreRoute(item)) {
          continue;
        }

        const staticParentPath = getStaticParentPath(parentSegments);
        const segment = parseRouteSegment({
          segment: item,
          parentSegment: staticParentPath,
        });

        if (!segment) {
          continue;
        }

        routes.push(
          ...(await scan({
            currentPath: fullPath,
            parentSegments: [...parentSegments, segment],
            accumulatedRoutes,
          })),
        );
      }
    }
    return routes;
  }
}
