import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Enumerates the elements of an iterator.
 *
 * @param iterable An iterator to enumerate.
 * @returns An iterator that yields the index and value of each element in the source iterator.
 */
export function* enumerate<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<[number, ElementType]> {
	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		yield [index++, value];
	}
}
