import { assertFunction } from '../shared/_assertFunction';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements that pass the test implemented by the provided function.
 *
 * @param iterable The iterator to filter.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to make the element yielded by the iterator helper, and a falsy value otherwise.
 * @returns An iterator that produces elements from the given iterator that satisfy the specified test.
 *
 * @example
 * ```typescript
 * import { filterAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = filterAsync([1, 2, 3, 4, 5], (value) => value % 2 === 0);
 * console.log(await collectAsync(iterable));
 * // Output: [2, 4]
 * ```
 */
export function filterAsync<const ElementType, const FilteredType extends ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): AsyncIterableIterator<FilteredType>;
export function filterAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): AsyncIterableIterator<ElementType>;
export async function* filterAsync<ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): AsyncIterableIterator<ElementType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		if (callbackFn(value, index++)) yield value;
	}
}
