import { RouteFunctionDefinition } from "../generator/createRouteFunction";
import { transformFunctionExports } from "../transformer/transformFunctionExports";
import { transformFunctionShared } from "../transformer/transformFunctionShared";

export const createFileContent = (
  routes: RouteFunctionDefinition[],
  type: "js" | "dts",
): string => {
  const shared = transformFunctionShared(type);
  const exports = transformFunctionExports(routes, type);

  return `${shared}\n${exports}`;
};
