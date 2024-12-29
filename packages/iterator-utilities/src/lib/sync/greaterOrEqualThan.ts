import { orderingIsLess, type LexicographicComparison } from '../shared/_compare';
import { compare } from './compare';
import type { IterableResolvable } from './from';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} greater or equal than
 * those of another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { greaterOrEqualThan } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(greaterOrEqualThan([1], [1]));
 * // Output: true
 * console.log(greaterOrEqualThan([1], [1, 2]));
 * // Output: false
 * console.log(greaterOrEqualThan([1, 2], [1]));
 * // Output: true
 * console.log(greaterOrEqualThan([1, 2], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function greaterOrEqualThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	const result = compare(iterable, other);
	return !orderingIsLess(result);
}

export { greaterOrEqualThan as ge };
