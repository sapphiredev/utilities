/**
 * Enumerates the elements of an iterator.
 *
 * @param iterator An iterator to enumerate.
 * @returns An iterator that yields the index and value of each element in the source iterator.
 */
export function* enumerate<const ElementType>(iterator: IterableIterator<ElementType>): IterableIterator<[number, ElementType]> {
	let index = 0;
	for (const value of iterator) {
		yield [index++, value];
	}
}
