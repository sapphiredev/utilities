import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Produces the set union of multiple iterators, deduplicating identical values.
 *
 * @param iterables The iterators to combine.
 * @returns An iterator that yields the union of the provided iterators.
 */
export function* union<const ElementType>(...iterables: IterableResolvable<ElementType>[]): IterableIterator<ElementType> {
	const seen = new Set<ElementType>();
	for (const iterator of iterables) {
		for (const value of toIterableIterator(iterator)) {
			if (!seen.has(value)) {
				seen.add(value);
				yield value;
			}
		}
	}
}
