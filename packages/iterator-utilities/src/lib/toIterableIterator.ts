import { from, type IterableResolvable } from './from';
import { makeIterableIterator } from './shared/makeIterableIterator';

/**
 * Creates an iterable iterator from an iterable or iterator-like object.
 *
 * @param iterable The iterable or iterable-like object to convert.
 * @returns An iterable iterator.
 *
 * @example
 * ```typescript
 * import { toIterableIterator } from '@sapphire/iterator-utilities';
 *
 * const array = [1, 2, 3, 4, 5];
 * console.log([...toIterableIterator(array)]);
 * // Output: [1, 2, 3, 4, 5]
 *
 * const set = new Set([1, 2, 3, 4, 5]);
 * console.log([...toIterableIterator(set)]);
 * // Output: [1, 2, 3, 4, 5]
 *
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
 * console.log([...toIterableIterator(map)]);
 * // Output: [['a', 1], ['b', 2], ['c', 3]]
 *
 * const string = 'hello';
 * console.log([...toIterableIterator(string)]);
 * // Output: ['h', 'e', 'l', 'l', 'o']
 * ```
 */
export function toIterableIterator<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const resolvedIterable = from(iterable);
	if (Symbol.iterator in resolvedIterable) {
		return resolvedIterable;
	}

	return makeIterableIterator(() => resolvedIterable.next());
}
