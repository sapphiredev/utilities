import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { take } from './take';
import { toArray } from './toArray';

/**
 * Returns a new iterator that contains the elements from `iterator` with the last `count` elements of the source collection omitted.
 *
 * @param iterable An iterator to drop values from.
 * @param count The number of values to drop from the end of the iterator.
 * @returns An iterator that contains the elements of the provided iterator, except for the last `count` elements.
 */
export function dropLast<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	const integerCount = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	const array = toArray(iterable);
	if (array.length <= integerCount) return empty();
	return take(array.values(), array.length - integerCount);
}

export { dropLast as skipLast };
