import { from, type IterableResolvable } from './from';

/**
 * Determines whether an iterator is empty.
 *
 * @param iterable The iterator to check for emptiness.
 * @returns `true` if the iterator is empty; otherwise, `false`.
 */
export function isEmpty<const ElementType>(iterable: IterableResolvable<ElementType>): boolean {
	return from(iterable).next().done ?? false;
}
