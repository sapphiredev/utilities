import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Chains together multiple iterators.
 *
 * @param iterables The iterators to chain together.
 * @returns An iterator that yields the values of the provided iterators in order.
 */
export function* chain<const ElementType>(...iterables: IterableResolvable<ElementType>[]): IterableIterator<ElementType> {
	for (const iterable of iterables) {
		yield* toIterableIterator(iterable);
	}
}
