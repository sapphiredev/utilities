import { toNumberOrThrow } from './common/toNumberOrThrow';
import { map } from './map';

/**
 * Computes the average of a sequence of numbers.
 *
 * @param iterator The iterator to calculate the average of.
 * @returns The average of the sequence of numbers, or `null` if the sequence is empty or contains only non-number values.
 */
export function average(iterator: IterableIterator<number>): number | null {
	let sum = 0;
	let total = 0;
	for (const value of map(iterator, toNumberOrThrow)) {
		sum += value;
		total++;
	}

	return total === 0 ? null : sum / total;
}
