# Changelog

All notable changes to this project will be documented in this file.

# [@sapphire/eslint-plugin-result@3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@2.0.4...@sapphire/eslint-plugin-result@3.0.0) - (2026-11-15)

## 🏠 Refactor

- **eslint-plugin-result:** Enhance type definition for plugin ([ea29497](https://github.com/sapphiredev/utilities/commit/ea29497708db3c8bd97ba6f2f3cec1c591d794f2)) ([#998](https://github.com/sapphiredev/utilities/pull/998) by @favna)
- **plugin-result:** Ensure it functions again ([ca1bf0c](https://github.com/sapphiredev/utilities/commit/ca1bf0c3dd9e0aa136b5187d23115baa408b6ce8))
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

- Update eslint dependencies ([b39c5d1](https://github.com/sapphiredev/utilities/commit/b39c5d18d04acc45ae6e22b3de2ca3c873439f7f))
- **eslint-plugin-result:** Detect discarded Results in union return types ([9354f90](https://github.com/sapphiredev/utilities/commit/9354f9041eb2c467bc7febebec1935bbde096ca7))
- **deps:** Update all non-major dependencies ([09c1811](https://github.com/sapphiredev/utilities/commit/09c1811dae117f501f4e03b2015d8288e28734f8)) ([#982](https://github.com/sapphiredev/utilities/pull/982) by @renovate[bot])
- **deps:** Update all non-major dependencies ([72499d9](https://github.com/sapphiredev/utilities/commit/72499d99a9feb107fd3dccea601da462f1f725c1)) ([#980](https://github.com/sapphiredev/utilities/pull/980) by @renovate[bot])
- **deps:** Update all non-major dependencies ([e6d4bac](https://github.com/sapphiredev/utilities/commit/e6d4bac47e65e9e0ec95ebaaa1b679cfc01bd107)) ([#953](https://github.com/sapphiredev/utilities/pull/953) by @renovate[bot])
- **deps:** Update all non-major dependencies ([3f9fe93](https://github.com/sapphiredev/utilities/commit/3f9fe93b770479fd72b7fd56f476244c040fcb41)) ([#952](https://github.com/sapphiredev/utilities/pull/952) by @renovate[bot])
- **deps:** Update all non-major dependencies ([841436f](https://github.com/sapphiredev/utilities/commit/841436f1b501f468b002790283a25298561768d6)) ([#946](https://github.com/sapphiredev/utilities/pull/946) by @renovate[bot])
- **deps:** Update all non-major dependencies ([636a5ee](https://github.com/sapphiredev/utilities/commit/636a5eed0939fd96a82213bf8459846aedd54037)) ([#897](https://github.com/sapphiredev/utilities/pull/897) by @renovate[bot])
- **deps:** Update all non-major dependencies ([4bc5591](https://github.com/sapphiredev/utilities/commit/4bc55911f95456a2caee10a3588c7b5f1542fb00)) ([#879](https://github.com/sapphiredev/utilities/pull/879) by @renovate[bot])
- **deps:** Update all non-major dependencies ([bc2f01c](https://github.com/sapphiredev/utilities/commit/bc2f01ce7d6932c9a0e02faa7cc081ecbae9640d)) ([#869](https://github.com/sapphiredev/utilities/pull/869) by @renovate[bot])
- **deps:** Update all non-major dependencies ([083376a](https://github.com/sapphiredev/utilities/commit/083376aac55094dbeddb5194e8a8f0d794b8cceb)) ([#763](https://github.com/sapphiredev/utilities/pull/763) by @renovate[bot])

## 📝 Documentation

- **readme:** Update feature descriptions across packages ([302730a](https://github.com/sapphiredev/utilities/commit/302730a5b8eccb763b7b9761c3de1db9d3857394))
- Fix changelog urls ([a3da0ab](https://github.com/sapphiredev/utilities/commit/a3da0ab0cfd94f3823c792887e76bb898686a89b)) ([#759](https://github.com/sapphiredev/utilities/pull/759) by @favna)

## 🚀 Features

- Target es2024 when bundling ([293e6b9](https://github.com/sapphiredev/utilities/commit/293e6b9eddbed5db178017d5ddedaaad0cfb3395))
  - 💥 **BREAKING CHANGE:** if your project is not full ES2024 compatible this new version will not work
- Update eslint rules ([901aca9](https://github.com/sapphiredev/utilities/commit/901aca995e28bf5f4b343b441ab658d9c6511195))
  - 💥 **BREAKING CHANGE:** ESLint has been updated to v10
  - 💥 **BREAKING CHANGE:** ESLint configuration has been changed to a flat config
  - 💥 **BREAKING CHANGE:** Our ESLint config is now a small layer on top of [eslint-config-neon](https://www.npmjs.com/package/eslint-config-neon) which brings a LOT more rules and stricter linting.

# [@sapphire/eslint-plugin-result@2.0.4](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@2.0.3...@sapphire/eslint-plugin-result@2.0.4) - (2024-06-03)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Bump transient dependencies ([6d030e2](https://github.com/sapphiredev/utilities/commit/6d030e28b6f9b84b309e2729bba0597e7f5898e0))
- **deps:** Update all non-major dependencies ([7dc491a](https://github.com/sapphiredev/utilities/commit/7dc491a3eebea3bd320fcc73d3b434067646c7df))

# [@sapphire/eslint-plugin-result@2.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@2.0.2...@sapphire/eslint-plugin-result@2.0.3) - (2024-03-11)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Fixed issue with linting with latest typescript-eslint ([0cf3801](https://github.com/sapphiredev/utilities/commit/0cf380184b60c2c7a310ec03b3eb25efb49dffda))
- **deps:** Update typescript-eslint monorepo to v7 (major) (#717) ([f929edc](https://github.com/sapphiredev/utilities/commit/f929edc5c951428a3e72e6f37725f27c4b383c54))
- Fixed commonjs typings export mapping (#707) ([216ff02](https://github.com/sapphiredev/utilities/commit/216ff0260d63a9590357f9a5069f1ae2b34eaf5d))
- Update transitive dependencies ([9fbbbb0](https://github.com/sapphiredev/utilities/commit/9fbbbb0252850d270fdaeaae491ed84d0c93cdf6))
- **eslint-plugin-result:** Bump transitive dependencies ([d4d8bea](https://github.com/sapphiredev/utilities/commit/d4d8bea8fb26541f9a94a9d380bd56a537764285))
- **deps:** Update all non-major dependencies (#681) ([a593be0](https://github.com/sapphiredev/utilities/commit/a593be07bc7a5ec4b9690a83bc6fbf223e012729))

# [@sapphire/eslint-plugin-result@2.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@2.0.2...@sapphire/eslint-plugin-result@2.0.2) - (2023-12-04)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Properly split CJS and ESM ([e357e62](https://github.com/sapphiredev/utilities/commit/e357e629a3932faf827f423736d793c02a495109))
- **eslint-plugin-result:** Update transitive dependencies ([7878399](https://github.com/sapphiredev/utilities/commit/7878399502917fbb90af1b7c85135b2966dd43b2))

# [@sapphire/eslint-plugin-result@2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@2.0.0...@sapphire/eslint-plugin-result@2.0.1) - (2023-08-29)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Update transitive dependencies ([422530e](https://github.com/sapphiredev/utilities/commit/422530e5fb93a31f0c488c00dc50bdd26dee0799))
- **eslint-plugin-result:** Update transitive dependencies ([c00aaa8](https://github.com/sapphiredev/utilities/commit/c00aaa8d6523d54aed1f7e1b6c36f0910e9866a1))

# [@sapphire/eslint-plugin-result@2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@1.0.3...@sapphire/eslint-plugin-result@2.0.0) - (2023-07-21)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Fix typo in rule name constant ([fb156b0](https://github.com/sapphiredev/utilities/commit/fb156b05fd3e9d7b2a5bf640fd8ec0dede2d0a4a))
- **deps:** Update all non-major dependencies ([3c9d07e](https://github.com/sapphiredev/utilities/commit/3c9d07e34217c2494f160d84cd177fba6ced4ac3))

## 🚀 Features

- **eslint-plugin-result:** Update to `@typescript-eslint v6` ([750be13](https://github.com/sapphiredev/utilities/commit/750be13a307db0395b8cb10c29130182c47b20fd))
  - 💥 **BREAKING CHANGE:** This package now depends on `@typescript-eslint` v6

## 🪞 Styling

- Prettier formatting ([2650e29](https://github.com/sapphiredev/utilities/commit/2650e29fe20fe4e82c0d24ecf93ae583bafdee5b))

# [@sapphire/eslint-plugin-result@1.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@1.0.2...@sapphire/eslint-plugin-result@1.0.3) - (2023-07-05)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Update transitive dependencies ([1dc024a](https://github.com/sapphiredev/utilities/commit/1dc024a5462cd110ddfe9ce79648efc30da9e49e))
- **deps:** Update all non-major dependencies (#607) ([9cc8bd0](https://github.com/sapphiredev/utilities/commit/9cc8bd0d4b5d650deab2c913e6c3d713861bae28))
- **eslint-plugin-result:** Update dependencies ([b68b697](https://github.com/sapphiredev/utilities/commit/b68b69790c73a24df581a720f6a13cfd6ff5ff68))
- **eslint-plugin-result:** Update transitive dependencies ([16928b7](https://github.com/sapphiredev/utilities/commit/16928b7d8a35c1a498762b2c74b4d63c6621f341))
- **eslint-plugin-result:** Bump typescript-eslint ([74c717a](https://github.com/sapphiredev/utilities/commit/74c717a2b5884ac58b34f60d60e49ef46d18a6f3))

## 🧪 Testing

- Update vitest to coverage v8 ([a4bc6e4](https://github.com/sapphiredev/utilities/commit/a4bc6e4f24ea60143a150ecc76fda6484f172ab9))

# [@sapphire/eslint-plugin-result@1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@1.0.1...@sapphire/eslint-plugin-result@1.0.2) - (2023-05-02)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Update dependencies ([49fc9c9](https://github.com/sapphiredev/utilities/commit/49fc9c975c22567e74b585651d2a6e62cbb42562))
- **eslint-plugin-result:** Ensure the correct .d.ts is read ([ad2701e](https://github.com/sapphiredev/utilities/commit/ad2701e4154200cb0701993b856aad88a8d4a04f))

# [@sapphire/eslint-plugin-result@1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/eslint-plugin-result@1.0.0...@sapphire/eslint-plugin-result@1.0.1) - (2023-04-10)

## 🐛 Bug Fixes

- **eslint-plugin-result:** Only outputs cjs (eslint only uses cjs) ([006b002](https://github.com/sapphiredev/utilities/commit/006b002f69066910e2d7df3f7b00d4ff181b6916))
- **eslint-config-plugin-result:** Update typescript to 5.0.3 ([f6598a4](https://github.com/sapphiredev/utilities/commit/f6598a427a1cfafd36c6ae0cc9c9055e0ce94cc1))
- **eslint-plugin-result:** Fix export assignment to use `module.exports` ([fde82b0](https://github.com/sapphiredev/utilities/commit/fde82b07e55e849e30477fac0dca77a59393a14c))
- **eslint-plugin-result:** Add missing type modifiers ([bd9c87b](https://github.com/sapphiredev/utilities/commit/bd9c87be65b4a7b0bda66df867199ebec70d532a))
- **deps:** Update all non-major dependencies (#577) ([291dd67](https://github.com/sapphiredev/utilities/commit/291dd6783e57d8f075ce566218ba076ef6c4bbbd))
- **eslint-config:** Bump dependencies ([8e25c99](https://github.com/sapphiredev/utilities/commit/8e25c99ab5d9c4e18831e000ab8101a079815f3b))

# [@sapphire/eslint-plugin-result@1.0.0](https://github.com/sapphiredev/utilities/tree/@sapphire/eslint-plugin-result@1.0.0) - (2023-03-12)

## 🚀 Features

- @sapphire/eslint-plugin-result (#556) ([009d3d2](https://github.com/sapphiredev/utilities/commit/009d3d2e3cfa51ac195a0b85a6c9e18cb32b4201))

