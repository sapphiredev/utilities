import type { AsyncIterableResolvable } from './from';
import { unionAsync } from './union';

/**
 * Creates an iterable with the unique elements of the input iterable. Under the hood, it calls {@linkcode unionAsync} with the iterable itself.
 *
 * @param iterable An iterator to remove duplicates from.
 * @returns An iterator that yields the values of the provided iterator with duplicates removed.
 *
 * @example
 * ```typescript
 * import { uniqueAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
 * const iterator = uniqueAsync(iterable);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export function uniqueAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): AsyncIterableIterator<ElementType> {
	// The union of a single iterator is the iterator itself, with duplicates removed.
	return unionAsync(iterable);
}
