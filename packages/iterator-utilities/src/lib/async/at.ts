import { assertNotNegative } from '../shared/_assertNotNegative';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { dropAsync } from './drop';
import { firstAsync } from './first';
import type { AsyncIterableResolvable } from './from';

/**
 * Advances the iterable to the `n`th element and returns it. If the iterable is exhausted before reaching the `n`th element, it returns `undefined`.
 *
 * @param iterable An iterator to return an element from.
 * @param index The index of the element to retrieve.
 * @returns The element at the specified index, or `undefined` if the index is out of range.
 *
 * @example
 * ```typescript
 * import { atAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await atAsync(iterable, 2));
 * // Output: 3
 * ```
 *
 * @remarks
 *
 * This function consumes the input iterator up to the specified index.
 */
export function atAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, index: number): Promise<ElementType | undefined> {
	index = assertNotNegative(toIntegerOrInfinityOrThrow(index), index);
	return firstAsync(index === 0 ? iterable : dropAsync(iterable, index));
}
