import { empty } from './empty';
import type { IterableResolvable } from './from';
import { assertNotNegative } from './shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow';
import { toIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable by `count` elements from the iterable.
 *
 * @param iterable - An iterator to drop values from.
 * @param count - The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `count` elements.
 * @example
 * ```typescript
 * import { drop } from '@sapphire/iterator-utilities';
 *
 * const iterable = drop(iterator, 2);
 * console.log([...iterable]);
 * // Output: [3, 4, 5]
 * ```
 */
export function drop<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	// eslint-disable-next-line no-param-reassign
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const resolvedIterable = toIterableIterator(iterable);

	// If the count is 0, return the original iterable:
	if (count === 0) return resolvedIterable;
	// If the count is infinite, return an empty iterable:
	if (count === Number.POSITIVE_INFINITY) return empty();

	for (let idx = 0; idx < count; idx++) {
		if (resolvedIterable.next().done) break;
	}

	return resolvedIterable;
}
