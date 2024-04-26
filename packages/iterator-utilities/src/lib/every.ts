import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

export function every<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): iterable is IterableIterator<FilteredType>;
export function every<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): boolean;

/**
 * Determines whether all the members of an iterator satisfy the specified test.
 *
 * @param iterable The iterator to check.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if callbackFn returns a truthy value for every element. Otherwise, `false`.
 */
export function every<const ElementType>(iterable: IterableResolvable<ElementType>, callbackFn: (element: ElementType, index: number) => boolean) {
	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		if (!callbackFn(value, index++)) return false;
	}

	return true;
}
