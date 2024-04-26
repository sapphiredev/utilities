import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Prepends the values of the provided iterables to the start of the provided iterator.
 *
 * @param iterable The iterator to prepend values to.
 * @param iterables The iterables to prepend to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
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
