import { from, type IterableResolvable } from './from';

/**
 * Returns the first value of an iterator.
 *
 * @param iterable The iterator to return the first value of.
 * @returns The first value of the iterator, or `undefined` if the iterator is empty.
 */
export function first<const ElementType>(iterable: IterableResolvable<ElementType>): ElementType | undefined {
	return from(iterable).next().value;
}
