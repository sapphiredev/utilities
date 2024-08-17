<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/lexure

**A powerful and fast parser for non-technical user input**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/lexure?logo=webpack&style=flat-square)](https://bundlephobia.com/lexure?p=@sapphire/lexure)
[![npm](https://img.shields.io/npm/v/@sapphire/lexure?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/lexure)

</div>

## Description

A powerful and fast parser and utilities for non-technical user input, inspired by [`lexure`](https://www.npmjs.com/package/lexure), powered by [`@sapphire/result`](https://www.npmjs.com/package/@sapphire/result).

The code in this package has been greatly inspired by [lexure] from [1Computer1].

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested
-   Parses quoted input with multiple quote styles
-   Parses flags and options with a customizable strategy system
-   Keeps leading whitespace
-   Includes a convenient wrapper to retrieve the parsed arguments
-   Includes custom argument delimiter

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/lexure
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { Parser } = require('@sapphire/lexure')` equals `import { Parser } from '@sapphire/lexure'`.

```typescript
const parser = new Parser(new PrefixedStrategy(['--', '/'], ['=', ':']));
const lexer = new Lexer({
	quotes: [
		['"', '"'],
		['“', '”'],
		['「', '」']
	]
});

const content = 'foo bar';
const stream = new ArgumentStream(parser.run(lexer.run(content)));

console.log(stream.single()); // Some { value: 'foo' }
console.log(stream.single()); // Some { value: 'bar' }
console.log(stream.single()); // None
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
[lexure]: https://github.com/1Computer1/lexure
[1computer1]: https://github.com/1Computer1
