import Link from "next/link";
import { safeRoute } from "@safe-routes/nextjs";

export default function HomePage() {
  const userId = safeRoute(
    "/users/[user-id]/",
    { userId: 1 },
    { page: 1, sort: "desc" },
  );
  safeRoute(
    "/products/[[...filters]]/",
    { filters: ["men", "shoes"] },
    { sort: "asc", page: 1 },
  );
  safeRoute("/");
  safeRoute("/users/[user-id]/", { userId: 1 }, { page: 1});
  safeRoute("/shop/", { isRequired: true });
  safeRoute('/login/', { redirect: "https://google.com" });

  return (
    <div>
      <h1>Route Examples</h1>
      <ul>
        <li>
          <Link href={safeRoute("/blog/[slug]/", { slug: "hello" }, { page: 1})}>
            Dynamic Route
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute("/shop/[...categories]/", { categories: ["men", "shoes"] }, { page: 1 })}
          >
            Catch-all Route
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute(
              "/products/[[...filters]]/",
              {},
              { sort: "asc", page: 1 },
            )}
          >
            Optional Catch-all
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute("/users/[user-id]/posts/[post-id]/", {
              userId: "123",
              postId: "11",
            }, { page: 1})}
          >
            Multiple Dynamic Segments
          </Link>
        </li>
      </ul>
    </div>
  );
}
