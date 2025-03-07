import { z } from "zod";

export type InferSearchParams<T extends z.ZodType> = {
  [K in keyof z.infer<T> as K extends string ? K : never]: z.infer<T>[K]
} & {};
