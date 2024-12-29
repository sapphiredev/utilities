import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable that yields the elements of each iterable in the input iterable.
 *
 * @param iterables An iterator to map.
 * @returns An iterator that yields the entries of each iterator.
 *
 * @example
 * ```typescript
 * import { flatAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = flatAsync([[1, 2], [3, 4], [5, 6]]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3, 4, 5, 6]
 * ```
 */
export async function* flatAsync<const ElementType>(
	iterables: AsyncIterableResolvable<AsyncIterableResolvable<ElementType>>
): AsyncIterableIterator<ElementType> {
	for await (const iterator of toAsyncIterableIterator(iterables)) {
		for await (const value of toAsyncIterableIterator(iterator)) {
			yield value;
		}
	}
}
