export type SearchParams = {
  page: number;
};

export default function UsersUserIdPostsPostIdPage({
  params,
  searchParams,
}: {
  params: {
    userId: string;
  };
  searchParams: SearchParams;
}) {
  return <h1>Users UserId Posts PostId Page</h1>;
}
