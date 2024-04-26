import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 */
export function drop<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const resolvedIterable = toIterableIterator(iterable);

	if (integerLimit === 0) return resolvedIterable;
	for (let i = 0; i < integerLimit; i++) {
		if (resolvedIterable.next().done) break;
	}

	return resolvedIterable;
}

export { drop as skip };
