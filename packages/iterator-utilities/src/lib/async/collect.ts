import { collectIntoAsync } from './collectInto';
import type { AsyncIterableResolvable } from './from';

/**
 * Consumes the iterable and returns an array with all the elements.
 *
 * @param iterable The iterator to convert to an array.
 * @returns An array containing the values of the provided iterator.
 *
 * @example
 * ```typescript
 * import { collectAsync } from '@sapphire/iterator-utilities';
 *
 * const array = [1, 2, 3, 4, 5];
 * console.log(await collectAsync(array));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const set = new Set([1, 2, 3, 4, 5]);
 * console.log(await collectAsync(set));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
 * console.log(await collectAsync(map));
 * // Output: [['a', 1], ['b', 2], ['c', 3]]
 *
 * const string = 'hello';
 * console.log(await collectAsync(string));
 * // Output: ['h', 'e', 'l', 'l', 'o']
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function collectAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<ElementType[]> {
	return collectIntoAsync(iterable, []);
}
