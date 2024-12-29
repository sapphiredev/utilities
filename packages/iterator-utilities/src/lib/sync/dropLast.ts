import { assertNotNegative } from '../shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { take } from './take';
import { toArray } from './toArray';

/**
 * Consumes the iterable, creating a new iterator without the last `count` elements from the iterable.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of values to drop from the end of the iterator.
 * @returns An iterator that contains the elements of the provided iterator, except for the last `count` elements.
 *
 * @example
 * ```typescript
 * import { dropLast } from '@sapphire/iterator-utilities';
 *
 * const iterable = dropLast([1, 2, 3, 4, 5], 2);
 * console.log([...iterable]);
 * // Output: [1, 2, 3]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function dropLast<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const array = toArray(iterable);
	if (array.length <= count) return empty();
	return take(array.values(), array.length - count);
}
