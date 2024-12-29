import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsLess, type CompareByComparator } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import type { minAsync } from './min';
import type { minByAsync } from './minBy';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Returns the element that gives the minimum value from the specified function.
 *
 * If several elements are equally minimum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link minAsync} for a version that uses the default comparator.
 * @seealso {@link minByAsync} for a version that allows custom comparators.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the minimum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { minByKeyAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(await minByKeyAsync(iterable, (value) => Math.abs(value)));
 * // Output: 0
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function minByKeyAsync<const ElementType, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare
): Promise<ElementType | null> {
	callbackFn = assertFunction(callbackFn);

	const iterator = toAsyncIterableIterator(iterable);
	const first = await iterator.next();
	if (first.done) return null;

	let minimum = first.value;
	let minimumKey = callbackFn(minimum, 0);
	let index = 1;
	for await (const value of iterator) {
		const key = callbackFn(value, index++);
		const comparison = compareIteratorElements<MappedType>(minimumKey, key, comparator);

		if (!orderingIsLess(comparison)) {
			minimum = value;
			minimumKey = key;
		}
	}

	return minimum;
}
