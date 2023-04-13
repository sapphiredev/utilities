<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/timer-manager

**Timer manager utilities for JavaScript.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/timer-manager?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/timer-manager)
[![npm](https://img.shields.io/npm/v/@sapphire/timer-manager?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/timer-manager)

</div>

**Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Basic Usage](#basic-usage)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/timer-manager
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { TimerManager } = require('@sapphire/timer-manager')` equals `import { TimerManager } from '@sapphire/timer-manager'`.

### Basic Usage

```typescript
// Import the TimerManager class
const { TimerManager } = require('@sapphire/timer-manager');

// Use the class for timeouts
const timeout = TimerManager.setTimeout(() => console.log('Hello, world!'), 1000);
TimerManager.clearTimeout(timeout);

// Use the class for intervals
const interval = TimerManager.setInterval(() => console.log('Hello, world!'), 1000);
TimerManager.clearInterval(interval);

// Destroy all running timeouts and intervals so that NodeJS can gracefully exit
TimerManager.destroy();
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
