# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/prettier-config@3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@2.0.0...@sapphire/prettier-config@3.0.0) - (2026-11-15)

## 🏠 Refactor

- **prettier-config:** Simplify re-export syntax in README ([77bd18b](https://github.com/sapphiredev/utilities/commit/77bd18be58cebcf5b3f24905f58359bc41ed53cf))
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
- **deps:** Update all non-major dependencies ([fff340c](https://github.com/sapphiredev/utilities/commit/fff340ccc9aa7d8c1770cb9159495afa071794f0)) ([#945](https://github.com/sapphiredev/utilities/pull/945) by @renovate[bot])
- **deps:** Update all non-major dependencies ([b1d26d6](https://github.com/sapphiredev/utilities/commit/b1d26d62fa2cea94f5f1e21655a7190ee270892f)) ([#899](https://github.com/sapphiredev/utilities/pull/899) by @renovate[bot])
- **deps:** Update all non-major dependencies ([636a5ee](https://github.com/sapphiredev/utilities/commit/636a5eed0939fd96a82213bf8459846aedd54037)) ([#897](https://github.com/sapphiredev/utilities/pull/897) by @renovate[bot])
- **deps:** Update all non-major dependencies ([4bc5591](https://github.com/sapphiredev/utilities/commit/4bc55911f95456a2caee10a3588c7b5f1542fb00)) ([#879](https://github.com/sapphiredev/utilities/pull/879) by @renovate[bot])
- **deps:** Update all non-major dependencies ([bc2f01c](https://github.com/sapphiredev/utilities/commit/bc2f01ce7d6932c9a0e02faa7cc081ecbae9640d)) ([#869](https://github.com/sapphiredev/utilities/pull/869) by @renovate[bot])
- **deps:** Update all non-major dependencies ([083376a](https://github.com/sapphiredev/utilities/commit/083376aac55094dbeddb5194e8a8f0d794b8cceb)) ([#763](https://github.com/sapphiredev/utilities/pull/763) by @renovate[bot])
- Update transitive dependencies ([8a4927b](https://github.com/sapphiredev/utilities/commit/8a4927ba1aed3dc094393bbea1dd6fa790bece8e))
- **deps:** Update dependency prettier to ^3.2.2 ([61630cc](https://github.com/sapphiredev/utilities/commit/61630cc5aa43e05d6e3e8881b2883f0ef334f02a)) ([#706](https://github.com/sapphiredev/utilities/pull/706) by @renovate[bot])
- Bump transitive prettier dependency ([13ec7e9](https://github.com/sapphiredev/utilities/commit/13ec7e95001ebaaea3267ef22dfdededab912528))
- **prettier-config:** Update transitive dependencies ([5408f85](https://github.com/sapphiredev/utilities/commit/5408f8510b2b42678c66cfbfd13f501ebda30277))

## 📝 Documentation

- **readme:** Update feature descriptions across packages ([302730a](https://github.com/sapphiredev/utilities/commit/302730a5b8eccb763b7b9761c3de1db9d3857394))
- **prettier-config:** Update readme ([bd487c7](https://github.com/sapphiredev/utilities/commit/bd487c72ecb4259683c628f982f267e22d56f2a2)) ([#642](https://github.com/sapphiredev/utilities/pull/642) by @RealShadowNova)

## 🚀 Features

- Update eslint rules ([901aca9](https://github.com/sapphiredev/utilities/commit/901aca995e28bf5f4b343b441ab658d9c6511195))
  - 💥 **BREAKING CHANGE:** ESLint has been updated to v10
  - 💥 **BREAKING CHANGE:** ESLint configuration has been changed to a flat config
  - 💥 **BREAKING CHANGE:** Our ESLint config is now a small layer on top of [eslint-config-neon](https://www.npmjs.com/package/eslint-config-neon) which brings a LOT more rules and stricter linting.

# [@sapphire/prettier-config@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.5...@sapphire/prettier-config@2.0.0) - (2023-07-21)

## 🏃 Performance

- **chunk:** Remove clone (#574) ([049047b](https://github.com/sapphiredev/utilities/commit/049047b3ceee6fcfeb2e09e15e26424022a5045c))

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies (#607) ([9cc8bd0](https://github.com/sapphiredev/utilities/commit/9cc8bd0d4b5d650deab2c913e6c3d713861bae28))
- **deps:** Update all non-major dependencies (#577) ([291dd67](https://github.com/sapphiredev/utilities/commit/291dd6783e57d8f075ce566218ba076ef6c4bbbd))
- **deps:** Update all non-major dependencies (#545) ([40ca040](https://github.com/sapphiredev/utilities/commit/40ca040a21d8a0949682051a3a974538183a400e))
- **deps:** Update all non-major dependencies (#544) ([cc78f17](https://github.com/sapphiredev/utilities/commit/cc78f17390c7f3db08af92bf46a5a70a9c11dd5f))

## 🚀 Features

- **prettier-config:** Update to Prettier v3 ([f7aca37](https://github.com/sapphiredev/utilities/commit/f7aca371e28e8a444299b9f7b900de6c32e53713))
  - 💥 **BREAKING CHANGE:** This package now depends on [Prettier v3](https://prettier.io/blog/2023/07/05/3.0.0.html). The config as exported by this package is now an EcmaScript Module, which means that it can no longer be imported in CJS with `require`. You should update your prettier config to use ESM instead.
- **duration:** Add units on Duration (#561) ([eac39af](https://github.com/sapphiredev/utilities/commit/eac39af4c43c4f600234fbacb5efe8fb0cbb53b8))

## 🧪 Testing

- Update vitest to coverage v8 ([a4bc6e4](https://github.com/sapphiredev/utilities/commit/a4bc6e4f24ea60143a150ecc76fda6484f172ab9))

# [@sapphire/prettier-config@1.4.5](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.4...@sapphire/prettier-config@1.4.5) - (2023-01-09)

## 🏠 Refactor

- **prettier-config:** Remove overwrite for `.all-contributorsrc` ([3bbaad5](https://github.com/sapphiredev/utilities/commit/3bbaad5eb3ca5236297eecef57a8d42cdf554cb9))
- Split `@sapphire/time-utilities` into 4 sub-packages (#462) ([574299a](https://github.com/sapphiredev/utilities/commit/574299a99e658f6500a2a7efa587a0919b2d1313))

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies (#532) ([8033d1f](https://github.com/sapphiredev/utilities/commit/8033d1ff7a5a1974134c61f424f171cccb2915e1))
- **deps:** Update all non-major dependencies (#514) ([21b07d5](https://github.com/sapphiredev/utilities/commit/21b07d5db529a0d982647a60de98e46f36f1ac93))
- **deps:** Update all non-major dependencies (#505) ([6178296](https://github.com/sapphiredev/utilities/commit/617829649e1e4deeee02b14533b5377cd5bc1fb3))
- **deps:** Update all non-major dependencies ([e20f299](https://github.com/sapphiredev/utilities/commit/e20f29906e83cee000aaba9c6827e3bec5173d28))

## 📝 Documentation

- Add @06000208 as a contributor ([fa3349e](https://github.com/sapphiredev/utilities/commit/fa3349e55ce4ad008785211dec7bf8e2b5d933df))
- Add @didinele as a contributor ([42ef7b6](https://github.com/sapphiredev/utilities/commit/42ef7b656c48fd0e720119db1d622c8bba2791e9))
- Add @goestav as a contributor ([0e56a92](https://github.com/sapphiredev/utilities/commit/0e56a92a4e2d0942bfa207f81a8cb03b32312034))
- Add @CitTheDev as a contributor ([34169ea](https://github.com/sapphiredev/utilities/commit/34169eae1dc0476ccf5a6c4f36e28602a204829e))
- Add @legendhimslef as a contributor ([059b6f1](https://github.com/sapphiredev/utilities/commit/059b6f1ab5362d46d58624d06c1aa39192b0716f))
- Add @r-priyam as a contributor ([fb278ba](https://github.com/sapphiredev/utilities/commit/fb278bacf627ec6fc88752eafeb12df5f3177a2c))
- Change name of @kyranet (#451) ([df4fdef](https://github.com/sapphiredev/utilities/commit/df4fdefce18659975a4ebc224723638507d02d35))
- Update @RealShadowNova as a contributor ([a869ba0](https://github.com/sapphiredev/utilities/commit/a869ba0abfad041610b9115187d426aebe671af6))

# [@sapphire/prettier-config@1.4.4](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.3...@sapphire/prettier-config@1.4.4) - (2022-08-20)

## 🐛 Bug Fixes

- **deps:** Update all non-major dependencies ([2308bd7](https://github.com/sapphiredev/utilities/commit/2308bd74356b6b2e0c12995b25f4d8ade4803fe9))
- **deps:** Update all non-major dependencies ([84af0db](https://github.com/sapphiredev/utilities/commit/84af0db2db749223b036aa99fe19a2e9af5681c6))
- **deps:** Update all non-major dependencies ([50cd8de](https://github.com/sapphiredev/utilities/commit/50cd8dea593b6f5ae75571209456b3421e2ca59a))

## 📝 Documentation

- Add @muchnameless as a contributor ([a1221fe](https://github.com/sapphiredev/utilities/commit/a1221fea68506e99591d5d00ec552a07c26833f9))
- Add @enxg as a contributor ([d2382f0](https://github.com/sapphiredev/utilities/commit/d2382f04e3909cb4ad11798a0a10e683f6cf5383))
- Add @EvolutionX-10 as a contributor ([efc3a32](https://github.com/sapphiredev/utilities/commit/efc3a320a72ae258996dd62866d206c33f8d4961))
- Add @MajesticString as a contributor ([295b3e9](https://github.com/sapphiredev/utilities/commit/295b3e9849a4b0fe64074bae02f6426378a303c3))
- Add @Mzato0001 as a contributor ([c790ef2](https://github.com/sapphiredev/utilities/commit/c790ef25df2d7e22888fa9f8169167aa555e9e19))
- Add @NotKaskus as a contributor ([00da8f1](https://github.com/sapphiredev/utilities/commit/00da8f199137b9277119823f322d1f2d168d928a))
- Add @imranbarbhuiya as a contributor ([fb674c2](https://github.com/sapphiredev/utilities/commit/fb674c2c5594d41e71662263553dcb4bac9e37f4))
- Add @axisiscool as a contributor ([ce1aa31](https://github.com/sapphiredev/utilities/commit/ce1aa316871a88d3663efbdf2a42d3d8dfe6a27f))
- Add @dhruv-kaushikk as a contributor ([ebbf43f](https://github.com/sapphiredev/utilities/commit/ebbf43f63617daba96e72c50a234bf8b64f6ddc4))
- Add @Commandtechno as a contributor ([f1d69fa](https://github.com/sapphiredev/utilities/commit/f1d69fabe1ee0abe4be08b19e63dbec03102f7ce))

## 🧪 Testing

- Migrate to vitest (#380) ([075ec73](https://github.com/sapphiredev/utilities/commit/075ec73c7a8e3374fad3ada612d37eb4ac36ec8d))

# [@sapphire/prettier-config@1.4.3](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.2...@sapphire/prettier-config@1.4.3) - (2022-04-18)

## Bug Fixes

- **deps:** Update all non-major dependencies ([b10c1b0](https://github.com/sapphiredev/utilities/commit/b10c1b00d88a561b982d64cee2203e49d0e1e546))

## Documentation

- Fix typedoc causing OOM crashes ([63ba41c](https://github.com/sapphiredev/utilities/commit/63ba41c4b6678554b1c7043a22d3296db4f59360))

## [1.4.2](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.1...@sapphire/prettier-config@1.4.2) (2022-04-01)

### Bug Fixes

-   **deps:** update all non-major dependencies ([308cf66](https://github.com/sapphiredev/utilities/commit/308cf66056b9b3718abb6946b1bc1cc9c144c4a3))

## [1.4.1](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.4.0...@sapphire/prettier-config@1.4.1) (2022-03-20)

**Note:** Version bump only for package @sapphire/prettier-config

# [1.4.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.3.0...@sapphire/prettier-config@1.4.0) (2022-03-06)

### Features

-   allow module: NodeNext ([#306](https://github.com/sapphiredev/utilities/issues/306)) ([9dc6dd6](https://github.com/sapphiredev/utilities/commit/9dc6dd619efab879bb2b0b3c9e64304e10a67ed6))
-   **ts-config:** add multi-config structure ([#281](https://github.com/sapphiredev/utilities/issues/281)) ([b5191d7](https://github.com/sapphiredev/utilities/commit/b5191d7f2416dc5838590c4ff221454925553e37))

# [1.3.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.9...@sapphire/prettier-config@1.3.0) (2022-01-28)

### Features

-   change build system to tsup ([#270](https://github.com/sapphiredev/utilities/issues/270)) ([365a53a](https://github.com/sapphiredev/utilities/commit/365a53a5517a01a0926cf28a83c96b63f32ed9f8))

## [1.2.9](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.8...@sapphire/prettier-config@1.2.9) (2022-01-21)

### Bug Fixes

-   fixed typos of `communitys` ([e4e3a69](https://github.com/sapphiredev/utilities/commit/e4e3a6913a8157f24f366ac43db46faebdc085ce)), closes [#263](https://github.com/sapphiredev/utilities/issues/263)

## [1.2.8](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.7...@sapphire/prettier-config@1.2.8) (2022-01-10)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.2.7](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.6...@sapphire/prettier-config@1.2.7) (2021-12-08)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.2.6](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.4...@sapphire/prettier-config@1.2.6) (2021-11-25)

### Bug Fixes

-   **prettier-config:** bump prettier dependency to 2.5.0 ([dfb2d91](https://github.com/sapphiredev/utilities/commit/dfb2d91c92b7637c2bee02af9c25339a2cdf7bbb))

## [1.2.5](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.4...@sapphire/prettier-config@1.2.5) (2021-11-25)

### Bug Fixes

-   **prettier-config:** bump prettier dependency to 2.5.0 ([dfb2d91](https://github.com/sapphiredev/utilities/commit/dfb2d91c92b7637c2bee02af9c25339a2cdf7bbb))

## [1.2.4](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.3...@sapphire/prettier-config@1.2.4) (2021-11-06)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.2.3](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.2...@sapphire/prettier-config@1.2.3) (2021-10-17)

### Bug Fixes

-   allow more node & npm versions in engines field ([5977d2a](https://github.com/sapphiredev/utilities/commit/5977d2a30a4b2cfdf84aff3f33af03ffde1bbec5))

## [1.2.2](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.1...@sapphire/prettier-config@1.2.2) (2021-10-11)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.2.1](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.2.0...@sapphire/prettier-config@1.2.1) (2021-10-08)

**Note:** Version bump only for package @sapphire/prettier-config

# [1.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.6...@sapphire/prettier-config@1.2.0) (2021-10-04)

### Features

-   **prettier-config:** set minimum NodeJS to v14 ([2e518dc](https://github.com/sapphiredev/utilities/commit/2e518dc46e96753a07828a73fd437be18efca6da))

## [1.1.6](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.5...@sapphire/prettier-config@1.1.6) (2021-06-27)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.1.5](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.4...@sapphire/prettier-config@1.1.5) (2021-06-27)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.1.4](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.3...@sapphire/prettier-config@1.1.4) (2021-06-19)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.1.3](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.2...@sapphire/prettier-config@1.1.3) (2021-06-06)

### Bug Fixes

-   remove peer deps, update dev deps, update READMEs ([#124](https://github.com/sapphiredev/utilities/issues/124)) ([67256ed](https://github.com/sapphiredev/utilities/commit/67256ed43b915b02a8b5c68230ba82d6210c5032))

## [1.1.2](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.1...@sapphire/prettier-config@1.1.2) (2021-05-20)

### Bug Fixes

-   **prettier-config:** mark package as side effect free ([06147d3](https://github.com/sapphiredev/utilities/commit/06147d39beb2a92bd94032ca96ea1b7ed0c0453b))

## [1.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.1.0...@sapphire/prettier-config@1.1.1) (2021-05-02)

### Bug Fixes

-   drop the `www.` from the SapphireJS URL ([494d89f](https://github.com/sapphiredev/utilities/commit/494d89ffa04f78c195b93d7905b3232884f7d7e2))
-   update all the SapphireJS URLs from `.com` to `.dev` ([f59b46d](https://github.com/sapphiredev/utilities/commit/f59b46d1a0ebd39cad17b17d71cd3b9da808d5fd))

# [1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.10...@sapphire/prettier-config@1.1.0) (2021-04-21)

### Features

-   add @sapphire/embed-jsx ([#100](https://github.com/sapphiredev/utilities/issues/100)) ([7277a23](https://github.com/sapphiredev/utilities/commit/7277a236015236ed8e81b7882875410facc4ce17))

## [1.0.10](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.9...@sapphire/prettier-config@1.0.10) (2021-04-19)

### Bug Fixes

-   change all Sapphire URLs from "project"->"community" & use our domain where applicable 👨‍🌾🚜 ([#102](https://github.com/sapphiredev/utilities/issues/102)) ([835b408](https://github.com/sapphiredev/utilities/commit/835b408e8e57130c3787aca2e32613346ff23e4d))

## [1.0.9](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.8...@sapphire/prettier-config@1.0.9) (2021-04-03)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.0.8](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.7...@sapphire/prettier-config@1.0.8) (2021-03-16)

### Bug Fixes

-   **eslint-config,prettier-config:** change peer dependencies for regular dependencies ([188bdd9](https://github.com/sapphiredev/utilities/commit/188bdd9b45fd71795422e50589b038311a020f00))

## [1.0.7](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.6...@sapphire/prettier-config@1.0.7) (2021-02-16)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.0.6](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.5...@sapphire/prettier-config@1.0.6) (2021-01-16)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.0.5](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.4...@sapphire/prettier-config@1.0.5) (2021-01-01)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.0.4](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.3...@sapphire/prettier-config@1.0.4) (2020-12-26)

**Note:** Version bump only for package @sapphire/prettier-config

## [1.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.2...@sapphire/prettier-config@1.0.3) (2020-12-23)

### Bug Fixes

-   **discord-utilities:** mention regexes to strictly match their raw formats ([#48](https://github.com/sapphiredev/utilities/issues/48)) ([51c54d1](https://github.com/sapphiredev/utilities/commit/51c54d122f5484aafa58f96e17e75dca635b8b8b))

## [1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.1...@sapphire/prettier-config@1.0.2) (2020-12-22)

### Bug Fixes

-   **prettier-config:** use 2-space indents for yaml files ([768ce24](https://github.com/sapphiredev/utilities/commit/768ce24f4a75d39a8ad0d4722d50d3156f3cbdbd))

## [1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/prettier-config@1.0.0...@sapphire/prettier-config@1.0.1) (2020-12-22)

**Note:** Version bump only for package @sapphire/prettier-config

# 1.0.0 (2020-12-22)

### Features

-   add prettier config package ([#47](https://github.com/sapphiredev/utilities/issues/47)) ([3fae522](https://github.com/sapphiredev/utilities/commit/3fae522b5e7ee3ca7b2e6394e883bea7482643dc))
