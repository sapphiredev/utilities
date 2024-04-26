/**
 * Returns the last value of an iterator.
 *
 * @param iterator An iterator to return the last value of.
 * @returns The value at the last position in the source iterator, or `undefined` if the iterator is empty.
 */
export function last<const ElementType>(iterator: IterableIterator<ElementType>): ElementType | undefined {
	let last: ElementType | undefined;
	for (const value of iterator) {
		last = value;
	}

	return last;
}
