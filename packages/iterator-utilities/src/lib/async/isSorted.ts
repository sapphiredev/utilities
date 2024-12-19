import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import { isSortedByAsync } from './isSortedBy';
import type { isSortedByKeyAsync } from './isSortedByKey';

/**
 * Checks if the elements of this iterator are sorted in ascending order.
 *
 * That is, for each element `a` and its following element `b`, `a <= b` must hold. If the iterator yields exactly zero
 * or one element, `true` is returned.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link isSortedByAsync} instead.
 *
 * @seealso {@link isSortedByAsync} for a version that allows custom comparators.
 * @seealso {@link isSortedByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable The iterator to compare.
 *
 * @example
 * ```typescript
 * import { isSortedAsync } from '@sapphire/iterator-utilities';
 *
 * assert(await isSortedAsync([1, 2, 2, 9]));
 * assert(!(await isSortedAsync([1, 3, 2, 4])));
 *
 * assert(await isSortedAsync([0]));
 * assert(await isSortedAsync([]));
 * assert(await isSortedAsync([0, 1, NaN]));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSortedAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<boolean> {
	return isSortedByAsync(iterable, defaultCompare);
}
