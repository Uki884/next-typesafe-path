import { RouteSegment } from "../../types";
import { generateFunctionName } from "../utils/generateFunctionName";
import { generateSearchParamsType } from "../utils/generateSearchParamsType";
import { generateUrlString } from "../utils/generateUrlString";

export type RouteFunctionDefinition = {
  functionName: string;
  urlPath: string;
  routeSegments: RouteSegment[];
  searchParamsType: Record<string, string>;
};

export const createRouteFunction = ({
  fullPath,
  segments,
}: {
  fullPath: string;
  segments: RouteSegment[];
}): RouteFunctionDefinition => {
  const searchParamsType = generateSearchParamsType(fullPath);

  if (!segments.length) {
    return {
      functionName: "root",
      urlPath: "/",
      routeSegments: segments,
      searchParamsType,
    };
  }

  const functionName = generateFunctionName(segments);
  const urlString = generateUrlString(segments);

  return {
    functionName,
    urlPath: `/${urlString}/`,
    routeSegments: segments,
    searchParamsType,
  };
};
