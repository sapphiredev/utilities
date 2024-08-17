<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/ratelimits

**Bucket implementation for Ratelimits.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/ratelimits?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/ratelimits)
[![npm](https://img.shields.io/npm/v/@sapphire/ratelimits?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/ratelimits)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Token RateLimitManager](#token-ratelimitmanager)
    -   [Leaky RateLimitManager](#leaky-ratelimitmanager)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors](#contributors)

## Description

There is often a need to apply ratelimits to protect a network from excessive traffic levels on connections routed through it, or limit bot command usages in your Discord bot, or similar things. This package offers two different techniques in the same implementation: the [Token Bucket](https://en.wikipedia.org/wiki/Token_bucket), and the [Leaky Bucket](https://en.wikipedia.org/wiki/Leaky_bucket).

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/ratelimits
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { RateLimitManager } = require('@sapphire/ratelimits')` equals `import { RateLimitManager } from '@sapphire/ratelimits'`.

### Token RateLimitManager

```typescript
// Import the Bucket class
const { RateLimitManager } = require('@sapphire/ratelimits');

// Define a bucket with 1 usage every 5 seconds
const rateLimitManager = new RateLimitManager(5000);

// Acquire the rate limit. The ID can be something like `'global'`, a Discord channel/server/user ID, or anything else.
const ratelimit = rateLimitManager.acquire('some-unique-id-here');

// Check if there is a rate limit right now
if (ratelimit.limited) {
	// Do something when limited, such as throwing an error
}

// We're not rate limited so we drip the bucket. After consuming once, the second run through we'll be rate limited.
ratelimit.consume();

// And now we can finish the flow by returning some form of "success" state.
```

### Leaky RateLimitManager

```typescript
// Import the Bucket class
const { RateLimitManager } = require('@sapphire/ratelimits');

// Define a bucket with 2 usages every 5 seconds
const rateLimitManager = new RateLimitManager(5000, 2);

// Acquire the rate limit. The ID can be something like `'global'`, a Discord channel/server/user ID, or anything else.
const ratelimit = rateLimitManager.acquire('some-unique-id-here');

// Check if there is a rate limit right now
if (ratelimit.limited) {
	// Do something when limited, such as throwing an error
}

// We're not rate limited so we drip the bucket. After consuming twice, the third run through we'll be rate limited.
ratelimit.consume();

// And now we can finish the flow by returning some form of "success" state.
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
