
type SearchParams = {
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
}

export type SafeRoutePath = "/login/" | "/blog/[slug]/[hoge]/" | "/blog/[slug]/" | "/" | "/products/[[...filters]]/" | "/shop/[...categories]/" | "/shop/" | "/users/[user-id]/[year]/[month]/" | "/users/[user-id]/" | "/users/[user-id]/posts/[post-id]/" | "/about/" | "/docs/[...slug]/" | "/video/[[...name]]/" | "/video/[id]/";

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

  const resolvedPath = path.replace(/\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g, (match, key) => {
    const paramKey = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const value = params?.[paramKey] || "";
    if (Array.isArray(value)) {
      return value.join("/");
    }
    return String(value || "");
  });
  return `${resolvedPath}${buildSearchParams(searchParams as SearchParams)}` as T;
}

export const safeRoutes = {
"/login/": {
    params: {} as Record<string, never>,
    // @ts-ignore
    searchParams: {} as import("../app/(auth)/login/page.tsx").SearchParams
  },
"/blog/[slug]/[hoge]/": {
    params: {} as { slug: string | number, hoge: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/blog/[slug]/[hoge]/page.tsx").SearchParams
  },
"/blog/[slug]/": {
    params: {} as { slug: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/blog/[slug]/page.tsx").SearchParams
  },
"/": {
    params: {} as Record<string, never>,
    // @ts-ignore
    searchParams: {} as import("../app/page.tsx").SearchParams
  },
"/products/[[...filters]]/": {
    params: {} as { filters?: string[] | number[] },
    // @ts-ignore
    searchParams: {} as import("../app/products/[[...filters]]/page.tsx").SearchParams
  },
"/shop/[...categories]/": {
    params: {} as { categories: string[] | number[] },
    // @ts-ignore
    searchParams: {} as import("../app/shop/[...categories]/page.tsx").SearchParams
  },
"/shop/": {
    params: {} as Record<string, never>,
    // @ts-ignore
    searchParams: {} as import("../app/shop/page.tsx").SearchParams
  },
"/users/[user-id]/[year]/[month]/": {
    params: {} as { userId: string | number, year: string | number, month: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user-id]/[year]/[month]/page.tsx").SearchParams
  },
"/users/[user-id]/": {
    params: {} as { userId: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user-id]/page.tsx").SearchParams
  },
"/users/[user-id]/posts/[post-id]/": {
    params: {} as { userId: string | number, postId: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user-id]/posts/[post-id]/page.tsx").SearchParams
  },
"/about/": {
    params: {} as Record<string, never>,
    // @ts-ignore
    searchParams: {} as import("../pages/about.tsx").SearchParams
  },
"/docs/[...slug]/": {
    params: {} as { slug: string[] | number[] },
    // @ts-ignore
    searchParams: {} as import("../pages/docs/[...slug].tsx").SearchParams
  },
"/video/[[...name]]/": {
    params: {} as { name?: string[] | number[] },
    // @ts-ignore
    searchParams: {} as import("../pages/video/[[...name]].tsx").SearchParams
  },
"/video/[id]/": {
    params: {} as { id: string | number },
    // @ts-ignore
    searchParams: {} as import("../pages/video/[id]/index.tsx").SearchParams
  }
} as const;