<div align="center">

![Sapphire Logo](https://cdn.skyra.pw/gh-assets/sapphire-banner.png)

# @sapphire/bitfield

**BitField utilities for JavaScript.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/bitfield?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/bitfield)
[![npm](https://img.shields.io/npm/v/@sapphire/bitfield?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/bitfield)

</div>

**Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Resolving](#resolving)
    -   [Checking for the existence of any bit](#checking-for-the-existence-of-any-bit)
    -   [Checking for the existence of one or multiple bits](#checking-for-the-existence-of-one-or-multiple-bits)
    -   [Getting the field's complement](#getting-the-fields-complement)
    -   [Getting the union of different fields](#getting-the-union-of-different-fields)
    -   [Getting the intersection between different fields](#getting-the-intersection-between-different-fields)
    -   [Getting the symmetric difference between different fields](#getting-the-symmetric-difference-between-different-fields)
    -   [Formatting a field](#formatting-a-field)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors ✨](#contributors-)

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/bitfield
```

## Usage

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { BitField } = require('@sapphire/bitfield')` equals `import { BitField } from '@sapphire/bitfield'`.

```typescript
// Require the BitField class
const { BitField } = require('@sapphire/bitfield');

const PermissionFlags = {
	Read: 1 << 0,
	Write: 1 << 1,
	Edit: 1 << 2,
	Delete: 1 << 3
};
const PermissionsBitField = new BitField(PermissionFlags);

const DetailedPermissionsFlags = {
	ReadMessages: 1n << 0n,
	ReadChannels: 1n << 1n,
	CreateMessages: 1n << 2n,
	CreateChannels: 1n << 3n
	// ...
};
const DetailedPermissionsBitField = new BitField(DetailedPermissionsFlags);
```

> **Note**: An exception will be thrown in the constructor if a non-object, null, empty object, or objects with values that aren't all numbers or all bigints.

### Resolving

You can resolve bitfields from raw numbers, strings, or arrays of them. All of `BitField`'s methods call `resolve` internally, making the usage a lot easier.

```typescript
PermissionsBitField.resolve(PermissionFlags.Read);
PermissionsBitField.resolve(1);
PermissionsBitField.resolve('Read');
PermissionsBitField.resolve([1]);
PermissionsBitField.resolve(['Read']);
// 1 [Read]

PermissionsBitField.resolve(PermissionFlags.Read | PermissionFlags.Write);
PermissionsBitField.resolve([PermissionFlags.Read, PermissionFlags.Write]);
PermissionsBitField.resolve(['Read', 'Write']);
// 3 [Read + Write]

PermissionsBitField.resolve([]);
PermissionsBitField.zero;
// 0 [∅]

// Out-of-bounds fields are masked by `PermissionsBitField.mask`:
PermissionsBitField.resolve(17);
// 0b10001 (17) -> ~~0b10000 (16, invalid)~~ | 0b0001 (1, Read)
// 1 [Read]

// Invalid names will cause a `RangeError` to be thrown:
PermissionsBitField.resolve(['Execute']);
// thrown RangeError('Received a name that could not be resolved to a property of flags')

// Invalid types, or non-array objects will cause a `TypeError` to be thrown:
PermissionsBitField.resolve(true);
PermissionsBitField.resolve(null);
PermissionsBitField.resolve({});

// Number BitFields do not accept bigints:
PermissionsBitField.resolve(1n);
// BigInt BitFields do not accept numbers:
DetailedPermissionsBitField.resolve(1);
```

For simplicity, we will be using arrays of strings for the rest of the README, but any of the above alternatives are available.

### Checking for the existence of any bit

Useful for checking if at least one of B's bits are included in A.

```typescript
PermissionsBitField.any(['Read', 'Write'], ['Read']);
PermissionsBitField.any(['Read', 'Write'], ['Write']);
PermissionsBitField.any(['Read', 'Write'], ['Write', 'Edit']);
// true

PermissionsBitField.any(['Read', 'Write'], ['Edit']);
PermissionsBitField.any(['Read', 'Write'], ['Delete']);
PermissionsBitField.any(['Read', 'Write'], ['Edit', 'Delete']);
// false
```

### Checking for the existence of one or multiple bits

Useful for checking if all of B's bits are included in A, or in other words, A is a superset of B.

```typescript
PermissionsBitField.any(['Read', 'Write'], ['Read']);
PermissionsBitField.any(['Read', 'Write'], ['Write']);
// true

PermissionsBitField.any(['Read', 'Write'], ['Write', 'Edit']);
PermissionsBitField.any(['Read', 'Write'], ['Edit']);
PermissionsBitField.any(['Read', 'Write'], ['Delete']);
PermissionsBitField.any(['Read', 'Write'], ['Edit', 'Delete']);
// false
```

### Getting the field's complement

Gets the complement of a field, or the result of excluding A from all of the BitField's mask.

```typescript
PermissionsBitField.complement(['Read']);
// 14 [Write + Edit + Delete]

PermissionsBitField.complement(['Read', 'Write']);
// 12 [Edit + Delete]

PermissionsBitField.complement(['Read', 'Write', 'Edit', 'Delete']);
// 0 [∅]
```

### Getting the union of different fields

Useful for adding multiple fields into one.

```typescript
PermissionsBitField.union(['Read'], ['Write'], ['Edit']);
// 7 [Read + Write + Edit]

PermissionsBitField.union();
// 0 [∅]
```

### Getting the intersection between different fields

Gets the intersection of all the fields.

```typescript
PermissionsBitField.intersection(['Read', 'Write'], ['Write']);
// 2 [Write]

PermissionsBitField.intersection(['Read'], ['Write']);
// 0 [∅]
```

### Getting the symmetric difference between different fields

The summetric difference is basically the union of the difference between A and B and vice versa (bits from A that aren't in B, and bits from B that aren't in A), or XOR, useful for retrieving the bit difference between two fields.

```typescript
PermissionsBitField.intersection(['Read', 'Write'], ['Write', 'Edit']);
// 5 [Read + Edit]

PermissionsBitField.intersection(['Write'], ['Write']);
// 0 [∅]
```

### Formatting a field

We can format fields in two ways, one is with arrays:

```typescript
PermissionsBitField.toArray(PermissionFlags.Read | PermissionFlags.Write);
PermissionsBitField.toArray([PermissionFlags.Read, PermissionFlags.Write]);
PermissionsBitField.toArray(['Read', 'Write']);
// ['Read', 'Write']
```

And another is with objects:

```typescript
PermissionsBitField.toObject(PermissionFlags.Read | PermissionFlags.Write);
PermissionsBitField.toObject([PermissionFlags.Read, PermissionFlags.Write]);
PermissionsBitField.toObject(['Read', 'Write']);
// {
//   Read: true,
//   Write: true,
//   Edit: false,
//   Delete: false
// }
```

## Buy us some doughnuts

Sapphire Community is and always will be open source, even if we don't get donations. That being said, we know there are amazing people who may still want to donate just to show their appreciation. Thank you very much in advance!

We accept donations through Open Collective, Ko-fi, PayPal, Patreon and GitHub Sponsorships. You can use the buttons below to donate through your method of choice.

|   Donate With   |                       Address                       |
| :-------------: | :-------------------------------------------------: |
| Open Collective | [Click Here](https://sapphirejs.dev/opencollective) |
|      Ko-fi      |      [Click Here](https://sapphirejs.dev/kofi)      |
|     Patreon     |    [Click Here](https://sapphirejs.dev/patreon)     |
|     PayPal      |     [Click Here](https://sapphirejs.dev/paypal)     |

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://favware.tech/"><img src="https://avatars3.githubusercontent.com/u/4019718?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jeroen Claassens</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=favna" title="Code">💻</a> <a href="#infra-favna" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#projectManagement-favna" title="Project Management">📆</a> <a href="https://github.com/sapphiredev/utilities/commits?author=favna" title="Documentation">📖</a> <a href="https://github.com/sapphiredev/utilities/commits?author=favna" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kyranet"><img src="https://avatars0.githubusercontent.com/u/24852502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aura Román</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=kyranet" title="Code">💻</a> <a href="#projectManagement-kyranet" title="Project Management">📆</a> <a href="https://github.com/sapphiredev/utilities/pulls?q=is%3Apr+reviewed-by%3Akyranet" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphiredev/utilities/commits?author=kyranet" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/PyroTechniac"><img src="https://avatars2.githubusercontent.com/u/39341355?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gryffon Bellish</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=PyroTechniac" title="Code">💻</a> <a href="https://github.com/sapphiredev/utilities/pulls?q=is%3Apr+reviewed-by%3APyroTechniac" title="Reviewed Pull Requests">👀</a> <a href="https://github.com/sapphiredev/utilities/commits?author=PyroTechniac" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/vladfrangu"><img src="https://avatars3.githubusercontent.com/u/17960496?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vlad Frangu</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=vladfrangu" title="Code">💻</a> <a href="https://github.com/sapphiredev/utilities/issues?q=author%3Avladfrangu" title="Bug reports">🐛</a> <a href="https://github.com/sapphiredev/utilities/pulls?q=is%3Apr+reviewed-by%3Avladfrangu" title="Reviewed Pull Requests">👀</a> <a href="#userTesting-vladfrangu" title="User Testing">📓</a> <a href="https://github.com/sapphiredev/utilities/commits?author=vladfrangu" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/Stitch07"><img src="https://avatars0.githubusercontent.com/u/29275227?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Stitch07</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Stitch07" title="Code">💻</a> <a href="#projectManagement-Stitch07" title="Project Management">📆</a> <a href="https://github.com/sapphiredev/utilities/commits?author=Stitch07" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/apps/depfu"><img src="https://avatars3.githubusercontent.com/in/715?v=4?s=100" width="100px;" alt=""/><br /><sub><b>depfu[bot]</b></sub></a><br /><a href="#maintenance-depfu[bot]" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/apps/allcontributors"><img src="https://avatars0.githubusercontent.com/in/23186?v=4?s=100" width="100px;" alt=""/><br /><sub><b>allcontributors[bot]</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=allcontributors[bot]" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/Nytelife26"><img src="https://avatars1.githubusercontent.com/u/22531310?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tyler J Russell</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Nytelife26" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/Alcremie"><img src="https://avatars0.githubusercontent.com/u/54785334?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ivan Lieder</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Alcremie" title="Code">💻</a> <a href="https://github.com/sapphiredev/utilities/issues?q=author%3AAlcremie" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/RealShadowNova"><img src="https://avatars3.githubusercontent.com/u/46537907?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Hezekiah Hendry</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=RealShadowNova" title="Code">💻</a> <a href="#tool-RealShadowNova" title="Tools">🔧</a></td>
    <td align="center"><a href="https://github.com/Vetlix"><img src="https://avatars.githubusercontent.com/u/31412314?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Vetlix</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Vetlix" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ethamitc"><img src="https://avatars.githubusercontent.com/u/27776796?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Ethan Mitchell</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=ethamitc" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/noftaly"><img src="https://avatars.githubusercontent.com/u/34779161?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Elliot</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=noftaly" title="Code">💻</a></td>
    <td align="center"><a href="https://jurien.dev"><img src="https://avatars.githubusercontent.com/u/5418114?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jurien Hamaker</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=jurienhamaker" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://fanoulis.dev/"><img src="https://avatars.githubusercontent.com/u/38255093?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Charalampos Fanoulis</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=cfanoulis" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/apps/dependabot"><img src="https://avatars.githubusercontent.com/in/29110?v=4?s=100" width="100px;" alt=""/><br /><sub><b>dependabot[bot]</b></sub></a><br /><a href="#maintenance-dependabot[bot]" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://kaname.netlify.app/"><img src="https://avatars.githubusercontent.com/u/56084970?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kaname</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=kaname-png" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/nandhagk"><img src="https://avatars.githubusercontent.com/u/62976649?v=4?s=100" width="100px;" alt=""/><br /><sub><b>nandhagk</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/issues?q=author%3Anandhagk" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://megatank58.me/"><img src="https://avatars.githubusercontent.com/u/51410502?v=4?s=100" width="100px;" alt=""/><br /><sub><b>megatank58</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=megatank58" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/UndiedGamer"><img src="https://avatars.githubusercontent.com/u/84702365?v=4?s=100" width="100px;" alt=""/><br /><sub><b>UndiedGamer</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=UndiedGamer" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Lioness100"><img src="https://avatars.githubusercontent.com/u/65814829?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Lioness100</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Lioness100" title="Documentation">📖</a> <a href="https://github.com/sapphiredev/utilities/commits?author=Lioness100" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://gitlab.com/DavidPH/"><img src="https://avatars.githubusercontent.com/u/44669930?v=4?s=100" width="100px;" alt=""/><br /><sub><b>David</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=DavidPHH" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/apps/renovate"><img src="https://avatars.githubusercontent.com/in/2740?v=4?s=100" width="100px;" alt=""/><br /><sub><b>renovate[bot]</b></sub></a><br /><a href="#maintenance-renovate[bot]" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://renovate.whitesourcesoftware.com/"><img src="https://avatars.githubusercontent.com/u/25180681?v=4?s=100" width="100px;" alt=""/><br /><sub><b>WhiteSource Renovate</b></sub></a><br /><a href="#maintenance-renovate-bot" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://fc5570.me/"><img src="https://avatars.githubusercontent.com/u/68158483?v=4?s=100" width="100px;" alt=""/><br /><sub><b>FC</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=FC5570" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/Tokipudi"><img src="https://avatars.githubusercontent.com/u/29551076?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jérémy de Saint Denis</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Tokipudi" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/ItsMrCube"><img src="https://avatars.githubusercontent.com/u/25201357?v=4?s=100" width="100px;" alt=""/><br /><sub><b>MrCube</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=ItsMrCube" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/bitomic"><img src="https://avatars.githubusercontent.com/u/35199700?v=4?s=100" width="100px;" alt=""/><br /><sub><b>bitomic</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=bitomic" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://c43721.dev/"><img src="https://avatars.githubusercontent.com/u/55610086?v=4?s=100" width="100px;" alt=""/><br /><sub><b>c43721</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=c43721" title="Code">💻</a></td>
    <td align="center"><a href="https://commandtechno.com/"><img src="https://avatars.githubusercontent.com/u/68407783?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Commandtechno</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Commandtechno" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/dhruv-kaushikk"><img src="https://avatars.githubusercontent.com/u/73697546?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Aura</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=dhruv-kaushikk" title="Code">💻</a></td>
    <td align="center"><a href="https://axis.moe/"><img src="https://avatars.githubusercontent.com/u/54381371?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=axisiscool" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/imranbarbhuiya"><img src="https://avatars.githubusercontent.com/u/74945038?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Parbez</b></sub></a><br /><a href="#maintenance-imranbarbhuiya" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/NotKaskus"><img src="https://avatars.githubusercontent.com/u/75168528?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Paul Andrew</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=NotKaskus" title="Documentation">📖</a></td>
    <td align="center"><a href="https://linktr.ee/mzato0001"><img src="https://avatars.githubusercontent.com/u/62367547?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mzato</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=Mzato0001" title="Code">💻</a> <a href="https://github.com/sapphiredev/utilities/issues?q=author%3AMzato0001" title="Bug reports">🐛</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/MajesticString"><img src="https://avatars.githubusercontent.com/u/66224939?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Harry Allen</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=MajesticString" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/EvolutionX-10"><img src="https://avatars.githubusercontent.com/u/85353424?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Evo</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=EvolutionX-10" title="Code">💻</a></td>
    <td align="center"><a href="https://enes.ovh/"><img src="https://avatars.githubusercontent.com/u/61084101?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Enes Genç</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=enxg" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/muchnameless"><img src="https://avatars.githubusercontent.com/u/12682826?v=4?s=100" width="100px;" alt=""/><br /><sub><b>muchnameless</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=muchnameless" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/r-priyam"><img src="https://avatars.githubusercontent.com/u/50884372?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Priyam</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=r-priyam" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/legendhimslef"><img src="https://avatars.githubusercontent.com/u/69213593?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Voxelli</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=legendhimslef" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/CitTheDev"><img src="https://avatars.githubusercontent.com/u/94020875?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Cit The Dev</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=CitTheDev" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://www.goestav.com/"><img src="https://avatars.githubusercontent.com/u/27970303?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Goestav</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=goestav" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/didinele"><img src="https://avatars.githubusercontent.com/u/27137376?v=4?s=100" width="100px;" alt=""/><br /><sub><b>DD</b></sub></a><br /><a href="https://github.com/sapphiredev/utilities/commits?author=didinele" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
