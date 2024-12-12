import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable until it finds the element, returning `true` if it's found and `false` otherwise.
 *
 * @param iterable The iterator in which to locate a value.
 * @param value The value to locate in the iterator.
 * @returns `true` if the value is found in the iterator; otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { containsAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(containsAsync(iterable, 3));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export async function containsAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, value: ElementType): Promise<boolean> {
	for await (const element of toAsyncIterableIterator(iterable)) {
		if (element === value) return true;
	}

	return false;
}
