# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.1.0...@sapphire/discord-utilities@2.1.1) (2021-05-02)

### Bug Fixes

-   drop the `www.` from the SapphireJS URL ([494d89f](https://github.com/sapphiredev/utilities/commit/494d89ffa04f78c195b93d7905b3232884f7d7e2))
-   update all the SapphireJS URLs from `.com` to `.dev` ([f59b46d](https://github.com/sapphiredev/utilities/commit/f59b46d1a0ebd39cad17b17d71cd3b9da808d5fd))

# [2.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.8...@sapphire/discord-utilities@2.1.0) (2021-04-21)

### Features

-   add @sapphire/embed-jsx ([#100](https://github.com/sapphiredev/utilities/issues/100)) ([7277a23](https://github.com/sapphiredev/utilities/commit/7277a236015236ed8e81b7882875410facc4ce17))

## [2.0.8](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.7...@sapphire/discord-utilities@2.0.8) (2021-04-19)

### Bug Fixes

-   change all Sapphire URLs from "project"->"community" & use our domain where applicable 👨‍🌾🚜 ([#102](https://github.com/sapphiredev/utilities/issues/102)) ([835b408](https://github.com/sapphiredev/utilities/commit/835b408e8e57130c3787aca2e32613346ff23e4d))

## [2.0.7](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.6...@sapphire/discord-utilities@2.0.7) (2021-04-03)

**Note:** Version bump only for package @sapphire/discord-utilities

## [2.0.6](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.5...@sapphire/discord-utilities@2.0.6) (2021-03-16)

### Bug Fixes

-   remove terser from all packages ([#79](https://github.com/sapphiredev/utilities/issues/79)) ([1cfe4e7](https://github.com/sapphiredev/utilities/commit/1cfe4e7c804e62c142495686d2b83b81d0026c02))

## [2.0.5](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.4...@sapphire/discord-utilities@2.0.5) (2021-02-18)

### Bug Fixes

-   **discord-utilities:** ensure `FormattedCustomEmojiWithGroups` and `ParsedCustomEmojiWithGroups` can be used as substring extraction ([#75](https://github.com/sapphiredev/utilities/issues/75)) ([f62e8d3](https://github.com/sapphiredev/utilities/commit/f62e8d37714353397bdbe48676f43f180adb660f))

## [2.0.4](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.3...@sapphire/discord-utilities@2.0.4) (2021-02-16)

### Bug Fixes

-   **discord-utils:** fix typo in TSDocs ([#74](https://github.com/sapphiredev/utilities/issues/74)) ([686f7ed](https://github.com/sapphiredev/utilities/commit/686f7ed28859d9d8a7987e4601604bdf0b10d5bf))

## [2.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.2...@sapphire/discord-utilities@2.0.3) (2021-02-13)

### Features

-   **discord-utilities:** add discord webhook regex ([#70](https://github.com/sapphiredev/utilities/issues/70)) ([8d56522](https://github.com/sapphiredev/utilities/commit/8d565228f0edf8b38846e1394056c2db122eb6cf))

## [2.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.1...@sapphire/discord-utilities@2.0.2) (2021-02-13)

### Bug Fixes

-   **discord-utilities:** `TwemojiRegex` is a RegExp, not a string ([#72](https://github.com/sapphiredev/utilities/issues/72)) ([5dbdf84](https://github.com/sapphiredev/utilities/commit/5dbdf8439f5602f4c363d2768c43d398715f8773))

## [2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@2.0.0...@sapphire/discord-utilities@2.0.1) (2021-01-16)

**Note:** Version bump only for package @sapphire/discord-utilities

# [2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@1.0.3...@sapphire/discord-utilities@2.0.0) (2021-01-01)

### Bug Fixes

-   **discord-utilities:** assign non-conflicting UMD global name ([373ccbe](https://github.com/sapphiredev/utilities/commit/373ccbea1e5161281c4779310dc657101dfc6142))

### Features

-   **discord-utilities:** add breaking change note to README ([cd0b999](https://github.com/sapphiredev/utilities/commit/cd0b999bc810abbee73ccec601ef3fd35f4e5cb5))
-   add discord.js-utilities pkg ([#52](https://github.com/sapphiredev/utilities/issues/52)) ([b61b05c](https://github.com/sapphiredev/utilities/commit/b61b05c148ea1d4aa28f4cccd27472e1dccf7702))

### BREAKING CHANGES

-   **discord-utilities:** discord-utilities no longer has type-guard functions as they are now moved to the
    discord.js-utilities package. Install @sapphire/discord.js-utilities along with
    @sapphire/discord-utilities to have the full utilities experience.

## [1.0.3](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@1.0.2...@sapphire/discord-utilities@1.0.3) (2020-12-26)

**Note:** Version bump only for package @sapphire/discord-utilities

## [1.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@1.0.1...@sapphire/discord-utilities@1.0.2) (2020-12-23)

### Bug Fixes

-   **discord-utilities:** Correctly assert text channels in isTextChannel ([#49](https://github.com/sapphiredev/utilities/issues/49)) ([552ce20](https://github.com/sapphiredev/utilities/commit/552ce20605eb35c43b66d5697e21d0e03a2fda82))
-   **discord-utilities:** mention regexes to strictly match their raw formats ([#48](https://github.com/sapphiredev/utilities/issues/48)) ([51c54d1](https://github.com/sapphiredev/utilities/commit/51c54d122f5484aafa58f96e17e75dca635b8b8b))

## [1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord-utilities@1.0.0...@sapphire/discord-utilities@1.0.1) (2020-12-22)

**Note:** Version bump only for package @sapphire/discord-utilities

# 1.0.0 (2020-12-22)

### Features

-   add discord-utilities package ([#46](https://github.com/sapphiredev/utilities/issues/46)) ([fb3574a](https://github.com/sapphiredev/utilities/commit/fb3574a166e9ce15d47bd8303db85db5ab3093a9))
