import { toNumberOrThrow } from './common/toNumberOrThrow';
import { map } from './map';

/**
 * Calculates the product of the elements in the input iterator.
 *
 * @param iterator An iterator to calculate the product of.
 * @returns The product of the elements in the input iterator.
 */
export function product(iterator: IterableIterator<number>) {
	let result = 1;
	for (const value of map(iterator, toNumberOrThrow)) {
		result *= value;
	}

	return result;
}
