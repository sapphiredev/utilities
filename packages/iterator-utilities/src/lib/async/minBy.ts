import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from '../shared/_compare';
import type { AsyncIterableResolvable } from './from';
import type { minAsync } from './min';
import type { minByKeyAsync } from './minByKey';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Returns the element that gives the minimum value with respect to the specified comparison function.
 *
 * If several elements are equally minimum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link minAsync} for a version that uses the default comparator.
 * @seealso {@link minByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the minimum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { ascNumber, minByAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(await minByAsync(iterable, ascNumber));
 * // Output: -10
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function minByAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	comparator: CompareByComparator<ElementType>
): Promise<ElementType | null> {
	comparator = assertFunction(comparator);

	const iterator = toAsyncIterableIterator(iterable);
	const first = await iterator.next();
	if (first.done) return null;

	let minimum = first.value;
	for await (const value of iterator) {
		const comparison = compareIteratorElements<ElementType>(value, minimum, comparator);

		if (!orderingIsGreater(comparison)) {
			minimum = value;
		}
	}

	return minimum;
}
