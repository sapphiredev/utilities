import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterable iterator from an iterable or iterator-like object.
 *
 * @param iterable The iterable or iterable-like object to convert.
 * @returns An iterable iterator.
 *
 * @example
 * ```typescript
 * import { toAsyncIterableIterator, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const array = [1, 2, 3, 4, 5];
 * const iterator = toAsyncIterableIterator(array);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const set = new Set([1, 2, 3, 4, 5]);
 * const iterator = toAsyncIterableIterator(set);
 * console.log(await collectAsync(iterator));
 * // Output: [1, 2, 3, 4, 5]
 *
 * const map = new Map([['a', 1], ['b', 2], ['c', 3]]);
 * const iterator = toAsyncIterableIterator(map);
 * console.log(await collectAsync(iterator));
 * // Output: [['a', 1], ['b', 2], ['c', 3]]
 *
 * const string = 'hello';
 * const iterator = toAsyncIterableIterator(string);
 * console.log(await collectAsync(iterator));
 * // Output: ['h', 'e', 'l', 'l', 'o']
 * ```
 */
export function toAsyncIterableIterator<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>
): AsyncIterableIterator<ElementType> | IterableIterator<ElementType> {
	const resolvedIterable = fromAsync(iterable);
	if (Symbol.asyncIterator in resolvedIterable) {
		return resolvedIterable;
	}

	if (Symbol.iterator in resolvedIterable) {
		return resolvedIterable;
	}

	return makeAsyncIterableIterator(async () => resolvedIterable.next());
}
