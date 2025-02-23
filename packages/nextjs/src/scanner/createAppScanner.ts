import path from "path";
import { readdir } from "fs/promises";
import { RouteFunctionDefinition, RouteSegment } from "../types";
import { isIgnoreRoute } from "./utils/isIgnoreRoute";
import { isPage } from "./utils/isPage";
import { isRouteGroup } from "./utils/isRouteGroup";
import { parseRouteSegment } from "./utils/parseRouteSegment";
import { withDuplicateParamSuffix } from "./utils/withDuplicateParamSuffix";
import { generateSearchParamsType } from "../generator/generateSearchParamsType";

function getStaticParentPath(segments: RouteSegment[]): string | undefined {
  return segments
    .filter((s) => !s.isDynamic)
    .map((s) => s.rawParamName)
    .join("/");
}

export function createAppScanner({ inputDir, outDir }: { inputDir: string, outDir: string }) {
  return async function scan({
    currentPath = inputDir,
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

      if (isIgnoreRoute(item)) {
        continue;
      }

      if (isPage(item)) {
        const segments = parentSegments.filter(Boolean);
        const searchParamsType = generateSearchParamsType(fullPath, outDir);
        routes.push({
          routeSegments: withDuplicateParamSuffix(segments),
          searchParamsType,
        });
      } else {
        // handle route group
        if (isRouteGroup(item)) {
          routes.push(
            ...(await scan({
              currentPath: fullPath,
              parentSegments: [],
              accumulatedRoutes,
            })),
          );
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
  };
}
