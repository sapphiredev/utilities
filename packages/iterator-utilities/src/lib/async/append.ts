import { chainAsync } from './chain';
import type { AsyncIterableResolvable } from './from';
import type { prependAsync } from './prepend';

/**
 * Appends iterables to the end of the first iterable, returning a new iterable combining all of them. It's similar to concatenating arrays or doing `[...a, ...b, ...c]`.
 *
 * @param iterable The iterator to append values to.
 * @param iterables The iterables to append to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 *
 * @example
 * ```typescript
 * import { appendAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = appendAsync([1, 2, 3], [4, 5, 6], [7, 8, 9]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 *
 * @seealso {@link prependAsync} to append values to the end of an iterator.
 */
export function appendAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	...iterables: AsyncIterableResolvable<ElementType>[]
): AsyncIterableIterator<ElementType> {
	return chainAsync(iterable, ...iterables);
}

export { appendAsync as concatAsync };
