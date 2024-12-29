import { toNumberOrThrow, type NumberResolvable } from '../shared/_toNumberOrThrow';
import type { AsyncIterableResolvable } from './from';
import { mapAsync } from './map';

/**
 * Consumes the iterable and returns the sum of all the elements.
 *
 * @param iterable An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 *
 * @example
 * ```typescript
 * import { sumAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await sumAsync(iterable));
 * // Output: 15
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function sumAsync(iterable: AsyncIterableResolvable<NumberResolvable>) {
	let sum = 0;
	for await (const value of mapAsync(iterable, toNumberOrThrow)) {
		sum += value;
	}

	return sum;
}
