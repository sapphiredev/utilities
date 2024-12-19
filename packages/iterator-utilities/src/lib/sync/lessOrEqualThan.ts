import { orderingIsGreater, type LexicographicComparison } from '../shared/_compare';
import { compare } from './compare';
import type { IterableResolvable } from './from';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} less or equal than
 * those of another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { lessOrEqualThan } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(lessOrEqualThan([1], [1]));
 * // Output: false
 * console.log(lessOrEqualThan([1], [1, 2]));
 * // Output: true
 * console.log(lessOrEqualThan([1, 2], [1]));
 * // Output: false
 * console.log(lessOrEqualThan([1, 2], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function lessOrEqualThan<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	const result = compare(iterable, other);
	return !orderingIsGreater(result);
}

export { lessOrEqualThan as le };
