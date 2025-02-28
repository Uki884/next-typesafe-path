
export type SearchParams = {
  [key: string]: string | number | (string | number)[];
};

const buildSearchParams = (params?: SearchParams): string => {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  const safeDecodeURIComponent = (value: string) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  };

  for (const [key, values] of Object.entries(params)) {
    if (Array.isArray(values)) {
      const uniqueValues = Array.from(new Set([...values]));
      for (const value of uniqueValues) {
        searchParams.append(key, safeDecodeURIComponent(String(value)));
      }
    } else {
      if (values) {
        searchParams.append(key, safeDecodeURIComponent(String(values)));
      }
    }
  }
  return `?${searchParams.toString()}`;
};

export type SafeRoutePath = "/login/" | "/about/" | "/blog/[slug]/" | "/" | "/products/[[...filters]]/" | "/products/" | "/search/" | "/shop/[...categories]/" | "/shop/" | "/users/[id]/" | "/users/[user-id]/" | "/users/[userId]/posts/[postId]/" | "/users/[user_id]/";;

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];
export type SafeRoutes = typeof safeRoutes;

type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined } ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true
type PickSearchParams<T extends SafeRoutePath> = Pick<typeof safeRoutes[T], 'searchParams'>;
type IsSearchParams<T> = symbol extends keyof T ? false : true;
type ExportedQuery<T> = IsSearchParams<T> extends true ? T & import("./types").GlobalSearchParams : import("./types").GlobalSearchParams;

type RouteParameters<T extends SafeRoutePath> = {
  RequiredBoth: [params: SafeRouteParams<T>, searchParams: SafeRouteSearchParams<T>];
  RequiredParamsOptionalSearch: [params: SafeRouteParams<T>, searchParams?: SafeRouteSearchParams<T>];
  ParamsOnly: [params: SafeRouteParams<T>];
  SearchOnly: [searchParams: SafeRouteSearchParams<T>];
  OptionalSearchOnly: [searchParams?: SafeRouteSearchParams<T>];
  None: [];
};

type SafeRouteArgs<T extends SafeRoutePath> =
  HasParams<SafeRouteParams<T>> extends true
    ? HasSearchParams<PickSearchParams<T>> extends true
      ? IsAllOptional<SafeRouteSearchParams<T>> extends true
        ? RouteParameters<T>['RequiredParamsOptionalSearch']
        : RouteParameters<T>['RequiredBoth']
      : RouteParameters<T>['ParamsOnly']
    : HasSearchParams<PickSearchParams<T>> extends true
      ? IsAllOptional<SafeRouteSearchParams<T>> extends true
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

  const resolvedPath = path.replace(/\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g, (_, key: string) => {
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
  const normalizedPath = resolvedPath.replace(/\/+/g, '/');

  return `${normalizedPath}${buildSearchParams(searchParams as SearchParams)}` as T;
}

export const safeRoutes = {
"/login/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/(auth)/login/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/about/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/about/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/blog/[slug]/": {
  params: {} as { slug: string | number },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/blog/[slug]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/products/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/products/[[...filters]]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/products/[[...filters]]/": {
  params: {} as { filters: string[] | number[] },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/products/[[...filters]]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/search/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/search/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/shop/[...categories]/": {
  params: {} as { categories: string[] | number[] },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/shop/[...categories]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/shop/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/shop/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/users/[id]/": {
  params: {} as { id: string | number },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/users/[id]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/users/[user-id]/": {
  params: {} as { userId: string | number },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/users/[user-id]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/users/[userId]/posts/[postId]/": {
  params: {} as { userId: string | number, postId: string | number },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/users/[userId]/posts/[postId]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
},
"/users/[user_id]/": {
  params: {} as { userId: string | number },
  // @ts-ignore
  searchParams: {} as ExportedQuery<import("../../../fixtures/app/users/[user_id]/page.tsx").SearchParams & import("./types").GlobalSearchParams>
}
} as const;