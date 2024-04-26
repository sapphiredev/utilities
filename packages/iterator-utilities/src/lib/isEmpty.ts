/**
 * Determines whether an iterator is empty.
 *
 * @param iterator The iterator to check for emptiness.
 * @returns `true` if the iterator is empty; otherwise, `false`.
 */
export function isEmpty<const ElementType>(iterator: IterableIterator<ElementType>): boolean {
	return iterator.next().done ?? false;
}
