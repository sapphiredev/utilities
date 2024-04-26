/**
 * Chains together multiple iterators.
 *
 * @param iterators The iterators to chain together.
 * @returns An iterator that yields the values of the provided iterators in order.
 */
export function* chain<const ElementType>(...iterators: IterableIterator<ElementType>[]): IterableIterator<ElementType> {
	for (const iterator of iterators) {
		yield* iterator;
	}
}
