import { createSearchParams, InferSearchParams, setGlobalSearchParams } from "@safe-routes/nextjs";

export const globalSearchParams = createSearchParams((p) => ({
  // Add your global search parameters here
  locale: p.enumOr(["en", "ja"], "ja").optional(),
}));

export type SearchParams = InferSearchParams<typeof globalSearchParams>;

setGlobalSearchParams(globalSearchParams);