# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/string-store@4.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@3.0.0...@sapphire/string-store@4.0.0) - (2026-11-15)

## 🏠 Refactor

- **eslint:** Allow globals to be used ([3f08d87](https://github.com/sapphiredev/utilities/commit/3f08d87496c885a851cb48ec59a5d8c8822c5284))
- Revert back to using globals instead of `node:X` imports ([25e18d0](https://github.com/sapphiredev/utilities/commit/25e18d0bf975e311d1baae2e5645355f4ffbdd0d))
- **tsdown:** Integrate nodeGlobals plugin in configs ([84502f6](https://github.com/sapphiredev/utilities/commit/84502f6bdaf7a031961a969f5602b509862408bf))
- **fromUTF16:** Replace codePointAt with charCodeAt ([bc0f08e](https://github.com/sapphiredev/utilities/commit/bc0f08e470e6e7702ea348c87730cdd91126b751))
- Update to ESLint v10 ([991c466](https://github.com/sapphiredev/utilities/commit/991c4665ff10d9efa32d34cab134570fa7d2dd22))
- ***:** All round repository upgrade ([44c5c90](https://github.com/sapphiredev/utilities/commit/44c5c900ecd6f9164e073c09630a7800d69f745a))
  - 💥 **BREAKING CHANGE:** Build system has been changed from tsup to tsdown. There may be unexpected changes in the build output.
  - 💥 **BREAKING CHANGE:** CJS support has been entirely dropped, all packages in this repository are now ESM-only.
  - 💥 **BREAKING CHANGE:** The `tslib` dependency has been removed from all packages.
  - 💥 **BREAKING CHANGE:** TypeScript has been internally updated to v7.
- ***:** All round repository upgrade ([a58424e](https://github.com/sapphiredev/utilities/commit/a58424eadcea4990a730b0f89ce2d45f5d896c65))
  - 💥 **BREAKING CHANGE:** Build system has been changed from tsup to tsdown. There may be unexpected changes in the build output.
  - 💥 **BREAKING CHANGE:** CJS support has been entirely dropped, all packages in this repository are now ESM-only.
  - 💥 **BREAKING CHANGE:** The `tslib` dependency has been removed from all packages.
  - 💥 **BREAKING CHANGE:** TypeScript has been internally updated to v7.

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([09c1811](https://github.com/sapphiredev/utilities/commit/09c1811dae117f501f4e03b2015d8288e28734f8)) ([#982](https://github.com/sapphiredev/utilities/pull/982) by @renovate[bot])
- **deps:** Update all non-major dependencies ([72499d9](https://github.com/sapphiredev/utilities/commit/72499d99a9feb107fd3dccea601da462f1f725c1)) ([#980](https://github.com/sapphiredev/utilities/pull/980) by @renovate[bot])
- **deps:** Update all non-major dependencies ([e6d4bac](https://github.com/sapphiredev/utilities/commit/e6d4bac47e65e9e0ec95ebaaa1b679cfc01bd107)) ([#953](https://github.com/sapphiredev/utilities/pull/953) by @renovate[bot])
- **deps:** Update all non-major dependencies ([3f9fe93](https://github.com/sapphiredev/utilities/commit/3f9fe93b770479fd72b7fd56f476244c040fcb41)) ([#952](https://github.com/sapphiredev/utilities/pull/952) by @renovate[bot])

## 📝 Documentation

- **readme:** Update feature descriptions across packages ([302730a](https://github.com/sapphiredev/utilities/commit/302730a5b8eccb763b7b9761c3de1db9d3857394))
- Update typedoc to proper tsdoc ([1d29dd6](https://github.com/sapphiredev/utilities/commit/1d29dd63bc2ffd1ea25093ca2d0a9ab7d6efc9e9))

## 🚀 Features

- Target es2024 when bundling ([293e6b9](https://github.com/sapphiredev/utilities/commit/293e6b9eddbed5db178017d5ddedaaad0cfb3395))
  - 💥 **BREAKING CHANGE:** if your project is not full ES2024 compatible this new version will not work
- Update eslint rules ([901aca9](https://github.com/sapphiredev/utilities/commit/901aca995e28bf5f4b343b441ab658d9c6511195))
  - 💥 **BREAKING CHANGE:** ESLint has been updated to v10
  - 💥 **BREAKING CHANGE:** ESLint configuration has been changed to a flat config
  - 💥 **BREAKING CHANGE:** Our ESLint config is now a small layer on top of [eslint-config-neon](https://www.npmjs.com/package/eslint-config-neon) which brings a LOT more rules and stricter linting.

# [@sapphire/string-store@3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@2.0.0...@sapphire/string-store@3.0.0) - (2025-12-14)

## 🐛 Bug Fixes

- **string-store:** Use only valid unicode characters to encode ([15184ba](https://github.com/sapphiredev/utilities/commit/15184bad08fad49e861bebafbe0b21e0da2a462b)) ([#935](https://github.com/sapphiredev/utilities/pull/935) by @SammyWhamy)
- **deps:** Update all non-major dependencies ([841436f](https://github.com/sapphiredev/utilities/commit/841436f1b501f468b002790283a25298561768d6)) ([#946](https://github.com/sapphiredev/utilities/pull/946) by @renovate[bot])
- **deps:** Update all non-major dependencies ([636a5ee](https://github.com/sapphiredev/utilities/commit/636a5eed0939fd96a82213bf8459846aedd54037)) ([#897](https://github.com/sapphiredev/utilities/pull/897) by @renovate[bot])
- **deps:** Update all non-major dependencies ([4bc5591](https://github.com/sapphiredev/utilities/commit/4bc55911f95456a2caee10a3588c7b5f1542fb00)) ([#879](https://github.com/sapphiredev/utilities/pull/879) by @renovate[bot])
- **deps:** Update all non-major dependencies ([bc2f01c](https://github.com/sapphiredev/utilities/commit/bc2f01ce7d6932c9a0e02faa7cc081ecbae9640d)) ([#869](https://github.com/sapphiredev/utilities/pull/869) by @renovate[bot])

# [@sapphire/string-store@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.2.0...@sapphire/string-store@2.0.0) - (2025-01-31)

## 🏠 Refactor

- Add `DuplexBuffer` interface ([548200f](https://github.com/sapphiredev/utilities/commit/548200f1af067ae2f017c27a3c5d056ec6dd7ff8)) ([#865](https://github.com/sapphiredev/utilities/pull/865) by @kyranet)
- **SchemaStore:** Introduce `serializeRaw` ([5141559](https://github.com/sapphiredev/utilities/commit/51415597fa4b8ed0e17ba71743e73f3963a6803b)) ([#862](https://github.com/sapphiredev/utilities/pull/862) by @kyranet)
  - 💥 **BREAKING CHANGE:** `serialize` no longer returns an `UnalignedUint16Array`, if you desire the old behaviour, use `serializeRaw`

## 🚀 Features

- **Schema:** Add serialization helpers ([8a922c4](https://github.com/sapphiredev/utilities/commit/8a922c421576707dcd1e74379544f20a8c43d785)) ([#864](https://github.com/sapphiredev/utilities/pull/864) by @kyranet)
  - 💥 **BREAKING CHANGE:** `serialize` has been renamed to `serializeInto`

# [@sapphire/string-store@1.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.1.0...@sapphire/string-store@1.2.0) - (2024-12-18)

## 🏠 Refactor

- Improve types for `t.constant` and `t.nullable` ([80c79c3](https://github.com/sapphiredev/utilities/commit/80c79c3faf6520acc1c4c8a67797d2a2c64e0e1d)) ([#849](https://github.com/sapphiredev/utilities/pull/849) by @kyranet)

## 📝 Documentation

- Add `nullable` to the README ([86690e3](https://github.com/sapphiredev/utilities/commit/86690e35df6020c6b2eaaa5adf1194a075e07160)) ([#847](https://github.com/sapphiredev/utilities/pull/847) by @kyranet)

## 🚀 Features

- Added `constant` type ([4414462](https://github.com/sapphiredev/utilities/commit/4414462a0147de444122df2ebe0f6ed20d2164ac)) ([#848](https://github.com/sapphiredev/utilities/pull/848) by @kyranet)
- Added `nullable` type ([3b1a353](https://github.com/sapphiredev/utilities/commit/3b1a353cb9ae6ffc3a0baf50cc27e2be26553a9b)) ([#846](https://github.com/sapphiredev/utilities/pull/846) by @kyranet)

# [@sapphire/string-store@1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/string-store@1.0.1...@sapphire/string-store@1.1.0) - (2024-12-01)

## 📝 Documentation

- Added remark on compile-time value types ([0c59968](https://github.com/sapphiredev/utilities/commit/0c59968d077155686106bdf62e94a317121f16cb)) ([#839](https://github.com/sapphiredev/utilities/pull/839) by @kyranet)

## 🚀 Features

- **SchemaStore:** Add `getIdentifier` method ([5127445](https://github.com/sapphiredev/utilities/commit/5127445079b13092968c0ab37924136e7819af28)) ([#838](https://github.com/sapphiredev/utilities/pull/838) by @kyranet)

# [@sapphire/string-store@1.0.0](https://github.com/sapphiredev/utilities/tree/@sapphire/string-store@1.0.0) - (2024-11-02)

## 🏃 Performance

- Implement fast word writing ([f63a9a1](https://github.com/sapphiredev/utilities/commit/f63a9a1165209c8367202d98233cea1837f01f1d)) ([#787](https://github.com/sapphiredev/utilities/pull/787) by @kyranet)

## 🐛 Bug Fixes

- Move browser imports ([100ffb0](https://github.com/sapphiredev/utilities/commit/100ffb0a2471bb9f74cc580d282d11059e1a0a68)) ([#826](https://github.com/sapphiredev/utilities/pull/826) by @kyranet)

## 📝 Documentation

- Grammar and use `t.type` ([6f32cac](https://github.com/sapphiredev/utilities/commit/6f32caca7ba5e1a9578e672c9e939f3855cf69e6)) ([#781](https://github.com/sapphiredev/utilities/pull/781) by @kyranet)

## 🚀 Features

- Add buffer utilities ([2e9590b](https://github.com/sapphiredev/utilities/commit/2e9590be59d57310b276365b372ba2602f3d665d)) ([#779](https://github.com/sapphiredev/utilities/pull/779) by @kyranet)
- Add signed ints ([68ee882](https://github.com/sapphiredev/utilities/commit/68ee882a8b13efcfb8d5bd01fabc23600f711e46)) ([#778](https://github.com/sapphiredev/utilities/pull/778) by @kyranet)
- Added string-store ([4c3de5e](https://github.com/sapphiredev/utilities/commit/4c3de5ebb8ced1a6b6d65fdee29caf731651a0fe)) ([#118](https://github.com/sapphiredev/utilities/pull/118) by @kyranet)

