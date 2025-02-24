export type SearchParams = {
  page: number;
  sort?: "asc" | "desc";
};

export default function UsersUserIdPage({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: SearchParams;
}) {
  return <h1>Users UserId Page</h1>;
}
