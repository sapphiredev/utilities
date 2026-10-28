# Security review: code-scanning alerts #45–#48

## Summary

Alerts #45–#48 identified path traversal in `scripts/gen-index.ts`. The package
name supplied as a command-line argument was used to construct paths passed to
`readdir`, `readFile`, and `writeFile`. A traversal argument could redirect
these operations outside the intended package directory, including writes in
`--write` mode.

All four alerts share this root cause:

| Alert | Affected operation               |
| ----- | -------------------------------- |
| #45   | `readdir`                        |
| #46   | `readFile` of the package index  |
| #47   | `readFile` of discovered modules |
| #48   | `writeFile` of the package index |

## Remediation

Before using the supplied package name to construct package paths, the script
now checks that it matches an actual direct child directory of `packages/`.
This rejects traversal values and symlinked package roots while preserving
valid workspace package names.

Validation performed:

- ESLint passed for `scripts/gen-index.ts`.
- `node --experimental-strip-types scripts/gen-index.ts utilities --check` passed.
- A traversal argument with `--write` was rejected before filesystem access.
- `git diff --check` passed.
