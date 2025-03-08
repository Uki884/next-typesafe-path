import { $path } from "../../../packages/next-typesafe-path";

export type SearchParams = {
  locale: "en";
};

export default function AboutPage() {
  console.log($path("/about", { locale: "en" }));
  return <h1>About Page</h1>;
}
