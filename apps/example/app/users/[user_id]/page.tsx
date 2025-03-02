import {
  InferSearchParams,
  createSearchParams,
  parseSearchParams,
} from "@safe-routes/nextjs";

export const $SearchParams = createSearchParams((q) => ({
  page: q.numberOr(1),
  sort: q.enumOr(["asc", "desc"] as const, "asc"),
}));

export default async function UsersUserIdPage({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: Promise<InferSearchParams<typeof $SearchParams>>;
}) {
  const parsedSearchParams = parseSearchParams(
    $SearchParams,
    await searchParams,
  );
  console.log(parsedSearchParams);
  return <h1>Users UserId Page</h1>;
}
