import { empty } from './empty';
import type { IterableResolvable } from './from';
import { assertNotNegative } from './shared/assertNotNegative';
import { makeIterableIterator } from './shared/makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from './shared/toIntegerOrInfinityOrThrow';
import { toArray } from './toArray';

/**
 * Returns a new iterator that contains the last `count` elements from `iterator`.
 *
 * @param iterable An iterator to take values from.
 * @param limit The number of values to take from the end of the iterator.
 * @returns An iterator that contains the last `count` elements of the provided iterator.
 */
export function takeLast<const ElementType>(iterable: IterableResolvable<ElementType>, limit: number): IterableIterator<ElementType> {
	limit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (limit === 0) return empty();

	const array = toArray(iterable);
	let i = Math.max(0, array.length - limit);
	return makeIterableIterator<ElementType>(() => {
		if (i >= array.length) {
			return { done: true, value: undefined };
		}

		return { done: false, value: array[i++] };
	});
}
