import { from, type IterableResolvable } from './from';

/**
 * Returns the number of elements in an iterator.
 *
 * @param iterable An iterator that contains elements to be counted.
 * @returns The number of elements in the input iterator.
 */
export function count<const ElementType>(iterable: IterableResolvable<ElementType>): number {
	let count = 0;
	const resolvedIterable = from(iterable);
	while (!resolvedIterable.next().done) {
		count++;
	}

	return count;
}
