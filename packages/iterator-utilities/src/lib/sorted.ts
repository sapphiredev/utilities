import type { IterableResolvable } from './from';
import { toArray } from './toArray';

/**
 * Consumes the iterable and returns a new iterable with the elements sorted.
 *
 * @param iterable An iterator to sort.
 * @param compareFn A function that defines the sort order. If omitted, the values are sorted in ascending order.
 * @returns An iterator that yields the values of the provided iterator in sorted order.
 *
 * @example
 * ```typescript
 * import { sorted } from '@sapphire/iterator-utilities';
 *
 * const iterable = [5, 3, 1, 4, 2];
 * console.log([...sorted(iterable)]);
 * // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire input iterator.
 */
export function sorted<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	compareFn?: (a: ElementType, b: ElementType) => number
): IterableIterator<ElementType> {
	return toArray(iterable).sort(compareFn).values();
}
