# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [4.3.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.3.1...@sapphire/decorators@4.3.2) (2022-03-20)

**Note:** Version bump only for package @sapphire/decorators

## [4.3.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.3.0...@sapphire/decorators@4.3.1) (2022-03-11)

**Note:** Version bump only for package @sapphire/decorators

# [4.3.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.6...@sapphire/decorators@4.3.0) (2022-03-06)

### Features

-   allow module: NodeNext ([#306](https://github.com/sapphiredev/utilities/issues/306)) ([9dc6dd6](https://github.com/sapphiredev/utilities/commit/9dc6dd619efab879bb2b0b3c9e64304e10a67ed6))

## [4.2.6](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.5...@sapphire/decorators@4.2.6) (2022-03-01)

**Note:** Version bump only for package @sapphire/decorators

## [4.2.5](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.4...@sapphire/decorators@4.2.5) (2022-02-18)

**Note:** Version bump only for package @sapphire/decorators

## [4.2.4](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.3...@sapphire/decorators@4.2.4) (2022-02-15)

**Note:** Version bump only for package @sapphire/decorators

## [4.2.3](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.2...@sapphire/decorators@4.2.3) (2022-02-11)

**Note:** Version bump only for package @sapphire/decorators

## [4.2.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.1...@sapphire/decorators@4.2.2) (2022-02-07)

**Note:** Version bump only for package @sapphire/decorators

## [4.2.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.2.0...@sapphire/decorators@4.2.1) (2022-02-06)

**Note:** Version bump only for package @sapphire/decorators

# [4.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.1.0...@sapphire/decorators@4.2.0) (2022-02-03)

### Features

-   **ts-config:** add multi-config structure ([#281](https://github.com/sapphiredev/utilities/issues/281)) ([b5191d7](https://github.com/sapphiredev/utilities/commit/b5191d7f2416dc5838590c4ff221454925553e37))

# [4.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.0.2...@sapphire/decorators@4.1.0) (2022-01-28)

### Features

-   change build system to tsup ([#270](https://github.com/sapphiredev/utilities/issues/270)) ([365a53a](https://github.com/sapphiredev/utilities/commit/365a53a5517a01a0926cf28a83c96b63f32ed9f8))

## [4.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.0.1...@sapphire/decorators@4.0.2) (2022-01-21)

**Note:** Version bump only for package @sapphire/decorators

## [4.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@4.0.0...@sapphire/decorators@4.0.1) (2022-01-21)

**Note:** Version bump only for package @sapphire/decorators

# [4.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.6...@sapphire/decorators@4.0.0) (2022-01-16)

### Features

-   **decorators:** add container to `ApplyOptions` callback ([#258](https://github.com/sapphiredev/utilities/issues/258)) ([d2876b8](https://github.com/sapphiredev/utilities/commit/d2876b83ce2356424e12e63cfe9f9e14c6ce52e0))
-   **decorators:** remove `enumerable` and `enumerableMethod`. Use their PascalCased variants instead. ([38e2977](https://github.com/sapphiredev/utilities/commit/38e2977b8dc061d0d62f076b12808b196e92b73a))

### BREAKING CHANGES

-   **decorators:** The previously deprecated enumerable`and`enumerableMethod` decorators have been removed. Use their PascalCased variants instead.
-   **decorators:** When using `@ApplyOptions` with a callback function, the single parameter of `PieceContex` been changed to an object, which also has a property of `Container`. Migration change is `@ApplyOptions<Listener.Options>(({ context }) => ({`

## [3.1.6](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.5...@sapphire/decorators@3.1.6) (2022-01-12)

**Note:** Version bump only for package @sapphire/decorators

## [3.1.5](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.4...@sapphire/decorators@3.1.5) (2022-01-10)

**Note:** Version bump only for package @sapphire/decorators

## [3.1.4](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.3...@sapphire/decorators@3.1.4) (2021-11-06)

**Note:** Version bump only for package @sapphire/decorators

## [3.1.3](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.2...@sapphire/decorators@3.1.3) (2021-10-26)

### Bug Fixes

-   **docs:** replace command usage of `run` to `messageRun` ([#204](https://github.com/sapphiredev/utilities/issues/204)) ([8279ec0](https://github.com/sapphiredev/utilities/commit/8279ec01e9037fb12e37e872979966c1c2e264e1))

## [3.1.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.1...@sapphire/decorators@3.1.2) (2021-10-17)

### Bug Fixes

-   allow more node & npm versions in engines field ([5977d2a](https://github.com/sapphiredev/utilities/commit/5977d2a30a4b2cfdf84aff3f33af03ffde1bbec5))

## [3.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.1.0...@sapphire/decorators@3.1.1) (2021-10-11)

**Note:** Version bump only for package @sapphire/decorators

# [3.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.0.1...@sapphire/decorators@3.1.0) (2021-10-10)

**Note:** Version bump only for package @sapphire/decorators

## [3.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@3.0.0...@sapphire/decorators@3.0.1) (2021-10-08)

### Bug Fixes

-   **decorators:** properly run postbuild scripts ([b71b7a5](https://github.com/sapphiredev/utilities/commit/b71b7a52ac2f2d64b49dc5835d08c8c6a3625752))

# [3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.2.0...@sapphire/decorators@3.0.0) (2021-10-04)

### Bug Fixes

-   **discord.js-utilities:** fixed permission error messages grammar ([ea9840b](https://github.com/sapphiredev/utilities/commit/ea9840b258770be20eb576b59d470fb03293f694))

### Features

-   **decorators:** add `RequiresUserPermissions` ([688e39f](https://github.com/sapphiredev/utilities/commit/688e39f26507a81fcf8be7c9e55d6290f38da460))
-   **decorators:** add default messages to errors thrown by `RequiresPermissions` ([13d89a3](https://github.com/sapphiredev/utilities/commit/13d89a3e4e37664e59d8a7b722df95786c5fdf1b))
-   **decorators:** set minimum NodeJS to v14 ([46c0f68](https://github.com/sapphiredev/utilities/commit/46c0f68a4b4f8ec5cff221183a1a620954be84be))

### BREAKING CHANGES

-   **decorators:** `RequiresPermissions` has been renamed to `RequiresClientPermissions`
-   **decorators:** enum entry `DecoratorIdentifiers.RequiresPermissionsGuildOnly` has been changed to `DecoratorIdentifiers.RequiresClientPermissionsGuildOnly`
-   **decorators:** enum entry `DecoratorIdentifiers.RequiresPermissionsMissingPermissions` has been changed to `DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions`
-   **decorators:** i18n identifier `requiresPermissionsGuildOnly` has been changed to `requiresClientPermissionsGuildOnly`
-   **decorators:** i18n identifier `requiresPermissionsMissingPermissions` has been changed to `requiresClientPermissionsMissingPermissions`

# [2.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.5...@sapphire/decorators@2.2.0) (2021-07-20)

### Features

-   **decorators:** add new permission decorators ([#138](https://github.com/sapphiredev/utilities/issues/138)) ([60ab0ca](https://github.com/sapphiredev/utilities/commit/60ab0cabcc768950909b0a35c2924edff13cec0e))

## [2.1.5](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.4...@sapphire/decorators@2.1.5) (2021-06-27)

**Note:** Version bump only for package @sapphire/decorators

## [2.1.4](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.3...@sapphire/decorators@2.1.4) (2021-06-19)

### Bug Fixes

-   **docs:** update-tsdoc-for-vscode-may-2021 ([#126](https://github.com/sapphiredev/utilities/issues/126)) ([f8581bf](https://github.com/sapphiredev/utilities/commit/f8581bfe97a1b2f8aac3a3d3ed342d8ba92d730b))

## [2.1.3](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.2...@sapphire/decorators@2.1.3) (2021-06-06)

### Bug Fixes

-   remove peer deps, update dev deps, update READMEs ([#124](https://github.com/sapphiredev/utilities/issues/124)) ([67256ed](https://github.com/sapphiredev/utilities/commit/67256ed43b915b02a8b5c68230ba82d6210c5032))

## [2.1.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.1...@sapphire/decorators@2.1.2) (2021-05-20)

### Bug Fixes

-   **decorators:** mark package as side effect free ([d42dadf](https://github.com/sapphiredev/utilities/commit/d42dadfbc76cf6613479e03f1216d35fc247af30))

## [2.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.1.0...@sapphire/decorators@2.1.1) (2021-05-02)

### Bug Fixes

-   drop the `www.` from the SapphireJS URL ([494d89f](https://github.com/sapphiredev/utilities/commit/494d89ffa04f78c195b93d7905b3232884f7d7e2))
-   update all the SapphireJS URLs from `.com` to `.dev` ([f59b46d](https://github.com/sapphiredev/utilities/commit/f59b46d1a0ebd39cad17b17d71cd3b9da808d5fd))

# [2.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.10...@sapphire/decorators@2.1.0) (2021-04-21)

### Features

-   add @sapphire/embed-jsx ([#100](https://github.com/sapphiredev/utilities/issues/100)) ([7277a23](https://github.com/sapphiredev/utilities/commit/7277a236015236ed8e81b7882875410facc4ce17))

## [2.0.10](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.9...@sapphire/decorators@2.0.10) (2021-04-19)

### Bug Fixes

-   change all Sapphire URLs from "project"->"community" & use our domain where applicable 👨‍🌾🚜 ([#102](https://github.com/sapphiredev/utilities/issues/102)) ([835b408](https://github.com/sapphiredev/utilities/commit/835b408e8e57130c3787aca2e32613346ff23e4d))

## [2.0.9](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.8...@sapphire/decorators@2.0.9) (2021-04-03)

**Note:** Version bump only for package @sapphire/decorators

## [2.0.8](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.7...@sapphire/decorators@2.0.8) (2021-03-16)

### Bug Fixes

-   **decorators:** bump framework dependency to v1.0.0 ([33dc61d](https://github.com/sapphiredev/utilities/commit/33dc61d9d0455cbe2f1385728fb8a2dd425dcc2a))

## [2.0.7](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.6...@sapphire/decorators@2.0.7) (2021-03-16)

### Bug Fixes

-   **decorators:** add tslib dependency ([3085f1d](https://github.com/sapphiredev/utilities/commit/3085f1dadcd84fc8f7aa9c39a7f23333c1d4eb14))

## [2.0.6](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.5...@sapphire/decorators@2.0.6) (2021-03-16)

**Note:** Version bump only for package @sapphire/decorators

## [2.0.5](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.4...@sapphire/decorators@2.0.5) (2021-02-22)

### Bug Fixes

-   **decorators:** clean up required peer dependencies ([b29e8a7](https://github.com/sapphiredev/utilities/commit/b29e8a7c2adb7c6beff392291fd5f2bc8587271c))

## [2.0.4](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.3...@sapphire/decorators@2.0.4) (2021-02-16)

**Note:** Version bump only for package @sapphire/decorators

## [2.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.2...@sapphire/decorators@2.0.3) (2021-01-18)

### Bug Fixes

-   **decorators:** change `ApplyOptions`'s callback parameter from Client to PieceContext ([#61](https://github.com/sapphiredev/utilities/issues/61)) ([d8b916b](https://github.com/sapphiredev/utilities/commit/d8b916bb0f90b40499f7d6315bfec3cfd6642968))

## [2.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.1...@sapphire/decorators@2.0.2) (2021-01-16)

**Note:** Version bump only for package @sapphire/decorators

## [2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@2.0.0...@sapphire/decorators@2.0.1) (2021-01-09)

### Bug Fixes

-   **decorators:** assign proper homepage url in package ([495fffc](https://github.com/sapphiredev/utilities/commit/495fffc3424335bd481ba684c29b2193194f2545))

# [2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.2.1...@sapphire/decorators@2.0.0) (2021-01-08)

### Features

-   **{ts,eslint}-config,decorators:** remove TypeScript v3 from peer dependencies ([a211f0b](https://github.com/sapphiredev/utilities/commit/a211f0b1d07c634cf80701a6685537c14e35586e))

### BREAKING CHANGES

-   **{ts,eslint}-config,decorators:** TypeScript v3 removed from peer dependencies, it may still work, however we
    strongly recommend updating.

## [1.2.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.2.0...@sapphire/decorators@1.2.1) (2021-01-01)

**Note:** Version bump only for package @sapphire/decorators

# [1.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.1.0...@sapphire/decorators@1.2.0) (2020-12-26)

### Bug Fixes

-   **utilities,time-utilities:** set published versions of dependencies in peerDependencies ([adee6fc](https://github.com/sapphiredev/utilities/commit/adee6fcbd1f7d85e5abee2630aeaa3a192e2a29f))

### Features

-   **decorators:** add createFunctionPrecondition, fixed build ([#51](https://github.com/sapphiredev/utilities/issues/51)) ([c87d5db](https://github.com/sapphiredev/utilities/commit/c87d5db8e29bbfcf96a29e34e4e4186426bac304))

# [1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.0.3...@sapphire/decorators@1.1.0) (2020-12-22)

### Features

-   added time-utilities package ([#26](https://github.com/sapphiredev/utilities/issues/26)) ([f17a333](https://github.com/sapphiredev/utilities/commit/f17a3339667a452e8745fad7884272176e5d65e8))

## [1.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.0.2...@sapphire/decorators@1.0.3) (2020-11-04)

### Bug Fixes

-   **decorators:** properly specify ESM and CommonJS exports ([8bf3ec7](https://github.com/sapphiredev/utilities/commit/8bf3ec7a025574244e232fae93f31e67b1689cf9))

## [1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.0.1...@sapphire/decorators@1.0.2) (2020-10-11)

**Note:** Version bump only for package @sapphire/decorators

## [1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/decorators@1.0.0...@sapphire/decorators@1.0.1) (2020-09-20)

**Note:** Version bump only for package @sapphire/decorators

# 1.0.0 (2020-09-05)

### Features

-   **decorators:** add enumerableMethod decorator ([aa60625](https://github.com/sapphiredev/utilities/commit/aa606251336eb983e7a37e10bc69bb2ba232683a))
-   implement snowflake ([5ba4e2d](https://github.com/sapphiredev/utilities/commit/5ba4e2d82557dd4ff60ffe891a7b46e46373bea2))
-   **decorators:** add decorators package ([#4](https://github.com/sapphiredev/utilities/issues/4)) ([677b3e5](https://github.com/sapphiredev/utilities/commit/677b3e59d5c6160cbe6fb410821cadd7c0f00e3c))
-   **decorators:** add enumerable decorator ([cbdd445](https://github.com/sapphiredev/utilities/commit/cbdd445dbe9341691ed706357bbcdd8636078a1b))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/skyra-project/decorators/compare/v2.2.0...v2.3.0) (2020-07-26)

### Features

-   rename master branch to main ([ea05734](https://github.com/skyra-project/decorators/commit/ea05734f32db0ea475e699e27658fb2749b40d5f))

## [2.2.0](https://github.com/skyra-project/decorators/compare/v2.1.2...v2.2.0) (2020-07-02)

### Features

-   allow ApplyOptions to take a function ([#24](https://github.com/skyra-project/decorators/issues/24)) ([cbcabdc](https://github.com/skyra-project/decorators/commit/cbcabdc03cb937364cde72a3d4d393cfbf474e55))
-   **apply-options:** add extendables support ([#26](https://github.com/skyra-project/decorators/issues/26)) ([39421bb](https://github.com/skyra-project/decorators/commit/39421bb69042a75d2b0257c6726436f432448281))

### [2.1.2](https://github.com/skyra-project/decorators/compare/v2.1.1...v2.1.2) (2020-06-14)

### Bug Fixes

-   **core:** properly pass rest options for ApplyOptions ([e7c68d2](https://github.com/skyra-project/decorators/commit/e7c68d2613c16a4438b9a816a71d0c20de71cac5))

### [2.1.1](https://github.com/skyra-project/decorators/compare/v2.1.0...v2.1.1) (2020-06-14)

### Bug Fixes

-   remove unnecessary optional chain ([bd7f3ec](https://github.com/skyra-project/decorators/commit/bd7f3ec347edd57c681b2283425569f3df4b5f32))

## [2.1.0](https://github.com/skyra-project/decorators/compare/v2.0.0...v2.1.0) (2020-06-13)

### Features

-   add CreateResolvers & requiredPermissions decorators ([3bdc4bd](https://github.com/skyra-project/decorators/commit/3bdc4bd4066a1e1112307c15c69fc80c790584f0))

## [2.0.0](https://github.com/skyra-project/decorators/compare/v1.0.0...v2.0.0) (2020-05-30)

### ⚠ BREAKING CHANGES

-   NodeJS version 12 is no longer supported. Install NodeJS 14 or higher.
-   Discord.JS is no longer supported. This library now targets @klasa/core and the new
    klasa

### Features

-   rework to using @klasa/core and the new klasa ([5100e86](https://github.com/skyra-project/decorators/commit/5100e869bc11e932350f97846942a8eb7b141c37))

### Bug Fixes

-   target NodeJS version 14 and higher ([a678765](https://github.com/skyra-project/decorators/commit/a678765ff28c2d16e12489512ac1d3d0d79e10fb))

## 1.0.0 (2020-03-01)

### Features

-   add ApplyOptions + move to Jest ([#19](https://github.com/skyra-project/decorators/issues/19)) ([972e164](https://github.com/skyra-project/decorators/commit/972e164a40b5bb6f1296ea8a3d1f8312a3c8de23))
-   update license ([d2366be](https://github.com/skyra-project/decorators/commit/d2366be6207c3794858d7255274b4c83fe14503d))
