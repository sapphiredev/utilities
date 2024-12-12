import { assertNotNegative } from '../shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import type { AsyncIterableResolvable } from './from';
import { toArrayAsync } from './toArray';

/**
 * Consumes the iterable, creating a new iterator without the last `count` elements from the iterable.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of values to drop from the end of the iterator.
 * @returns An iterator that contains the elements of the provided iterator, except for the last `count` elements.
 *
 * @example
 * ```typescript
 * import { dropLastAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = dropLastAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function* dropLastAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	count: number
): AsyncIterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);

	const array = await toArrayAsync(iterable);
	if (array.length <= count) {
		return;
	}

	for (let i = 0, max = array.length - count; i < max; ++i) {
		yield array[i];
	}
}
