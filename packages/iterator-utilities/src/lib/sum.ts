import type { IterableResolvable } from './from';
import { map } from './map';
import { toNumberOrThrow, type NumberResolvable } from './shared/toNumberOrThrow';

/**
 * Computes the sum of an iterator of number values.
 *
 * @param iterable An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 */
export function sum(iterable: IterableResolvable<NumberResolvable>) {
	let sum = 0;
	for (const value of map(iterable, toNumberOrThrow)) {
		sum += value;
	}

	return sum;
}
