import { assertPositive } from '../shared/_assertPositive';
import { makeAsyncIterableIterator } from '../shared/_makeAsyncIterableIterator';
import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterator starting at the same point, but stepping by the given amount at each iteration.
 *
 * @param iterable An iterator to map over.
 * @param step A positive integer representing the step to take at each iteration.
 *
 * @example
 * ```typescript
 * import { stepByAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterator = stepByAsync([0, 1, 2, 3, 4, 5], 2);
 * console.log(collectAsync(iterator));
 * // Output: [0, 2, 4]
 * ```
 *
 * @remarks
 *
 * The first element of the iterator will always be returned, regardless of the step given.
 */
export function stepByAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>, step: number): AsyncIterableIterator<ElementType> {
	step = assertPositive(toIntegerOrInfinityOrThrow(step), step);

	const iterator = fromAsync(iterable);
	return makeAsyncIterableIterator<ElementType>(async () => {
		const result = await iterator.next();
		if (result.done) {
			return { done: true, value: undefined };
		}

		for (let i = 0; i < step - 1; i++) {
			const result = await iterator.next();
			if (result.done) break;
		}

		return { done: false, value: result.value };
	});
}
