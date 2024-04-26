/**
 * Repeats an iterator endlessly.
 *
 * @param iterator An iterator to cycle over.
 */
export function* cycle<const ElementType>(iterator: IterableIterator<ElementType>): IterableIterator<ElementType> {
	const results = [] as ElementType[];
	for (const element of iterator) {
		yield element;
		results.push(element);
	}

	while (results.length > 0) {
		for (const element of results) {
			yield element;
		}
	}
}
