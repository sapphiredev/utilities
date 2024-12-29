import { assertNotNegative } from '../shared/_assertNotNegative';
import { makeIterableIterator } from '../shared/_makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { toArray } from './toArray';
import { toIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable and returns a new iterable with the last `count` elements.
 *
 * @param iterable An iterator to take values from.
 * @param count The number of values to take from the end of the iterator.
 * @returns An iterator that contains the last `count` elements of the provided iterator.
 *
 * @example
 * ```typescript
 * import { takeLast } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...takeLast(iterable, 2)]);
 * // Output: [4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function takeLast<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	if (count === 0) return empty();
	if (count === Number.POSITIVE_INFINITY) return toIterableIterator(iterable);

	const array = toArray(iterable);
	let i = Math.max(0, array.length - count);
	return makeIterableIterator<ElementType>(() => {
		if (i >= array.length) {
			return { done: true, value: undefined };
		}

		return { done: false, value: array[i++] };
	});
}
