import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Splits the elements of an iterator into chunks of size at most `size`.
 *
 * @param iterable The iterator whose elements to chunk.
 * @param size The maximum size of each chunk.
 */
export function* chunk<const ElementType>(iterable: IterableResolvable<ElementType>, size: number): IterableIterator<ElementType[]> {
	const buffer: ElementType[] = [];
	let i = 0;

	for (const element of toIterableIterator(iterable)) {
		buffer.push(element);
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
