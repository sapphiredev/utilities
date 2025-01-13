import { assertFunction } from '../shared/_assertFunction';
import type { Awaitable } from '../shared/_types';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the results of calling a provided function on each element.
 *
 * @param iterable An iterator to map over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is yielded by the iterator helper.
 *
 * @example
 * ```typescript
 * import { mapAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = mapAsync([1, 2, 3, 4, 5], (value) => value * 2);
 * console.log(collectAsync(iterable));
 * // Output: [2, 4, 6, 8, 10]
 * ```
 */
export async function* mapAsync<const ElementType, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => Awaitable<MappedType>
): AsyncIterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const element of toAsyncIterableIterator(iterable)) {
		yield await callbackFn(element, index++);
	}
}
