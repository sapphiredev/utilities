<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/time-utilities

**Time utilities for JavaScript.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/time-utilities?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/time-utilities)
[![npm](https://img.shields.io/npm/v/@sapphire/time-utilities?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/time-utilities)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

Working with Time and Duration can be a huge chore in any programming language. There are various time parsing libraries on the NPM registry but we are of the opinion that none of them meet the code quality that we desire to use. For this reason we have decided to make this package.

Note that this package only re-exports everything from the four packages [`@sapphire/cron`][cron-readme], [`@sapphire/duration`][duration-readme], [`@sapphire/timer-manager`][timer-manager-readme], and [`@sapphire/timestamp`][timestamp-readme]. Those packages should be cited individually for documentation and can be installed by themselves if you only need a subset of the functionality.

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/time-utilities
```

## Buy us some doughnuts

Sapphire Community is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, PayPal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

|   Donate With   |                       Address                       |
| :-------------: | :-------------------------------------------------: |
| Open Collective | [Click Here](https://sapphirejs.dev/opencollective) |
|      Ko-fi      |      [Click Here](https://sapphirejs.dev/kofi)      |
|     Patreon     |    [Click Here](https://sapphirejs.dev/patreon)     |
|     PayPal      |     [Click Here](https://sapphirejs.dev/paypal)     |

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/sapphiredev/utilities/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sapphiredev/utilities" />
</a>

[contributing]: https://github.com/sapphiredev/.github/blob/main/.github/CONTRIBUTING.md
[cron-readme]: ../cron/#readme
[duration-readme]: ../duration#readme
[timer-manager-readme]: ../timer-manager#readme
[timestamp-readme]: ../timestamp#readme
