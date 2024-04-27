import type { IterableResolvable } from './from';
import { assertPositive } from './shared/assertPositive';
import { toIntegerOrThrow } from './shared/toIntegerOrThrow';
import { toIterableIterator } from './toIterableIterator';

/**
 * Chunks the iterable into arrays of at most `size` elements.
 *
 * @param iterable The iterator whose elements to chunk.
 * @param size The maximum size of each chunk.
 *
 * @example
 * ```typescript
 * import { chunk } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...chunk(iterable, 2)]);
 * // Output: [[1, 2], [3, 4], [5]]
 * ```
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
