<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/sapphire-banner.png)

# @sapphire/phisherman

**Wrapper around [Phisherman](https://phisherman.gg) to easily check and report domains**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=QWL8FB16BR)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/phisherman?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/phisherman)
[![npm](https://img.shields.io/npm/v/@sapphire/phisherman?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/phisherman)

</div>

## Description

With @sapphire/phisherman, you can have an out of the box integration with [Phisherman](https://phisherman.gg).

## Features

-   Fully ready for TypeScript!
-   Includes ESM ready entrypoint
-   Easy to use

## Before we start
* What is phisherman?
Phisherman is a centralised database of phishing and scam links. It is designed for use with Discord bots, allowing them to utilise the Phisherman API to cross-check urls against our known phishing links.

Note: Phisherman is currently in early access. For more information or to request access, please visit their [discord server](https://discord.gg/QwrpmTgvWy).

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/phisherman
```

---

## Usage

**Note:** While this section uses `import`, it maps 1:1 with CommonJS' require syntax. For example, `import { check } from '@sapphire/phisherman'` is the same as `const { checkDomain } = require('@sapphire/phisherman')`.

Before you do anything make sure to set the apiKey like this:
```typescript
import { setApiKey } from '@sapphire/phisherman';

setApiKey('your-api-key');
```

The main use you will have for phisherman is checking whether an URL is safe or not. You can do so with:

```typescript
import { checkDomain } from '@sapphire/phisherman';

checkDomain('some-domain');
```

If you have an URL that didn't pass the check, but you are sure is actually a phishing site, you can use the following to report it to phisherman:

```typescript
import { reportDomain } from '@sapphire/phisherman';

reportDomain('some-domain');
```

## Buy us some doughnuts

Sapphire Community is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, Paypal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

|   Donate With   |                       Address                       |
| :-------------: | :-------------------------------------------------: |
| Open Collective | [Click Here](https://sapphirejs.dev/opencollective) |
|      Ko-fi      |      [Click Here](https://sapphirejs.dev/kofi)      |
|     Patreon     |    [Click Here](https://sapphirejs.dev/patreon)     |
|     PayPal      |     [Click Here](https://sapphirejs.dev/paypal)     |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
