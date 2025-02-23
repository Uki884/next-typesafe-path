import { transformFunctionExports } from "../transformer/transformFunctionExports";
import { transformFunctionShared } from "../transformer/transformFunctionShared";
import { RouteFunctionDefinition } from "../types";

export const createFileContent = (
  routes: RouteFunctionDefinition[],
  type: "js" | "dts",
): string => {
  const shared = transformFunctionShared(type);
  const exports = transformFunctionExports(routes, type);

  return `${shared}\n${exports}`;
};
