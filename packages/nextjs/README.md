# @safe-routes/nextjs

Type-safe route utilities for Next.js App Router and Pages Router.

## Features

- Full TypeScript support
- App Router support
  - Dynamic routes ([id])
  - Catch-all routes ([...slug])
  - Optional catch-all routes ([[...name]])
  - Route groups ((auth))
  - SearchParams type inference
- Pages Router support
  - Dynamic routes
  - Catch-all routes
  - Index routes
  - Nested routes
  - SearchParams type inference

## Installation

```bash
npm install @safe-routes/nextjs
```

## Setup

Add the CLI to your package.json scripts:

```json
{
  "scripts": {
    "dev": "safe-routes --watch & next dev",
    "build": "safe-routes && next build"
  }
}
```

### Using pnpm

When using pnpm, additional configuration is required for correct module resolution:

1. Update your package.json scripts:

```json
{
  "scripts": {
    "dev": "safe-routes --watch --out-dir ./node_modules/.safe-routes & next dev",
    "build": "safe-routes --out-dir ./node_modules/.safe-routes && next build"
  }
}
```

2. Update your tsconfig.json:

```json
{
  "compilerOptions": {
    "paths": {
      "@safe-routes/nextjs": ["./node_modules/.safe-routes"]
    }
  }
}
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

// Optional catch-all
safeRoute('/products/[[...filters]]/', {});  // => /products/
safeRoute(
  '/products/[[...filters]]/',
  { filters: ['sale', 'winter'] }
);  // => /products/sale/winter/
```

4. Route Groups:

```typescript
// Route groups are ignored in the path
export type SearchParams = {
  redirect?: string;
};
safeRoute('/login/', { redirect: '/dashboard' });  // => /login/?redirect=/dashboard
```

### Type Safety

The `safeRoute` function provides full type safety:

- Path validation
- Required/optional parameters checking
- Search params type inference
- Compile-time error detection

```typescript
// ✅ Valid
safeRoute('/users/[id]/', { id: '123' });

// ❌ Type Error: Missing required parameter 'id'
safeRoute('/users/[id]/');

// ❌ Type Error: Unknown parameter 'unknown'
safeRoute('/about/', { unknown: 'value' });

// ❌ Type Error: Invalid search param type
safeRoute('/users/[id]/', { id: '123' }, { tab: 'invalid' });
```

## License

MIT
