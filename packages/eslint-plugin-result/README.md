<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/eslint-plugin-result

**A TypeScript ESLint plugin for @sapphire/result**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/eslint-plugin-result?logo=webpack&style=flat-square)](https://bundlephobia.com/eslint-plugin-result?p=@sapphire/eslint-plugin-result)
[![npm](https://img.shields.io/npm/v/@sapphire/eslint-plugin-result?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/eslint-plugin-result)

</div>

## Description

There's some best practices for using `@sapphire/result` - such as never discarding a `Result` returned by a function! This ESLint plugin will help you enforce those best practices.

## Features

-   Written in TypeScript
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/eslint-plugin-result
```

## Usage

Somewhere in your ESLint configuration:

```json
{
	"extends": ["plugin:@sapphire/result/recommended"]
}
```

Or

```json
{
	"plugins": ["@sapphire/result"],
	"rules": {
		"@sapphire/result/no-discard-result": "error"
	}
}
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

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/sapphiredev/utilities/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sapphiredev/utilities" />
</a>

[contributing]: https://github.com/sapphiredev/.github/blob/main/.github/CONTRIBUTING.md
