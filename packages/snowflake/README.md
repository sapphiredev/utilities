<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/sapphire.png)

# @sapphire/snowflake

**Deconstruct and generate snowflake IDs using BigInts.**

[![GitHub](https://img.shields.io/github/license/sapphire-project/utilities)](https://github.com/sapphire-project/utilities/blob/main/LICENSE.md)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/sapphire-project/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-project/utilities/alerts/)
[![Language grade: JavaScript/TypeScript](https://img.shields.io/lgtm/grade/javascript/g/sapphire-project/utilities.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/sapphire-project/utilities/context:javascript)
[![Coverage Status](https://coveralls.io/repos/github/sapphire-project/utilities/badge.svg?branch=main)](https://coveralls.io/github/sapphire-project/utilities?branch=main)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/snowflake?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/snowflake)
[![npm](https://img.shields.io/npm/v/@sapphire/snowflake?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/snowflake)
[![Depfu](https://badges.depfu.com/badges/ec42ff3d6bae55eee1de4749960852b3/count.svg)](https://depfu.com/github/sapphire-project/utilities?project_id=15195)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Constructing snowflakes](#constructing-snowflakes)
        -   [Snowflakes with custom epoch](#snowflakes-with-custom-epoch)
        -   [Snowflake with Discord epoch constant](#snowflake-with-discord-epoch-constant)
        -   [Snowflake with Twitter epoch constant](#snowflake-with-twitter-epoch-constant)
    -   [Deconstructing snowflakes](#deconstructing-snowflakes)
        -   [Snowflakes with custom epoch](#snowflakes-with-custom-epoch-1)
        -   [Snowflake with Discord epoch constant](#snowflake-with-discord-epoch-constant-1)
        -   [Snowflake with Twitter epoch constant](#snowflake-with-twitter-epoch-constant-1)
-   [API Documentation](#api-documentation)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

There is often a need to get a unique ID for entities, be that for Discord messages/channels/servers, keys in a database or many other similar examples. There are many ways to get such a unique ID, and one of those is using a so-called "snowflake". You can read more about snowflake IDs in [this Medium article](https://medium.com/better-programming/uuid-generation-snowflake-identifiers-unique-2aed8b1771bc).

## Features

-   Written in TypeScript
-   Bundled with Rollup so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Offers predefined epochs for Discord and Twitter
-   Fully tested

## Installation

```sh
yarn add @sapphire/snowflake
# npm install @sapphire/snowflake
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { Snowflake } = require('@sapphire/snowflake')` equals `import { Snowflake } from '@sapphire/snowflake'`.

### Constructing snowflakes

#### Snowflakes with custom epoch

```ts
// Import the Snowflake class
const { Snowflake } = require('@sapphire/snowflake');

// Define a custom epoch
const epoch = new Date('2000-01-01T00:00:00.000Z');

// Create an instance of Snowflake
const snowflake = new Snowflake(epoch);

// Generate a snowflake with the given epoch
const uniqueId = snowflake.generate();
```

#### Snowflake with Discord epoch constant

```ts
// Import the Snowflake class
const { DiscordSnowflake } = require('@sapphire/snowflake');

// Create an instance of Snowflake
const discordSnowflake = new DiscordSnowflake();

// Generate a snowflake with Discord's epoch
const uniqueId = discordSnowflake.generate();

// Alternatively, you can use the method directly
const uniqueId = DiscordSnowflake.generate();
```

#### Snowflake with Twitter epoch constant

```ts
// Import the Snowflake class
const { TwitterSnowflake } = require('@sapphire/snowflake');

// Create an instance of Snowflake
const twitterSnowflake = new TwitterSnowflake();

// Generate a snowflake with Twitter's epoch
const uniqueId = twitterSnowflake.generate();

// Alternatively, you can use the method directly
const uniqueId = TwitterSnowflake.generate();
```

### Deconstructing snowflakes

#### Snowflakes with custom epoch

```ts
// Import the Snowflake class
const { Snowflake } = require('@sapphire/snowflake');

// Define a custom epoch
const epoch = new Date('2000-01-01T00:00:00.000Z');

// Create an instance of Snowflake
const snowflake = new Snowflake(epoch);

// Deconstruct a snowflake with the given epoch
const uniqueId = snowflake.deconstruct('3971046231244935168');
```

#### Snowflake with Discord epoch constant

```ts
// Import the Snowflake class
const { DiscordSnowflake } = require('@sapphire/snowflake');

// Create an instance of Snowflake
const discordSnowflake = new DiscordSnowflake();

// Deconstruct a snowflake with Discord's epoch
const uniqueId = discordSnowflake.deconstruct('3971046231244935168');

// Alternatively, you can use the method directly
const uniqueId = DiscordSnowflake.deconstruct('3971046231244935168');
```

#### Snowflake with Twitter epoch constant

```ts
// Import the Snowflake class
const { TwitterSnowflake } = require('@sapphire/snowflake');

// Create an instance of Snowflake
const twitterSnowflake = new TwitterSnowflake();

// Deconstruct a snowflake with Twitter's epoch
const uniqueId = twitterSnowflake.deconstruct('3971046231244935168');

// Alternatively, you can use the method directly
const uniqueId = TwitterSnowflake.deconstruct('3971046231244935168');
```

---

## API Documentation

For the full API documentation please refer to the TypeDoc generated [documentation](https://sapphire-project.github.io/utilities/modules/_sapphire_snowflake.html).

## Buy us some doughnuts

Sapphire Project is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, PayPal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

|   Donate With   |                                             Address                                              |
| :-------------: | :----------------------------------------------------------------------------------------------: |
| Open Collective |                    [Click Here](https://opencollective.com/sapphire-project)                     |
|      Ko-fi      |                         [Click Here](https://ko-fi.com/sapphireproject)                          |
|     Patreon     |                      [Click Here](https://www.patreon.com/sapphire_project)                      |
|     PayPal      | [Click Here](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=SP738BQTQQYZY) |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars3.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Favna" title="Code">💻</a> <a href="#infra-Favna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-Favna" title="Project Management">📆</a> <a href="https://github.com/sapphire-project/utilities/commits?author=Favna" title="Documentation">📖</a> <a href="https://github.com/sapphire-project/utilities/commits?author=Favna" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kyranet"><img src="https://avatars0.githubusercontent.com/u/24852502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Antonio Román</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=kyranet" title="Code">💻</a> <a href="#projectManagement-kyranet" title="Project Management">📆</a> <a href="https://github.com/sapphire-project/utilities/pulls?q=is%3Apr+reviewed-by%3Akyranet" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphire-project/utilities/commits?author=kyranet" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/PyroTechniac"><img src="https://avatars2.githubusercontent.com/u/39341355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gryffon Bellish</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=PyroTechniac" title="Code">💻</a> <a href="https://github.com/sapphire-project/utilities/pulls?q=is%3Apr+reviewed-by%3APyroTechniac" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphire-project/utilities/commits?author=PyroTechniac" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/vladfrangu"><img src="https://avatars3.githubusercontent.com/u/17960496?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vlad Frangu</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=vladfrangu" title="Code">💻</a> <a href="https://github.com/sapphire-project/utilities/issues?q=author%3Avladfrangu" title="Bug reports">🐛</a> <a href="https://github.com/sapphire-project/utilities/pulls?q=is%3Apr+reviewed-by%3Avladfrangu" title="Reviewed Pull Requests">👀</a> <a href="#userTesting-vladfrangu" title="User Testing">📓</a> <a href="https://github.com/sapphire-project/utilities/commits?author=vladfrangu" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Soumil07"><img src="https://avatars0.githubusercontent.com/u/29275227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Soumil07</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Soumil07" title="Code">💻</a> <a href="#projectManagement-Soumil07" title="Project Management">📆</a> <a href="https://github.com/sapphire-project/utilities/commits?author=Soumil07" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/apps/depfu"><img src="https://avatars3.githubusercontent.com/in/715?v=4?s=100" width="100px;" alt=""/><br /><sub><b>depfu[bot]</b></sub></a><br /><a href="#maintenance-depfu[bot]" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars0.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt=""/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Nytelife26"><img src="https://avatars1.githubusercontent.com/u/22531310?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler J Russell</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Nytelife26" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Alcremie"><img src="https://avatars0.githubusercontent.com/u/54785334?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ivan Lieder</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Alcremie" title="Code">💻</a> <a href="https://github.com/sapphire-project/utilities/issues?q=author%3AAlcremie" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RealShadowNova"><img src="https://avatars3.githubusercontent.com/u/46537907?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hezekiah Hendry</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=RealShadowNova" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Stitch07"><img src="https://avatars.githubusercontent.com/u/29275227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stitch07</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Stitch07" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Vetlix"><img src="https://avatars.githubusercontent.com/u/31412314?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vetlix</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=Vetlix" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ethamitc"><img src="https://avatars.githubusercontent.com/u/27776796?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ethan Mitchell</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=ethamitc" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/noftaly"><img src="https://avatars.githubusercontent.com/u/34779161?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Elliot</b></sub></a><br /><a href="https://github.com/sapphire-project/utilities/commits?author=noftaly" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
