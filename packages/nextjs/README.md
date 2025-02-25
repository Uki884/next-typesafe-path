# @safe-routes/nextjs

Zero-dependency type-safe routing utilities that work seamlessly with Next.js App Router and Pages Router.

## Features

- Full TypeScript support
- Zero runtime dependencies
- App Router support
  - Dynamic routes ([id])
  - Catch-all routes ([...slug])
  - Optional catch-all routes ([[...name]])
  - SearchParams type inference
- Pages Router support
  - Dynamic routes
  - Catch-all routes
  - Index routes
  - Nested routes
  - SearchParams type inference

## Acknowledgments

This project is inspired by:
- [safe-routes](https://github.com/yesmeck/safe-routes) - Type-safe routing for React Router apps

## Installation

```bash
npm install @safe-routes/nextjs --save-dev
# or
yarn add @safe-routes/nextjs --dev
# or
pnpm add @safe-routes/nextjs --dev
# or
npx @safe-routes/nextjs --no-trailing-slash
```

## Setup

The CLI will generate type definitions in the `.safe-routes` directory at the root of your project.

Add the CLI to your package.json scripts:

```json
{
  "scripts": {
    "dev": "npm run dev:routes & npm run dev:next",
    "dev:routes": "safe-routes --watch",
    "dev:next": "next dev",
    "build": "safe-routes && next build"
  }
}
```

You can customize the output directory using the `--out-dir` option:

1. Update your package.json scripts:

```json
{
  "scripts": {
    "dev:routes": "safe-routes --watch --out-dir ./custom/path"
  }
}
```

2. Update your tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@safe-routes/nextjs": ["./custom/path"]
    }
  }
}
```

## CLI Options

```bash
Usage: safe-routes [options]

Options:
  -w, --watch            Watch for file changes and regenerate types
  -o, --out-dir <path>  Output directory (default: .safe-routes)
  -h, --help           Display help for command
```

### Examples

```bash
# Watch mode with custom output directory
safe-routes --watch --out-dir ./types
```

## Usage

The `safeRoute` function provides type-safe routing with the following signature:

```typescript
import { safeRoute } from '@safe-routes/nextjs';

// For dynamic routes
safeRoute(path, params, searchParams?)

// For static routes
safeRoute(path, searchParams?)
```

### Search Parameters Behavior

The `searchParams` argument becomes optional when:
- The `SearchParams` type is not defined in the page component
- All properties in `SearchParams` are optional

```typescript
// Case 1: All optional properties - searchParams is optional
export type SearchParams = {
  lang?: string;
  page?: number;
};
safeRoute('/about/');  // OK
safeRoute('/about/', { lang: 'en' });  // OK

// Case 2: Has required properties - searchParams is required
export type SearchParams = {
  lang: string;    // required
  page?: number;   // optional
};
safeRoute('/about/');  // Error: searchParams is required
safeRoute('/about/', { lang: 'en' });  // OK

// Case 3: No SearchParams type - searchParams is optional
safeRoute('/about/');  // OK
```

### Examples

1. Static Routes (no parameters):

```typescript
// Simple route
safeRoute('/about/');  // => /about/

// With search params
export type SearchParams = {
  lang?: 'en' | 'ja';
};
safeRoute('/about/', { lang: 'en' });  // => /about/?lang=en
```

2. Dynamic Routes:

```typescript
// Single dynamic parameter
export type SearchParams = {
  tab?: 'profile' | 'settings';
};
safeRoute('/users/[id]/', { id: '123' });  // => /users/123/
safeRoute('/users/[id]/', { id: '123' }, { tab: 'profile' });  // => /users/123/?tab=profile

// Multiple dynamic parameters
safeRoute(
  '/users/[userId]/posts/[postId]/',
  { userId: '123', postId: '456' }
);  // => /users/123/posts/456/
```

3. Catch-all Routes:

```typescript
// Required catch-all
safeRoute(
  '/shop/[...categories]/',
  { categories: ['men', 'shoes'] }
);  // => /shop/men/shoes/

// Optional catch-all routes are split into two patterns:
// Pattern 1: Base route without parameters
safeRoute('/products/');  // => /products/

// Pattern 2: Route with optional catch-all
// Note: When using this pattern, params are required
safeRoute(
  '/products/[[...filters]]/',
  { filters: ['sale', 'winter'] }
);  // => /products/sale/winter/

// This will cause a type error:
safeRoute('/products/[[...filters]]/');  // Error: params are required when specified
```

4. Route Groups:

```typescript
// Route groups are ignored in the path
export type SearchParams = {
  redirect?: string;
};
safeRoute('/login/', { redirect: '/dashboard' });  // => /login/?redirect=/dashboard
```

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
