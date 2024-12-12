import { assertFunction } from '../shared/_assertFunction';
import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Consumes the iterable and creates two arrays, one with the elements that pass the test and another with the elements that don't.
 *
 * @param iterable An iterator to partition.
 * @param predicate A function that determines which partition an element belongs to.
 * @returns An array containing two iterators. The first iterator contains elements that satisfy the predicate, and the
 * second iterator contains elements that do not.
 *
 * @example
 * ```typescript
 * import { partition } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const [even, odd] = partition(iterable, (value) => value % 2 === 0);
 *
 * console.log(even);
 * // Output: [2, 4]
 *
 * console.log(odd);
 * // Output: [1, 3, 5]
 * ```
 *
 * @remarks
 *
 * This function collects all elements of the provided iterator into two arrays based on the predicate before returning
 * them, which may not be desirable for large iterators.
 */
export function partition<const ElementType, const FilteredType extends ElementType>(
	iterable: IterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => value is FilteredType
): [FilteredType[], Exclude<ElementType, FilteredType>[]];
export function partition<const ElementType>(
	iterable: IterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => boolean
): [ElementType[], ElementType[]];

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
