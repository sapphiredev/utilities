import { filterAsync } from './filter';
import type { AsyncIterableResolvable } from './from';

/**
 * Creates a new iterable that yields all the non-nullish values (`null` and `undefined`) from the iterable.
 *
 * @param iterable An iterator that contains elements to be compacted.
 *
 * @example
 * ```typescript
 * import { compactAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = compactAsync([1, null, 2, undefined, 3]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 2, 3]
 * ```
 */
export function compactAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType | null | undefined>
): AsyncIterableIterator<ElementType> {
	return filterAsync(iterable, (value): value is ElementType => value !== null && value !== undefined);
}
