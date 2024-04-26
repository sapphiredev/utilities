import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Converts an iterator to an array.
 *
 * @param iterable The iterator to convert to an array.
 * @returns An array containing the values of the provided iterator.
 */
export function toArray<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType[] {
	return [...toIterableIterator(iterable)];
}
