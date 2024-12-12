import { assertPositive } from '../shared/_assertPositive';
import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterable with arrays of `count` elements representing a sliding window.
 *
 * @param iterable The iterator to take values from.
 * @param count The maximum number of values in the window.
 * @returns An iterator that yields windows with `count` values from the provided iterator.
 *
 * @example
 * ```typescript
 * import { windowsAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = windowsAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterable));
 * // Output: [[1, 2], [2, 3], [3, 4], [4, 5]]
 * ```
 */
export function windowsAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, count: number): AsyncIterableIterator<ElementType[]> {
	count = assertPositive(toIntegerOrInfinityOrThrow(count), count);

	const buffer = [] as ElementType[];
	const resolvedIterable = fromAsync(iterable);
	return makeAsyncIterableIterator<ElementType[]>(async () => {
		while (buffer.length !== count) {
			const result = await resolvedIterable.next();
			if (result.done) return { done: true, value: undefined };

			buffer.push(result.value);
		}

		const value = buffer.slice();
		buffer.shift();
		return { done: false, value };
	});
}
