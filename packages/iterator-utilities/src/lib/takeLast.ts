import { assertNotNegative } from './common/assertNotNegative';
import { makeIterableIterator } from './common/makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { toArray } from './toArray';

/**
 * Returns a new iterator that contains the last `count` elements from `iterator`.
 *
 * @param iterable An iterator to take values from.
 * @param limit The number of values to take from the end of the iterator.
 * @returns An iterator that contains the last `count` elements of the provided iterator.
 */
export function takeLast<const ElementType>(iterable: IterableResolvable<ElementType>, limit: number): IterableIterator<ElementType> {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (integerLimit === 0) return empty();

	const array = toArray(iterable);
	let i = array.length - integerLimit;
	return makeIterableIterator<ElementType>(() => {
		if (i >= array.length) {
			return { done: true, value: undefined };
		}

		return { done: false, value: array[i++] };
	});
}
