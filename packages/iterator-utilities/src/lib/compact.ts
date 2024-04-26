import { filter } from './filter';

/**
 * Returns an iterator that contains only the non-null and non-undefined elements of the input iterator.
 * @param iterator An iterator that contains elements to be compacted.
 */
export function compact<const ElementType>(iterator: IterableIterator<ElementType | null | undefined>): IterableIterator<ElementType> {
	return filter(iterator, (value): value is ElementType => value !== null && value !== undefined);
}
