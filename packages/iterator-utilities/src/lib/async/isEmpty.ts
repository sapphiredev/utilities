import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Advances the iterable once, returning `true` if it's exhausted and `false` otherwise.
 *
 * @param iterable The iterator to check for emptiness.
 * @returns `true` if the iterator is empty; otherwise, `false`.
 *
 * @example
 * ```typescript
 * import { isEmptyAsync } from '@sapphire/iterator-utilities';
 *
 * console.log(await isEmptyAsync([]));
 * // Output: true
 *
 * console.log(await isEmptyAsync([1, 2, 3, 4, 5]));
 * // Output: false
 * ```
 *
 * @remarks
 *
 * This function consumes the first value of the iterator.
 */
export async function isEmptyAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<boolean> {
	return (await fromAsync(iterable).next()).done ?? false;
}
