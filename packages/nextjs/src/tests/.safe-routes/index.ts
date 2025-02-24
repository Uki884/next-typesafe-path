
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

  // Override URLSearchParams toString to use %20 instead of + for spaces
  searchParams.toString = function() {
    return Array.from<[string, string]>(this.entries())
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
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

export type SafeRoutePath = "/login/" | "/about/" | "/blog/[slug]/" | "/" | "/products/[[...filters]]/" | "/search/" | "/shop/[...categories]/" | "/shop/" | "/users/[id]/" | "/users/[user-id]/" | "/users/[userId]/posts/[postId]/";

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];

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
"/products/[[...filters]]/": {
    params: {} as { filters?: string[] | number[] },
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