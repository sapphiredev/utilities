/**
 * Determines whether an iterator contains a specific value.
 *
 * @param iterator The iterator in which to locate a value.
 * @param value The value to locate in the iterator.
 * @returns `true` if the value is found in the iterator; otherwise, `false`.
 */
export function contains<const ElementType>(iterator: IterableIterator<ElementType>, value: ElementType): boolean {
	for (const item of iterator) {
		if (item === value) return true;
	}

	return false;
}
