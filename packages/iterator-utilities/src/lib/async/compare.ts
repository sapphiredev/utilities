import type { LexicographicComparison } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import { compareByAsync } from './compareBy';
import type { AsyncIterableResolvable } from './from';

/**
 * {@link LexicographicComparison Lexicographically} compares the elements of both iterators are equal.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link compareByAsync} instead.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal.
 *
 * @example
 * ```typescript
 * import { compareAsync } from '@sapphire/iterator-utilities';
 *
 * console.log(await compareAsync([1], [1]));
 * // Output: 0
 * console.log(await compareAsync([1], [1, 2]));
 * // Output: -1
 * console.log(await compareAsync([1, 2], [1]));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function compareAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<LexicographicComparison> {
	return compareByAsync(iterable, other, defaultCompare);
}
