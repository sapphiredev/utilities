import { orderingIsLess, type LexicographicComparison } from '../shared/_compare';
import { compareAsync } from './compare';
import type { AsyncIterableResolvable } from './from';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} less than those of
 * another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { lessThanAsync } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(await lessThanAsync([1], [1]));
 * // Output: false
 * console.log(await lessThanAsync([1], [1, 2]));
 * // Output: true
 * console.log(await lessThanAsync([1, 2], [1]));
 * // Output: false
 * console.log(await lessThanAsync([1, 2], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function lessThanAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<boolean> {
	const result = await compareAsync(iterable, other);
	return orderingIsLess(result);
}

export { lessThanAsync as ltAsync };
