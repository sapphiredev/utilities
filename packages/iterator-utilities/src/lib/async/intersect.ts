import { collectAsync } from './collect';
import type { differenceAsync } from './difference';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements that are in both input iterables.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to include in the result.
 *
 * @example
 * ```typescript
 * import { intersectAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = intersectAsync([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire `second` iterator to build the set of elements to intersect with `first`.
 *
 * @seealso {@link differenceAsync} for the opposite behavior.
 */
export async function* intersectAsync<const ElementType>(
	first: AsyncIterableResolvable<ElementType>,
	second: AsyncIterableResolvable<ElementType>
): AsyncIterableIterator<ElementType> {
	const set = new Set(await collectAsync(second));

	for await (const value of toAsyncIterableIterator(first)) {
		if (set.has(value)) {
			yield value;
		}
	}
}
