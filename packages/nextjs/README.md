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

## Usage

1. Add the CLI to your package.json scripts:

```json
{
  "scripts": {
    "dev": "safe-routes --watch & next dev",
    "build": "safe-routes && next build"
  }
}
```

2. Use in your components:

```typescript
import { safeRoute } from '@safe-routes/nextjs';

// App Router
export type SearchParams = {
  page: number;
  sort: 'asc' | 'desc';
};

// Pages Router
export type SearchParams = {
  locale: string;
};

// Usage
const url = safeRoute('/users/[id]/', { id: '123' }, { page: 1 });
```

## License

MIT 