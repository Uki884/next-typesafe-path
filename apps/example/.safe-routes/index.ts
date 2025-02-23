
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

type SafeRouteParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['params'];
type SafeRouteSearchParams<T extends SafeRoutePath> = (typeof safeRoutes)[T]['searchParams'];


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

  const resolvedPath = path.replace(/\[(?:\[)?(?:\.\.\.)?([^\]]+?)\](?:\])?/g, (_, key: string) => {
    const paramKey = key.replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase()) as keyof typeof params;
    const value = params?.[paramKey] || "";
    if (Array.isArray(value)) {
      return value.join("/");
    }
    return String(value || "");
  });
  return `${resolvedPath}${buildSearchParams(searchParams)}` as T;
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