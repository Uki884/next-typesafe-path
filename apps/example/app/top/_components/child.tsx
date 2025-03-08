import { $path } from "../../../../../packages/next-typesafe-path";

export const Child = () => {
  $path("/login", { redirect: "/" }); // /login?redirect=/
  return <div>Child</div>;
};
