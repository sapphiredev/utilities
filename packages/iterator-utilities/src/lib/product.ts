import { toNumberOrThrow } from './common/toNumberOrThrow';
import type { IterableResolvable } from './from';
import { map } from './map';

/**
 * Calculates the product of the elements in the input iterator.
 *
 * @param iterable An iterator to calculate the product of.
 * @returns The product of the elements in the input iterator.
 */
export function product(iterable: IterableResolvable<number>) {
	let result = 1;
	for (const value of map(iterable, toNumberOrThrow)) {
		result *= value;
	}

	return result;
}
