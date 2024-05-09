<div align="center">

![Sapphire Logo](https://raw.githubusercontent.com/sapphiredev/assets/main/banners/SapphireCommunity.png)

# @sapphire/iterator-utilities

**Iterator utilities for JavaScript.**

[![GitHub](https://img.shields.io/github/license/sapphiredev/utilities)](https://github.com/sapphiredev/utilities/blob/main/LICENSE.md)
[![codecov](https://codecov.io/gh/sapphiredev/utilities/branch/main/graph/badge.svg?token=OEGIV6RFDO)](https://codecov.io/gh/sapphiredev/utilities)
[![npm bundle size](https://img.shields.io/bundlephobia/min/@sapphire/iterator-utilities?logo=webpack&style=flat-square)](https://bundlephobia.com/result?p=@sapphire/iterator-utilities)
[![npm](https://img.shields.io/npm/v/@sapphire/iterator-utilities?color=crimson&logo=npm&style=flat-square)](https://www.npmjs.com/package/@sapphire/iterator-utilities)

</div>

**Table of Contents**

-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
    -   [`append`](#append)
    -   [`at`](#at)
    -   [`average`](#average)
    -   [`chain`](#chain)
    -   [`chunk`](#chunk)
    -   [`compact`](#compact)
    -   [`compress`](#compress)
    -   [`contains`](#contains)
    -   [`count`](#count)
    -   [`cycle`](#cycle)
    -   [`difference`](#difference)
    -   [`drop`](#drop)
    -   [`dropLast`](#droplast)
    -   [`dropWhile`](#dropwhile)
    -   [`empty`](#empty)
    -   [`enumerate`](#enumerate)
    -   [`every`](#every)
    -   [`filter`](#filter)
    -   [`find`](#find)
    -   [`findIndex`](#findindex)
    -   [`first`](#first)
    -   [`flat`](#flat)
    -   [`flatMap`](#flatmap)
    -   [`forEach`](#foreach)
    -   [`from`](#from)
    -   [`indexOf`](#indexof)
    -   [`intersect`](#intersect)
    -   [`isEmpty`](#isempty)
    -   [`last`](#last)
    -   [`map`](#map)
    -   [`max`](#max)
    -   [`min`](#min)
    -   [`partition`](#partition)
    -   [`peekable`](#peekable)
    -   [`prepend`](#prepend)
    -   [`product`](#product)
    -   [`range`](#range)
    -   [`reduce`](#reduce)
    -   [`repeat`](#repeat)
    -   [`reverse`](#reverse)
    -   [`slice`](#slice)
    -   [`some`](#some)
    -   [`sorted`](#sorted)
    -   [`starMap`](#starmap)
    -   [`sum`](#sum)
    -   [`take`](#take)
    -   [`takeLast`](#takelast)
    -   [`takeWhile`](#takewhile)
    -   [`tee`](#tee)
    -   [`toArray`](#toarray)
    -   [`toIterableIterator`](#toiterableiterator)
    -   [`union`](#union)
    -   [`unique`](#unique)
    -   [`unzip`](#unzip)
    -   [`zip`](#zip)
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
npm install @sapphire/iterator-utilities
```

## Usage

For any of the following examples, you can import the utilities from the index file:

```ts
import { append } from '@sapphire/iterator-utilities';
const { append } = require('@sapphire/iterator-utilities');
```

Or you can import the utilities directly:

```ts
import { append } from '@sapphire/iterator-utilities/append';
const { append } = require('@sapphire/iterator-utilities/append');
```

### `append`

Appends iterables to the end of the first iterable, returning a new iterable combining all of them. It's similar to concatenating arrays or doing `[...a, ...b, ...c]`.

```typescript
const iterable = append([1, 2, 3], [4, 5, 6], [7, 8, 9]);
console.log([...iterable]);
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### `at`

Advances the iterable to the `n`th element and returns it. If the iterable is exhausted before reaching the `n`th element, it returns `undefined`.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(at(iterable, 2));
// Output: 3
```

### `average`

Consumes the iterable and returns the average value of all the elements. If the iterable is empty, it returns `null`.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(average(iterable));
// Output: 3
```

### `chain`

Similar to `append`, but takes an iterable of iterables and chains them together.

```typescript
const iterable = chain([1, 2, 3], [4, 5, 6], [7, 8, 9]);
console.log([...iterable]);
// Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### `chunk`

Chunks the iterable into arrays of at most `size` elements.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...chunk(iterable, 2)]);
// Output: [[1, 2], [3, 4], [5]]
```

### `compact`

Creates a new iterable that yields all the non-nullish values (`null` and `undefined`) from the iterable.

```typescript
const iterable = [1, null, 2, undefined, 3];
console.log([...compact(iterable)]);
// Output: [1, 2, 3]
```

### `compress`

Creates a new iterable of the first iterable based on the truthiness of the corresponding element in the second iterable.

```typescript
const iterable = compress([1, 2, 3, 4, 5], [true, false, true, false, true]);
console.log([...iterable]);
// Output: [1, 3, 5]
```

### `contains`

Advances the iterable until it finds the element, returning `true` if it's found and `false` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(contains(iterable, 3));
// Output: true
```

### `count`

Consumes the iterable and returns the number of elements.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(count(iterable));
// Output: 5
```

### `cycle`

Creates an infinite iterable by cycling through the elements of the input iterable.

```typescript
const iterable = cycle([1, 2, 3]);
for (const element of iterable) {
	console.log(element);
	// Output: 1, 2, 3, 1, 2, 3, 1, 2, 3, ...
}
```

### `difference`

Creates an iterable with the elements of the first iterable that are not in the second iterable.

```typescript
const first = [1, 2, 3, 4, 5];
const second = [3, 4, 5, 6, 7];
console.log([...difference(first, second)]);
// Output: [1, 2]
```

### `drop`

Advances the iterable by `count` elements from the iterable.

```typescript
const iterable = drop(iterator, 2);
console.log([...iterable]);
// Output: [3, 4, 5]
```

### `dropLast`

Consumes the iterable, creating a new iterator without the last `count` elements from the iterable.

```typescript
const iterable = dropLast([1, 2, 3, 4, 5], 2);
console.log([...iterable]);
// Output: [1, 2, 3]
```

### `dropWhile`

Creates a new iterator without the elements that satisfy the specified test.

```typescript
const iterable = dropWhile([1, 2, 3, 4, 5], (value) => value < 3);
console.log([...iterable]);
// Output: [3, 4, 5]
```

### `empty`

Creates an empty iterator.

```typescript
const iterable = empty();
console.log([...iterable]);
// Output: []
```

### `enumerate`

Creates a new iterable that yields the index and value of each element.

```typescript
const iterable = ['a', 'b', 'c'];
for (const [index, value] of enumerate(iterable)) {
	console.log(`Index: ${index}, Value: ${value}`);
	// Output: Index: 0, Value: a
	// Output: Index: 1, Value: b
	// Output: Index: 2, Value: c
}
```

### `every`

Tests whether all elements in the iterable pass the test implemented by the provided function.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(every(iterable, (value) => value < 10));
// Output: true
console.log(every(iterable, (value) => value < 3));
// Output: false
```

### `filter`

Creates an iterable with the elements that pass the test implemented by the provided function.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...filter(iterable, (value) => value % 2 === 0)]);
// Output: [2, 4]
```

### `find`

Advances the iterable until it finds the element, returning it if it's found and `undefined` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(find(iterable, (value) => value % 2 === 0));
// Output: 2
```

### `findIndex`

Advances the iterable until it finds the element, returning its index if it's found and `-1` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(findIndex(iterable, (value) => value % 2 === 0));
// Output: 1
```

### `first`

Consumes the first element of the iterable, returning it if it's found and `undefined` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(first(iterable));
// Output: 1
```

### `flat`

Creates an iterable that yields the elements of each iterable in the input iterable.

```typescript
const iterable = flat([
	[1, 2],
	[3, 4],
	[5, 6]
]);
console.log([...iterable]);
// Output: [1, 2, 3, 4, 5, 6]
```

### `flatMap`

Creates an iterable that yields the elements of each iterable returned by the provided function on each element of the input iterable.

```typescript
const iterable = [1, 2, 3];
console.log([...flatMap(iterable, (value) => [value, value * 2])]);
// Output: [1, 2, 2, 4, 3, 6]
```

### `forEach`

Executes a provided function once for each iterable element.

```typescript
const iterable = [1, 2, 3, 4, 5];
forEach(iterable, (value) => console.log(value));
// Output: 1, 2, 3, 4, 5
```

### `from`

Resolves an iterable from an iterable or iterator-like object.

```typescript
const iterable = from([1, 2, 3, 4, 5]);
for (const element of iterable) {
	console.log(element);
	// Output: 1, 2, 3, 4, 5
}
```

### `indexOf`

Advances the iterable until it finds the element, returning its index if it's found and `-1` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(indexOf(iterable, 3));
// Output: 2
```

### `intersect`

Creates an iterable with the elements that are in both input iterables.

```typescript
const iterable = intersect([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]);
console.log([...iterable]);
// Output: [3, 4, 5]
```

### `isEmpty`

Advances the iterable once, returning `true` if it's exhausted and `false` otherwise.

```typescript
console.log(isEmpty([]));
// Output: true

console.log(isEmpty([1, 2, 3, 4, 5]));
// Output: false
```

### `last`

Consumes the iterable until it's exhausted, returning the last element.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(last(iterable));
// Output: 5
```

### `map`

Creates an iterable with the results of calling a provided function on each element.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...map(iterable, (value) => value * 2)]);
// Output: [2, 4, 6, 8, 10]
```

### `max`

Consumes the iterable and returns the highest number element. If the iterable is empty, or contains only non-number values, it returns `null`.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(max(iterable));
// Output: 5
```

### `min`

Consumes the iterable and returns the lowest number element. If the iterable is empty, or contains only non-number values, it returns `null`.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(min(iterable));
// Output: 1
```

### `partition`

Consumes the iterable and creates two arrays, one with the elements that pass the test and another with the elements that don't.

```typescript
const iterable = [1, 2, 3, 4, 5];
const [even, odd] = partition(iterable, (value) => value % 2 === 0);

console.log(even);
// Output: [2, 4]

console.log(odd);
// Output: [1, 3, 5]
```

### `peekable`

Creates an iterator that allows you to peek at the next element without advancing the iterator.

```typescript
const iterable = [1, 2, 3, 4, 5];
const peekableIterator = peekable(iterable);

console.log(peekableIterator.next());
// Output: { value: 1, done: false }

console.log(peekableIterator.peek());
// Output: { value: 2, done: false }

console.log(peekableIterator.next());
// Output: { value: 2, done: false }

console.log(peekableIterator.next());
// Output: { value: 3, done: false }
```

### `prepend`

Creates an iterator with the provided iterables prepended to the first iterable.

```typescript
console.log([...prepend([3, 4, 5], [1], [2])]);
// Output: [1, 2, 3, 4, 5]
```

### `product`

Consumes the iterable and returns the product of all the elements. If the iterable is empty, it returns `1`.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(product(iterable));
// Output: 120
```

### `range`

Creates an iterable with the numbers from `start` to `stop` (exclusive) with an optional step.

```typescript
const iterable = range(0, 5);
console.log([...iterable]);
// Output: [0, 1, 2, 3, 4]
```

If `start` is greater than `stop`, the iterable will count down with a negative step.

```typescript
const iterable = range(5, 0);
console.log([...iterable]);
// Output: [5, 4, 3, 2, 1]
```

You can also specify a step.

```typescript
const iterable = range(0, 5, 2);
console.log([...iterable]);
// Output: [0, 2, 4]
```

### `reduce`

Consumes the iterable and reduces it to the reducer function's result.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(reduce(iterable, (accumulator, currentValue) => accumulator + currentValue));
// Output: 15
```

### `repeat`

Creates an iterable that repeats the input iterable `count` times.

```typescript
const iterator = repeat('Hello, world!', 3);
console.log([...iterator]);
// Output: ['Hello, world!', 'Hello, world!', 'Hello, world!']
```

### `reverse`

Consumes the iterable and returns a new iterable with the elements in reverse order.

```typescript
console.log([...reverse([1, 2, 3, 4, 5])]);
// Output: [5, 4, 3, 2, 1]

console.log([...reverse('hello')]);
// Output: ['o', 'l', 'l', 'e', 'h']
```

### `slice`

Produces an iterable with the elements from the `start` index to the `end` index (exclusive).

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, 1, 3)]);
// Output: [2, 3]
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, -2)]);
// Output: [4, 5]
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, 2)]);
// Output: [3, 4, 5]
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, 2, -1)]);
// Output: [3, 4]
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, -2, -1)]);
// Output: [4]
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...slice(iterable, 2, 1)]);
// Output: []
```

### `some`

Advances the iterable until it finds a matching element, returning `true` if it's found and `false` otherwise.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(some(iterable, (value) => value % 2 === 0));
// Output: true
```

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(some(iterable, (value) => value % 6 === 0));
// Output: false
```

### `sorted`

Consumes the iterable and returns a new iterable with the elements sorted.

```typescript
const iterable = [5, 3, 1, 4, 2];
console.log([...sorted(iterable)]);
// Output: [1, 2, 3, 4, 5]
```

### `starMap`

Creates an iterable with the results of calling a provided function on each element of the input iterables as the function's parameters.

```typescript
const iterable = [
	[1, 2],
	[3, 4],
	[5, 6]
];
console.log([...starMap(iterable, (a, b) => a + b)]);
// Output: [3, 7, 11]
```

### `sum`

Consumes the iterable and returns the sum of all the elements.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log(sum(iterable));
// Output: 15
```

### `take`

Creates an iterable with the first `count` elements.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...take(iterable, 2)]);
// Output: [1, 2]
```

### `takeLast`

Consumes the iterable and returns a new iterable with the last `count` elements.

```typescript
const iterable = [1, 2, 3, 4, 5];
console.log([...takeLast(iterable, 2)]);
// Output: [4, 5]
```

### `takeWhile`

Alias of [`filter`](#filter).

### `tee`

Creates `count` independent iterators from the input iterable.

```typescript
const iterable = [1, 2, 3, 4, 5];
const [iter1, iter2] = tee(iterable, 2);

console.log([...iter1]);
// Output: [1, 2, 3, 4, 5]

console.log([...iter2]);
// Output: [1, 2, 3, 4, 5]
```

### `toArray`

Consumes the iterable and returns an array with all the elements.

```typescript
const array = [1, 2, 3, 4, 5];
console.log(toArray(array));
// Output: [1, 2, 3, 4, 5]
```

```typescript
const set = new Set([1, 2, 3, 4, 5]);
console.log(toArray(set));
// Output: [1, 2, 3, 4, 5]
```

```typescript
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3]
]);
console.log(toArray(map));
// Output: [['a', 1], ['b', 2], ['c', 3]]
```

```typescript
const string = 'hello';
console.log(toArray(string));
// Output: ['h', 'e', 'l', 'l', 'o']
```

### `toIterableIterator`

Creates an iterable iterator from an iterable or iterator-like object.

```typescript
const array = [1, 2, 3, 4, 5];
console.log([...toIterableIterator(array)]);
// Output: [1, 2, 3, 4, 5]
```

```typescript
const set = new Set([1, 2, 3, 4, 5]);
console.log([...toIterableIterator(set)]);
// Output: [1, 2, 3, 4, 5]
```

```typescript
const map = new Map([
	['a', 1],
	['b', 2],
	['c', 3]
]);
console.log([...toIterableIterator(map)]);
// Output: [['a', 1], ['b', 2], ['c', 3]]
```

```typescript
const string = 'hello';
console.log([...toIterableIterator(string)]);
// Output: ['h', 'e', 'l', 'l', 'o']
```

### `union`

Creates an iterable with the elements that are in either input iterable.

```typescript
const iterable1 = [1, 2, 3];
const iterable2 = [3, 4, 5];
console.log([...union(iterable1, iterable2)]);
// Output: [1, 2, 3, 4, 5]
```

### `unique`

Creates an iterable with the unique elements of the input iterable. Under the hood, it calls [`union`](#union) with the iterable itself.

```typescript
const iterable = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
console.log([...unique(iterable)]);
// Output: [1, 2, 3, 4, 5]
```

### `unzip`

Creates an array for each element of the input iterable, transposing the input iterable. The opposite of [`zip`](#zip).

```typescript
const iterable = [
	[1, 'a'],
	[2, 'b'],
	[3, 'c']
];
const [numbers, letters] = unzip(iterable);

console.log(numbers);
// Output: [1, 2, 3]

console.log(letters);
// Output: ['a', 'b', 'c']
```

### `zip`

Creates an iterable with the elements of the input iterables zipped together. The opposite of [`unzip`](#unzip).

```typescript
const iterable1 = [1, 2, 3];
const iterable2 = ['a', 'b', 'c'];
const iterable3 = [true, false, true];
console.log(zip(iterable1, iterable2, iterable3));
// Output: [
// 	[1, 'a', true],
// 	[2, 'b', false],
// 	[3, 'c', true]
// ]
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
