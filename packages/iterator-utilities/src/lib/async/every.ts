import { assertFunction } from '../shared/_assertFunction';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Tests whether all elements in the iterable pass the test implemented by the provided function.
 *
 * @param iterable The iterator to check.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a truthy value to indicate the element passes the test, and a falsy value otherwise.
 * @returns `true` if callbackFn returns a truthy value for every element. Otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { everyAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await everyAsync(iterable, (value) => value < 10));
 * // Output: true
 *
 * console.log(await everyAsync(iterable, (value) => value < 3));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function everyAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => boolean
): Promise<boolean> {
	callbackFn = assertFunction(callbackFn);

	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		if (!callbackFn(value, index++)) return false;
	}

	return true;
}
