/**
 * Converts an iterator to an array.
 *
 * @param iterator The iterator to convert to an array.
 * @returns An array containing the values of the provided iterator.
 */
export function toArray<const ElementType>(iterator: IterableIterator<ElementType>): ElementType[] {
	return [...iterator];
}
