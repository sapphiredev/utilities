import { toNumberOrThrow } from './common/toNumberOrThrow';
import { map } from './map';

/**
 * Computes the sum of an iterator of number values.
 *
 * @param iterator An iterator of numbers to calculate the sum of.
 * @returns The sum of the numbers in the input iterator.
 */
export function sum(iterator: IterableIterator<number>) {
	let sum = 0;
	for (const value of map(iterator, toNumberOrThrow)) {
		sum += value;
	}

	return sum;
}
