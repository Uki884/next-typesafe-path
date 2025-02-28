import { z } from 'zod'

type ParamBuilder = {
  string: () => z.ZodString
  number: () => z.ZodNumber
  boolean: () => z.ZodBoolean
  parse: {
    number: () => z.ZodNumber
    string: () => z.ZodString
    boolean: () => z.ZodBoolean
  }
  oneOf: <T extends [string, ...string[]]>(
    values: readonly [...T],
    defaultValue?: T[number]
  ) => z.ZodType<T[number]>
  or: <T>(schema: z.ZodType<T>, fallback: T) => z.ZodType<T>
  date: () => z.ZodType<Date>
  object: <T extends z.ZodRawShape>(shape: T) => z.ZodObject<T>
  list: <T>(type: z.ZodType<T>, separator?: string) => z.ZodType<T[]>
  optional: <T>(schema: z.ZodType<T>) => z.ZodOptional<z.ZodType<T>>
  multi: (defaultValue?: string[]) => z.ZodType<string[]>
  search: (defaultValue?: string) => z.ZodType<string>
  custom: <T>(schema: z.ZodType<T>, validator: (value: T) => boolean, errorMessage: string) => z.ZodType<T>
  page: (defaultPage?: number) => z.ZodType<number>
}

export const createSearchParams = <T extends Record<string, z.ZodType>>(
  builder: (p: ParamBuilder) => T
) => {
  const p: ParamBuilder = {
    // 基本的なスキーマビルダー
    string: () => z.string(),
    number: () => z.number(),
    boolean: () => z.boolean(),
    parse: {
      number: () => z.coerce.number(),
      string: () => z.coerce.string(),
      boolean: () => z.coerce.boolean()
    },
    oneOf: <T extends [string, ...string[]]>(
      values: readonly [...T],
      defaultValue?: T[number]
    ) => {
      const schema = z.enum([...values]);
      return defaultValue !== undefined
        ? p.or(schema, defaultValue)
        : schema;
    },
    or: <T>(schema: z.ZodType<T>, fallback: T): z.ZodType<T> => {
      type NoUndefined<T> = T extends undefined ? never : T;
      const defaultSchema = schema.default(fallback as NoUndefined<T>);
      // fallback
      const catchSchema = defaultSchema.catch(fallback as NoUndefined<T>);
      return catchSchema as z.ZodType<T>;
    },
    date: () => {
      return z.preprocess(
        (val) => new Date(String(val)),
        z.date()
      ) as unknown as z.ZodType<Date>;
    },
    object: <T extends z.ZodRawShape>(shape: T) => z.object(shape),
    list: <T>(type: z.ZodType<T>, separator = ',') => {
      return z.preprocess(
        (val) => {
          const str = String(val);
          if (!str) return [];
          return str.split(separator).map(item => type.parse(item.trim()));
        },
        z.array(type)
      ) as unknown as z.ZodType<T[]>;
    },
    optional: <T>(schema: z.ZodType<T>) => z.optional(schema),
    multi: (defaultValue: string[] = []) => {
      const schema = z.array(z.string());
      return p.or(schema, defaultValue)
    },
    search: (defaultValue = "") => {
      const schema = z.preprocess(
        (val) => String(val).trim().toLowerCase(),
        z.string()
      ) as unknown as z.ZodType<string>;
      return defaultValue !== undefined
        ? p.or(schema, defaultValue)
        : schema;
    },
    page: (defaultPage = 1) => {
      return p.or(p.parse.number().int().min(1), defaultPage);
    },
    custom: <T>(schema: z.ZodType<T>, validator: (value: T) => boolean, errorMessage: string) =>
      schema.refine(validator, { message: errorMessage })
  }

  const schema = builder(p)
  return z.object(schema)
}

// パース例
export const parseSearchParams = <T>(
  schema: z.ZodType<T>,
  input: URLSearchParams | Record<string, unknown>
): T => {
  const data = input instanceof URLSearchParams
    ? Object.fromEntries(input)
    : input
  return schema.parse(data)
}

export type InferSearchParams<T extends z.ZodType> = z.infer<T>;