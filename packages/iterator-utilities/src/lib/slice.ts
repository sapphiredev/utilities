import { drop } from './drop';
import { dropLast } from './dropLast';
import { empty } from './empty';
import type { IterableResolvable } from './from';
import { toIntegerOrInfinityOrThrow } from './shared/toIntegerOrInfinityOrThrow';
import { take } from './take';
import { takeLast } from './takeLast';

/**
 * Creates a new iterator that contains the elements of the provided iterator from `start` to `end`, this function is
 * similar to the `Array.prototype.slice` method.
 *
 * @param iterable The iterator to slice.
 * @param start The index at which to begin extraction.
 * @param end The index at which to end extraction.
 * @returns An iterator that contains the elements of the provided iterator from `start` to `end`.
 */
export function slice<const ElementType>(iterable: IterableResolvable<ElementType>, start?: number, end?: number): IterableIterator<ElementType> {
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	start = toIntegerOrInfinityOrThrow(start ?? 0);
	if (start === Number.NEGATIVE_INFINITY) {
		start = 0;
	}

	// 1. If end is not provided, `slice` behaves like `drop` or `takeLast`,
	// depending on the sign of `start`:
	if (end === undefined) {
		return start >= 0 //
			? drop(iterable, start)
			: takeLast(iterable, -start);
	}

	end = toIntegerOrInfinityOrThrow(end);
	// 2. If end is negative:
	if (end < 0) {
		// 2.1. If `end` is `-Infinity`, end would be `0`, which will always
		// result on an empty iterator:
		if (end === Number.NEGATIVE_INFINITY) {
			return empty();
		}

		// 2.2. If start is positive, drop the last n elements:
		if (start === 0) {
			return dropLast(iterable, -end);
		}

		// 2.3. If the start is positive, drop the first n elements and take the
		// last m elements:
		if (start >= 0) {
			return dropLast(drop(iterable, start), -end);
		}

		// 2.4. If the start is the same or greater than the end, return an
		// empty iterator:
		if (start >= end) {
			return empty();
		}

		// 2.5. `start` and `end` are negative, take the elements between the
		// start and end:
		return take(takeLast(iterable, -start), end - start);
	}

	// 3.0. If `start` is greater than or equal to `end`, return an empty iterator:
	if (start >= end) return empty();

	// 4.0. Otherwise, take the elements between `start` and `end`:
	return end === Number.POSITIVE_INFINITY //
		? drop(iterable, start)
		: take(drop(iterable, start), end - start);
}
