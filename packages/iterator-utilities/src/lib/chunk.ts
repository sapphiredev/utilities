/**
 * Splits the elements of an iterator into chunks of size at most `size`.
 *
 * @param iterator The iterator whose elements to chunk.
 * @param size The maximum size of each chunk.
 */
export function* chunk<const ElementType>(iterator: IterableIterator<ElementType>, size: number): IterableIterator<ElementType[]> {
	const buffer: ElementType[] = [];
	let i = 0;

	for (const value of iterator) {
		buffer.push(value);
		i++;

		if (i === size) {
			yield buffer;
			buffer.length = 0;
			i = 0;
		}
	}

	if (buffer.length) {
		yield buffer;
	}
}
