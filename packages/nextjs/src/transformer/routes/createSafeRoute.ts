export const createSafeRoute = () => {
  return `
type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined, params: Record<string, never> } ? false : IsAllOptional<T> extends true ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true;

export type SafeRoutes = typeof safeRoutes;

type RouteParameters<T extends SafeRoutePath> = {
  RequiredBoth: [params: SafeRouteParams<T>, searchParams: SafeRouteSearchParams<T>];
  RequiredParamsOptionalSearch: [params: SafeRouteParams<T>, searchParams?: SafeRouteSearchParams<T>];
  ParamsOnly: [params: SafeRouteParams<T>];
  SearchOnly: [searchParams: SafeRouteSearchParams<T>];
  OptionalSearchOnly: [searchParams?: SafeRouteSearchParams<T>];
  None: [];
};

type SafeRouteArgs<T extends SafeRoutePath> =
  HasParams<typeof safeRoutes[T]['params']> extends true
    ? HasSearchParams<typeof safeRoutes[T]> extends true
      ? IsAllOptional<typeof safeRoutes[T]['searchParams']> extends true
        ? RouteParameters<T>['RequiredParamsOptionalSearch']
        : RouteParameters<T>['RequiredBoth']
      : RouteParameters<T>['ParamsOnly']
    : HasSearchParams<typeof safeRoutes[T]> extends true
      ? IsAllOptional<typeof safeRoutes[T]['searchParams']> extends true
        ? RouteParameters<T>['OptionalSearchOnly']
        : RouteParameters<T>['SearchOnly']
      : RouteParameters<T>['None'];

export function safeRoute<T extends SafeRoutePath>(
  path: T,
  ...args: SafeRouteArgs<T>
): T {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? args[0] : {};
  const searchParams = hasDynamicParams ? args[1] : args[0];

  const resolvedPath = path.replace(/\\[(?:\\[)?(?:\\.\\.\\.)?([^\\]]+?)\\](?:\\])?/g, (_, key: string) => {
    const paramKey = key.replace(/[-_]([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof params;
    const value = params?.[paramKey] || "";

    if (Array.isArray(value)) {
      if (value.length === 0) return "";
      return value.join("/");
    }

    const stringValue = String(value || "");
    return stringValue === "" ? "" : stringValue;
  });

  // Remove extra slashes
  const normalizedPath = resolvedPath.replace(/\\/+/g, '/');

  return \`\${normalizedPath}\${buildSearchParams(searchParams as SearchParams)}\` as T;
}`;
};
