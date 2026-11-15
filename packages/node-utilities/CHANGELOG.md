# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/node-utilities@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/node-utilities@1.0.2...@sapphire/node-utilities@2.0.0) - (2026-11-15)

## 🏠 Refactor

- Update to ESLint v10 ([991c466](https://github.com/sapphiredev/utilities/commit/991c4665ff10d9efa32d34cab134570fa7d2dd22))
- Set minimal node version to 24 and npm to 12 ([2e4174b](https://github.com/sapphiredev/utilities/commit/2e4174bd3feb97ab1bbd15fd4735d2528c35cc2b))
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
- **deps:** Update all non-major dependencies ([4bc5591](https://github.com/sapphiredev/utilities/commit/4bc55911f95456a2caee10a3588c7b5f1542fb00)) ([#879](https://github.com/sapphiredev/utilities/pull/879) by @renovate[bot])
- **deps:** Update all non-major dependencies ([bc2f01c](https://github.com/sapphiredev/utilities/commit/bc2f01ce7d6932c9a0e02faa7cc081ecbae9640d)) ([#869](https://github.com/sapphiredev/utilities/pull/869) by @renovate[bot])
- **deps:** Update all non-major dependencies ([083376a](https://github.com/sapphiredev/utilities/commit/083376aac55094dbeddb5194e8a8f0d794b8cceb)) ([#763](https://github.com/sapphiredev/utilities/pull/763) by @renovate[bot])
- **deps:** Update all non-major dependencies ([e7fdc5d](https://github.com/sapphiredev/utilities/commit/e7fdc5db3632a7f90292ef3978898da32730343a)) ([#752](https://github.com/sapphiredev/utilities/pull/752) by @renovate[bot])

## 📝 Documentation

- **readme:** Update feature descriptions across packages ([302730a](https://github.com/sapphiredev/utilities/commit/302730a5b8eccb763b7b9761c3de1db9d3857394))
- Update typedoc to proper tsdoc ([1d29dd6](https://github.com/sapphiredev/utilities/commit/1d29dd63bc2ffd1ea25093ca2d0a9ab7d6efc9e9))
- **readme:** Fix readme table of contents ([c60e8bd](https://github.com/sapphiredev/utilities/commit/c60e8bd9fc89156cf973871597ec3f0ef0308c08))

## 🚀 Features

- Target es2024 when bundling ([293e6b9](https://github.com/sapphiredev/utilities/commit/293e6b9eddbed5db178017d5ddedaaad0cfb3395))
  - 💥 **BREAKING CHANGE:** if your project is not full ES2024 compatible this new version will not work
- Update eslint rules ([901aca9](https://github.com/sapphiredev/utilities/commit/901aca995e28bf5f4b343b441ab658d9c6511195))
  - 💥 **BREAKING CHANGE:** ESLint has been updated to v10
  - 💥 **BREAKING CHANGE:** ESLint configuration has been changed to a flat config
  - 💥 **BREAKING CHANGE:** Our ESLint config is now a small layer on top of [eslint-config-neon](https://www.npmjs.com/package/eslint-config-neon) which brings a LOT more rules and stricter linting.

# [@sapphire/node-utilities@1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/node-utilities@1.0.2...@sapphire/node-utilities@1.0.2) - (2024-01-19)

## 🐛 Bug Fixes

- Fixed commonjs typings export mapping (#707) ([216ff02](https://github.com/sapphiredev/utilities/commit/216ff0260d63a9590357f9a5069f1ae2b34eaf5d))

# [@sapphire/node-utilities@1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/node-utilities@1.0.1...@sapphire/node-utilities@1.0.1) - (2023-12-04)

## 🐛 Bug Fixes

- **node-utilities:** Properly split CJS and ESM ([360fe19](https://github.com/sapphiredev/utilities/commit/360fe1983e7db6d6a61c5f79ac399f74f9993410))
- Update export mapping for proper ESM/CJS split ([dd0cff8](https://github.com/sapphiredev/utilities/commit/dd0cff8e9b03a15812f25f7a1180501a92422629))
- **deps:** Update all non-major dependencies (#607) ([9cc8bd0](https://github.com/sapphiredev/utilities/commit/9cc8bd0d4b5d650deab2c913e6c3d713861bae28))
- **deps:** Update all non-major dependencies (#577) ([291dd67](https://github.com/sapphiredev/utilities/commit/291dd6783e57d8f075ce566218ba076ef6c4bbbd))
- **deps:** Update all non-major dependencies (#545) ([40ca040](https://github.com/sapphiredev/utilities/commit/40ca040a21d8a0949682051a3a974538183a400e))
- **deps:** Update all non-major dependencies (#544) ([cc78f17](https://github.com/sapphiredev/utilities/commit/cc78f17390c7f3db08af92bf46a5a70a9c11dd5f))
- **deps:** Update all non-major dependencies (#532) ([8033d1f](https://github.com/sapphiredev/utilities/commit/8033d1ff7a5a1974134c61f424f171cccb2915e1))
- **deps:** Update all non-major dependencies (#514) ([21b07d5](https://github.com/sapphiredev/utilities/commit/21b07d5db529a0d982647a60de98e46f36f1ac93))
- **deps:** Update all non-major dependencies (#505) ([6178296](https://github.com/sapphiredev/utilities/commit/617829649e1e4deeee02b14533b5377cd5bc1fb3))

## 📝 Documentation

- Fixed docs using incorrect reference format ([615d930](https://github.com/sapphiredev/utilities/commit/615d930570fdf8e0c743df1c91f30f280fdd2813))
- Add @06000208 as a contributor ([fa3349e](https://github.com/sapphiredev/utilities/commit/fa3349e55ce4ad008785211dec7bf8e2b5d933df))
- Add @didinele as a contributor ([42ef7b6](https://github.com/sapphiredev/utilities/commit/42ef7b656c48fd0e720119db1d622c8bba2791e9))
- Add @goestav as a contributor ([0e56a92](https://github.com/sapphiredev/utilities/commit/0e56a92a4e2d0942bfa207f81a8cb03b32312034))
- Add @CitTheDev as a contributor ([34169ea](https://github.com/sapphiredev/utilities/commit/34169eae1dc0476ccf5a6c4f36e28602a204829e))
- Add @legendhimslef as a contributor ([059b6f1](https://github.com/sapphiredev/utilities/commit/059b6f1ab5362d46d58624d06c1aa39192b0716f))
- **node-utilities:** Add usage (#500) ([6f1210d](https://github.com/sapphiredev/utilities/commit/6f1210d90f14422289e8493aeed9a2e1769241b2))
- Add @r-priyam as a contributor ([fb278ba](https://github.com/sapphiredev/utilities/commit/fb278bacf627ec6fc88752eafeb12df5f3177a2c))

## 🧪 Testing

- Update vitest to coverage v8 ([a4bc6e4](https://github.com/sapphiredev/utilities/commit/a4bc6e4f24ea60143a150ecc76fda6484f172ab9))

# [@sapphire/node-utilities@1.0.0](https://github.com/sapphiredev/utilities/tree/@sapphire/node-utilities@1.0.0) - (2022-10-02)

## 🚀 Features

- Add `@sapphire/node-utilities` (#468) ([1606208](https://github.com/sapphiredev/utilities/commit/1606208ce2e1ca8a6b307d14ce7f119e6c914a97))

