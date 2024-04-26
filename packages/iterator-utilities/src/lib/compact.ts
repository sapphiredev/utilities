import { filter } from './filter';
import type { IterableResolvable } from './from';

/**
 * Returns an iterator that contains only the non-null and non-undefined elements of the input iterator.
 * @param iterable An iterator that contains elements to be compacted.
 */
export function compact<const ElementType>(iterable: IterableResolvable<ElementType | null | undefined>): IterableIterator<ElementType> {
	return filter(iterable, (value): value is ElementType => value !== null && value !== undefined);
}
