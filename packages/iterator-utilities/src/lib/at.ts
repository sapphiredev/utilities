import { drop } from './drop';
import { first } from './first';
import type { IterableResolvable } from './from';
import { assertNotNegative } from './shared/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './shared/toIntegerOrInfinityOrThrow';

/**
 * Returns the element at a specified index in an iterator.
 *
 * @param iterable An iterator to return an element from.
 * @param index The index of the element to retrieve.
 * @returns The element at the specified index, or `undefined` if the index is out of range.
 */
export function at<const ElementType>(iterable: IterableResolvable<ElementType>, index: number): ElementType | undefined {
	index = assertNotNegative(toIntegerOrInfinityOrThrow(index), index);
	return first(index === 0 ? iterable : drop(iterable, index));
}
