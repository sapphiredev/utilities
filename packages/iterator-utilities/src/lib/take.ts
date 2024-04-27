import { empty } from './empty';
import { from, type IterableResolvable } from './from';
import { assertNotNegative } from './shared/assertNotNegative';
import { makeIterableIterator } from './shared/makeIterableIterator';
import { toIntegerOrInfinityOrThrow } from './shared/toIntegerOrInfinityOrThrow';

/**
 * Takes the first `limit` values from the iterator.
 *
 * @param iterable The iterator to take values from.
 * @param limit The maximum number of values to take from the iterator.
 * @returns An iterator that yields at most `limit` values from the provided iterator.
 */
export function take<const ElementType>(iterable: IterableResolvable<ElementType>, limit: number): IterableIterator<ElementType> {
	limit = assertNotNegative(toIntegerOrInfinityOrThrow(limit), limit);
	if (limit === 0) return empty();

	let i = 0;
	const resolvedIterable = from(iterable);
	return makeIterableIterator<ElementType>(() =>
		i >= limit //
			? { done: true, value: undefined }
			: (i++, resolvedIterable.next())
	);
}
