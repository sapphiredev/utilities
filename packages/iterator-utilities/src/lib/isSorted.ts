import type { IterableResolvable } from './from';
import { isSortedBy } from './isSortedBy';
import type { isSortedByKey } from './isSortedByKey';
import { defaultCompare } from './shared/comparators';

/**
 * Checks if the elements of this iterator are sorted in ascending order.
 *
 * That is, for each element `a` and its following element `b`, `a <= b` must hold. If the iterator yields exactly zero
 * or one element, `true` is returned.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link isSortedBy} instead.
 *
 * @seealso {@link isSortedBy} for a version that allows custom comparators.
 * @seealso {@link isSortedByKey} for a version that allows custom key extractors.
 *
 * @param iterable The iterator to compare.
 *
 * @example
 * ```typescript
 * import { isSorted } from '@sapphire/iterator-utilities';
 *
 * assert(isSorted([1, 2, 2, 9]);
 * assert(!isSorted([1, 3, 2, 4]);
 *
 * assert(isSorted([0]);
 * assert(isSorted([]);
 * assert(isSorted([0, 1, NaN]);
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSorted<const ElementType>(iterable: IterableResolvable<ElementType>): boolean {
	return isSortedBy(iterable, defaultCompare);
}
