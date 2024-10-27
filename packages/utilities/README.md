<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/utilities

**Common JavaScript utilities for the Sapphire Community.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/utilities?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/utilities)
[![npm](https://img.shields.io/npm/v/@sapphire/utilities?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/utilities)

</div>

**Table of Contents**

-   [Description](#description)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [Javascript Utilities](#javascript-utilities)
        -   [`arrayStrictEquals`](#arraystrictequals)
        -   [`chunk`](#chunk)
        -   [`classExtends`](#classextends)
        -   [`codeBlock`](#codeblock)
        -   [`cutText`](#cuttext)
        -   [`deepClone`](#deepclone)
        -   [`filterNullAndUndefined`](#filternullandundefined)
        -   [`filterNullAndUndefinedAndEmpty`](#filternullandundefinedandempty)
        -   [`filterNullAndUndefinedAndZero`](#filternullandundefinedandzero)
        -   [`getDeepObjectKeys`](#getdeepobjectkeys)
        -   [`hasAtLeastOneKeyInMap`](#hasatleastonekeyinmap)
        -   [`inlineCodeBlock`](#inlinecodeblock)
        -   [`isClass`](#isclass)
        -   [`isFunction`](#isfunction)
        -   [`isNullOrUndefined`](#isnullorundefined)
        -   [`isNullOrUndefinedOrEmpty`](#isnullorundefinedorempty)
        -   [`isNullOrUndefinedOrZero`](#isnullorundefinedorzero)
        -   [`isNumber`](#isnumber)
        -   [`isObject`](#isobject)
        -   [`isPrimitive`](#isprimitive)
        -   [`isThenable`](#isthenable)
        -   [`lazy`](#lazy)
        -   [`makeObject`](#makeobject)
        -   [`mergeDefault`](#mergedefault)
        -   [`mergeObjects`](#mergeobjects)
        -   [`noop`](#noop)
        -   [`objectToTuples`](#objecttotuples)
        -   [`partition`](#partition)
        -   [`pickRandom`](#pickrandom)
        -   [`range`](#range)
        -   [`regExpEsc`](#regexpesc)
        -   [`roundNumber`](#roundnumber)
        -   [`sleep` / `sleepSync`](#sleep--sleepsync)
        -   [`splitText`](#splittext)
        -   [`throttle`](#throttle)
        -   [`toTitleCase`](#totitlecase)
        -   [`tryParseJSON`](#tryparsejson)
        -   [`tryParseURL`](#tryparseurl)
    -   [Typescript Utilities](#typescript-utilities)
        -   [Functions](#functions)
            -   [`cast`](#cast)
            -   [`objectEntries`](#objectentries)
            -   [`objectKeys`](#objectkeys)
            -   [`objectValues`](#objectvalues)
        -   [Types](#types)
            -   [`Primitive`](#primitive)
            -   [`Builtin`](#builtin)
            -   [`DeepReadonly`](#deepreadonly)
            -   [`DeepRequired`](#deeprequired)
            -   [`RequiredExcept`](#requiredexcept)
            -   [`PartialRequired`](#partialrequired)
            -   [`ArgumentTypes`](#argumenttypes)
            -   [`Arr`](#arr)
            -   [`Ctor`](#ctor)
            -   [`AbstractCtor`](#abstractctor)
            -   [`Constructor`](#constructor)
            -   [`AbstractConstructor`](#abstractconstructor)
            -   [`FirstArgument`](#firstargument)
            -   [`SecondArgument`](#secondargument)
            -   [`Awaitable`](#awaitable)
            -   [`Nullish`](#nullish)
            -   [`NonNullableProperties`](#nonnullableproperties)
            -   [`NonNullObject`](#nonnullobject-deprecated)
            -   [`AnyObject`](#anyobject-deprecated)
            -   [`PrettifyObject`](#prettifyobject)
            -   [`PickByValue`](#pickbyvalue)
            -   [`Mutable`](#mutable)
            -   [`StrictRequired`](#strictrequired)
            -   [`ArrayElementType`](#arrayelementtype)
-   [Buy us some doughnuts](#buy-us-some-doughnuts)
-   [Contributors](#contributors)

## Description

We often have a need for a function or type augmentation and having to include it in every repo is a huge drag. To solve this problem there are dozens upon dozens of packages on NPM, but we cannot maintain those in case of issues and a lot of them are poorly written or under-optimised. Our solution is to provide @sapphire/utilities, which is the only package you'll likely need to cover your day-to-day needs.

## Features

-   Written in TypeScript
-   Bundled with esbuild so it can be used in NodeJS and browsers
-   Offers CommonJS, ESM and UMD bundles
-   Fully tested

## Installation

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install @sapphire/utilities
```

---

## Usage

You can import individual utility function from subpath like: @sapphire/utility/isFunction or the entire library.

```ts
import { isFunction } from '@sapphire/utilities/isFunction';
// or
import { isFunction } from '@sapphire/utilities';
```

**Note:** For typescript users, subpath import are only supported in `--moduleResolution node16` and `--moduleResolution nodenext`. More information can be found [in this issue on the microsoft/TypeScript repository](https://github.com/microsoft/TypeScript/issues/50794).

**Note:** While this section uses `require`, the imports match 1:1 with ESM imports. For example `const { arrayStrictEquals } = require('@sapphire/utilities')` equals `import { arrayStrictEquals } from '@sapphire/utilities'`.

### Javascript Utilities

#### `arrayStrictEquals`

Compares if two arrays are strictly equal.

```ts
arrayStrictEquals([1, 2, 3], [1, 2, 3]); // true
arrayStrictEquals([1, 2, 3], [1, 2, 3, 4]); // false
arrayStrictEquals([1, 2, 3], [1, 2, 4]); // false
```

#### `chunk`

Splits up an array into chunks.

```ts
chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
chunk([1, 2, 3, 4, 5], 3); // [[1, 2, 3], [4, 5]]
```

#### `classExtends`

Checks whether or not the value class extends the base class.

```ts
class A {}
class B extends A {}

classExtends(A, B); // false
classExtends(B, A); // true
```

#### `codeBlock`

Wraps text in a markdown codeblock with a language indicator for syntax highlighting.

````ts
codeBlock('js', 'const value = "Hello World!";'); // ```js\nconst value = "Hello World!";\n```
````

#### `cutText`

Split a text by its latest space character in a range from the character 0 to the selected one.

```ts
cutText('Lorem Ipsum', 9); // "Lorem..."
```

#### `deepClone`

Deep clones an object.

```ts
const obj = { a: 1, b: { c: 2 } };
const clone = deepClone(obj); // { a: 1, b: { c: 2 } }
```

#### `filterNullAndUndefined`

Checks whether a value is not `null` nor `undefined`. This can be used in `Array#filter` to remove `null` and `undefined` from the array type

```ts
// TypeScript Type: (string | undefined | null)[]
const someArray = ['one', 'two', undefined, null, 'five'];

// TypeScript Type: string[]
const filteredArray = someArray.filter(filterNullAndUndefined); // ['one', 'two', 'five']
```

#### `filterNullAndUndefinedAndEmpty`

Checks whether a value is not `null`, `undefined`, or `''` (empty string). This can be used in `Array#filter` to remove `null`, `undefined`, and `''` from the array type

```ts
// TypeScript Type: (number | string | undefined | null)[]
const someArray = [1, 2, undefined, null, ''];

// TypeScript Type: number[]
const filteredArray = someArray.filter(filterNullAndUndefinedAndEmpty); // [1, 2]
```

#### `filterNullAndUndefinedAndZero`

Checks whether a value is not `null`, `undefined`, or `0`. This can be used in `Array#filter` to remove `null`, `undefined`, and `0` from the array type

```ts
// TypeScript Type: (string | number | undefined | null)[]
const someArray = ['one', 'two', undefined, null, 0];

// TypeScript Type: string[]
const filteredArray = someArray.filter(filterNullAndUndefinedAndZero); // ['one', 'two']
```

#### `getDeepObjectKeys`

Returns an array of all the keys of an object, including the keys of nested objects.

```ts
const obj = { a: 1, b: { c: 2 }, d: [{ e: 3 }] };
getDeepObjectKeys(obj); // ['a', 'b.c', 'd.0.e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'braces' }); // ['a', 'bc', 'd[0]e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'braces-with-dot' }); // ['a', 'b.c', 'd[0].e']
getDeepObjectKeys(obj, { arrayKeysIndexStyle: 'dotted' }); // ['a', 'b.c', 'd.0.e']
```

#### `hasAtLeastOneKeyInMap`

Checks whether a map has at least one of an array of keys.

```ts
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3]
]);

hasAtLeastOneKeyInMap(map, ['a', 'd']); // true
hasAtLeastOneKeyInMap(map, ['d', 'e']); // false
```

#### `inlineCodeBlock`

Wraps text in a markdown inline codeblock.

```ts
inlineCodeBlock('const value = "Hello World!";'); // `const value = "Hello World!";`
```

#### `isClass`

Verifies if the input is a class constructor.

```ts
class A {}

isClass(A); // true
isClass(function () {}); // false
```

#### `isFunction`

Verifies if the input is a function.

```ts
isFunction(function () {}); // true
isFunction('foo'); // false
```

#### `isNullOrUndefined`

Checks whether a value is `null` or `undefined`.

```ts
isNullOrUndefined(null); // true
isNullOrUndefined(undefined); // true
isNullOrUndefined(1); // false
```

#### `isNullOrUndefinedOrEmpty`

Checks whether a value is `null`, `undefined`, or `''` (empty string).

```ts
isNullOrUndefinedOrEmpty(null); // true
isNullOrUndefinedOrEmpty(undefined); // true
isNullOrUndefinedOrEmpty(''); // true
isNullOrUndefinedOrEmpty(1); // false
```

#### `isNullOrUndefinedOrZero`

Checks whether a value is `null`, `undefined`, or `0`.

```ts
isNullOrUndefinedOrZero(null); // true
isNullOrUndefinedOrZero(undefined); // true
isNullOrUndefinedOrZero(0); // true
isNullOrUndefinedOrZero(1); // false
```

#### `isNumber`

Verifies if the input is a number.

```ts
isNumber(1); // true
isNumber('1'); // false
```

#### `isObject`

Verifies if the input is an object.

```ts
isObject({}); // true
isObject([]); // true
isObject('foo'); // false
```

#### `isPrimitive`

Verifies if the input is a primitive.

```ts
isPrimitive(1); // true
isPrimitive('1'); // true
isPrimitive({}); // false
```

#### `isThenable`

Verifies if an object is a promise.

```ts
isThenable({}); // false
isThenable(Promise.resolve()); // true
```

#### `lazy`

Lazily creates a constant or load a module and caches it internally.

```ts
let timesCalled = 0;
const lazyValue = lazy(() => {
	timesCalled++;
	return 'foo';
});

lazyValue(); // 'foo'
lazyValue(); // 'foo' - cached

timesCalled; // 1
```

#### `makeObject`

Turn a dotted path into a json object.

```ts
makeObject('a.b.c', 1); // { a: { b: { c: 1 } } }
```

#### `mergeDefault`

Deep merges two objects. Properties from the second parameter are applied to the first.

```ts
const base = { a: 1, b: { c: 2 } };
const overwritten = { b: { d: 3 } };

mergeDefault(base, overwritten);
overwritten; // { a: 1, b: { c: 2, d: 3 } }
```

#### `mergeObjects`

Merges two objects.

```ts
const source = { a: 1, b: 2 };
const target = { c: 4 };

mergeObjects(source, target);
target; // { a: 1, b: 2, c: 4 }
```

#### `noop`

A no-operation function.

```ts
noop(); // undefined

// Example usage of ignoring a promise rejection
Promise.reject().catch(noop);
```

#### `objectToTuples`

Converts an object to a tuple with string paths.

```ts
const obj = { a: 1, b: { c: 2 } };
objectToTuples(obj); // [['a', 1], ['b.c', 2]]
```

#### `partition`

Partitions an array into a tuple of two arrays, where one array contains all elements that satisfies the predicate, and the other contains all elements that do not satisfy the predicate.

```ts
const arr = [1, 2, 3, 4, 5];
const [evens, odds] = partition(arr, (n) => n % 2 === 0);

evens; // [2, 4]
odds; // [1, 3, 5]
```

#### `pickRandom`

Picks a random element from an array.

```ts
const arr = [1, 2, 3, 4, 5];
pickRandom(arr); // 3
```

#### `range`

Get an array of numbers with the selected range, considering a specified step.

```ts
range(1, 4, 1); // [1, 2, 3, 4]
range(1, 4, 2); // [1, 3]
range(4, 1, -1); // [4, 3, 2, 1]
range(4, 1, -2); // [4, 2]
```

#### `regExpEsc`

Cleans a string from regex injection by escaping special characters.

```ts
regExpEsc('foo.bar?'); // 'foo\\.bar\\?'
```

#### `roundNumber`

Properly rounds up or down a number. Also supports strings using an exponent to indicate large or small numbers.

```ts
roundNumber(1.9134658034); // 1
roundNumber(1.9134658034, 2); // 1.91
roundNumber('10e-5'); // 0
```

#### `sleep` / `sleepSync`

Sleeps for the specified number of milliseconds.

```ts
await sleep(1000); // Sleeps for 1 second
sleepSync(1000); // Sleeps for 1 second
```

#### `splitText`

Split a string by its latest space character in a range from the character 0 to the selected one.

```ts
splitText('Hello All People!', 8); // 'Hello'
splitText('Hello All People!', 10); // 'Hello All'
```

#### `throttle`

Creates a throttled function that only invokes a function at most once per every x milliseconds. The throttled function comes with a flush method to reset the last time the throttled function was invoked.

```ts
const throttled = throttle(() => console.log('throttled'), 1000);

throttled(); // 'throttled'
throttled(); // nothing
throttled.flush();
throttled(); // 'throttled'
```

#### `toTitleCase`

Converts a string to Title Case. This is designed to also ensure common Discord PascalCased strings are put in their TitleCase variants.

```ts
toTitleCase('foo bar'); // 'Foo Bar'
toTitleCase('textchannel'); // 'TextChannel'
toTitleCase('onetwo three', { onetwo: 'OneTwo' }); // OneTwo Three
```

#### `tryParseJSON`

Tries to parse a string as JSON.

```ts
tryParseJSON('{"foo": "bar"}'); // { foo: 'bar' }
tryParseJSON('{"foo": "bar"' /* invalid */); // '{"foo": "bar"'
```

#### `tryParseURL`

Tries to parse a string as a URL.

```ts
tryParseURL('https://google.com'); // URL object
tryParseURL('hello there :)'); // null
```

### Typescript Utilities

A subset of our utilities are intended specifically for typescript users.

#### Functions

##### `cast`

Casts any value to `T`. Note that this function is not type-safe, and may cause runtime errors if used incorrectly.

```ts
const value = cast<string>(1); // value is now of type string
```

##### `objectEntries`

A strongly-typed alternative to `Object.entries`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.entries(obj); // [string, number][]
const strict = objectEntries(obj); // [['a', 1], ['b', 2]]
```

##### `objectKeys`

A strongly-typed alternative to `Object.keys`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.keys(obj); // string[]
const strict = objectKeys(obj); // ['a', 'b']
```

##### `objectValues`

A strongly-typed alternative to `Object.values`.

```ts
const obj = { a: 1, b: 2 } as const;

const native = Object.values(obj); // number[]
const strict = objectValues(obj); // [1, 2]
```

#### Types

##### `Primitive`

A union of all primitive types.

```ts
// string | number | bigint | boolean | symbol | undefined | null
declare const primitive: Primitive;
```

##### `Builtin`

A union of all builtin types.

```ts
// Primitive | Function | Date | Error | RegExp
declare const builtin: Builtin;
```

##### `DeepReadonly`

Makes all properties in `T` readonly recursively.

```ts
type Foo = Set<{ bar?: ['foo', { hello: 'world' }] }>;

// ReadonlySet<{
//     readonly bar?: readonly ["foo", {
//         readonly hello: "world";
//     }] | undefined;
// }>
declare const foo: DeepReadonly<Foo>;
```

##### `DeepRequired`

Makes all properties in `T` required recursively.

```ts
type Foo = Set<{ bar?: Promise<{ baz?: string }>[] }>;

// Set<{ bar: Promise<{ baz: string }>[] }>
declare const foo: DeepRequired<Foo>;
```

##### `RequiredExcept`

Makes all properties in `T` required except for the ones specified in `K`.

```ts
interface Foo {
	bar?: string;
	baz?: number;
}

// { bar?: string; baz: number }
declare const foo: RequiredExcept<Foo, 'bar'>;
```

##### `PartialRequired`

Makes all properties in `T` that are assignable to `K` required.

```ts
interface Foo {
	bar?: string;
	baz?: number;
}

// { bar: string; baz?: number }
declare const foo: PartialRequired<Foo, 'bar'>;
```

##### `ArgumentTypes`

Extracts the argument types of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// [string, number]
declare const foo: ArgumentTypes<Foo>;
```

##### `Arr`

A type that represents a readonly array of `any`.

```ts
// readonly any[]
declare const arr: Arr;
```

##### `Ctor`

A constructor with parameters.

```ts
// new (...args: any[]) => any
declare const foo: Ctor;

// new (...args: [string, number]) => SomeClass
declare const bar: Ctor<[string, number], SomeClass>;
```

##### `AbstractCtor`

An abstract constructor with parameters.

```ts
// abstract new (...args: any[]) => any
declare const foo: AbstractCtor;

// abstract new (...args: [string, number]) => SomeClass
declare const bar: AbstractCtor<[string, number], SomeClass>;
```

##### `Constructor`

A constructor without parameters.

```ts
// new (...args: any[]) => any
declare const foo: Constructor;

// new (...args: any[]) => SomeClass
declare const bar: Constructor<SomeClass>;
```

##### `AbstractConstructor`

An abstract constructor without parameters.

```ts
// abstract new (...args: any[]) => any
declare const foo: AbstractConstructor;

// abstract new (...args: any[]) => SomeClass
declare const bar: AbstractConstructor<SomeClass>;
```

##### `FirstArgument`

Extracts the first argument of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// string
declare const foo: FirstArgument<Foo>;
```

##### `SecondArgument`

Extracts the second argument of a function type.

```ts
type Foo = (bar: string, baz: number) => void;

// number
declare const foo: SecondArgument<Foo>;
```

##### `Awaitable`

A type that represents a value or a promise of a value. Useful for functions that can accept both promises and non-promises.

```ts
// string | Promise<string>
declare const foo: Awaitable<string>;
```

##### `Nullish`

A type that represents `null` or `undefined`.

```ts
// null | undefined
declare const foo: Nullish;
```

##### `NonNullableProperties`

Removes all properties of `T` that are not `null` or `undefined`.

```ts
interface Foo {
	foo: null;
	bar: undefined;
	baz: boolean;
}

// { baz: boolean }
declare const foo: NonNullableProperties<Foo>;
```

##### `NonNullObject` (deprecated)

A type that represents an object that is not `null` or `undefined`.

```ts
// ✅
const foo: NonNullObject = {};

// ❌
const bar: NonNullObject = null;

// ❌
const baz: NonNullObject = undefined;
```

##### `AnyObject` (deprecated)

An object that can have any structure. Similar to `NonNullObject`, and to be used as an alternative if the aforementioned type leads to unexpected behaviors.

```ts
// ✅
const foo: AnyObject = {};

// ❌
const bar: AnyObject = null;

// ❌
const baz: AnyObject = undefined;
```

##### `PrettifyObject`

An utility type that fuses intersections of objects.

```ts
type Objects = {
  foo: string;
  bar: number;
} & {
  hello: boolean;
  world: bigint;
};

type PrettyObjects = PrettifyObject<Objects>;
// {
//   foo: string;
//   bar: number;
//   hello: boolean;
//   world: bigint
// }
```

##### `PickByValue`

Picks keys from `T` who's values are assignable to `V`.

```ts
interface Foo {
	foo: string;
	bar: number;
	baz: boolean;
}

// 'foo' | 'bar'
declare const foo: PickByValue<Foo, string | number>;
```

##### `Mutable`

Makes all properties in `T` mutable.

```ts
interface Foo {
	readonly bar: string;
	readonly baz: readonly number][];
}

// { bar: string; baz: number[] }
declare const foo: Mutable<Foo>;
```

##### `StrictRequired`

Makes all properties in `T` strictly required by removing `undefined` and `null` from value types.

```ts
interface Foo {
	bar: string | undefined;
	baz?: number | null;
}

// { bar: string; baz: number }
declare const foo: StrictRequired<Foo>;
```

##### `ArrayElementType`

Gets a union type of all the keys that are in an array.

```ts
const sample = [1, 2, '3', true];

// string | number | boolean
declare const foo: ArrayElementType<typeof sample>;
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
