import { toArray } from './toArray';

/**
 * Creates a new iterator that yields the values of the provided iterator in sorted order.
 *
 * @param iterator An iterator to sort.
 * @param compareFn A function that defines the sort order. If omitted, the values are sorted in ascending order.
 * @returns An iterator that yields the values of the provided iterator in sorted order.
 */
export function sorted<const ElementType>(
	iterator: IterableIterator<ElementType>,
	compareFn?: (a: ElementType, b: ElementType) => number
): IterableIterator<ElementType> {
	const values = toArray(iterator).sort(compareFn);
	return values.values();
}
