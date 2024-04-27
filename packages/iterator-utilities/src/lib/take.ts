import { empty } from './empty';
import { from, type IterableResolvable } from './from';
import { assertNotNegative } from './shared/_assertNotNegative';
import { makeIterableIterator } from './shared/_makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from './shared/_toIntegerOrInfinityOrThrow';

/**
 * Creates an iterable with the first `count` elements.
 *
 * @param iterable The iterator to take values from.
 * @param count The maximum number of values to take from the iterator.
 * @returns An iterator that yields at most `count` values from the provided iterator.
 *
 * @example
 * ```typescript
 * import { take } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * console.log([...take(iterable, 2)]);
 * // Output: [1, 2]
 * ```
 */
export function take<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType> {
	count = assertNotNegative(toIntegerOrInfinityOrThrow(count), count);
	if (count === 0) return empty();

	let i = 0;
	const resolvedIterable = from(iterable);
	return makeIterableIterator<ElementType>(() =>
		i >= count //
			? { done: true, value: undefined }
			: (i++, resolvedIterable.next())
	);
}
