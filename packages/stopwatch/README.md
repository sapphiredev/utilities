<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/stopwatch

**Accurately measure passing time**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/stopwatch?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/stopwatch)
[![npm](https://img.shields.io/npm/v/@sapphire/stopwatch?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/stopwatch)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Basic Usage](#basic-usage)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors](#contributors)

## Description

Provides a set of methods and properties that you can use to accurately measure elapsed time.

## Features

-   Written in TypeScript
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/stopwatch
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { Stopwatch } = require('@sapphire/stopwatch')` equals `import { Stopwatch } from '@sapphire/stopwatch'`.

### Basic Usage

```typescript
// Import the Stopwatch class
const { Stopwatch } = require('@sapphire/stopwatch');

// Create a new Stopwatch (which also starts it immediately)
const stopwatch = new Stopwatch();

// run other task here

console.log(stopwatch.stop().toString());
// 200ms
```

---

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
