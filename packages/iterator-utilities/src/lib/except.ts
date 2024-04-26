/**
 * Produces the set difference of two sequences.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to exclude from the result.
 */
export function* except<const ElementType>(
	first: IterableIterator<ElementType>,
	second: IterableIterator<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(second);
	for (const value of first) {
		if (!set.has(value)) {
			yield value;
		}
	}
}
