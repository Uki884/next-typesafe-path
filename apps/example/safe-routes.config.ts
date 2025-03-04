import {
  InferSearchParams,
  createSearchParams,
  setGlobalSearchParams,
} from "@safe-routes/nextjs";

export const globalSearchParams = createSearchParams((p) => ({
  // Add your global search parameters here
})).passthrough();

export type GlobalSearchParams = InferSearchParams<typeof globalSearchParams>;

setGlobalSearchParams(globalSearchParams);
