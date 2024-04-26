/**
 * Produces the set union of multiple iterators, deduplicating identical values.
 *
 * @param iterators The iterators to combine.
 * @returns An iterator that yields the union of the provided iterators.
 */
export function* union<const ElementType>(...iterators: IterableIterator<ElementType>[]): IterableIterator<ElementType> {
	const seen = new Set<ElementType>();
	for (const iterator of iterators) {
		for (const value of iterator) {
			if (!seen.has(value)) {
				seen.add(value);
				yield value;
			}
		}
	}
}
