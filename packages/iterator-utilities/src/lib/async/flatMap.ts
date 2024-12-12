import { assertFunction } from '../shared/_assertFunction';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable that yields the elements of each iterable returned by the provided function on each element of the input iterable.
 *
 * @param iterable An iterator to map.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return an iterator or iterable that yields elements to be yielded by `flatMap()`, or a single non-iterator/iterable value to be yielded.
 * @returns An iterator that applies a function to each element of the input iterator and yields the results.
 *
 * @example
 * ```typescript
 * import { flatMapAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = flatMapAsync([1, 2, 3], (value) => [value, value * 2]);
 * console.log(collectAsync(iterable));
 * // Output: [1, 2, 2, 4, 3, 6]
 * ```
 */
export async function* flatMapAsync<const ElementType, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => AsyncIterableResolvable<MappedType>
): AsyncIterableIterator<MappedType> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const iterator of toAsyncIterableIterator(iterable)) {
		for await (const value of toAsyncIterableIterator(callbackFn(iterator, index++))) {
			yield value;
		}
	}
}
