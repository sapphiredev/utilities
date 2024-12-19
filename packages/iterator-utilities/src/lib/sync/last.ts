import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable until it's exhausted, returning the last element.
 *
 * @param iterable An iterator to return the last value of.
 * @returns The value at the last position in the source iterator, or `undefined` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { last } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(last(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator to find the last value.
 */
export function last<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType | undefined {
	let last: ElementType | undefined;
	for (const value of toIterableIterator(iterable)) {
		last = value;
	}

	return last;
}
