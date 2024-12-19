import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import { maxByAsync } from './maxBy';
import type { maxByKeyAsync } from './maxByKey';

/**
 * Consumes the iterable and returns the highest number element. If the iterable is empty, it returns `null`.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link maxByAsync} instead.
 *
 * @seealso {@link maxByAsync} for a version that allows custom comparators.
 * @seealso {@link maxByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @returns The maximum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { maxAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await maxAsync(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function maxAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<ElementType | null> {
	return maxByAsync(iterable, defaultCompare);
}
