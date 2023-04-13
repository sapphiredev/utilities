<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/fetch

**Tiny wrapper around cross-fetch for improved TypeScript and data type support**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/fetch?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/fetch)
[![npm](https://img.shields.io/npm/v/@sapphire/fetch?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/fetch)

</div>

**Table of Contents**

-   [@sapphire/fetch](#sapphirefetch)
    -   [Description](#description)
    -   [Features](#features)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [`GET`ting JSON data](#getting-json-data)
        -   [`GET`ting Buffer data (images, etc.)](#getting-buffer-data-images-etc)
        -   [`POST`ing JSON data](#posting-json-data)
    -   [Buy us some doughnuts](#buy-us-some-doughnuts)
    -   [Contributors ✨](#contributors-%E2%9C%A8)

## Description

[cross-fetch] is already a great library for making API calls, but because it focuses solely on bringing the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to Node.js, it doesn't provide specific error messages and handling for different return types (JSON, Buffer, plain text, etc). This is where `@sapphire/fetch` comes in. The syntax is more restrictive than that of [cross-fetch], but that makes it consistent and easier to use in TypeScript.

## Features

-   Written in TypeScript
-   Fully tested
-   Exported `enum` for the common return data types.
-   Throws distinctive errors when the API returns a "not ok" status code to make them easier to understand.
-   Enforces casting the return type when requesting JSON data, to ensure your return data is strictly typed.
-   Uses [cross-fetch] so this package can be used in NodeJS (where it uses [node-fetch]) and browser (where it uses [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API))

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/fetch
```

## Usage

**Note:** While this section uses `import`, it maps 1:1 with CommonJS' require syntax. For example, `import { fetch } from '@sapphire/fetch'` is the same as `const { fetch } = require('@sapphire/fetch')`.

**Note**: `fetch` can also be imported as a default import: `import fetch from '@sapphire/fetch'`.

### `GET`ting JSON data

```typescript
// Import the fetch function
import { fetch, FetchResultTypes } from '@sapphire/fetch';

interface JsonPlaceholderResponse {
	userId: number;
	id: number;
	title: string;
	completed: boolean;
}

// Fetch the data. No need to call `.json()` after making the request!
const data = await fetch<JsonPlaceholderResponse>('https://jsonplaceholder.typicode.com/todos/1', FetchResultTypes.JSON);

// Do something with the data
console.log(data.userId);
```

### `GET`ting Buffer data (images, etc.)

```typescript
// Import the fetch function
import { fetch, FetchResultTypes } from '@sapphire/fetch';

// Fetch the data. No need to call `.buffer()` after making the request!
const sapphireLogo = await fetch('https://github.com/sapphiredev.png', FetchResultTypes.Buffer);

// sapphireLogo is the `Buffer` of the image
console.log(sapphireLogo);
```

### `POST`ing JSON data

```typescript
// Import the fetch function
import { fetch, FetchResultTypes, FetchMethods } from '@sapphire/fetch';

// Fetch the data. No need to call `.json()` after making the request!
const responseData = await fetch(
	'https://jsonplaceholder.typicode.com/todos',
	{
		method: FetchMethods.Post,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: 'John Doe'
		})
	},
	FetchResultTypes.JSON
);

// Do something with the response data
console.log(responseData);
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

<!-- LINKS -->

[node-fetch]: https://github.com/node-fetch/node-fetch
[cross-fetch]: https://github.com/lquixada/cross-fetch
