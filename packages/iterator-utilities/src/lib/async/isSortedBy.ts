import { assertFunction } from '../shared/_assertFunction';
import { compareIteratorElements, orderingIsGreater, type CompareByComparator } from '../shared/_compare';
import type { AsyncIterableResolvable } from './from';
import type { isSortedAsync } from './isSorted';
import type { isSortedByKeyAsync } from './isSortedByKey';
import { toAsyncIterableIterator } from './toIterableIterator';

/**
 * Checks if the elements of this iterator are sorted using the given comparator function.
 *
 * @seealso {@link isSortedAsync} for a version that uses the default comparator.
 * @seealso {@link isSortedByKeyAsync} for a version that allows custom key extractors.
 *
 * @param iterable The iterator to compare.
 *
 * @example
 * ```typescript
 * import { ascNumber, isSortedByAsync } from '@sapphire/iterator-utilities';
 *
 * assert(await isSortedByAsync([1, 2, 2, 9], ascNumber));
 * assert(!await isSortedByAsync([1, 2, 2, 9], ascNumber));
 *
 * assert(await isSortedByAsync([0], () => true));
 * assert(await isSortedByAsync([0], () => false));
 *
 * assert(await isSortedByAsync([], () => true));
 * assert(await isSortedByAsync([], () => false));
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function isSortedByAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	comparator: CompareByComparator<ElementType>
): Promise<boolean> {
	comparator = assertFunction(comparator);

	const iterator = toAsyncIterableIterator(iterable);
	const result = await iterator.next();
	if (result.done) return true;

	let previous = result.value;
	for await (const current of iterator) {
		const comparison = compareIteratorElements<ElementType>(previous, current, comparator);
		if (orderingIsGreater(comparison)) return false;

		previous = current;
	}

	return true;
}
