<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/timestamp

**Timestamp utilities for JavaScript.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/timestamp?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/timestamp)
[![npm](https://img.shields.io/npm/v/@sapphire/timestamp?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/timestamp)

</div>

**Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Human Readable Milliseconds](#human-readable-milliseconds)
    -   [Formatting a Date](#formatting-a-date)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors](#contributors)

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/timestamp
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { Timestamp } = require('@sapphire/timestamp')` equals `import { Timestamp } from '@sapphire/timestamp'`.

### Human Readable Milliseconds

Milliseconds are often hard for humans to quickly parse, so it's nice to use
named Enum members to make it easier to read.

```typescript
// Import the Time enum
const { Time } = require('@sapphire/timestamp');

setTimeout(() => {
	// Do something in half a second
}, Time.Second / 2 /* 500 */);

setTimeout(() => {
	// Do something in 6 hours
}, Time.Hour * 6 /* 21600000 */);

setTimeout(() => {
	// Do something in 1 day
}, Time.Day /* 86400000 */);
```

### Formatting a Date

```typescript
// Import the Timestamp class
const { Timestamp } = require('@sapphire/timestamp');

// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

// Format the date with tokens (use square brackets to escape)
const timestamp = new Timestamp('MMMM d YYYY[, at ]HH:mm:ss:SSS');
timestamp.display(date); // March 9th 2019, at 16:20:35:001
```

<details>
	<summary>
		<b>View all available tokens</b>
	</summary>

```typescript
// Saturday 9th March 2019, at 16:20:35:500
const date = new Date(2019, 2, 9, 16, 20, 35, 1);

new Timestamp('Y').display(date); // 19
new Timestamp('YY').display(date); // 19
new Timestamp('YYY').display(date); // 2019
new Timestamp('YYYY').display(date); // 2019
new Timestamp('Q').display(date); // 1
new Timestamp('M').display(date); // 3
new Timestamp('MM').display(date); // 03
new Timestamp('MMM').display(date); // March
new Timestamp('MMMM').display(date); // March
new Timestamp('D').display(date); // 9
new Timestamp('DD').display(date); // 09
new Timestamp('DDD').display(date); // 68
new Timestamp('DDDD').display(date); // 68
new Timestamp('d').display(date); // 9th
new Timestamp('dd').display(date); // Sa
new Timestamp('ddd').display(date); // Sat
new Timestamp('dddd').display(date); // Saturday
new Timestamp('X').display(date); // 1552168835
new Timestamp('x').display(date); // 1552168835001
new Timestamp('H').display(date); // 16
new Timestamp('HH').display(date); // 16
new Timestamp('h').display(date); // 4
new Timestamp('hh').display(date); // 04
new Timestamp('a').display(date); // pm
new Timestamp('A').display(date); // PM
new Timestamp('m').display(date); // 20
new Timestamp('mm').display(date); // 20
new Timestamp('s').display(date); // 35
new Timestamp('ss').display(date); // 35
new Timestamp('S').display(date); // 0
new Timestamp('SS').display(date); // 00
new Timestamp('SSS').display(date); // 001
new Timestamp('t').display(date); // 4:20:35 PM
new Timestamp('T').display(date); // 4:20 PM
new Timestamp('L').display(date); // 03/09/2019
new Timestamp('LL').display(date); // March 09, 2019
new Timestamp('LLL').display(date); // March 09, 2019 4:20 PM
new Timestamp('LLLL').display(date); // Saturday, March 09, 2019 4:20 PM
new Timestamp('l').display(date); // 3/9/2019
new Timestamp('ll').display(date); // Mar 09, 2019
new Timestamp('lll').display(date); // Mar 09, 2019 4:20 PM
new Timestamp('llll').display(date); // Sat, Mar 09, 2019 4:20 PM
new Timestamp('Z').display(date); // -05:00
new Timestamp('ZZ').display(date); // -05:00
```

</details>

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
