export const createSafeRoute = () => {
  return `
type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;

type SafeRouteArgs<T extends SafeRoutePath> = SafeRouteParams<T> extends Record<string, never>
  ? IsAllOptional<SafeRouteSearchParams<T>> extends true
    ? [searchParams?: SafeRouteSearchParams<T>] | []
    : [searchParams: SafeRouteSearchParams<T>]
  : [params: SafeRouteParams<T>, searchParams?: SafeRouteSearchParams<T>];

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
  return \`\${resolvedPath}\${buildSearchParams(searchParams)}\` as T;
}`;
};
