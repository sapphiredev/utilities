import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { drop } from './drop';
import { first } from './first';

/**
 * Returns the element at a specified index in an iterator.
 *
 * @param iterator An iterator to return an element from.
 * @param index The index of the element to retrieve.
 * @returns The element at the specified index, or `undefined` if the index is out of range.
 */
export function at<const ElementType>(iterator: IterableIterator<ElementType>, index: number): ElementType | undefined {
	const integerIndex = assertNotNegative(toIntegerOrInfinityOrThrow(index), index);
	return first(integerIndex === 0 ? iterator : drop(iterator, integerIndex - 1));
}
