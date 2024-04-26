import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Returns an iterator that yields the entries of each iterator.
 *
 * @param iterables An iterator to map.
 * @returns An iterator that yields the entries of each iterator.
 */
export function* flat<const ElementType>(iterables: IterableResolvable<IterableResolvable<ElementType>>): IterableIterator<ElementType> {
	for (const value of toIterableIterator(iterables)) {
		yield* toIterableIterator(value);
	}
}
