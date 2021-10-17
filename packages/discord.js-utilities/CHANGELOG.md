# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.2.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.2.1...@sapphire/discord.js-utilities@3.2.2) (2021-10-17)

### Bug Fixes

-   allow more node & npm versions in engines field ([5977d2a](https://github.com/sapphiredev/utilities/commit/5977d2a30a4b2cfdf84aff3f33af03ffde1bbec5))

## [3.2.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.2.0...@sapphire/discord.js-utilities@3.2.1) (2021-10-11)

**Note:** Version bump only for package @sapphire/discord.js-utilities

# [3.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.1.0...@sapphire/discord.js-utilities@3.2.0) (2021-10-10)

### Features

-   update to DJS v13 ([4085534](https://github.com/sapphiredev/utilities/commit/4085534e538a94e0a2fe6e33cd9825a408eb1c65))

# [3.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.0.2...@sapphire/discord.js-utilities@3.1.0) (2021-10-08)

### Features

-   **discord.js-utilities:** add support for setting custom page options ([#196](https://github.com/sapphiredev/utilities/issues/196)) ([9baa7c0](https://github.com/sapphiredev/utilities/commit/9baa7c0feb70e045a1e54a0f17069abe7ee20dec))

## [3.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.0.1...@sapphire/discord.js-utilities@3.0.2) (2021-10-08)

**Note:** Version bump only for package @sapphire/discord.js-utilities

## [3.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@3.0.0...@sapphire/discord.js-utilities@3.0.1) (2021-10-04)

**Note:** Version bump only for package @sapphire/discord.js-utilities

# [3.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@2.0.2...@sapphire/discord.js-utilities@3.0.0) (2021-10-04)

### Bug Fixes

-   **discord.js-utilities:** account thread channels in permission checks ([#165](https://github.com/sapphiredev/utilities/issues/165)) ([d4982ed](https://github.com/sapphiredev/utilities/commit/d4982ed61703ddfba4174766ee013a7088006a06))
-   **discord.js-utilities:** allow more channel types for MessagePrompter ([cf7c8ed](https://github.com/sapphiredev/utilities/commit/cf7c8edbcd6b7ed1ffd2de63e99199be873c2963))
-   **discord.js-utilities:** allow more types in `can*` methods ([15fcf51](https://github.com/sapphiredev/utilities/commit/15fcf513af69c47650214391b131bf2f5526cf39))
-   **discord.js-utilities:** fixed examples for MessagePrompter ([660f4be](https://github.com/sapphiredev/utilities/commit/660f4be50ec851deaf0a5ea5fd11ed4fff7b810a))
-   **discord.js-utilities:** import type from dapi types v9 ([9b57a29](https://github.com/sapphiredev/utilities/commit/9b57a2911aab6e995bcf0c93175622a1060a43d0))
-   **discord.js-utilities:** mismatch between types ([#161](https://github.com/sapphiredev/utilities/issues/161)) ([823c6b1](https://github.com/sapphiredev/utilities/commit/823c6b12142eb69d4f91a829363b48038e687df3))
-   **discord.js-utilities:** remove `MessagePrompterStrategies` in favour of `keyof StrategyReturns` ([#159](https://github.com/sapphiredev/utilities/issues/159)) ([c185369](https://github.com/sapphiredev/utilities/commit/c185369a699277e3d0cca842dc979b58d67ed978))
-   **djs-utilities:** fixed parameter types for type guards ([#152](https://github.com/sapphiredev/utilities/issues/152)) ([6e8314f](https://github.com/sapphiredev/utilities/commit/6e8314f38dbf99105eec2533a8154a7820c86e25))
-   **PaginatedMessage:** fixed `embedFooterSeperator` -> `embedFooterSeparator` ([#191](https://github.com/sapphiredev/utilities/issues/191)) ([cf2c08f](https://github.com/sapphiredev/utilities/commit/cf2c08f1333370779561a155f569416cc4aaa272))
-   **PaginatedMessage:** fixed formatting for embed footers ([a4e5a56](https://github.com/sapphiredev/utilities/commit/a4e5a567a4d75dbba57df6774664ebaff55c24f4))
-   **utilities:** rename `Awaited<T>` to `Awaitable<T>` ([#193](https://github.com/sapphiredev/utilities/issues/193)) ([6ff3e28](https://github.com/sapphiredev/utilities/commit/6ff3e28a78cc9c2b3d58d42fbfba876ab70046c2))

### Features

-   backported more utilities and fixed bugs ([5cb1862](https://github.com/sapphiredev/utilities/commit/5cb18622e200ebacfc2aa2cdcebc8a3ed9728384))
-   **decorators:** add `RequiresUserPermissions` ([688e39f](https://github.com/sapphiredev/utilities/commit/688e39f26507a81fcf8be7c9e55d6290f38da460))
-   **discord.js-utilities:** add `isTextBasedChannel` channel type guard ([ec70645](https://github.com/sapphiredev/utilities/commit/ec7064597745bccce19d9c8e6481376a5315f33d))
-   **discord.js-utilities:** add `pageIndexPrefix` static property ([#143](https://github.com/sapphiredev/utilities/issues/143)) ([3c95c6f](https://github.com/sapphiredev/utilities/commit/3c95c6fc384b6ecab08724a07f1187843c826c12))
-   **discord.js-utilities:** add `PaginatedFieldMessageEmbed` ([#144](https://github.com/sapphiredev/utilities/issues/144)) ([2c2df24](https://github.com/sapphiredev/utilities/commit/2c2df24fe37b19e7070c8a65e58b041c3f3eb8e5))
-   **discord.js-utilities:** add many more utilities ([#147](https://github.com/sapphiredev/utilities/issues/147)) ([ba5c590](https://github.com/sapphiredev/utilities/commit/ba5c5908d8bae83db7d38ce4d352149bab99f83a))
-   **discord.js-utilities:** add more thread-related type guards ([#155](https://github.com/sapphiredev/utilities/issues/155)) ([e5418d0](https://github.com/sapphiredev/utilities/commit/e5418d0d4ee0ba203da610fac3b8162ffe9eddab))
-   **discord.js-utilities:** add more typeguards + update checks ([#162](https://github.com/sapphiredev/utilities/issues/162)) ([b89de42](https://github.com/sapphiredev/utilities/commit/b89de42655bbbc2f537a1dea92510ce38847651c))
-   **discord.js-utilities:** option to make Prompters edit a message ([#160](https://github.com/sapphiredev/utilities/issues/160)) ([31af761](https://github.com/sapphiredev/utilities/commit/31af7614bbdcb7a2f8b40d05a4ffaefecf3e11f7))
-   **discord.js-utilities:** set minimum NodeJS to v16.6.0 ([2abc6c1](https://github.com/sapphiredev/utilities/commit/2abc6c131c360a14f273e9cb57fc1b01458601e0))
-   **discord.js-utilities:** update for Discord.JS v13 ([#135](https://github.com/sapphiredev/utilities/issues/135)) ([f5a8f64](https://github.com/sapphiredev/utilities/commit/f5a8f642aa45d9c1267337bd141461f213ac9e98))
-   **PaginatedMessage:** made separator text of embed field customizable ([#188](https://github.com/sapphiredev/utilities/issues/188)) ([82f4dab](https://github.com/sapphiredev/utilities/commit/82f4dab78d6fa873a2a1377488aa1cf3f8ee6180))

### BREAKING CHANGES

-   **utilities:** `Awaited` has been renamed to `Awaitable`
-   **PaginatedMessage:** `embedFooterSeperator` -> `embedFooterSeparator`
-   **discord.js-utilities:** `MessagePrompterStrategies` does no exist as it was not mutable with type augmentation
-   **discord.js-utilities:** If you had custom strategies then be sure to instead module augment `StrategyReturns` with your added keys.
-   Increased strictness of `isCategoryChannel`
-   Increased strictness of `isStageChannel`
-   Increased strictness of `isStoreChannel`
-   Increased strictness of `isThreadChannel`
-   Increased strictness of `isVoiceChannel`
-   Lowered strictness of `isDMChannel`
-   Lowered strictness of `isGuildBasedChannel`
-   Lowered strictness of `isGuildBasedChannelByGuildKey`
-   Lowered strictness of `isNewsChannel`
-   Lowered strictness of `isTextChannel`
-   **decorators:** `RequiresPermissions` has been renamed to `RequiresClientPermissions`
-   **decorators:** enum entry `DecoratorIdentifiers.RequiresPermissionsGuildOnly` has been changed to `DecoratorIdentifiers.RequiresClientPermissionsGuildOnly`
-   **decorators:** enum entry `DecoratorIdentifiers.RequiresPermissionsMissingPermissions` has been changed to `DecoratorIdentifiers.RequiresClientPermissionsMissingPermissions`
-   **decorators:** i18n identifier `requiresPermissionsGuildOnly` has been changed to `requiresClientPermissionsGuildOnly`
-   **decorators:** i18n identifier `requiresPermissionsMissingPermissions` has been changed to `requiresClientPermissionsMissingPermissions`
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

## [2.0.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@2.0.1...@sapphire/discord.js-utilities@2.0.2) (2021-07-20)

**Note:** Version bump only for package @sapphire/discord.js-utilities

## [2.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@2.0.0...@sapphire/discord.js-utilities@2.0.1) (2021-07-18)

### Bug Fixes

-   **discord.js-utilities:** fix run method for PaginatedMessage ([#137](https://github.com/sapphiredev/utilities/issues/137)) ([76b50e0](https://github.com/sapphiredev/utilities/commit/76b50e0b05292ff57732117fbf91d41ee281c7ad))

# [2.0.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.6.0...@sapphire/discord.js-utilities@2.0.0) (2021-07-17)

### Features

-   **discord.js-utilities:** improve PaginatedMessage ([#134](https://github.com/sapphiredev/utilities/issues/134)) ([ad62513](https://github.com/sapphiredev/utilities/commit/ad62513a6a9fb4f8bdf681e7157324cb12ff56c5))

### BREAKING CHANGES

-   **discord.js-utilities:** `PaginatedMessageOptions.run` now takes a single parameter of `Message` instead of 2 parameters (`User` and `TextChannel | NewsChannel`)
-   **discord.js-utilities:** Reactions will no longer be added if your `PaginatedMessage` only has 1 page
-   **discord.js-utilities:** TypeScript types for various methods that previously had `TextChannel | NewsChannel` have been changed to `Message['channel']`
-   **discord.js-utilities:** 1 user can no longer have more than 1 `PaginatedMessage` running. The older one will automatically be cancelled. You can override this by overriding the `run` method.

# [1.6.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.10...@sapphire/discord.js-utilities@1.6.0) (2021-06-27)

### Bug Fixes

-   **discord.js-utilities:** fixed `PaginatedMessage#handleEnd` ([0c05a6b](https://github.com/sapphiredev/utilities/commit/0c05a6b5d707f0decc7d5d140875b51b99a57b63))

### Features

-   **djs-utilities:** verify channel type before removing reaction & allow page prompt customization ([e4f49b3](https://github.com/sapphiredev/utilities/commit/e4f49b348845dbb92a4a3f3963e7fdc067102ef8)), closes [#128](https://github.com/sapphiredev/utilities/issues/128)

## [1.5.10](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.9...@sapphire/discord.js-utilities@1.5.10) (2021-06-19)

### Bug Fixes

-   **doc:** change `[@link](https://github.com/link)` to `[@linkplain](https://github.com/linkplain)` for support in VSCode IntelliSense ([703d460](https://github.com/sapphiredev/utilities/commit/703d4605b547a8787aff62d6f1054ea26dfd9d1c))
-   **docs:** update-tsdoc-for-vscode-may-2021 ([#126](https://github.com/sapphiredev/utilities/issues/126)) ([f8581bf](https://github.com/sapphiredev/utilities/commit/f8581bfe97a1b2f8aac3a3d3ed342d8ba92d730b))

## [1.5.9](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.8...@sapphire/discord.js-utilities@1.5.9) (2021-06-06)

### Bug Fixes

-   remove peer deps, update dev deps, update READMEs ([#124](https://github.com/sapphiredev/utilities/issues/124)) ([67256ed](https://github.com/sapphiredev/utilities/commit/67256ed43b915b02a8b5c68230ba82d6210c5032))

## [1.5.8](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.7...@sapphire/discord.js-utilities@1.5.8) (2021-05-20)

### Bug Fixes

-   **discord.js-utilities:** mark package as side effect free ([9fdf1d0](https://github.com/sapphiredev/utilities/commit/9fdf1d05496a16324ba8515ae90d0b9f661aeb75))

## [1.5.7](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.6...@sapphire/discord.js-utilities@1.5.7) (2021-05-02)

### Bug Fixes

-   drop the `www.` from the SapphireJS URL ([494d89f](https://github.com/sapphiredev/utilities/commit/494d89ffa04f78c195b93d7905b3232884f7d7e2))
-   update all the SapphireJS URLs from `.com` to `.dev` ([f59b46d](https://github.com/sapphiredev/utilities/commit/f59b46d1a0ebd39cad17b17d71cd3b9da808d5fd))

## [1.5.6](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.5...@sapphire/discord.js-utilities@1.5.6) (2021-04-21)

**Note:** Version bump only for package @sapphire/discord.js-utilities

## [1.5.5](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.4...@sapphire/discord.js-utilities@1.5.5) (2021-04-19)

### Bug Fixes

-   change all Sapphire URLs from "project"->"community" & use our domain where applicable 👨‍🌾🚜 ([#102](https://github.com/sapphiredev/utilities/issues/102)) ([835b408](https://github.com/sapphiredev/utilities/commit/835b408e8e57130c3787aca2e32613346ff23e4d))

## [1.5.4](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.3...@sapphire/discord.js-utilities@1.5.4) (2021-04-03)

### Bug Fixes

-   **discord.js-utilities:** message prompter confirm strategy ([#96](https://github.com/sapphiredev/utilities/issues/96)) ([c21e428](https://github.com/sapphiredev/utilities/commit/c21e42856f8f32fc1b56771a78b0356a08679086))

## [1.5.3](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.2...@sapphire/discord.js-utilities@1.5.3) (2021-04-03)

### Bug Fixes

-   **discord.js-utilities:** improve MessagePrompter typings ([#94](https://github.com/sapphiredev/utilities/issues/94)) ([f828e77](https://github.com/sapphiredev/utilities/commit/f828e7721074d182b12c7d302f1720093e7374da))

## [1.5.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.1...@sapphire/discord.js-utilities@1.5.2) (2021-03-16)

### Bug Fixes

-   remove terser from all packages ([#79](https://github.com/sapphiredev/utilities/issues/79)) ([1cfe4e7](https://github.com/sapphiredev/utilities/commit/1cfe4e7c804e62c142495686d2b83b81d0026c02))

## [1.5.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.5.0...@sapphire/discord.js-utilities@1.5.1) (2021-03-02)

### Bug Fixes

-   **discord.js-utilities:** fixed IMessagePrompterStrategyOptions not being optional ([1876355](https://github.com/sapphiredev/utilities/commit/1876355f51177fee64281c052bdca51228073566))

# [1.5.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.4.4...@sapphire/discord.js-utilities@1.5.0) (2021-02-22)

### Features

-   **discord.js-utilities:** add MessagePrompter ([#59](https://github.com/sapphiredev/utilities/issues/59)) ([d120d95](https://github.com/sapphiredev/utilities/commit/d120d950869b8a712e54221efe28d783443bd194))

## [1.4.4](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.4.3...@sapphire/discord.js-utilities@1.4.4) (2021-02-18)

**Note:** Version bump only for package @sapphire/discord.js-utilities

## [1.4.3](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.4.2...@sapphire/discord.js-utilities@1.4.3) (2021-02-16)

**Note:** Version bump only for package @sapphire/discord.js-utilities

## [1.4.2](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.4.1...@sapphire/discord.js-utilities@1.4.2) (2021-02-13)

### Features

-   **discord-utilities:** add discord webhook regex ([#70](https://github.com/sapphiredev/utilities/issues/70)) ([8d56522](https://github.com/sapphiredev/utilities/commit/8d565228f0edf8b38846e1394056c2db122eb6cf))

## [1.4.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.4.0...@sapphire/discord.js-utilities@1.4.1) (2021-02-13)

**Note:** Version bump only for package @sapphire/discord.js-utilities

# [1.4.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.3.1...@sapphire/discord.js-utilities@1.4.0) (2021-02-02)

### Features

-   **discord.js-utilities/pm:** minor changes to static defaultActions ([#67](https://github.com/sapphiredev/utilities/issues/67)) ([9451815](https://github.com/sapphiredev/utilities/commit/94518157b4e7ea2f7b35836f0bfe219d4900cb54))

## [1.3.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.3.0...@sapphire/discord.js-utilities@1.3.1) (2021-01-21)

### Bug Fixes

-   **pm,lpm:** resolved a couple of bugs, make PM more extensible ([#63](https://github.com/sapphiredev/utilities/issues/63)) ([6dc004e](https://github.com/sapphiredev/utilities/commit/6dc004ef22cc069ee831e09293bc560646bf21ec))

# [1.3.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.2.0...@sapphire/discord.js-utilities@1.3.0) (2021-01-20)

### Features

-   added MessageOptions, make PM and LPM work stateless ([#62](https://github.com/sapphiredev/utilities/issues/62)) ([733eab8](https://github.com/sapphiredev/utilities/commit/733eab81e5db4aaf7e70aa48b31ae87a3370cc56))

# [1.2.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.1.0...@sapphire/discord.js-utilities@1.2.0) (2021-01-16)

### Features

-   **paginated-message:** expose response, collector, handleEnd and handleCollect ([#60](https://github.com/sapphiredev/utilities/issues/60)) ([43cc490](https://github.com/sapphiredev/utilities/commit/43cc49030efe3fde5c55a4b7dbd98927c3721687))

# [1.1.0](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.0.1...@sapphire/discord.js-utilities@1.1.0) (2021-01-13)

### Features

-   **discord.js-utilities:** add checking index changes and documentation ([#57](https://github.com/sapphiredev/utilities/issues/57)) ([8d99797](https://github.com/sapphiredev/utilities/commit/8d99797968af72fa02958d80eebcfc92a1cb3c2d))

## [1.0.1](https://github.com/sapphiredev/utilities/compare/@sapphire/discord.js-utilities@1.0.0...@sapphire/discord.js-utilities@1.0.1) (2021-01-08)

### Bug Fixes

-   **djs:** modifying pages and messages outside of constructor ([#55](https://github.com/sapphiredev/utilities/issues/55)) ([6e22cae](https://github.com/sapphiredev/utilities/commit/6e22cae7cc6d12242742b399ca584989931550ef))

# 1.0.0 (2021-01-01)

### Bug Fixes

-   **discord.js-utilities:** fix readme stuff more ([242fdb8](https://github.com/sapphiredev/utilities/commit/242fdb8cd0387c5c6e207b6ec42be67faa838f43))
-   **discord.js-utilities:** typo in readme ([c7cff05](https://github.com/sapphiredev/utilities/commit/c7cff058ebae29fba309cd84af91ac15df36d71f))
-   typo in PaginatedMessage ([#53](https://github.com/sapphiredev/utilities/issues/53)) ([d4fb9fa](https://github.com/sapphiredev/utilities/commit/d4fb9fa609363e323f59931f11597a69d2434335))

### Features

-   **discord-utilities:** add breaking change note to README ([cd0b999](https://github.com/sapphiredev/utilities/commit/cd0b999bc810abbee73ccec601ef3fd35f4e5cb5))
-   add discord.js-utilities pkg ([#52](https://github.com/sapphiredev/utilities/issues/52)) ([b61b05c](https://github.com/sapphiredev/utilities/commit/b61b05c148ea1d4aa28f4cccd27472e1dccf7702))

### BREAKING CHANGES

-   **discord-utilities:** discord-utilities no longer has type-guard functions as they are now moved to the
    discord.js-utilities package. Install @sapphire/discord.js-utilities along with
    @sapphire/discord-utilities to have the full utilities experience.
