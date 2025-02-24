
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

export type SafeRoutePath = "/login/" | "/blog/[slug]/[hoge]/" | "/blog/[slug]/" | "/" | "/products/[[...filters]]/" | "/shop/[...categories]/" | "/shop/" | "/users/[user_id]/[year]/[month]/" | "/users/[user_id]/" | "/users/[user_id]/posts/[post-id]/" | "/about/" | "/docs/[...slug]/" | "/video/[[...name]]/" | "/video/[id]/";

export type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
export type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];

type IsAllOptional<T> = { [K in keyof T]?: any } extends T ? true : false;
export type SafeRoutes = typeof safeRoutes;

type SafeRouteArgs<T extends SafeRoutePath> =
  SafeRoutes[T]['params'] extends Record<string, never>
    ? SafeRoutes[T]['searchParams'] extends Record<string, never>
      ? []
      : IsAllOptional<SafeRoutes[T]['searchParams']> extends true
        ? [] | [searchParams?: SafeRoutes[T]['searchParams']]
        : [searchParams: SafeRoutes[T]['searchParams']]
    : IsAllOptional<SafeRoutes[T]['params']> extends true
      ? SafeRoutes[T]['searchParams'] extends Record<string, never>
        ? [] | [params?: SafeRoutes[T]['params']]
        : IsAllOptional<SafeRoutes[T]['searchParams']> extends true
          ? [] | [params?: SafeRoutes[T]['params']] | [params?: SafeRoutes[T]['params'], searchParams?: SafeRoutes[T]['searchParams']]
          : [searchParams: SafeRoutes[T]['searchParams']] | [params?: SafeRoutes[T]['params'], searchParams: SafeRoutes[T]['searchParams']]
      : SafeRoutes[T]['searchParams'] extends Record<string, never>
        ? [params: SafeRoutes[T]['params']]
        : [params: SafeRoutes[T]['params'], searchParams: SafeRoutes[T]['searchParams']];

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

      "/products/": {
        params: {} as Record<string, never>,
        // @ts-ignore
        searchParams: {} as import("../app/products/[[...filters]]/page.tsx").SearchParams
      },
      "/products/[[...filters]]/": {
        params: {} as { filters?: string[] | number[] },
        // @ts-ignore
        searchParams: {} as import("../app/products/[[...filters]]/page.tsx").SearchParams
      }
    ,
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
"/users/[user_id]/[year]/[month]/": {
    params: {} as { user_id: string | number, year: string | number, month: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user_id]/[year]/[month]/page.tsx").SearchParams
  },
"/users/[user_id]/": {
    params: {} as { user_id: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user_id]/page.tsx").SearchParams
  },
"/users/[user_id]/posts/[post-id]/": {
    params: {} as { user_id: string | number, postId: string | number },
    // @ts-ignore
    searchParams: {} as import("../app/users/[user_id]/posts/[post-id]/page.tsx").SearchParams
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

      "/video/": {
        params: {} as Record<string, never>,
        // @ts-ignore
        searchParams: {} as import("../pages/video/[[...name]].tsx").SearchParams
      },
      "/video/[[...name]]/": {
        params: {} as { name?: string[] | number[] },
        // @ts-ignore
        searchParams: {} as import("../pages/video/[[...name]].tsx").SearchParams
      }
    ,
"/video/[id]/": {
    params: {} as { id: string | number },
    // @ts-ignore
    searchParams: {} as import("../pages/video/[id]/index.tsx").SearchParams
  }
} as const;