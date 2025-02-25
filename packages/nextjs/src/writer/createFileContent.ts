import { transformFunctionExports } from "../transformer/transformFunctionExports";
import { transformFunctionShared } from "../transformer/transformFunctionShared";
import { FileContentOption } from "../types";

export const createFileContent = ({ routes, config }: FileContentOption): string => {
  const shared = transformFunctionShared();
  const exports = transformFunctionExports({ routes, config });

  return `${shared}\n${exports}`;
};
