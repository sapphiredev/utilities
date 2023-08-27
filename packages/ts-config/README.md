<div align="center">
![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/ts-config

**TypeScript configuration for all Sapphire Community repositories.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/ts-config?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/ts-config)
[![npm](https://img.shields.io/npm/v/@sapphire/ts-config?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/ts-config)

</div>

**Table of Contents**

-   [@sapphire/ts-config](#sapphirets-config)
    -   [Installation](#installation)
    -   [Usage](#usage)
        -   [Base](#base)
        -   [Extra Strict](#extra-strict)
        -   [Decorators](#decorators)
        -   [Verbatim](#verbatim)
        -   [Bundler](#bundler)
    -   [Buy us some doughnuts](#buy-us-some-doughnuts)
    -   [Contributors](#contributors)

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install --save-dev @sapphire/ts-config
```

---

## Usage

This package ships a couple of different sets of tsconfig, they should be used in an array of
`extends` in your `tsconfig.json` file. The supported configs are:

-   `@sapphire/ts-config/base` -> This is identical to `@sapphire/ts-config`
-   `@sapphire/ts-config/extra-strict`
-   `@sapphire/ts-config/decorators`
-   `@sapphire/ts-config/verbatim`

You should always start with the base config, regardless of what other configs you choose.
Next you can opt-in to the other configs.

Finally you should configure your package.json properly based on what kind of package you are writing

-   For CJS packages you should add `"type": "commonjs"` to your `package.json`
-   For ESM packages you should add `"type": "module"` to your `package.json`
-   For a package that is going to be used by both CJS and ESM then you should not add any `"type"` to your `package.json`
    -   Note that if you intend to compile for both your best option is to compile
        for CJS from TypeScript, then use [`gen-esm-wrapper`](https://github.com/addaleax/gen-esm-wrapper) to transform your
        input file to ESM compatible exports. This is also what we do for our Sapphire packages.
    -   Note also that in this case you should not enable `@sapphire/ts-config/verbatim`, because it will not work without
        a `"type"` specified in `package.json`

Next we will go over the different configs and what they do.

### Base

The base config (`@sapphire/ts-config`, or `@sapphire/ts-config/base`) is the default config with options set up in
such a way that it will suite nearly all projects.

You can view the content of this tsconfig [here](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/src/tsconfig.json)

### Extra Strict

You should include this config if you want to extra strict checking. This enables the following compiler options:

-   [allowUnreachableCode](https://www.typescriptlang.org/tsconfig#allowUnreachableCode)
-   [allowUnusedLabels](https://www.typescriptlang.org/tsconfig#allowUnusedLabels)
-   [exactOptionalPropertyTypes](https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes)
-   [noImplicitOverride](https://www.typescriptlang.org/tsconfig#noImplicitOverride)

You can view the content of this tsconfig [here](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/src/extra-strict.json)

### Decorators

You should include this config if you want to use decorators in the project using decorators from before the TC39
TC39 standardization process. Note that at time of writing (2023-08-24) TC39 decorators aren't fully properly
implemented by either NodeJS or TypeScript yet, so at least at time of writing we recommend enabling this config if
you are using decorators. Packages such as `@sapphire/decorators` rely on this config being enabled.

This enables the following compiler options:

-   [experimentalDecorators](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
-   [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig#emitDecoratorMetadata)

You can view the content of this tsconfig [here](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/src/decorators.json)

### Verbatim

You should include this config if you want to enable the
[verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax) option. This option has some
drawbacks when writing CJS code but also ensures even more type strictness.
See the TypeScript documentation for more information.

This enables the following compiler options:

-   [verbatimModuleSyntax](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)

You can view the content of this tsconfig [here](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/src/verbatim.json)

### Bundler

You may include this config if bundle your code with a bundler such as [tsup], [esbuild], [swc] or something else. This
config sets [`moduleResolution` to `Bundler`][moduleResolution] and [`module` to `ES2022`][module]. This will likely also allow you to enable
[Verbatim](#verbatim).

This configures the following compiler options:

-   [`moduleResolution` to `Bundler`][moduleResolution]
-   [`module` to `ES2022`][module]

You can view the content of this tsconfig [here](https://github.com/sapphiredev/utilities/blob/main/packages/ts-config/src/bundler.json)

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
[module]: https://www.typescriptlang.org/tsconfig#module
[moduleResolution]: https://www.typescriptlang.org/tsconfig#moduleResolution
[tsup]: https://tsup.egoist.dev
[esbuild]: https://esbuild.github.io
[swc]: https://swc.rs
