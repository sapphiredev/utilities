import { assertFunction } from '../shared/_assertFunction';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable until it finds the element, returning its index if it's found and `-1` otherwise.
 *
 * @param iterable An iterator to search for an element in.
 * @param callbackFn A function that determines if an element is the one being searched for.
 * @returns The index of the first element that satisfies the predicate, or `-1` if no elements satisfy the predicate.
 *
 * @example
 * ```typescript
 * import { findIndex } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(findIndex(iterable, (value) => value % 2 === 0));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export function findIndex<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): number {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for (const element of toIterableIterator(iterable)) {
		if (callbackFn(element, index)) {
			return index;
		}

		index++;
	}

	return -1;
}
