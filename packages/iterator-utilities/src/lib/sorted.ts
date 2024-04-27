import type { IterableResolvable } from './from';
import { toArray } from './toArray';

/**
 * Creates a new iterator that yields the values of the provided iterator in sorted order.
 *
 * @param iterable An iterator to sort.
 * @param compareFn A function that defines the sort order. If omitted, the values are sorted in ascending order.
 * @returns An iterator that yields the values of the provided iterator in sorted order.
 */
export function sorted<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	compareFn?: (a: ElementType, b: ElementType) => number
): IterableIterator<ElementType> {
	return toArray(iterable).sort(compareFn).values();
}
