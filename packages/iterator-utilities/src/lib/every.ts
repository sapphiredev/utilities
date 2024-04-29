import type { IterableResolvable } from './from';
import { assertFunction } from './shared/_assertFunction';
import { toIterableIterator } from './toIterableIterator';

/**
 * Tests whether all elements in the iterable pass the test implemented by the provided function.
 *
 * @param iterable The iterator to check.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if callbackFn returns a truthy value for every element. Otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { every } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(every(iterable, (value) => value < 10));
 * // Output: true
 *
 * console.log(every(iterable, (value) => value < 3));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function every<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): iterable is IterableIterator<FilteredType>;
export function every<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): boolean;
export function every<const ElementType>(iterable: IterableResolvable<ElementType>, callbackFn: (element: ElementType, index: number) => boolean) {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		if (!callbackFn(value, index++)) return false;
	}

	return true;
}
