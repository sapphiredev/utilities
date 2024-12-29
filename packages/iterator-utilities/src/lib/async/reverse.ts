import { collectAsync } from './collect';
import type { AsyncIterableResolvable } from './from';

/**
 * Consumes the iterable and returns a new iterable with the elements in reverse order.
 *
 * @param iterable The iterator to reverse.
 * @returns An iterator whose element correspond to the elements of the provided iterator in reverse order.
 *
 * @example
 * ```typescript
 * import { reverseAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterator = reverseAsync([1, 2, 3, 4, 5]);
 * console.log(await collectAsync(iterator));
 * // Output: [5, 4, 3, 2, 1]
 *
 * const iterator = reverseAsync('hello');
 * console.log(await collectAsync(iterator));
 * // Output: ['o', 'l', 'l', 'e', 'h']
 * ```
 *
 * @remarks
 *
 * This function collects all elements of the provided iterator into an array before yielding them in reverse order.
 */
export async function* reverseAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): AsyncIterableIterator<ElementType> {
	const items = await collectAsync(iterable);
	for (let i = items.length - 1; i >= 0; i--) {
		yield items[i];
	}
}
