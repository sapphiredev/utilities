import { from, type IterableResolvable } from './from';
import { repeat } from './repeat';
import { assertNotNegative } from './shared/_assertNotNegative';
import { makeIterableIterator } from './shared/_makeIterableIterator';
import { toIntegerOrThrow } from './shared/_toIntegerOrThrow';
import { toArray } from './toArray';

/**
 * Creates `count` independent iterators from the input iterable.
 *
 * @param iterable An iterator to tee.
 * @param count The number of iterators to create.
 * @returns An array of `count` iterators that each yield the same values as the input iterator.
 *
 * @example
 * ```typescript
 * import { tee } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const [iter1, iter2] = tee(iterable, 2);
 * console.log([...iter1]);
 * // Output: [1, 2, 3, 4, 5]
 *
 * console.log([...iter2]);
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export function tee<const ElementType>(iterable: IterableResolvable<ElementType>, count: number): IterableIterator<ElementType>[] {
	count = assertNotNegative(toIntegerOrThrow(count), count);
	if (count === 0) return [];

	const entries = [] as ElementType[];
	const indexes = toArray(repeat(0, count));
	const resolvedIterable = from(iterable);

	const iterables = [] as IterableIterator<ElementType>[];
	for (let i = 0; i < count; i++) {
		const iterable = makeIterableIterator<ElementType>(() => {
			if (indexes[i] >= entries.length) {
				const result = resolvedIterable.next();
				if (result.done) {
					return { done: true, value: undefined };
				}

				entries.push(result.value);
			}

			return { done: false, value: entries[indexes[i]++] };
		});

		iterables.push(iterable);
	}

	return iterables;
}
