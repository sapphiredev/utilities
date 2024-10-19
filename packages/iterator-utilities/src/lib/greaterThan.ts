import { compare } from './compare';
import type { IterableResolvable } from './from';
import { orderingIsGreater, type LexicographicComparison } from './shared/_compare';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} greater than those of
 * another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { greaterThan } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(greaterThan([1], [1]));
 * // Output: false
 * console.log(greaterThan([1], [1, 2]));
 * // Output: false
 * console.log(greaterThan([1, 2], [1]));
 * // Output: true
 * console.log(greaterThan([1, 2], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function greaterThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	const result = compare(iterable, other);
	return orderingIsGreater(result);
}

export { greaterThan as gt };
