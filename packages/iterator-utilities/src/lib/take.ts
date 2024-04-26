import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { empty } from './empty';

/**
 * Takes the first `limit` values from the iterator.
 *
 * @param iterator The iterator to take values from.
 * @param limit The maximum number of values to take from the iterator.
 * @returns An iterator that yields at most `limit` values from the provided iterator.
 */
export function* take<const ElementType>(iterator: IterableIterator<ElementType>, limit: number): IterableIterator<ElementType> {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (integerLimit === 0) return empty();

	let i = 0;
	for (const value of iterator) {
		if (i >= integerLimit) break;
		i++;
		yield value;
	}
}
