import { $path } from "@safe-routes/nextjs";

export const Child = () => {
  $path("/login");
  return <div>Child</div>;
};
