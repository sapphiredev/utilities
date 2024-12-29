import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import { minByAsync } from './minBy';
import type { minByKeyAsync } from './minByKey';

/**
 * Consumes the iterable and returns the lowest number element. If the iterable is empty, it returns `null`.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link minByAsync} instead.
 *
 * @seealso {@link minByAsync} for a version that allows custom comparators.
 * @seealso {@link minByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @returns The minimum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { minAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await minAsync(iterable));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function minAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<ElementType | null> {
	return minByAsync(iterable, defaultCompare);
}
