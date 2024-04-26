import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Finds the index of the first element in an iterator that satisfies a predicate.
 *
 * @param iterable An iterator to search for an element in.
 * @param callbackFn A function that determines if an element is the one being searched for.
 * @returns The index of the first element that satisfies the predicate, or `-1` if no elements satisfy the predicate.
 */
export function findIndex<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): number {
	let index = 0;
	for (const element of toIterableIterator(iterable)) {
		if (callbackFn(element, index)) {
			return index;
		}

		index++;
	}

	return -1;
}
