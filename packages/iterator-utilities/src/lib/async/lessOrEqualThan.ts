import { orderingIsGreater, type LexicographicComparison } from '../shared/_compare';
import { compareAsync } from './compare';
import type { AsyncIterableResolvable } from './from';

/**
 * Determines if the elements of `iterable` are {@link LexicographicComparison lexicographically} less or equal than
 * those of another.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 *
 * @example
 * ```typescript
 * import { lessOrEqualThanAsync } from '@sapphire/iterator-utilities';
 *
 * const x = [1, 2, 3, 4];
 * const y = [1, 4, 9, 16];
 * console.log(await lessOrEqualThanAsync([1], [1]));
 * // Output: false
 * console.log(await lessOrEqualThanAsync([1], [1, 2]));
 * // Output: true
 * console.log(await lessOrEqualThanAsync([1, 2], [1]));
 * // Output: false
 * console.log(await lessOrEqualThanAsync([1, 2], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function lessOrEqualThanAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<boolean> {
	const result = await compareAsync(iterable, other);
	return !orderingIsGreater(result);
}

export { lessOrEqualThanAsync as leAsync };
