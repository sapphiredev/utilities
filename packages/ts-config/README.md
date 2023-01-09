<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/sapphire-banner.png)

# @sapphire/ts-config

**TypeScript configuration for all Sapphire Community repositories.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/ts-config?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/ts-config)
[![npm](https://img.shields.io/npm/v/@sapphire/ts-config?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/ts-config)

</div>

**Table of Contents**

-   [Installation](#installation)
-   [Usage](#usage)
    -   [Base Config](#base-config)
    -   [Config without decorators](#config-without-decorators)
    -   [Config with extra strict compiler options](#config-with-extra-strict-compiler-options)
    -   [Config with extra strict compiler options and without decorators](#config-with-extra-strict-compiler-options-and-without-decorators)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-%E2%9C%A8)

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install --save-dev @sapphire/ts-config
```

---

## Usage

### Base Config

You can use `@sapphire/ts-config` base [`tsconfig.json`](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/tsconfig.json) by extending it in yours:

```json
{
	"extends": "@sapphire/ts-config"
}
```

This TypeScript config is set up in such a way that it will suite nearly all projects, you may extend this to include your own
configuration options as well.

Following is a copy of this config file for easy viewing:

```json
{
	"compileOnSave": true,
	"compilerOptions": {
		"allowSyntheticDefaultImports": true,
		"alwaysStrict": true,
		"declaration": true,
		"declarationMap": true,
		"emitDecoratorMetadata": true,
		"esModuleInterop": true,
		"experimentalDecorators": true,
		"importHelpers": true,
		"verbatimModuleSyntax": true,
		"incremental": true,
		"lib": ["esnext"],
		"module": "Node16",
		"moduleResolution": "Node",
		"newLine": "lf",
		"noEmitHelpers": true,
		"noFallthroughCasesInSwitch": true,
		"noImplicitReturns": true,
		"noUnusedLocals": true,
		"noUnusedParameters": true,
		"preserveConstEnums": true,
		"pretty": true,
		"removeComments": false,
		"resolveJsonModule": true,
		"sourceMap": true,
		"strict": true,
		"target": "ES2020",
		"useDefineForClassFields": true
	}
}
```

### Config without decorators

You can use `@sapphire/ts-config`'s [`without-decorators.json`](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/extra-strict-without-decorators.json) by extending it in yours:

```json
{
	"extends": "@sapphire/ts-config/without-decorators"
}
```

This TypeScript extends everything from the base config, but disables decorator support.

Following is a copy of this config file for easy viewing:

```json
{
	"$schema": "https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json",
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"emitDecoratorMetadata": false,
		"experimentalDecorators": false
	}
}
```

### Config with extra strict compiler options

You can use `@sapphire/ts-config`'s [`extra-strict.json`](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/extra-strict.json) by extending it in yours:

```json
{
	"extends": "@sapphire/ts-config/extra-strict"
}
```

This TypeScript extends everything from the base config, while enabling some extra strict options.

Following is a copy of this config file for easy viewing:

```json
{
	"$schema": "https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json",
	"extends": "./tsconfig.json",
	"compilerOptions": {
		"allowUnreachableCode": false,
		"allowUnusedLabels": false,
		"exactOptionalPropertyTypes": false,
		"noImplicitOverride": true
	}
}
```

### Config with extra strict compiler options and without decorators

You can use `@sapphire/ts-config`'s [`extra-strict-without-decorators.json`](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/extra-strict-without-decorators.json) by extending it in yours:

```json
{
	"extends": "@sapphire/ts-config/extra-strict-without-decorators"
}
```

This TypeScript is a combination of the [Config without decorators](#config-without-decorators) and [Config with extra strict compiler options](#config-with-extra-strict-compiler-options) config files.

Following is a copy of this config file for easy viewing:

```json
{
	"$schema": "https://raw.githubusercontent.com/SchemaStore/schemastore/master/src/schemas/json/tsconfig.json",
	"extends": "./extra-strict.json",
	"compilerOptions": {
		"emitDecoratorMetadata": false,
		"experimentalDecorators": false
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
