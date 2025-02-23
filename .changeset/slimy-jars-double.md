---
"@safe-routes/nextjs": patch
---

- Fix URL encoding to use %20 instead of + for spaces
- Add type safety for URLSearchParams entries
- Fix kebab-case parameter handling in dynamic routes
- Remove redundant slashes in URL paths
