/**
 * Returns the number of elements in an iterator.
 *
 * @param iterator An iterator that contains elements to be counted.
 * @returns The number of elements in the input iterator.
 */
export function count<const ElementType>(iterator: IterableIterator<ElementType>): number {
	let count = 0;
	for (const _ of iterator) {
		count++;
	}

	return count;
}
