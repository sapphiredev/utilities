import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable until it finds the element, returning its index if it's found and `-1` otherwise.
 *
 * @param iterable An iterator to search for a value in.
 * @param value The value to search for.
 * @returns The index of the first occurrence of the value in the iterator, or `-1` if the value is not found.
 *
 * @example
 * ```typescript
 * import { indexOfAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await indexOf(iterable, 3));
 * // Output: 2
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export async function indexOfAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, value: ElementType): Promise<number> {
	let index = 0;
	for await (const element of toAsyncIterableIterator(iterable)) {
		if (element === value) {
			return index;
		}

		index++;
	}

	return -1;
}
