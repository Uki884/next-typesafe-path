import { transformFunctionExports } from "../transformer/transformFunctionExports";
import { transformFunctionShared } from "../transformer/transformFunctionShared";
import { RouteFunctionDefinition } from "../types";

export const createFileContent = (routes: RouteFunctionDefinition[]): string => {
  const shared = transformFunctionShared();
  const exports = transformFunctionExports(routes);

  return `${shared}\n${exports}`;
};
