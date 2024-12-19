import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Collects all the items from an iterator into an array.
 *
 * This method consumes the iterator and adds all its items to the passed array. The array is then returned, so the call
 * chain can be continued.
 *
 * This is useful when you already have a collection and want to add the iterator items to it.
 *
 * @param iterable An iterator to fuse.
 *
 * @example
 * ```typescript
 * import { collectIntoAsync, mapAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3];
 * const output = [0, 1];
 *
 * await collectIntoAsync(mapAsync(iterable, (value) => value * 2), output);
 * await collectIntoAsync(mapAsync(iterable, (value) => value * 10), output);
 *
 * console.log(output);
 * // Output: [0, 1, 2, 4, 6, 10, 20, 30]
 * ```
 */
export async function collectIntoAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	output: ElementType[]
): Promise<ElementType[]> {
	for await (const value of toAsyncIterableIterator(iterable)) {
		output.push(value);
	}

	return output;
}
