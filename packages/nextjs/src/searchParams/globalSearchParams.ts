import { z } from "zod";

export class GlobalSearchParamsManager {
  private static instance: GlobalSearchParamsManager;
  private schema: z.ZodObject<z.ZodRawShape> | null = null;
  private initialized = false;
  private constructor() {}

  public static getInstance(): GlobalSearchParamsManager {
    if (!GlobalSearchParamsManager.instance) {
      GlobalSearchParamsManager.instance = new GlobalSearchParamsManager();
    }
    return GlobalSearchParamsManager.instance;
  }

  public setSchema(schema: z.ZodObject<z.ZodRawShape>): void {
    if (this.initialized) {
      return;
    }

    this.schema = schema;
    this.initialized = true;
  }

  public getSchema(): z.ZodObject<z.ZodRawShape> | undefined {
    if (!this.schema) {
      return undefined;
    }
    return this.schema;
  }
}

export const setGlobalSearchParams = (
  schema: z.ZodObject<z.ZodRawShape>,
): void => {
  GlobalSearchParamsManager.getInstance().setSchema(schema);
};

export const getGlobalSearchParams = () => {
  return GlobalSearchParamsManager.getInstance().getSchema();
};
