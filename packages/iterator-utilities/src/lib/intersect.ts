import { filter } from './filter';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements that are in both input iterables.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to include in the result.
 *
 * @example
 * ```typescript
 * import { intersect } from '@sapphire/iterator-utilities';
 *
 * const iterable = intersect([1, 2, 3, 4, 5], [3, 4, 5, 6, 7]);
 * console.log([...iterable]);
 * // Output: [3, 4, 5]
 * ```
 *
 * @remarks
 *
 * This function consumes the entire `second` iterator to build the set of elements to intersect with `first`.
 *
 * @seealso {@link difference} for the opposite behavior.
 */
export function intersect<const ElementType>(
	first: IterableResolvable<ElementType>,
	second: IterableResolvable<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(toIterableIterator(second));
	return filter(first, (value) => set.has(value));
}
