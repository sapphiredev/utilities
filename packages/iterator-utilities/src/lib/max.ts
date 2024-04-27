import type { IterableResolvable } from './from';
import { map } from './map';
import { toNumberOrThrow, type NumberResolvable } from './shared/_toNumberOrThrow';

/**
 * Consumes the iterable and returns the maximum element. If the iterable is empty, it returns `null`.
 *
 * @param iterable An iterator of number values to determine the maximum value of.
 * @returns The maximum value in the input iterator, or `null` if the iterator is empty or contains only non-number values.
 *
 * @example
 * ```typescript
 * import { max } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log(max(iterable));
 * // Output: 5
 * ```
 *
 * @remarks
 *
 * This function consumes the entire iterator.
 */
export function max(iterable: IterableResolvable<NumberResolvable>): number | null {
	let max: number | null = null;
	for (const value of map(iterable, toNumberOrThrow)) {
		if (max === null || value > max) max = value;
	}

	return max;
}
