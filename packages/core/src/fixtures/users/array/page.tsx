type SearchParams = {
  "categoryIds[]": string[];
  "serviceIds[]": number[];
};

type Props = {
  searchParams: Promise<SearchParams>;
};

export const users = (params: Props) => {};
