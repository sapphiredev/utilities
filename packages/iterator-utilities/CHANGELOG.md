# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/iterator-utilities@3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/iterator-utilities@2.0.1...@sapphire/iterator-utilities@3.0.0) - (2026-11-15)

## 🏠 Refactor

- **unzip:** Change `Error` to `RangeError` ([f40dc15](https://github.com/sapphiredev/utilities/commit/f40dc151e3ec722b5e035b538034999e40ed51af))
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
- **deps:** Update all non-major dependencies ([841436f](https://github.com/sapphiredev/utilities/commit/841436f1b501f468b002790283a25298561768d6)) ([#946](https://github.com/sapphiredev/utilities/pull/946) by @renovate[bot])
- **deps:** Update all non-major dependencies ([636a5ee](https://github.com/sapphiredev/utilities/commit/636a5eed0939fd96a82213bf8459846aedd54037)) ([#897](https://github.com/sapphiredev/utilities/pull/897) by @renovate[bot])
- **deps:** Update all non-major dependencies ([da56be5](https://github.com/sapphiredev/utilities/commit/da56be564ed75f128acbff76b8d7df677e3bef5b)) ([#894](https://github.com/sapphiredev/utilities/pull/894) by @renovate[bot])
- **deps:** Update all non-major dependencies ([4bc5591](https://github.com/sapphiredev/utilities/commit/4bc55911f95456a2caee10a3588c7b5f1542fb00)) ([#879](https://github.com/sapphiredev/utilities/pull/879) by @renovate[bot])
- **deps:** Update all non-major dependencies ([bc2f01c](https://github.com/sapphiredev/utilities/commit/bc2f01ce7d6932c9a0e02faa7cc081ecbae9640d)) ([#869](https://github.com/sapphiredev/utilities/pull/869) by @renovate[bot])

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
- Add `windows` ([4844417](https://github.com/sapphiredev/utilities/commit/4844417eabab0a64657b14e4267367fea0f27c36)) ([#836](https://github.com/sapphiredev/utilities/pull/836) by @kyranet)

## 🪞 Styling

- Apply linting rules ([d049345](https://github.com/sapphiredev/utilities/commit/d049345fd19a1bcbf8e466c1f9141ef6ecc32dc4))

# [@sapphire/iterator-utilities@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/iterator-utilities@1.0.2...@sapphire/iterator-utilities@2.0.0) - (2024-11-02)

## 🐛 Bug Fixes

- Move browser imports ([100ffb0](https://github.com/sapphiredev/utilities/commit/100ffb0a2471bb9f74cc580d282d11059e1a0a68)) ([#826](https://github.com/sapphiredev/utilities/pull/826) by @kyranet)
- **deps:** Update all non-major dependencies ([083376a](https://github.com/sapphiredev/utilities/commit/083376aac55094dbeddb5194e8a8f0d794b8cceb)) ([#763](https://github.com/sapphiredev/utilities/pull/763) by @renovate[bot])

## 🚀 Features

- **iterator-utilities:** Add more methods ([65ad816](https://github.com/sapphiredev/utilities/commit/65ad8163b787db55ac67f58aa454e12f07753af5)) ([#809](https://github.com/sapphiredev/utilities/pull/809) by @kyranet)
  - 💥 **BREAKING CHANGE:** `min` now uses a lexicographical comparison by default. Use `minBy` for custom comparisons.
  - 💥 **BREAKING CHANGE:** `max` now uses a lexicographical comparison by default. Use `maxBy` for custom comparisons.

# [@sapphire/iterator-utilities@1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/iterator-utilities@1.0.1...@sapphire/iterator-utilities@1.0.2) - (2024-06-03)

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([e7fdc5d](https://github.com/sapphiredev/utilities/commit/e7fdc5db3632a7f90292ef3978898da32730343a)) ([#752](https://github.com/sapphiredev/utilities/pull/752) by @renovate[bot])
- **iterator-utilities:** Export `NumberResolvable` ([dbc5c6c](https://github.com/sapphiredev/utilities/commit/dbc5c6c319857fd8c13d5c371276bd155f682c06))

## 📝 Documentation

- **readme:** Fix readme table of contents ([c60e8bd](https://github.com/sapphiredev/utilities/commit/c60e8bd9fc89156cf973871597ec3f0ef0308c08))
- **iterator-utilities:** Update README formatting ([094baf0](https://github.com/sapphiredev/utilities/commit/094baf034193800267afcd1f6c764402b32c0794))

# [@sapphire/iterator-utilities@1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/iterator-utilities@1.0.0...@sapphire/iterator-utilities@1.0.1) - (2024-05-02)

## 🐛 Bug Fixes

- **peekable:** Fix `peek()`'s return type (#741) ([c71b759](https://github.com/sapphiredev/utilities/commit/c71b759c22627b80e304d18361308fcf42458102))

## 📝 Documentation

- **iterator-utilities:** Fix `union` jsdoc (#740) ([22736fd](https://github.com/sapphiredev/utilities/commit/22736fdf9a84a97fda3670bf6a878ff00688fff2))

# [@sapphire/iterator-utilities@1.0.0](https://github.com/sapphiredev/utilities/tree/@sapphire/iterator-utilities@1.0.0) - (2024-04-29)

## 🚀 Features

- Add `iterator-utilities` package (#737) ([a7ce2c6](https://github.com/sapphiredev/utilities/commit/a7ce2c6fceef67759e42ea5b4f957802c8e8df21))

