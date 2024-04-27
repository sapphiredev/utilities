import type { IterableResolvable } from './from';
import { assertPositive } from './shared/assertPositive';
import { toIntegerOrThrow } from './shared/toIntegerOrThrow';
import { toIterableIterator } from './toIterableIterator';

/**
 * Splits the elements of an iterator into chunks of size at most `size`.
 *
 * @param iterable The iterator whose elements to chunk.
 * @param size The maximum size of each chunk.
 */
export function* chunk<const ElementType>(iterable: IterableResolvable<ElementType>, size: number): IterableIterator<ElementType[]> {
	size = assertPositive(toIntegerOrThrow(size), size);

	let buffer: ElementType[] = [];
	for (const element of toIterableIterator(iterable)) {
		buffer.push(element);

		if (buffer.length === size) {
			yield buffer;
			buffer = [];
		}
	}

	if (buffer.length) {
		yield buffer;
	}
}
