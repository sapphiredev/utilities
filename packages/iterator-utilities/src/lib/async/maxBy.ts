import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsLess, type CompareByComparator } from '../shared/_compare';
import type { AsyncIterableResolvable } from './from';
import type { maxAsync } from './max';
import type { maxByKeyAsync } from './maxByKey';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Returns the element that gives the maximum value with respect to the specified comparison function.
 *
 * If several elements are equally maximum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link maxAsync} for a version that uses the default comparator.
 * @seealso {@link maxByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @param comparator A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the maximum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { ascNumber, maxByAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(await maxByAsync(iterable, ascNumber));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function maxByAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	comparator: CompareByComparator<ElementType>
): Promise<ElementType | null> {
	comparator = assertFunction(comparator);

	const iterator = toAsyncIterableIterator(iterable);
	const first = await iterator.next();
	if (first.done) return null;

	let maximum = first.value;
	for await (const value of iterator) {
		const comparison = compareIteratorElements<ElementType>(value, maximum, comparator);
		if (!orderingIsLess(comparison)) {
			maximum = value;
		}
	}

	return maximum;
}
