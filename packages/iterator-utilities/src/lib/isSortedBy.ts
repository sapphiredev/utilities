import type { IterableResolvable } from './from';
import type { isSorted } from './isSorted';
import type { isSortedByKey } from './isSortedByKey';
import { assertFunction } from './shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from './shared/_compare';
import { toIterableIterator } from './toIterableIterator';

/**
 * Checks if the elements of this iterator are sorted using the given comparator function.
 *
 * @seealso {@link isSorted} for a version that uses the default comparator.
 * @seealso {@link isSortedByKey} for a version that allows custom key extractors.
 *
 * @param iterable The iterator to compare.
 *
 * @example
 * ```typescript
 * import { ascNumber, isSortedBy } from '@sapphire/iterator-utilities';
 *
 * assert(isSortedBy([1, 2, 2, 9], ascNumber));
 * assert(!isSortedBy([1, 2, 2, 9], ascNumber));
 *
 * assert(isSortedBy([0], () => true));
 * assert(isSortedBy([0], () => false));
 *
 * assert(isSortedBy([], () => true));
 * assert(isSortedBy([], () => false));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSortedBy<const ElementType>(iterable: IterableResolvable<ElementType>, comparator: CompareByComparator<ElementType>): boolean {
	comparator = assertFunction(comparator);

	const iterator = toIterableIterator(iterable);
	const result = iterator.next();
	if (result.done) return true;

	let previous = result.value;
	for (const current of iterator) {
		const comparison = compareIteratorElements<ElementType>(previous, current, comparator);
		if (orderingIsGreater(comparison)) return false;

		previous = current;
	}

	return true;
}
