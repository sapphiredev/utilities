import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterable that yields the index and value of each element.
 *
 * @param iterable An iterator to enumerate.
 * @returns An iterator that yields the index and value of each element in the source iterator.
 *
 * @example
 * ```typescript
 * import { enumerate } from '@sapphire/iterator-utilities';
 *
 * const iterable = ['a', 'b', 'c'];
 * for (const [index, value] of enumerate(iterable)) {
 * 	console.log(`Index: ${index}, Value: ${value}`);
 * 	// Output: Index: 0, Value: a
 * 	// Output: Index: 1, Value: b
 * 	// Output: Index: 2, Value: c
 * }
 * ```
 */
export function* enumerate<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<[number, ElementType]> {
	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		yield [index++, value];
	}
}
