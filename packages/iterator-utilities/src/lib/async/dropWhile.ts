import { assertFunction } from '../shared/_assertFunction';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterator without the elements that satisfy the specified test.
 *
 * @param iterable An iterator to drop values from.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a falsy value to make the element yielded by the iterator helper, and a truthy value otherwise.
 * @returns An iterator that produces elements from the given iterator that don't satisfy the specified test.
 *
 * @example
 * ```typescript
 * import { dropWhileAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = dropWhileAsync([1, 2, 3, 4, 5], (value) => value < 3);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 4, 5]
 * ```
 *
 * @seealso {@link filter} or {@link takeWhile} for the opposite behavior.
 */
export function dropWhileAsync<const ElementType, const FilteredType extends ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => element is FilteredType
): AsyncIterableIterator<Exclude<ElementType, FilteredType>>;
export function dropWhileAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): AsyncIterableIterator<ElementType>;
export async function* dropWhileAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): AsyncIterableIterator<ElementType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		if (!callbackFn(value, index++)) {
			yield value;
		}
	}
}
