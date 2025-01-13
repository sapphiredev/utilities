import type { appendAsync } from './append';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterator with the provided iterables prepended to the first iterable.
 *
 * @param iterable The iterator to prepend values to.
 * @param iterables The iterables to prepend to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 *
 * @example
 * ```typescript
 * import { prependAsync } from '@sapphire/iterator-utilities';
 *
 * const iterator = prependAsync([3, 4, 5], [1, 2]);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * @seealso {@link appendAsync} to append values to the end of an iterator.
 */
export async function* prependAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	...iterables: AsyncIterableResolvable<ElementType>[]
): AsyncIterableIterator<ElementType> {
	for (const iterable of iterables) {
		for await (const value of toAsyncIterableIterator(iterable)) {
			yield value;
		}
	}

	for await (const value of toAsyncIterableIterator(iterable)) {
		yield value;
	}
}
