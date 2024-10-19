import type { IterableResolvable } from './from';
import type { min } from './min';
import type { minBy } from './minBy';
import { assertFunction } from './shared/_assertFunction';
import { compareIteratorElements, orderingIsLess, type CompareByComparator } from './shared/_compare';
import { defaultCompare } from './shared/comparators';
import { toIterableIterator } from './toIterableIterator';

/**
 * Returns the element that gives the minimum value from the specified function.
 *
 * If several elements are equally minimum, the last element is returned. If the iterator is empty, `null` is returned.
 *
 * @seealso {@link min} for a version that uses the default comparator.
 * @seealso {@link minBy} for a version that allows custom comparators.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @param callbackFn A function to execute for each element produced by the iterator. It should return a number value.
 * @returns The element that gives the minimum value from the specified function, or `null` if the iterator is empty.
 *
 * @example
 * ```typescript
 * import { minByKey } from '@sapphire/iterator-utilities';
 *
 * const iterable = [-3, 0, 1, 5, -10];
 * console.log(minByKey(iterable, (value) => Math.abs(value)));
 * // Output: 0
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function minByKey<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (element: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare
): ElementType | null {
	callbackFn = assertFunction(callbackFn);

	const iterator = toIterableIterator(iterable);
	const first = iterator.next();
	if (first.done) return null;

	let minimum = first.value;
	let minimumKey = callbackFn(minimum, 0);
	let index = 1;
	for (const value of iterator) {
		const key = callbackFn(value, index++);
		const comparison = compareIteratorElements<MappedType>(minimumKey, key, comparator);

		if (!orderingIsLess(comparison)) {
			minimum = value;
			minimumKey = key;
		}
	}

	return minimum;
}
