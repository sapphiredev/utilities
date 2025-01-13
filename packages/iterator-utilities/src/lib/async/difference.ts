import { collectAsync } from './collect';
import { filterAsync } from './filter';
import type { AsyncIterableResolvable } from './from';

/**
 * Creates an iterable with the elements of the first iterable that are not in the second iterable.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to exclude from the result.
 *
 * @example
 * ```typescript
 * import { differenceAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const first = [1, 2, 3, 4, 5];
 * const second = [3, 4, 5, 6, 7];
 *
 * const iterator = differenceAsync(first, second);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire `second` iterator to build the set of elements to exclude from `first`.
 */
export async function* differenceAsync<const ElementType>(
	first: AsyncIterableResolvable<ElementType>,
	second: AsyncIterableResolvable<ElementType>
): AsyncIterableIterator<ElementType> {
	const set = new Set(await collectAsync(second));
	for await (const value of filterAsync(first, (value) => !set.has(value))) {
		yield value;
	}
}

export { differenceAsync as exceptAsync, differenceAsync as omitAsync };
