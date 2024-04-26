import { assertNotNegative } from './common/assertNotNegative';
import { toIntegerOrInfinityOrThrow } from './common/toIntegerOrInfinityOrThrow';
import { empty } from './empty';
import { toArray } from './toArray';

/**
 * Returns a new iterator that contains the last `count` elements from `iterator`.
 *
 * @param iterator An iterator to take values from.
 * @param limit The number of values to take from the end of the iterator.
 * @returns An iterator that contains the last `count` elements of the provided iterator.
 */
export function takeLast<const ElementType>(iterator: IterableIterator<ElementType>, limit: number): IterableIterator<ElementType> {
	const integerLimit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (integerLimit === 0) return empty();

	const array = toArray(iterator);
	let i = array.length - integerLimit;
	return {
		next() {
			if (i >= array.length) {
				return { done: true, value: undefined };
			}

			return { done: false, value: array[i++] };
		},
		[Symbol.iterator]() {
			return this;
		}
	};
}
