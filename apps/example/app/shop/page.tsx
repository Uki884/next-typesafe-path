export type SearchParams = {
  isRequired: boolean;
  isOptional?: number;
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return <h1>Shop Page</h1>;
}
