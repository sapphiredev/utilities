import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import type { maxAsync } from './max';
import type { maxByAsync } from './maxBy';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Returns the element that gives the maximum value from the specified function.
 *
 * If several elements are equally maximum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link maxAsync} for a version that uses the default comparator.
 * @seealso {@link maxByAsync} for a version that allows custom comparators.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @param callbackFn A function to execute for each element produced by the iterator, producing a key to compare with.
 * @param comparator A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the maximum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { maxByKeyAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(await maxByKeyAsync(iterable, (value) => Math.abs(value)));
 * // Output: -10
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function maxByKeyAsync<const ElementType, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare
): Promise<ElementType | null> {
	callbackFn = assertFunction(callbackFn);

	const iterator = toAsyncIterableIterator(iterable);
	const first = await iterator.next();
	if (first.done) return null;

	let maximum = first.value;
	let maximumKey = callbackFn(maximum, 0);
	let index = 1;
	for await (const value of iterator) {
		const key = callbackFn(value, index++);
		const comparison = compareIteratorElements<MappedType>(maximumKey, key, comparator);

		if (!orderingIsGreater(comparison)) {
			maximum = value;
			maximumKey = key;
		}
	}

	return maximum;
}
