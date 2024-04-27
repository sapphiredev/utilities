import type { IterableResolvable } from './from';
import { assertFunction } from './shared/assertFunction';
import { toIterableIterator } from './toIterableIterator';

export function partition<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => value is FilteredType
): [FilteredType[], Exclude<ElementType, FilteredType>[]];
export function partition<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => boolean
): [ElementType[], ElementType[]];

/**
 * Partitions an iterator into two iterators based on a predicate.
 *
 * @param iterable An iterator to partition.
 * @param predicate A function that determines which partition an element belongs to.
 * @returns An array containing two iterators. The first iterator contains elements that satisfy the predicate, and the
 * second iterator contains elements that do not.
 */
export function partition<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => boolean
): [ElementType[], ElementType[]] {
	predicate = assertFunction(predicate);

	const bufferLeft: ElementType[] = [];
	const bufferRight: ElementType[] = [];

	let index = 0;
	for (const value of toIterableIterator(iterable)) {
		if (predicate(value, index++)) {
			bufferLeft.push(value);
		} else {
			bufferRight.push(value);
		}
	}

	return [bufferLeft, bufferRight];
}
