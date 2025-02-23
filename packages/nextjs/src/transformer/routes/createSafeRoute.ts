export const createSafeRoute = () => {
  return `
type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
export type SafeRoutes = typeof safeRoutes;

type SafeRouteArgs<T extends SafeRoutePath> =
  // Check if T is a valid route path
  [T] extends [keyof SafeRoutes]
    ? SafeRoutes[T] extends { params: infer P, searchParams: infer S }
      ? P extends Record<string, never>
        // Case 1: No params
        ? S extends Record<string, never>
          // Case 1.1: No params and no search params
          ? []
          // Case 1.2: Only search params
          : IsAllOptional<S> extends true
            ? [] | [searchParams?: S]
            : [searchParams: S]
        // Case 2: Has params
        : S extends Record<string, never>
          // Case 2.1: Only params
          ? IsAllOptional<P> extends true
            ? [] | [params?: P]
            : [params: P]
          // Case 2.2: Both params and search params
          : IsAllOptional<P> extends true
            ? IsAllOptional<S> extends true
              ? [] | [params?: P] | [params?: P, searchParams?: S]
              : [params?: P, searchParams?: S]
            : IsAllOptional<S> extends true
              ? [params: P] | [params: P, searchParams?: S]
              : [params: P, searchParams: S]
      : never
    : never;

export function safeRoute<T extends SafeRoutePath>(
  path: T,
  ...args: SafeRouteArgs<T>
): T {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? args[0] : {};
  const searchParams = hasDynamicParams ? args[1] : args[0];

  const resolvedPath = path.replace(/\\[(?:\\[)?(?:\\.\\.\\.)?([^\\]]+?)\\](?:\\])?/g, (match, key) => {
    const paramKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = params?.[paramKey] || "";
    if (Array.isArray(value)) {
      return value.join("/");
    }
    return String(value || "");
  });
  return \`\${resolvedPath}\${buildSearchParams(searchParams as SearchParams)}\` as T;
}`;
};
