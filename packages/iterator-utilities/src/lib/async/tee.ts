import { assertNotNegative } from '../shared/_assertNotNegative';
import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { toIntegerOrThrow } from '../shared/_toIntegerOrThrow';
import { repeat } from '../sync/repeat';
import { collectAsync } from './collect';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates `count` independent iterators from the input iterable.
 *
 * @param iterable An iterator to tee.
 * @param count The number of iterators to create.
 * @returns An array of `count` iterators that each yield the same values as the input iterator.
 *
 * @example
 * ```typescript
 * import { teeAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const [iter1, iter2] = await teeAsync(iterable, 2);
 * console.log(collectAsync(iter1));
 * // Output: [1, 2, 3, 4, 5]
 *
 * console.log(collectAsync(iter2));
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export async function teeAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	count: number
): Promise<AsyncIterableIterator<ElementType>[]> {
	count = assertNotNegative(toIntegerOrThrow(count), count);
	if (count === 0) return [];

	const entries = [] as ElementType[];
	const indexes = await collectAsync(repeat(0, count));
	const resolvedIterable = fromAsync(iterable);

	const iterables = [] as AsyncIterableIterator<ElementType>[];
	for (let i = 0; i < count; i++) {
		const iterable = makeAsyncIterableIterator<ElementType>(async () => {
			if (indexes[i] >= entries.length) {
				const result = await resolvedIterable.next();
				if (result.done) {
					return { done: true, value: undefined };
				}

				entries.push(result.value);
			}

			return { done: false, value: entries[indexes[i]++] };
		});

		iterables.push(iterable);
	}

	return iterables;
}
