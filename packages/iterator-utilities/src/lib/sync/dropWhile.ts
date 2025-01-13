import { assertFunction } from '../shared/_assertFunction';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterator without the elements that satisfy the specified test.
 *
 * @param iterable An iterator to drop values from.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a falsy value to make the element yielded by the iterator helper, and a truthy value otherwise.
 * @returns An iterator that produces elements from the given iterator that don't satisfy the specified test.
 *
 * @example
 * ```typescript
 * import { dropWhile } from '@sapphire/iterator-utilities';
 *
 * const iterable = dropWhile([1, 2, 3, 4, 5], (value) => value < 3);
 * console.log([...iterable]);
 * // Output: [3, 4, 5]
 * ```
 *
 * @seealso {@link filter} or {@link takeWhile} for the opposite behavior.
 */
export function dropWhile<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): IterableIterator<Exclude<ElementType, FilteredType>>;
export function dropWhile<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType>;
export function* dropWhile<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		if (!callbackFn(value, index++)) {
			yield value;
		}
	}
}
