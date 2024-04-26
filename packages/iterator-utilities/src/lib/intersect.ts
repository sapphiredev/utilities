import { filter } from './filter';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Produces the set intersection of two iterators.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to include in the result.
 */
export function intersect<const ElementType>(
	first: IterableResolvable<ElementType>,
	second: IterableResolvable<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(toIterableIterator(second));
	return filter(first, (value) => set.has(value));
}
