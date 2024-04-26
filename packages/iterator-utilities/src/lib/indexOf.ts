/**
 * Returns the index of the first occurrence of a value in an iterator.
 *
 * @param iterator An iterator to search for a value in.
 * @param value The value to search for.
 * @returns The index of the first occurrence of the value in the iterator, or `-1` if the value is not found.
 */
export function indexOf<const ElementType>(iterator: IterableIterator<ElementType>, value: ElementType): number {
	let index = 0;
	for (const element of iterator) {
		if (element === value) {
			return index;
		}

		index++;
	}

	return -1;
}

export { indexOf as position };
