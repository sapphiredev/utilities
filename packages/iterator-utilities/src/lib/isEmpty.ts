import { from, type IterableResolvable } from './from';

/**
 * Advances the iterable once, returning `true` if it's exhausted and `false` otherwise.
 *
 * @param iterable The iterator to check for emptiness.
 * @returns `true` if the iterator is empty; otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { isEmpty } from '@sapphire/iterator-utilities';
 *
 * console.log(isEmpty([]));
 * // Output: true
 *
 * console.log(isEmpty([1, 2, 3, 4, 5]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the first value of the iterator.
 */
export function isEmpty<const ElementType>(iterable: IterableResolvable<ElementType>): boolean {
	return from(iterable).next().done ?? false;
}
