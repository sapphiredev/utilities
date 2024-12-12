import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements that are in either input iterable.
 *
 * @param iterables The iterators to combine.
 * @returns An iterator that yields the union of the provided iterators.
 *
 * @example
 * ```typescript
 * import { unionAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable1 = [1, 2, 3];
 * const iterable2 = [3, 4, 5];
 * const iterator = unionAsync(iterable1, iterable2);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export async function* unionAsync<const ElementType>(...iterables: AsyncIterableResolvable<ElementType>[]): AsyncIterableIterator<ElementType> {
	const seen = new Set<ElementType>();
	for (const iterator of iterables) {
		for await (const value of toAsyncIterableIterator(iterator)) {
			if (!seen.has(value)) {
				seen.add(value);
				yield value;
			}
		}
	}
}
