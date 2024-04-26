import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Determines whether at least one of the members of an iterator satisfy the specified test.
 *
 * @param iterable An iterator to search for a value in.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to
 * indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if the callback function returns a truthy value for at least one element. Otherwise, `false`.
 */
export function some<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): boolean {
	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		if (callbackFn(value, index++)) {
			return true;
		}
	}

	return false;
}
