import { fromAsync, type AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Creates a new iterable of the first iterable based on the truthiness of the corresponding element in the second iterable.
 *
 * @param iterable An iterator that contains elements to be compressed.
 * @param selectors The selectors that determine which elements to include in the result.
 * @returns An iterator that contains only the elements from the input iterator that correspond to `true` values in the
 * selectors iterator.
 *
 * @example
 * ```typescript
 * import { compressAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = compressAsync([1, 2, 3, 4, 5], [true, false, true, false, true]);
 * console.log(await collectAsync(iterable));
 * // Output: [1, 3, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes both input iterators until either is exhausted.
 */
export async function* compressAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	selectors: AsyncIterableResolvable<boolean>
): AsyncIterableIterator<ElementType> {
	const resolvedSelectors = fromAsync(selectors);
	for await (const resolvedIterableResult of toAsyncIterableIterator(iterable)) {
		const selectorResult = await resolvedSelectors.next();
		if (selectorResult.done) {
			return;
		}

		if (selectorResult.value) {
			yield resolvedIterableResult;
		}
	}
}
