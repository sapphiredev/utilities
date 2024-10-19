import { compare } from './compare';
import type { IterableResolvable } from './from';
import { orderingIsLess, type LexicographicComparison } from './shared/_compare';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} less than those of
 * another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { lessThan } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(lessThan([1], [1]));
 * // Output: false
 * console.log(lessThan([1], [1, 2]));
 * // Output: true
 * console.log(lessThan([1, 2], [1]));
 * // Output: false
 * console.log(lessThan([1, 2], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function lessThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	const result = compare(iterable, other);
	return orderingIsLess(result);
}

export { lessThan as lt };
