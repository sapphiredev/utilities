import { chain } from './chain';
import type { IterableResolvable } from './from';

/**
 * Appends iterables to the end of the first iterable, returning a new iterable combining all of them. It's similar to concatenating arrays or doing `[...a, ...b, ...c]`.
 *
 * @param iterable The iterator to append values to.
 * @param iterables The iterables to append to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 *
 * @example
 * ```typescript
 * import { append } from '@sapphire/iterator-utilities';
 *
 * const iterable = append([1, 2, 3], [4, 5, 6], [7, 8, 9]);
 * console.log([...iterable]);
 * // Output: [1, 2, 3, 4, 5, 6, 7, 8, 9]
 * ```
 */
export function append<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	...iterables: IterableResolvable<ElementType>[]
): IterableIterator<ElementType> {
	return chain(iterable, ...iterables);
}

export { append as concat };
