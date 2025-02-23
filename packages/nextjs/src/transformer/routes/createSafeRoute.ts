export const createSafeRoute = () => {
  return `
type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
type HasSearchParams<T> = T extends undefined ? false : IsAllOptional<T> extends true ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true;

type SafeRouteArgs<T extends SafeRoutePath> = HasParams<typeof safeRoutes[T]['params']> extends true
  ? HasSearchParams<typeof safeRoutes[T]['searchParams']> extends true ? [params: SafeRouteParams<T>, searchParams: SafeRouteSearchParams<T>]: [params: SafeRouteParams<T>]
  : HasSearchParams<typeof safeRoutes[T]['searchParams']> extends true ? [searchParams: IsAllOptional<typeof safeRoutes[T]['searchParams']> extends true ? [] : SafeRouteSearchParams<T>] : [];

export function safeRoute<T extends SafeRoutePath>(
  path: T,
  ...searchOrDynamicParams: SafeRouteArgs<T>
): T {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? searchOrDynamicParams[0] : {};
  const searchParams = hasDynamicParams ? searchOrDynamicParams[1] : searchOrDynamicParams[0];

  const resolvedPath = path.replace(/\\[(?:\\[)?(?:\\.\\.\\.)?([^\\]]+?)\\](?:\\])?/g, (_, key: string) => {
    const paramKey = key.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof params;
    const value = params?.[paramKey] || "";
    if (Array.isArray(value)) {
      return value.join("/");
    }
    return String(value || "");
  });
  return \`\${resolvedPath}\${buildSearchParams(searchParams)}\` as T;
}`;
};
