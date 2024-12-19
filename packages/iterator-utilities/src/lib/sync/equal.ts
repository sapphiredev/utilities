import { equalBy } from './equalBy';
import type { IterableResolvable } from './from';

/**
 * Determines if the elements of both iterators are equal.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are equal.
 *
 * @example
 * ```typescript
 * import { equal } from '@sapphire/iterator-utilities';
 *
 * console.log(equal([1], [1]));
 * // Output: true
 * console.log(equal([1], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function equal<const ElementType>(iterable: IterableResolvable<ElementType>, other: IterableResolvable<ElementType>): boolean {
	return equalBy(iterable, other, (a, b) => a === b);
}

export { equal as eq };
