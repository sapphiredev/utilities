import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterator with the provided iterables prepended to the first iterable.
 *
 * @param iterable The iterator to prepend values to.
 * @param iterables The iterables to prepend to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 *
 * @example
 * ```typescript
 * import { prepend } from '@sapphire/iterator-utilities';
 *
 * console.log([...prepend([3, 4, 5], [1, 2])]);
 * // Output: [1, 2, 3, 4, 5]
 * ```
 *
 * @seealso {@link append} to append values to the end of an iterator.
 */
export function* prepend<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	...iterables: IterableResolvable<ElementType>[]
): IterableIterator<ElementType> {
	for (const iterable of iterables) {
		yield* toIterableIterator(iterable);
	}

	yield* toIterableIterator(iterable);
}
