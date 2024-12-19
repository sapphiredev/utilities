import { assertNotNegative } from '../shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import type { AsyncIterableResolvable } from './from';
import { toArrayAsync } from './toArray';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable and returns a new iterable with the last `count` elements.
 *
 * @param iterable An iterator to take values from.
 * @param count The number of values to take from the end of the iterator.
 * @returns An iterator that contains the last `count` elements of the provided iterator.
 *
 * @example
 * ```typescript
 * import { takeLastAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterator = takeLastAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterator));
 * // Output: [4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function* takeLastAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	count: number
): AsyncIterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);

	if (count === 0) {
		return;
	}

	if (count === Number.POSITIVE_INFINITY) {
		for await (const value of toAsyncIterableIterator(iterable)) {
			yield value;
		}

		return;
	}

	const array = await toArrayAsync(iterable);
	for (let i = Math.max(0, array.length - count); i < array.length; ++i) {
		yield array[i];
	}
}
