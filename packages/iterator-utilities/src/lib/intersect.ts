/**
 * Produces the set intersection of two iterators.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to include in the result.
 */
export function* intersect<const ElementType>(
	first: IterableIterator<ElementType>,
	second: IterableIterator<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(second);
	for (const value of first) {
		if (set.has(value)) {
			yield value;
		}
	}
}
