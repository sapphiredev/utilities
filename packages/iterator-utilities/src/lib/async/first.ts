import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Consumes the first element of the iterable, returning it if it's found and `undefined` otherwise.
 *
 * @param iterable The iterator to return the first value of.
 * @returns The first value of the iterator, or `undefined` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { firstAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(firstAsync(iterable));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the first value of the iterator.
 */
export async function firstAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<ElementType | undefined> {
	return (await fromAsync(iterable).next()).value;
}
