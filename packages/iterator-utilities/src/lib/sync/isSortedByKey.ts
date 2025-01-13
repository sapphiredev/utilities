import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import type { IterableResolvable } from './from';
import type { isSorted } from './isSorted';
import type { isSortedBy } from './isSortedBy';
import { toIterableIterator } from './toIterableIterator';

/**
 * Checks if the elements of this iterator are sorted using the given key extraction function.
 *
 * Instead of comparing the iterator's elements directly, this function compares the keys of the elements, as determined
 * by `callbackFn`. Apart from that, it's equivalent to {@link isSorted}; see its documentation for more information.
 *
 * @seealso {@link isSorted} for a version that uses the default comparator.
 * @seealso {@link isSortedBy} for a version that allows custom comparators.
 *
 * @param iterable The iterator to compare.
 * @param callbackFn The function to extract the key from an element.
 *
 * @example
 * ```typescript
 * import { isSortedByKey } from '@sapphire/iterator-utilities';
 *
 * assert(isSortedByKey(['c', 'bb', 'aaa'], (s) => s.length));
 * assert(!isSortedBy([-2, -1, 0, 3], (n) => Math.abs(n)));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function isSortedByKey<const ElementType, const MappedType>(
	iterable: IterableResolvable<ElementType>,
	callbackFn: (a: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare
): boolean {
	callbackFn = assertFunction(callbackFn);

	const iterator = toIterableIterator(iterable);
	const result = iterator.next();
	if (result.done) return true;

	let previousKey = callbackFn(result.value, 0);
	let index = 1;
	for (const current of iterator) {
		const currentKey = callbackFn(current, index++);
		const comparison = compareIteratorElements<MappedType>(previousKey, currentKey, comparator);
		if (orderingIsGreater(comparison)) return false;

		previousKey = currentKey;
	}

	return true;
}
