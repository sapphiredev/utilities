import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';

/**
 * Creates a new iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 *
 * @param iterator An iterator to drop values from.
 * @param count The number of elements to drop from the start of the iteration.
 * @returns An iterator that contains the elements of the provided iterator, except for the first `limit` elements.
 */
export function drop<const ElementType>(iterator: IterableIterator<ElementType>, count: number) {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);

	if (integerLimit === 0) return iterator;
	for (let i = 0; i < integerLimit; i++) {
		if (iterator.next().done) break;
	}

	return iterator;
}

export { drop as skip };
