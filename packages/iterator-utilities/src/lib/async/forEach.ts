import { assertFunction } from '../shared/_assertFunction';
import type { Awaitable } from '../shared/_types';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Executes a provided function once for each iterable element.
 *
 * @param iterable An iterator to iterate over.
 * @param callbackFn A function to execute for each element produced by the iterator. Its return value is discarded.
 *
 * @example
 * ```typescript
 * import { forEachAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * forEachAsync(iterable, (value) => console.log(value));
 * // Output: 1, 2, 3, 4, 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function forEachAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => Awaitable<void>
): Promise<void> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const element of toAsyncIterableIterator(iterable)) {
		await callbackFn(element, index++);
	}
}
