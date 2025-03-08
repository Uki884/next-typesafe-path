# next-typesafe-path

A library for type-safe routing in Next.js.

## Features

- Type-safe routing for Next.js
- Support for dynamic routes (`[id]`), catch-all routes (`[...slug]`), and optional catch-all routes (`[[...slug]]`)
- Type-safe handling of search parameters (query parameters)
- Define globally available search parameters
- Compatible with both App Router and Pages Router

## Acknowledgments

This project is inspired by:
- [safe-routes](https://github.com/yesmeck/safe-routes) - Type-safe routing for React Router apps


## Installation

```bash
npm install next-typesafe-path --save-dev
# or
yarn add next-typesafe-path --dev
# or
pnpm add next-typesafe-path --save-dev
# or
npx next-typesafe-path
```

## Usage

### 1. Generate Type Definitions

Run the following command to generate type definitions:

```bash
npx next-typesafe-path
```

This command generates a `_next-typesafe-path.d.ts` file in the root of your project.

#### Options

- `--config-dir`: Specify the configuration file directory (default: project root)
- `--trailing-slash`: Add trailing slashes to URLs (default: `false`)
- `--watch`: Watch for file changes and regenerate type definitions automatically

### 2. Set Up Global Search Parameters (Optional)

Create a `next-typesafe-path.config.ts` file in the root of your project to define globally available search parameters:

```typescript
// next-typesafe-path.config.ts
import { createSearchParams, InferSearchParams, setGlobalSearchParams } from "next-typesafe-path";

export const searchParams = createSearchParams((p) => ({
  // Define your global search parameters here
  locale: p.enumOr(["en", "ja"], "ja").optional(),
}));

export type SearchParams = InferSearchParams<typeof searchParams>;

// Set global configuration
setGlobalSearchParams(searchParams);
```

Next, import this configuration file in your `layout.tsx` (for App Router) or `_app.tsx` (for Pages Router):

```typescript
// app/layout.tsx (App Router)
import "../next-typesafe-path.config";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

```typescript
// pages/_app.tsx (Pages Router)
import "../next-typesafe-path.config";
import type { AppProps } from "next/app";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### 3. Use Routing

#### Generate Paths

Use the `$path` function to generate type-safe paths:

```typescript
import { $path } from "next-typesafe-path";

// Regular path
const path1 = $path("/about");

// Dynamic route
const path2 = $path("/users/[id]", { id: "123" });

// Path with search parameters
const path3 = $path("/blog", { page: 1, sort: "desc" });

// Dynamic route + search parameters
const path4 = $path("/users/[id]", { id: "123" }, { tab: "profile" });

// Catch-all route
const path5 = $path("/shop/[...categories]", { categories: ["men", "shoes"] });

// Optional catch-all route
const path6 = $path("/products/[[...filters]]", { filters: ["sort", "price"] });

// Optional catch-all route without path param
const path7 = $path("/products/");
```

#### Define and Use Search Parameters

Define search parameters in your page component and use them in a type-safe way:

```tsx
// app/blog/page.tsx (App Router)
import { createSearchParams, InferSearchParams, parseSearchParams } from "next-typesafe-path";

// Define search parameters
const SearchParams = createSearchParams((p) => ({
  page: p.numberOr(1),
  sort: p.enumOr(["asc", "desc"] as const, "asc"),
  q: p.stringOr(""),
}));

// Extract type
export type SearchParams = InferSearchParams<typeof SearchParams>;

// Page component
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Parse search parameters
  const params = parseSearchParams(SearchParams, await searchParams);

  return (
    <div>
      <h1>Blog</h1>
      <p>Page: {params.page}</p>
      <p>Sort: {params.sort}</p>
      <p>Query: {params.q}</p>
      {/* Access global search parameters */}
      <p>Locale: {params.locale}</p>
    </div>
  );
}
```

```tsx
// pages/blog.tsx (Pages Router)
import { createSearchParams, InferSearchParams, parseSearchParams } from "next-typesafe-path";
import { GetServerSideProps } from "next";

// Define search parameters
const SearchParams = createSearchParams((p) => ({
  page: p.numberOr(1),
  sort: p.enumOr(["asc", "desc"] as const, "asc"),
  q: p.stringOr(""),
}));

// Extract type
export type SearchParams = InferSearchParams<typeof SearchParams>;

// Page component
export default function BlogPage({ params }: { params: SearchParams }) {
  return (
    <div>
      <h1>Blog</h1>
      <p>Page: {params.page}</p>
      <p>Sort: {params.sort}</p>
      <p>Query: {params.q}</p>
      {/* Access global search parameters */}
      <p>Locale: {params.locale}</p>
    </div>
  );
}

// Parse search parameters on the server side
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const params = parseSearchParams(SearchParams, query);
  return { props: { params } };
};
```

## Advanced Usage

### Customize Parameter Builder

Use the `createSearchParams` function to create your own parameter builder:

```typescript
import { createSearchParams, InferSearchParams } from "next-typesafe-path";

// Custom parameter builder
const SearchParams = createSearchParams((p) => ({
  // Required parameter
  id: p.string(),
  // Parameter with default value
  page: p.numberOr(1),
  // Enum parameter
  sort: p.enumOr(["asc", "desc"] as const, "asc"),
  // Optional parameter
  q: p.string().optional(),
  // Array parameter
  tags: p.array(p.string()).optional(),
}));

// or

const SearchParams = createSearchParams(() => ({
  id: z.string(),
  page: z.number(),
}));

// Extract type
export type SearchParams = InferSearchParams<typeof SearchParams>;
```

## License

MIT
