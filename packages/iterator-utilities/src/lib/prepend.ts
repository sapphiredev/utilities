/**
 * Prepends the values of the provided iterables to the start of the provided iterator.
 *
 * @param iterator The iterator to prepend values to.
 * @param iterators The iterables to prepend to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 */
export function* prepend<const ElementType>(
	iterator: IterableIterator<ElementType>,
	...iterators: IterableIterator<ElementType>[]
): IterableIterator<ElementType> {
	for (const iterator of iterators) {
		yield* iterator;
	}
	yield* iterator;
}
