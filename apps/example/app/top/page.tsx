import {
  safeRoute,
  createSearchParams,
  parseSearchParams,
  InferSearchParams,
} from "@safe-routes/nextjs";
import Link from "next/link";

export const schema = createSearchParams(({ page, oneOf, search }) => ({
  page: page(),
  sort: oneOf(["asc", "desc"] as const, 'asc'),
  q: search(''),
  via: oneOf(["hoge", "fuga"] as const, 'hoge'),
}));

export type SearchParams = InferSearchParams<typeof schema>;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = parseSearchParams(schema, await searchParams);
  console.log('params', params);

  const userId = safeRoute(
    "/users/[user_id]",
    { userId: 1 },
    { page: 1, sort: "desc" },
  );
  safeRoute(
    "/products/[[...filters]]",
    { filters: ["sort", "page"] },
    { sort: "asc", page: 1 },
  );
  safeRoute("/products", { sort: "asc", page: 1 });
  // safeRoute("/", { page: 1 });
  safeRoute("/shop", { isRequired: true, isOptional: 1 });
  safeRoute("/login", { redirect: "https://example.com" });

  return (
    <div>
      <h1>Route Examples</h1>
      {JSON.stringify(params)}
      <ul>
        <li>
          <Link
            href={safeRoute("/blog/[slug]", { slug: "hello" }, { page: 1 })}
          >
            Dynamic Route
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute(
              "/shop/[...categories]",
              { categories: ["men", "shoes"] },
              { page: 1 },
            )}
          >
            Catch-all Route
          </Link>
        </li>
        <li>
          <Link href={safeRoute("/products", { sort: "asc", page: 1 })}>
            Optional Catch-all
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute(
              "/users/[user_id]/posts/[post-id]",
              { userId: "123", postId: "11" },
              { page: 1 },
            )}
          >
            Multiple Dynamic Segments
          </Link>
        </li>
      </ul>
    </div>
  );
}
