# Safe Routes

Type-safe routing utilities for Web applications.

## Packages

- [@safe-routes/nextjs](./packages/nextjs/README.md) - Type-safe route utilities for Next.js App Router and Pages Router

## Development

This is a monorepo using pnpm workspaces.

### Setup

```bash
pnpm install
```

### Development

```bash
# Run example app
cd apps/example
pnpm dev
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/nextjs
pnpm build
```

### Testing

```bash
pnpm test
```

## Project Structure

```
.
├── apps/
│   └── example/          # Example Next.js application
│       ├── app/         # App Router examples
│       └── pages/       # Pages Router examples
│
└── packages/
    └── nextjs/          # Main package
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create new Pull Request

## License

MIT
