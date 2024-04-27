import { filter } from './filter';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements of the first iterable that are not in the second iterable.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to exclude from the result.
 *
 * @example
 * ```typescript
 * import { except } from '@sapphire/iterator-utilities';
 *
 * const first = [1, 2, 3, 4, 5];
 * const second = [3, 4, 5, 6, 7];
 * console.log([...except(first, second)]);
 * // Output: [1, 2]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire `second` iterator to build the set of elements to exclude from `first`.
 */
export function except<const ElementType>(
	first: IterableResolvable<ElementType>,
	second: IterableResolvable<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(toIterableIterator(second));
	return filter(first, (value) => !set.has(value));
}
