import path from "path";
import { readdir, stat } from "fs/promises";
import { RouteFunctionDefinition } from "../generator/createRouteFunction";
import { createRouteFunction } from "../generator/createRouteFunction";
import { RouteSegment } from "../types";
import { parseRouteSegment } from "./utils/parseRouteSegment";
import { withDuplicateParamSuffix } from "./utils/withDuplicateParamSuffix";
import { isIgnoreRoute } from "./utils/isIgnoreRoute";

function getStaticParentPath(segments: RouteSegment[]): string | undefined {
  return segments
    .filter((s) => !s.isDynamic)
    .map((s) => s.rawParamName)
    .join("/");
}

export function createPagesScanner(pagesDir: string) {
  async function scan({
    currentPath = pagesDir,
    parentSegments = [],
  }: {
    currentPath?: string;
    parentSegments?: RouteSegment[];
  } = {}): Promise<RouteFunctionDefinition[]> {
    const items = await readdir(currentPath);
    const routes: RouteFunctionDefinition[] = [];

    for (const item of items) {
      // 特殊ファイルをスキップ
      if (isIgnoreRoute(item)) {
        continue;
      }

      const fullPath = path.join(currentPath, item);
      const stats = await stat(fullPath);

      if (stats.isDirectory()) {
        // ディレクトリの処理
        const segment = parseRouteSegment({
          segment: item,
          parentSegment: getStaticParentPath(parentSegments),
        });

        if (segment) {
          routes.push(
            ...(await scan({
              currentPath: fullPath,
              parentSegments: [...parentSegments, segment],
            })),
          );
        }
      } else {
        // ファイルの処理
        if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          const isIndex = item === "index.tsx" || item === "index.ts";
          const segment = parseRouteSegment({
            segment: item.replace(/\.tsx?$/, ""),
            parentSegment: getStaticParentPath(parentSegments),
          });

          if (!segment) {
            continue;
          }

          if (isIndex || segment) {
            const segments = isIndex
              ? parentSegments
              : [...parentSegments, segment];

            routes.push(
              createRouteFunction({
                fullPath,
                segments: withDuplicateParamSuffix(segments),
              }),
            );
          }
        }
      }
    }

    return routes;
  }

  return scan;
}
