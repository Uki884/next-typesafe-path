export type SearchParams = {
  page: number;
  sort?: "asc" | "desc";
};

export default function UsersUserIdYearMonthPage({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: SearchParams;
}) {
  return <h1>Users UserId Year Month Page</h1>;
}
