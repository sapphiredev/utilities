import { from, type IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Returns an iterator that contains only the elements from the input iterator that correspond to `true` values in the
 * selectors iterator.
 *
 * @param iterable An iterator that contains elements to be compressed.
 * @param selectors The selectors that determine which elements to include in the result.
 * @returns An iterator that contains only the elements from the input iterator that correspond to `true` values in the
 * selectors iterator.
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
