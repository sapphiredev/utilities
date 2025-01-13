import { equalAsync } from './equal';
import type { AsyncIterableResolvable } from './from';

/**
 * Determines if the elements of both iterators are not equal.
 *
 * @param iterable The iterator to compare.
 * @param other The iterator to compare against.
 * @returns Whether the two iterators are not equal.
 *
 * @example
 * ```typescript
 * import { notEqualAsync } from '@sapphire/iterator-utilities';
 *
 * console.log(await notEqualAsync([1], [1]));
 * // Output: false
 * console.log(await notEqualAsync([1], [1, 2]));
 * // Output: true
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function notEqualAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	other: AsyncIterableResolvable<ElementType>
): Promise<boolean> {
	return !(await equalAsync(iterable, other));
}

export { notEqualAsync as neAsync };
