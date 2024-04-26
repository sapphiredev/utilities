/**
 * Returns the first value of an iterator.
 *
 * @param iterator The iterator to return the first value of.
 * @returns The first value of the iterator, or `undefined` if the iterator is empty.
 */
export function first<const ElementType>(iterator: IterableIterator<ElementType>): ElementType | undefined {
	return iterator.next().value;
}
