import { chain } from './chain';
import type { IterableResolvable } from './from';

/**
 * Appends the values of the provided iterables to the end of the provided iterator.
 *
 * @param iterable The iterator to append values to.
 * @param iterables The iterables to append to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 */
export function append<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	...iterables: IterableResolvable<ElementType>[]
): IterableIterator<ElementType> {
	return chain(iterable, ...iterables);
}

export { append as concat };
