import { toNumberOrThrow, type NumberResolvable } from '../shared/_toNumberOrThrow';
import type { AsyncIterableResolvable } from './from';
import { mapAsync } from './map';

/**
 * Consumes the iterable and returns the average value of all the elements. If the iterable is empty, it returns `null`.
 *
 * @param iterable The iterator to calculate the average of.
 * @returns The average of the sequence of numbers, or `null` if the sequence is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { averageAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(await averageAsync(iterable));
 * // Output: 3
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export async function averageAsync(iterable: AsyncIterableResolvable<NumberResolvable>): Promise<number | null> {
	let sum = 0;
	let total = 0;
	for await (const value of mapAsync(iterable, toNumberOrThrow)) {
		sum += value;
		total++;
	}

	return total === 0 ? null : sum / total;
}
