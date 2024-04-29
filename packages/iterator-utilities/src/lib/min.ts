import type { IterableResolvable } from './from';
import { map } from './map';
import { toNumberOrThrow, type NumberResolvable } from './shared/_toNumberOrThrow';

/**
 * Consumes the iterable and returns the lowest number element. If the iterable is empty, or contains only non-number values, it returns `null`.
 *
 * @param iterable An iterator of number values to determine the minimum value of.
 * @returns The minimum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { min } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(min(iterable));
 * // Output: 1
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function min(iterable: IterableResolvable<NumberResolvable>): number | null {
	let min: number | null = null;
	for (const value of map(iterable, toNumberOrThrow)) {
		if (min === null || value < min) min = value;
	}

	return min;
}
