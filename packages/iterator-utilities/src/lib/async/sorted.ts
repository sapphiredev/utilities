import type { AsyncIterableResolvable } from './from';
import { toArrayAsync } from './toArray';

/**
 * Consumes the iterable and returns a new iterable with the elements sorted.
 *
 * @param iterable An iterator to sort.
 * @param compareFn A function that defines the sort order. If omitted, the values are sorted in ascending order.
 * @returns An iterator that yields the values of the provided iterator in sorted order.
 *
 * @example
 * ```typescript
 * import { sortedAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = sortedAsync([5, 3, 1, 4, 2]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire input iterator.
 */
export async function* sortedAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	compareFn?: (a: ElementType, b: ElementType) => number
): AsyncIterableIterator<ElementType> {
	const entries = await toArrayAsync(iterable);
	for (const entry of entries.sort(compareFn)) {
		yield entry;
	}
}
