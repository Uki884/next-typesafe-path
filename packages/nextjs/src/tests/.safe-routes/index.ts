
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

export type SafeRoutePath = "/login/" | "/about/" | "/blog/[slug]/" | "/" | "/products/[[...filters]]/" | "/products/" | "/search/" | "/shop/[...categories]/" | "/shop/" | "/users/[id]/" | "/users/[user-id]/" | "/users/[userId]/posts/[postId]/";;

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];

type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
type HasSearchParams<T> = T extends { searchParams: undefined, params: Record<string, never> } ? false : IsAllOptional<T> extends true ? false : true;
type HasParams<T> = T extends Record<string, never> ? false : true;

export type SafeRoutes = typeof safeRoutes;

type SafeRouteArgs<T extends SafeRoutePath> = HasParams<typeof safeRoutes[T]['params']> extends true
  ? HasSearchParams<typeof safeRoutes[T]> extends true
    ? IsAllOptional<typeof safeRoutes[T]['searchParams']> extends true
      ? [params: SafeRouteParams<T>, searchParams?: SafeRouteSearchParams<T>]
        : [params: SafeRouteParams<T>, searchParams: SafeRouteSearchParams<T>]
        : [params: SafeRouteParams<T>]
  : HasSearchParams<typeof safeRoutes[T]> extends true
    ? IsAllOptional<typeof safeRoutes[T]['searchParams']> extends true
      ? [searchParams?: SafeRouteSearchParams<T>]
      : [searchParams: SafeRouteSearchParams<T>]
    : [];

export function safeRoute<T extends SafeRoutePath>(
  path: T,
  ...args: SafeRouteArgs<T>
): T {
  const hasDynamicParams = path.includes('[');
  const params = hasDynamicParams ? args[0] : {};
  const searchParams = hasDynamicParams ? args[1] : args[0];

  const resolvedPath = path.replace(/\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g, (_, key: string) => {
    const paramKey = key.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof params;
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
  searchParams: {} as import("../../fixtures/app/(auth)/login/page.tsx").SearchParams
},
"/about/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/about/page.tsx").SearchParams
},
"/blog/[slug]/": {
  params: {} as { slug: string | number },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/blog/[slug]/page.tsx").SearchParams
},
"/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/page.tsx").SearchParams
},
"/products/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/products/[[...filters]]/page.tsx").SearchParams
},
"/products/[[...filters]]/": {
  params: {} as { filters: string[] | number[] },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/products/[[...filters]]/page.tsx").SearchParams
},
"/search/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/search/page.tsx").SearchParams
},
"/shop/[...categories]/": {
  params: {} as { categories: string[] | number[] },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/shop/[...categories]/page.tsx").SearchParams
},
"/shop/": {
  params: {} as Record<string, never>,
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/shop/page.tsx").SearchParams
},
"/users/[id]/": {
  params: {} as { id: string | number },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/users/[id]/page.tsx").SearchParams
},
"/users/[user-id]/": {
  params: {} as { userId: string | number },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/users/[user-id]/page.tsx").SearchParams
},
"/users/[userId]/posts/[postId]/": {
  params: {} as { userId: string | number, postId: string | number },
  // @ts-ignore
  searchParams: {} as import("../../fixtures/app/users/[userId]/posts/[postId]/page.tsx").SearchParams
}
} as const;