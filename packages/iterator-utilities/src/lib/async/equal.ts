import { equalByAsync } from './equalBy';
import type { AsyncIterableResolvable } from './from';

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
 * console.log(await equalAsync([1], [1]));
 * // Output: true
 * console.log(await equalAsync([1], [1, 2]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function equalAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<boolean> {
	return equalByAsync(iterable, other, (a, b) => a === b);
}

export { equalAsync as eqAsync };
