import { orderingIsGreater, type LexicographicComparison } from '../shared/_compare';
import { compareAsync } from './compare';
import type { AsyncIterableResolvable } from './from';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} greater than those of
 * another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { greaterThanAsync } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(await greaterThanAsync([1], [1]));
 * // Output: false
 * console.log(await greaterThanAsync([1], [1, 2]));
 * // Output: false
 * console.log(await greaterThanAsync([1, 2], [1]));
 * // Output: true
 * console.log(await greaterThanAsync([1, 2], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function greaterThanAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<boolean> {
	const result = await compareAsync(iterable, other);
	return orderingIsGreater(result);
}

export { greaterThanAsync as gtAsync };
