/**
 * Inverts the order of the elements in an iterator.
 *
 * @param iterator The iterator to reverse.
 * @returns An iterator whose element correspond to the elements of the provided iterator in reverse order.
 */
export function* reverse<const ElementType>(iterator: IterableIterator<ElementType>): IterableIterator<ElementType> {
	const items: ElementType[] = [];
	for (const item of iterator) {
		items.push(item);
	}

	for (let i = items.length - 1; i >= 0; i--) {
		yield items[i];
	}
}
