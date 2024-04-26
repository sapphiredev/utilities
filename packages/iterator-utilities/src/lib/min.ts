import { toNumberOrThrow } from './common/toNumberOrThrow';
import { map } from './map';

/**
 * Returns the minimum value in an iterator of numbers.
 *
 * @param iterator An iterator of number values to determine the minimum value of.
 * @returns The minimum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 */
export function min(iterator: IterableIterator<number>): number | null {
	let min: number | null = null;
	for (const value of map(iterator, toNumberOrThrow)) {
		if (min === null || value < min) min = value;
	}

	return min;
}
