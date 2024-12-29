import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from '../shared/_compare';
import { defaultCompare } from '../shared/comparators';
import type { AsyncIterableResolvable } from './from';
import type { isSortedAsync } from './isSorted';
import type { isSortedByAsync } from './isSortedBy';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Checks if the elements of this iterator are sorted using the given key extraction function.
 *
 * Instead of comparing the iterator's elements directly, this function compares the keys of the elements, as determined
 * by `callbackFn`. Apart from that, it's equivalent to {@link isSortedAsync}; see its documentation for more information.
 *
 * @seealso {@link isSortedAsync} for a version that uses the default comparator.
 * @seealso {@link isSortedByAsync} for a version that allows custom comparators.
 *
 * @param iterable The iterator to compare.
 * @param callbackFn The function to extract the key from an element.
 *
 * @example
 * ```typescript
 * import { isSortedByKeyAsync } from '@sapphire/iterator-utilities';
 *
 * assert(await isSortedByKeyAsync(['c', 'bb', 'aaa'], (s) => s.length));
 * assert(!await isSortedByKeyAsync([-2, -1, 0, 3], (n) => Math.abs(n)));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function isSortedByKeyAsync<const ElementType, const MappedType>(
	iterable: AsyncIterableResolvable<ElementType>,
	callbackFn: (a: ElementType, index: number) => MappedType,
	comparator: CompareByComparator<MappedType> = defaultCompare
): Promise<boolean> {
	callbackFn = assertFunction(callbackFn);

	const iterator = toAsyncIterableIterator(iterable);
	const result = await iterator.next();
	if (result.done) return true;

	let previousKey = callbackFn(result.value, 0);
	let index = 1;
	for await (const current of iterator) {
		const currentKey = callbackFn(current, index++);
		const comparison = compareIteratorElements<MappedType>(previousKey, currentKey, comparator);
		if (orderingIsGreater(comparison)) return false;

		previousKey = currentKey;
	}

	return true;
}
