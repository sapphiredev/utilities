<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/event-iterator

**Turns event emitter events into async iterators.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/event-iterator?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/event-iterator)
[![npm](https://img.shields.io/npm/v/@sapphire/event-iterator?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/event-iterator)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Basic Usage](#basic-usage)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

There is often a need to have async iterators with fine control, timeouts, limits, filter, and so on, this package exists to satisfy those needs. By implementing an [async iterator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/asyncIterator) which can be used with [`for await...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of) loops.

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/event-iterator
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { EventIterator } = require('@sapphire/event-iterator')` equals `import { EventIterator } from '@sapphire/event-iterator'`.

### Basic Usage

```typescript
// Import the EventIterator class
const { EventIterator } = require('@sapphire/event-iterator');

// Define an event iterator with a limit of 2 entries
const iterator = new EventIterator(emitter, 'message', { limit: 2 });

emitter.emit('message', { id: 'foo' });
emitter.emit('message', { id: 'bar' });
emitter.emit('message', { id: 'baz' });

for await (const message of iterator) {
	console.log(message);
	// Logs: { id: 'foo' }
	// Logs: { id: 'bar' }
}

// The iterator ended at second item, { id: 'baz' } is not collected due to the specified limit.
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
