import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable and returns an array with all the elements.
 *
 * @param iterable The iterator to convert to an array.
 * @returns An array containing the values of the provided iterator.
 *
 * @example
 * ```typescript
 * import { toArray } from '@sapphire/iterator-utilities';
 *
 * const array = [1, 2, 3, 4, 5];
 * console.log(toArray(array));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const set = new Set([1, 2, 3, 4, 5]);
 * console.log(toArray(set));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
 * console.log(toArray(map));
 * // Output: [['a', 1], ['b', 2], ['c', 3]]
 *
 * const string = 'hello';
 * console.log(toArray(string));
 * // Output: ['h', 'e', 'l', 'l', 'o']
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function toArray<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType[] {
	return [...toIterableIterator(iterable)];
}
