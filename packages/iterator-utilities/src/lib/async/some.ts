import { assertFunction } from '../shared/_assertFunction';
import type { Awaitable } from '../shared/_types';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Advances the iterable until it finds a matching element, returning `true` if it's found and `false` otherwise.
 *
 * @param iterable An iterator to search for a value in.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to
 * indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if the callback function returns a truthy value for at least one element. Otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { someAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await someAsync(iterable, (value) => value % 2 === 0));
 * // Output: true
 * ```
 *
 * @example
 * ```typescript
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await someAsync(iterable, (value) => value % 6 === 0));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the iterator until the value is found or the iterator is exhausted.
 */
export async function someAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => Awaitable<boolean>
): Promise<boolean> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		if (await callbackFn(value, index++)) {
			return true;
		}
	}

	return false;
}
