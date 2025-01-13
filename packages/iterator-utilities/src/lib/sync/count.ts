import { from, type IterableResolvable } from './from';

/**
 * Consumes the iterable and returns the number of elements.
 *
 * @param iterable An iterator that contains elements to be counted.
 * @returns The number of elements in the input iterator.
 *
 * @example
 * ```typescript
 * import { count } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(count(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function count<const ElementType>(iterable: IterableResolvable<ElementType>): number {
	let count = 0;
	const resolvedIterable = from(iterable);
	while (!resolvedIterable.next().done) {
		count++;
	}

	return count;
}
