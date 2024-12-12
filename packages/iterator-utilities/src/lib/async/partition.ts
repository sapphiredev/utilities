import { assertFunction } from '../shared/_assertFunction';
import type { Awaitable } from '../shared/_types';
import type { AsyncIterableResolvable } from './from';
import { toAsyncIterableIterator } from './toIterableIterator';

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
 * import { partitionAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const [even, odd] = await partitionAsync(iterable, (value) => value % 2 === 0);
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
export function partitionAsync<const ElementType, const FilteredType extends ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => value is FilteredType
): Promise<[FilteredType[], Exclude<ElementType, FilteredType>[]]>;
export function partitionAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => Awaitable<boolean>
): Promise<[ElementType[], ElementType[]]>;

export async function partitionAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	predicate: (value: ElementType, index: number) => Awaitable<boolean>
): Promise<[ElementType[], ElementType[]]> {
	predicate = assertFunction(predicate);

	const bufferLeft: ElementType[] = [];
	const bufferRight: ElementType[] = [];

	let index = 0;
	for await (const value of toAsyncIterableIterator(iterable)) {
		if (await predicate(value, index++)) {
			bufferLeft.push(value);
		} else {
			bufferRight.push(value);
		}
	}

	return [bufferLeft, bufferRight];
}
