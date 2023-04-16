<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

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

> **Warning**: If the source is a TypeScript enum of numbers, you may use the `enumToObject` utility to turn it into a strict typed 1-way object.

```typescript
const { BitField, enumToObject } = require('@sapphire/bitfield');
const { ActivityFlags } = require('discord-api-types/v10');

const PermissionsBitField = new BitField(enumToObject(ActivityFlags));
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

## Contributors

Please make sure to read the [Contributing Guide][contributing] before making a pull request.

Thank you to all the people who already contributed to Sapphire!

<a href="https://github.com/sapphiredev/utilities/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=sapphiredev/utilities" />
</a>

[contributing]: https://github.com/sapphiredev/.github/blob/main/.github/CONTRIBUTING.md
