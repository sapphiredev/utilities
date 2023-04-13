<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/node-utilities

**Common NodeJS utilities for the Sapphire Community.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/node-utilities?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/node-utilities)
[![npm](https://img.shields.io/npm/v/@sapphire/node-utilities?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/node-utilities)

</div>

**Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [`findFilesRecursively`](#findfilesrecursively)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-)

## Features

-   Written in TypeScript
-   Offers CommonJS, and ESM bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/node-utilities
```

## Usage

### `findFilesRecursively`

Recursively searches for files in a directory and returns an [`AsyncIterableIterator`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) of the found paths.

```ts
import { findFilesRecursively } from '@sapphire/node-utilities';

const files = findFilesRecursively('./src');
for await (const file of files) {
	console.log(file);
}

// This, for example, could log:
// /root/src/index.js
// /root/src/database.csv
// /root/src/lib/utils/constants.json

// Alternate forms:
const files = findFilesRecursivelyStringStartsWith('./src', 'index'); // filename starts with "index"
const files = findFilesRecursivelyStringEndsWith('./src', '.js'); // filename ends with ".js"
const files = findFilesRecursivelyStringIncludes('./src', 'database'); // filename includes "database"
const files = findFilesRecursivelyRegex('./src', /\.[tj]sx?$/); // filename matches the regex
```

---

## Buy us some doughnuts

Sapphire Community is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, Paypal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

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
