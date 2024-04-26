/**
 * Returns an iterator that contains only the elements from the input iterator that correspond to `true` values in the
 * selectors iterator.
 *
 * @param iterator An iterator that contains elements to be compressed.
 * @param selectors The selectors that determine which elements to include in the result.
 * @returns An iterator that contains only the elements from the input iterator that correspond to `true` values in the
 * selectors iterator.
 */
export function* compress<const ElementType>(
	iterator: IterableIterator<ElementType>,
	selectors: IterableIterator<boolean>
): IterableIterator<ElementType> {
	for (const value of iterator) {
		const selectorResult = selectors.next();
		if (selectorResult.done) {
			return;
		}

		if (selectorResult.value) {
			yield value;
		}
	}
}
