/**
 * Returns an iterator that yields the entries of each iterator.
 *
 * @param iterator An iterator to map.
 * @returns An iterator that yields the entries of each iterator.
 */
export function* flat<const ElementType>(iterator: IterableIterator<IterableIterator<ElementType>>): IterableIterator<ElementType> {
	for (const value of iterator) {
		yield* value;
	}
}
