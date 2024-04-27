import { empty } from './empty';
import type { IterableResolvable } from './from';
import { assertNotNegative } from './shared/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './shared/toIntegerOrInfinityOrThrow';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 */
export function drop<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const resolvedIterable = toIterableIterator(iterable);

	// If the count is 0, return the original iterable:
	if (count === 0) return resolvedIterable;
	// If the count is infinite, return an empty iterable:
	if (count === Number.POSITIVE_INFINITY) return empty();

	for (let i = 0; i < count; i++) {
		if (resolvedIterable.next().done) break;
	}

	return resolvedIterable;
}

export { drop as skip };
