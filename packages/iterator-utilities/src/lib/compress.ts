import { from, type IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

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
 * import { compress } from '@sapphire/iterator-utilities';
 *
 * const iterable = compress([1, 2, 3, 4, 5], [true, false, true, false, true]);
 * console.log([...iterable]);
 * // Output: [1, 3, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes both input iterators until either is exhausted.
 */
export function* compress<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	selectors: IterableResolvable<boolean>
): IterableIterator<ElementType> {
	const resolvedSelectors = from(selectors);
	for (const resolvedIterableResult of toIterableIterator(iterable)) {
		const selectorResult = resolvedSelectors.next();
		if (selectorResult.done) {
			return;
		}

		if (selectorResult.value) {
			yield resolvedIterableResult;
		}
	}
}
