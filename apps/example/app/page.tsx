import Link from "next/link";
import { safeRoute } from "../node_modules/@safe-routes/nextjs";

export type SearchParams = {
  page: number;
  hoge: string;
};

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
  safeRoute("/", { page: 1, hoge: "" });
  safeRoute("/users/[user-id]/", { userId: 1 });
  safeRoute("/shop/", { isRequired: true });
  safeRoute("/login/");

  return (
    <div>
      <h1>Route Examples</h1>
      <ul>
        <li>
          <Link href={safeRoute("/blog/[slug]/", { slug: "hello" })}>
            Dynamic Route
          </Link>
        </li>
        <li>
          <Link
            href={safeRoute("/shop/[...categories]/", {
              categories: ["men", "shoes"],
            })}
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
            })}
          >
            Multiple Dynamic Segments
          </Link>
        </li>
      </ul>
    </div>
  );
}
