import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterable that yields the index and value of each element.
 *
 * @param iterable An iterator to enumerate.
 * @returns An iterator that yields the index and value of each element in the source iterator.
 *
 * @example
 * ```typescript
 * import { enumerateAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = ['a', 'b', 'c'];
 * for await (const [index, value] of enumerateAsync(iterable)) {
 * 	console.log(`Index: ${index}, Value: ${value}`);
 * 	// Output: Index: 0, Value: a
 * 	// Output: Index: 1, Value: b
 * 	// Output: Index: 2, Value: c
 * }
 * ```
 */
export async function* enumerateAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>
): AsyncIterableIterator<[number, ElementType]> {
	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		yield [index++, value];
	}
}
