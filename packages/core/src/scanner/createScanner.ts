import fs from "fs";
import path from "path";
import { createRouteFunction } from "../generator/createRouteFunction";
import { RouteFunctionDefinition } from "../generator/createRouteFunction/createRouteFunction";
import { RouteSegment } from "../types";
import { parseRouteSegment } from "./utils/parseRouteSegment";

export type RouteRule = {
  ignoreRoute: (segment: string) => boolean;
  isDynamicRoute: (segment: string) => boolean;
  isPage: (segment: string) => boolean;
};

export type ScannerOptions = {
  rules: RouteRule;
  baseDir: string;
};

export function createScanner({ rules, baseDir }: ScannerOptions) {
  return function scan({
    currentPath = baseDir,
    parentSegments = [],
    accumulatedRoutes = [],
  }: {
    currentPath?: string;
    parentSegments?: RouteSegment[];
    accumulatedRoutes?: RouteFunctionDefinition[];
  } = {}) {
    const routes: RouteFunctionDefinition[] = accumulatedRoutes;
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const isDirectory = fs.statSync(fullPath).isDirectory();

      if (rules.ignoreRoute(item)) {
        continue;
      }

      if (rules.isPage(item)) {
        const segments = parentSegments.filter(Boolean);
        const routeFunctionDefinition = createRouteFunction({
          fullPath,
          segments,
        });
        routes.push(routeFunctionDefinition);
      } else {
        if (!isDirectory) continue;

        const staticParentPath = getStaticParentPath(parentSegments);

        const segment = parseRouteSegment({
          segment: item,
          parentSegment: staticParentPath,
          rules,
        });

        if (segment) {
          scan({
            currentPath: fullPath,
            parentSegments: [...parentSegments, segment],
            accumulatedRoutes: routes,
          });
        } else {
          scan({
            currentPath,
            parentSegments,
            accumulatedRoutes,
          });
        }
      }
    }
    return routes;
  };
}

const getStaticParentPath = (segments: RouteSegment[]) => {
  const getLastStaticSegment = (segments: RouteSegment[]) => {
    // 動的パラメータの直前までの静的セグメントを取得
    const staticSegments = segments.filter((p) => !p.isDynamic);
    if (staticSegments.length === 0) {
      throw new Error("No static segments found");
    }

    // 最後の静的セグメントを返す
    return staticSegments[staticSegments.length - 1];
  };

  return segments.length > 0
    ? getLastStaticSegment(segments.filter((p) => !p.isDynamic))?.parsed
    : undefined;
};
