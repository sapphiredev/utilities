import { assertNotNegative } from '../shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable by `count` elements from the iterable.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `count` elements.
 *
 * @example
 * ```typescript
 * import { dropAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = dropAsync(iterator, 2);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 4, 5]
 * ```
 */
export async function* dropAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	count: number
): AsyncIterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const resolvedIterable = toAsyncIterableIterator(iterable);

	// If the count is infinite, return an empty iterable:
	if (count === Number.POSITIVE_INFINITY) {
		return;
	}

	for (let i = 0; i < count; i++) {
		if ((await resolvedIterable.next()).done) break;
	}

	for await (const value of resolvedIterable) {
		yield value;
	}
}
