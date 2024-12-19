import type { LexicographicComparison } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import { compareBy } from './compareBy';
import type { IterableResolvable } from './from';

/**
 * {@link LexicographicComparison Lexicographically} compares the elements of both iterators are equal.
 *
 * This function uses the default comparator (lexicographically), which means it will compare the elements as strings.
 * If this is undesirable, use {@link compareBy} instead.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal.
 *
 * @example
 * ```typescript
 * import { compare } from '@sapphire/iterator-utilities';
 *
 * console.log(compare([1], [1]));
 * // Output: 0
 * console.log(compare([1], [1, 2]));
 * // Output: -1
 * console.log(compare([1, 2], [1]));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function compare<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	other: IterableResolvable<ElementType>
): LexicographicComparison {
	return compareBy(iterable, other, defaultCompare);
}
