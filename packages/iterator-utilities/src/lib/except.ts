import { filter } from './filter';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Produces the set difference of two sequences.
 *
 * @param first An iterator to return elements from.
 * @param second An iterator that contains elements to exclude from the result.
 */
export function except<const ElementType>(
	first: IterableResolvable<ElementType>,
	second: IterableResolvable<ElementType>
): IterableIterator<ElementType> {
	const set = new Set(toIterableIterator(second));
	return filter(first, (value) => !set.has(value));
}
