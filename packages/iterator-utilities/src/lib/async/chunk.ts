import { assertPositive } from '../shared/_assertPositive';
import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { toIntegerOrThrow } from '../shared/_toIntegerOrThrow';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Chunks the iterable into arrays of at most `size` elements.
 *
 * @param iterable The iterator whose elements to chunk.
 * @param size The maximum size of each chunk.
 *
 * @example
 * ```typescript
 * import { chunkAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = chunkAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterable));
 * // Output: [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunkAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, size: number): AsyncIterableIterator<ElementType[]> {
	size = assertPositive(toIntegerOrThrow(size), size);

	const iterator = fromAsync(iterable);
	return makeAsyncIterableIterator<ElementType[]>(async () => {
		let result = await iterator.next();
		if (result.done) {
			return { done: true, value: undefined };
		}

		const buffer = [result.value];
		while (buffer.length !== size) {
			result = await iterator.next();
			if (result.done) break;

			buffer.push(result.value);
		}

		return { done: false, value: buffer };
	});
}
