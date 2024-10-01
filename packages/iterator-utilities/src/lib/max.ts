import type { IterableResolvable } from './from';
import { maxBy } from './maxBy';
import type { maxByKey } from './maxByKey';
import { defaultCompare } from './shared/comparators';

/**
 * Consumes the iterable and returns the highest number element. If the iterable is empty, it returns `null`.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link maxBy} instead.
 *
 * @seealso {@link maxBy} for a version that allows custom comparators.
 * @seealso {@link maxByKey} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @returns The maximum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { max } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(max(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function max<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType | null {
	return maxBy(iterable, defaultCompare);
}
