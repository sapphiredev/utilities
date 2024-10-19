import type { IterableResolvable } from './from';
import { minBy } from './minBy';
import type { minByKey } from './minByKey';
import { defaultCompare } from './shared/comparators';

/**
 * Consumes the iterable and returns the lowest number element. If the iterable is empty, it returns `null`.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link minBy} instead.
 *
 * @seealso {@link minBy} for a version that allows custom comparators.
 * @seealso {@link minByKey} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @returns The minimum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { min } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(min(iterable));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function min<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType | null {
	return minBy(iterable, defaultCompare);
}
