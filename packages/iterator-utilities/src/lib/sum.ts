import type { IterableResolvable } from './from';
import { map } from './map';
import { toNumberOrThrow, type NumberResolvable } from './shared/_toNumberOrThrow';

/**
 * Consumes the iterable and returns the sum of all the elements.
 *
 * @param iterable An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 *
 * @example
 * ```typescript
 * import { sum } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(sum(iterable));
 * // Output: 15
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function sum(iterable: IterableResolvable<NumberResolvable>) {
	let sum = 0;
	for (const value of map(iterable, toNumberOrThrow)) {
		sum += value;
	}

	return sum;
}
