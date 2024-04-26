import { toNumberOrThrow } from './common/toNumberOrThrow';
import type { IterableResolvable } from './from';
import { map } from './map';

/**
 * Computes the sum of an iterator of number values.
 *
 * @param iterable An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 */
export function sum(iterable: IterableResolvable<number>) {
	let sum = 0;
	for (const value of map(iterable, toNumberOrThrow)) {
		sum += value;
	}

	return sum;
}
