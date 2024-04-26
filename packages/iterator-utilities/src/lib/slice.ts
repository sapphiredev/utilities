import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { drop } from './drop';
import { empty } from './empty';
import { take } from './take';
import { takeLast } from './takeLast';
import { toArray } from './toArray';

/**
 * Creates a new iterator that contains the elements of the provided iterator from `start` to `end`, this function is
 * similar to the `Array.prototype.slice` method.
 *
 * @param iterator The iterator to slice.
 * @param start The index at which to begin extraction.
 * @param end The index at which to end extraction.
 * @returns An iterator that contains the elements of the provided iterator from `start` to `end`.
 */
export function* slice<const ElementType>(iterator: IterableIterator<ElementType>, start?: number, end?: number): IterableIterator<ElementType> {
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	let relativeStart = toIntegerOrInfinityOrThrow(start ?? 0);
	if (relativeStart === Number.NEGATIVE_INFINITY) {
		relativeStart = 0;
	} else if (relativeStart < 0) {
		yield* toArray(iterator).slice(start, end);
		return;
	}

	const relativeEnd = toIntegerOrInfinityOrThrow(end ?? Number.POSITIVE_INFINITY);
	if (relativeEnd === Number.NEGATIVE_INFINITY) {
		// [].slice(0, -Infinity) will always return [], because relativeEnd gets assigned to 0
		return empty();
	}

	// If end is negative, take the last n elements using `takeLast`:
	if (relativeEnd < 0) {
		return takeLast(drop(iterator, relativeStart), -relativeEnd);
	}

	// If start is greater than or equal to end, return an empty iterator:
	if (relativeStart >= relativeEnd) return empty();

	// Otherwise, take the elements between start and end:
	return take(drop(iterator, relativeStart), relativeEnd - relativeStart);
}
