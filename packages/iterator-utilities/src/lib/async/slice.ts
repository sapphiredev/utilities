import { toIntegerOrInfinityOrThrow } from '../shared/_toIntegerOrInfinityOrThrow';
import { dropAsync } from './drop';
import { dropLastAsync } from './dropLast';
import { emptyAsync } from './empty';
import type { AsyncIterableResolvable } from './from';
import { takeAsync } from './take';
import { takeLastAsync } from './takeLast';

/**
 * Produces an iterable with the elements from the `start` index to the `end` index (exclusive).
 *
 * @param iterable The iterator to slice.
 * @param start The index at which to begin extraction.
 * @param end The index at which to end extraction.
 * @returns An iterator that contains the elements of the provided iterator from `start` to `end`.
 *
 * @example
 * ```typescript
 * import { sliceAsync, collectAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = sliceAsync([1, 2, 3, 4, 5], 1, 3);
 * console.log(await collectAsync(iterable));
 * // Output: [2, 3]
 * ```
 *
 * @example
 * ```typescript
 * const iterable = sliceAsync([1, 2, 3, 4, 5], -2);
 * console.log(await collectAsync(iterable));
 * // Output: [4, 5]
 * ```
 *
 * @example
 * ```typescript
 * const iterable = sliceAsync([1, 2, 3, 4, 5], 2);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 4, 5]
 * ```
 *
 * @example
 * ```typescript
 * const iterable = sliceAsync([1, 2, 3, 4, 5], 2, -1);
 * console.log(await collectAsync(iterable));
 * // Output: [3, 4]
 * ```
 *
 * @example
 * ```typescript
 * const iterable = sliceAsync([1, 2, 3, 4, 5], -2, -1);
 * console.log(await collectAsync(iterable));
 * // Output: [4]
 * ```
 *
 * @example
 * ```typescript
 * const iterable = sliceAsync([1, 2, 3, 4, 5], 2, 1);
 * console.log(await collectAsync(iterable));
 * // Output: []
 * ```
 *
 * @remarks
 *
 * This function consumes the input iterator based on the `start` and `end` values, therefore, you should not use the
 * original iterator after calling this function.
 */
export function sliceAsync<const ElementType>(
	iterable: AsyncIterableResolvable<ElementType>,
	start?: number,
	end?: number
): AsyncIterableIterator<ElementType> {
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	start = toIntegerOrInfinityOrThrow(start ?? 0);
	if (start === Number.NEGATIVE_INFINITY) {
		start = 0;
	}

	// 1. If end is not provided, `slice` behaves like `drop` or `takeLast`,
	// depending on the sign of `start`:
	if (end === undefined) {
		return start >= 0 //
			? dropAsync(iterable, start)
			: takeLastAsync(iterable, -start);
	}

	end = toIntegerOrInfinityOrThrow(end);
	// 2. If end is negative:
	if (end < 0) {
		// 2.1. If `end` is `-Infinity`, end would be `0`, which will always
		// result on an empty iterator:
		if (end === Number.NEGATIVE_INFINITY) {
			return emptyAsync();
		}

		// 2.2. If start is positive, drop the last n elements:
		if (start === 0) {
			return dropLastAsync(iterable, -end);
		}

		// 2.3. If the start is positive, drop the first n elements and take the
		// last m elements:
		if (start >= 0) {
			return dropLastAsync(dropAsync(iterable, start), -end);
		}

		// 2.4. If the start is the same or greater than the end, return an
		// empty iterator:
		if (start >= end) {
			return emptyAsync();
		}

		// 2.5. `start` and `end` are negative, take the elements between the
		// start and end:
		return takeAsync(takeLastAsync(iterable, -start), end - start);
	}

	// 3.0. If `start` is greater than or equal to `end`, return an empty iterator:
	if (start >= end) return emptyAsync();

	// 4.0. Otherwise, take the elements between `start` and `end`:
	return end === Number.POSITIVE_INFINITY //
		? dropAsync(iterable, start)
		: takeAsync(dropAsync(iterable, start), end - start);
}
