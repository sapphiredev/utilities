import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable until it's exhausted, returning the last element.
 *
 * @param iterable An iterator to return the last value of.
 * @returns The value at the last position in the source iterator, or `undefined` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { lastAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await lastAsync(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator to find the last value.
 */
export async function lastAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<ElementType | undefined> {
	let last: ElementType | undefined;
	for await (const value of toAsyncIterableIterator(iterable)) {
		last = value;
	}

	return last;
}
