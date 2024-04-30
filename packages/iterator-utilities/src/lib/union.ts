import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an iterable with the elements that are in either input iterable.
 *
 * @param iterables The iterators to combine.
 * @returns An iterator that yields the union of the provided iterators.
 *
 * @example
 * ```typescript
 * import { union } from '@sapphire/iterator-utilities';
 *
 * const iterable1 = [1, 2, 3];
 * const iterable2 = [3, 4, 5];
 * console.log([...union(iterable1, iterable2)]);
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export function* union<const ElementType>(...iterables: IterableResolvable<ElementType>[]): IterableIterator<ElementType> {
	const seen = new Set<ElementType>();
	for (const iterator of iterables) {
		for (const value of toIterableIterator(iterator)) {
			if (!seen.has(value)) {
				seen.add(value);
				yield value;
			}
		}
	}
}
