import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Takes the first `limit` values from the iterator.
 *
 * @param iterable The iterator to take values from.
 * @param limit The maximum number of values to take from the iterator.
 * @returns An iterator that yields at most `limit` values from the provided iterator.
 */
export function* take<const ElementType>(iterable: IterableResolvable<ElementType>, limit: number): IterableIterator<ElementType> {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (integerLimit === 0) return empty();

	let i = 0;
	for (const value of toIterableIterator(iterable)) {
		if (i >= integerLimit) break;
		i++;
		yield value;
	}
}
