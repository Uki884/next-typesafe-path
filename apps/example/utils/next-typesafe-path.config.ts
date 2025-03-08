import { createSearchParams, InferSearchParams, setGlobalSearchParams } from "next-typesafe-path";

export const searchParams = createSearchParams((p) => ({
  // Add your global search parameters here
  locale: p.enumOr(["en", "ja"], "ja").optional(),
}));

export type SearchParams = InferSearchParams<typeof searchParams>;

setGlobalSearchParams(searchParams);