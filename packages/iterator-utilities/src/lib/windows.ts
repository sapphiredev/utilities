import { from, type IterableResolvable } from './from';
import { assertPositive } from './shared/_assertPositive';
import { makeIterableIterator } from './shared/_makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow';

/**
 * Creates an iterable with arrays of `count` elements representing a sliding window.
 *
 * @param iterable The iterator to take values from.
 * @param count The maximum number of values in the window.
 * @returns An iterator that yields windows with `count` values from the provided iterator.
 *
 * @example
 * ```typescript
 * import { windows } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...windows(iterable, 2)]);
 * // Output: [[1, 2], [2, 3], [3, 4], [4, 5]]
 * ```
 */
export function windows<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType[]> {
	count = assertPositive(toIntegerOrInfinityOrThrow(count), count);

	const buffer = [] as ElementType[];
	const resolvedIterable = from(iterable);
	return makeIterableIterator<ElementType[]>(() => {
		while (buffer.length !== count) {
			const result = resolvedIterable.next();
			if (result.done) return { done: true, value: undefined };

			buffer.push(result.value);
		}

		const value = buffer.slice();
		buffer.shift();
		return { done: false, value };
	});
}
