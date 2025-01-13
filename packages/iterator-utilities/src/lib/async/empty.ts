import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';

/**
 * Creates an empty iterator.
 *
 * @returns An empty iterator.
 *
 * @example
 * ```typescript
 * import { emptyAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = emptyAsync();
 * console.log(await collectAsync(iterable));
 * // Output: []
 * ```
 */
export function emptyAsync<const ElementType = never>(): AsyncIterableIterator<ElementType> {
	return makeAsyncIterableIterator<ElementType>(() => Promise.resolve({ done: true, value: undefined }));
}
