import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

export function dropWhile<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): IterableIterator<Exclude<ElementType, FilteredType>>;
export function dropWhile<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): IterableIterator<ElementType>;
/**
 * Returns an iterator that produces elements from the given iterator that don't satisfy the specified test.
 *
 * @param iterable An iterator to drop values from.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a falsy value to make the element yielded by the iterator helper, and a truthy value otherwise.
 * @returns An iterator that produces elements from the given iterator that don't satisfy the specified test.
 */
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

export { dropWhile as skipWhile };
