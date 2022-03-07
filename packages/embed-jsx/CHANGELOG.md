# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.3.0](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.2.0...@sapphire/embed-jsx@2.3.0) (2022-03-06)

### Features

-   allow module: NodeNext ([#306](https://github.com/sapphiredev/utilities/issues/306)) ([9dc6dd6](https://github.com/sapphiredev/utilities/commit/9dc6dd619efab879bb2b0b3c9e64304e10a67ed6))
-   **ts-config:** add multi-config structure ([#281](https://github.com/sapphiredev/utilities/issues/281)) ([b5191d7](https://github.com/sapphiredev/utilities/commit/b5191d7f2416dc5838590c4ff221454925553e37))

# [2.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.6...@sapphire/embed-jsx@2.2.0) (2022-01-28)

### Features

-   change build system to tsup ([#270](https://github.com/sapphiredev/utilities/issues/270)) ([365a53a](https://github.com/sapphiredev/utilities/commit/365a53a5517a01a0926cf28a83c96b63f32ed9f8))

## [2.1.6](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.5...@sapphire/embed-jsx@2.1.6) (2022-01-10)

**Note:** Version bump only for package @sapphire/embed-jsx

## [2.1.5](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.4...@sapphire/embed-jsx@2.1.5) (2021-11-15)

### Bug Fixes

-   **embed-jsx:** remove instances of eslint-ignore comment ([#213](https://github.com/sapphiredev/utilities/issues/213)) ([8a451b5](https://github.com/sapphiredev/utilities/commit/8a451b582c2bfbcc74e0a58749bda6a9d7cb3ccd))

## [2.1.4](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.3...@sapphire/embed-jsx@2.1.4) (2021-11-06)

**Note:** Version bump only for package @sapphire/embed-jsx

## [2.1.3](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.2...@sapphire/embed-jsx@2.1.3) (2021-10-26)

**Note:** Version bump only for package @sapphire/embed-jsx

## [2.1.2](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.1...@sapphire/embed-jsx@2.1.2) (2021-10-17)

### Bug Fixes

-   allow more node & npm versions in engines field ([5977d2a](https://github.com/sapphiredev/utilities/commit/5977d2a30a4b2cfdf84aff3f33af03ffde1bbec5))

## [2.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.1.0...@sapphire/embed-jsx@2.1.1) (2021-10-11)

**Note:** Version bump only for package @sapphire/embed-jsx

# [2.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.0.1...@sapphire/embed-jsx@2.1.0) (2021-10-10)

**Note:** Version bump only for package @sapphire/embed-jsx

## [2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@2.0.0...@sapphire/embed-jsx@2.0.1) (2021-10-08)

### Bug Fixes

-   **embed-jsx:** properly run postbuild scripts ([8e642ad](https://github.com/sapphiredev/utilities/commit/8e642ad9027d0dd2cb8760202a40b06e310ca3fd))

# [2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@1.1.3...@sapphire/embed-jsx@2.0.0) (2021-10-04)

### Features

-   **discord.js-utilities:** update for Discord.JS v13 ([#135](https://github.com/sapphiredev/utilities/issues/135)) ([f5a8f64](https://github.com/sapphiredev/utilities/commit/f5a8f642aa45d9c1267337bd141461f213ac9e98))
-   **embed-jsx:** set minimum NodeJS to v14 ([3c49821](https://github.com/sapphiredev/utilities/commit/3c49821859f5aa2319c3e8fbaa816d92ebeb7d3d))

### BREAKING CHANGES

-   **discord.js-utilities:** As this release bumps the minimum Discord.JS version from v12.x to v13.x we also advice looking at [The DiscordJS v12 to v13 migration guide](https://deploy-preview-680--discordjs-guide.netlify.app/additional-info/changes-in-v13.html)
-   **discord.js-utilities:** `Awaited` utility type is no longer exported from constants. Use `@sapphire/utilities`.
-   **discord.js-utilities:** `Constructor` utility type is no longer exported from constants. Use `@sapphire/utilities`.
-   **discord.js-utilities:** `MessageBuilder.allowedMentions`'s type has been changed to `MessageOptions['allowedMentions']`
-   **discord.js-utilities:** `MessageBuilder.code` has been removed as this is no longer in the `MessageOptions` of Discord.JS
-   **discord.js-utilities:** `MessageBuilder.content`'s type has been changed to `MessageOptions['content']`
-   **discord.js-utilities:** `MessageBuilder.embed` has been changed to `MessageBuilder.embeds`
-   **discord.js-utilities:** `MessageBuilder.embeds`'s type has been changed to `MessageOptions['embeds']`
-   **discord.js-utilities:** `MessageBuilder.files`'s type has been changed to `MessageOptions['files']`
-   **discord.js-utilities:** `MessageBuilder.nonce`'s type has been changed to `MessageOptions['nonce']`
-   **discord.js-utilities:** `MessageBuilder.setEmbed()` has been changed to `MessageBuilder.setEmbeds()`
-   **discord.js-utilities:** `MessageBuilder.split` has been removed as this is no longer in the `MessageOptions` of Discord.JS
-   **discord.js-utilities:** `MessageBuilder.tts`'s type has been changed to `MessageOptions['tts']`
-   **discord.js-utilities:** `MessagePrompterMessage` has been changed from `APIMessageContentResolvable | (MessageOptions & { split?: false }) | MessageAdditions` to `ArgumentTypes<PartialTextBasedChannelFields['send']>[0]`, which is the same type as the single argument for the common `message.channel.send()` method.
-   **discord.js-utilities:** When providing more than 1 embed template to `PaginatedMessages.options.template` as well as more than 1 embed on a given `MessagePage` an attempt will be made to apply to footer of the template at the respective index, otherwise it will fallback to the footer of the first embed in the template, and if that fails it will be an empty string.

## [1.1.3](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@1.1.2...@sapphire/embed-jsx@1.1.3) (2021-06-27)

**Note:** Version bump only for package @sapphire/embed-jsx

## [1.1.2](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@1.1.1...@sapphire/embed-jsx@1.1.2) (2021-06-06)

### Bug Fixes

-   remove peer deps, update dev deps, update READMEs ([#124](https://github.com/sapphiredev/utilities/issues/124)) ([67256ed](https://github.com/sapphiredev/utilities/commit/67256ed43b915b02a8b5c68230ba82d6210c5032))

## [1.1.1](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@1.1.0...@sapphire/embed-jsx@1.1.1) (2021-05-20)

### Bug Fixes

-   **embed-jsx:** mark package as side effect free ([a5ef679](https://github.com/sapphiredev/utilities/commit/a5ef6793f0f61d269fb5b2e41ec919830ff28870))

# [1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/embed-jsx@1.0.0...@sapphire/embed-jsx@1.1.0) (2021-05-02)

### Features

-   **embed-jsx:** type the elements AND return type ([#110](https://github.com/sapphiredev/utilities/issues/110)) ([3a4735e](https://github.com/sapphiredev/utilities/commit/3a4735e58efd22ee253044331d240a3066d971f3))

# 1.0.0 (2021-04-21)

### Features

-   **embed-jsx:** add data validation ([#108](https://github.com/sapphiredev/utilities/issues/108)) ([8953fdd](https://github.com/sapphiredev/utilities/commit/8953fdd266785f37cafaf90ab7c79ab9060411ad))
-   add @sapphire/embed-jsx ([#100](https://github.com/sapphiredev/utilities/issues/100)) ([7277a23](https://github.com/sapphiredev/utilities/commit/7277a236015236ed8e81b7882875410facc4ce17))
