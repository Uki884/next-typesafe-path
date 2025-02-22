export const createSafeRoute = (type: "js" | "dts") => {
  if (type === "dts") {
    return `
type IsAllOptional<T> = { [K in keyof T]?: unknown } extends T ? true : false;

type SafeRouteArgs<T extends RoutePath> = RouteParams<T> extends Record<string, never>
  ? IsAllOptional<RouteSearchParams<T>> extends true
    ? [searchParams?: RouteSearchParams<T>]
    : [searchParams: RouteSearchParams<T>]
  : [params: RouteParams<T>, searchParams?: RouteSearchParams<T>];

export declare function safeRoute<T extends RoutePath>(
  path: T,
  ...searchParams: SafeRouteArgs<T>
): T;`;
  }

  return `
export function safeRoute(path, paramsOrSearchParams, maybeSearchParams) {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? paramsOrSearchParams : {};
  const searchParams = hasDynamicParams ? maybeSearchParams : paramsOrSearchParams;

  const resolvedPath = path.replace(/\\[(?:\\[)?(?:\\.\\.\\.)?([^\\]]+?)\\](?:\\])?/g, (match, key) => {
    const paramKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = params?.[paramKey] || "";
    if (Array.isArray(value)) {
      return value.join("/");
    }
    return String(value || "");
  });
  return \`\${resolvedPath}\${buildSearchParams(searchParams)}\`;
}`;
};
