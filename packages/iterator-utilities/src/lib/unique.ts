import { union } from './union';

/**
 * Returns an iterator that yields the values of the provided iterator with duplicates removed.
 *
 * @param iterator An iterator to remove duplicates from.
 * @returns An iterator that yields the values of the provided iterator with duplicates removed.
 */
export function unique<const ElementType>(iterator: IterableIterator<ElementType>): IterableIterator<ElementType> {
	// The union of a single iterator is the iterator itself, with duplicates removed.
	return union(iterator);
}
