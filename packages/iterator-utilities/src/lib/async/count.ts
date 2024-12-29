import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Consumes the iterable and returns the number of elements.
 *
 * @param iterable An iterator that contains elements to be counted.
 * @returns The number of elements in the input iterator.
 *
 * @example
 * ```typescript
 * import { countAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(countAsync(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function countAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): Promise<number> {
	let count = 0;
	const resolvedIterable = fromAsync(iterable);
	while (!(await resolvedIterable.next()).done) {
		count++;
	}

	return count;
}
