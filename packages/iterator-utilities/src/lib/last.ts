import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Returns the last value of an iterator.
 *
 * @param iterable An iterator to return the last value of.
 * @returns The value at the last position in the source iterator, or `undefined` if the iterator is empty.
 */
export function last<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType | undefined {
	let last: ElementType | undefined;
	for (const value of toIterableIterator(iterable)) {
		last = value;
	}

	return last;
}
