import { assertNotNegative } from '../shared/_assertNotNegative';
import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { emptyAsync } from './empty';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterable with the first `count` elements.
 *
 * @param iterable The iterator to take values from.
 * @param count The maximum number of values to take from the iterator.
 * @returns An iterator that yields at most `count` values from the provided iterator.
 *
 * @example
 * ```typescript
 * import { takeAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterator = takeAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2]
 * ```
 */
export function takeAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, count: number): AsyncIterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	if (count === 0) return emptyAsync();

	let i = 0;
	const resolvedIterable = fromAsync(iterable);
	return makeAsyncIterableIterator<ElementType>(async () =>
		i >= count //
			? { done: true, value: undefined }
			: (i++, resolvedIterable.next())
	);
}
