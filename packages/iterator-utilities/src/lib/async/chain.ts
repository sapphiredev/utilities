import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Similar to `append`, but takes an iterable of iterables and chains them together.
 *
 * @param iterables The iterators to chain together.
 * @returns An iterator that yields the values of the provided iterators in order.
 *
 * @example
 * ```typescript
 * import { chainAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = chainAsync([1, 2, 3], [4, 5, 6], [7, 8, 9]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 */
export async function* chainAsync<const ElementType>(...iterables: AsyncIterableResolvable<ElementType>[]): AsyncIterableIterator<ElementType> {
	for (const iterable of iterables) {
		for await (const value of toAsyncIterableIterator(iterable)) {
			yield value;
		}
	}
}
