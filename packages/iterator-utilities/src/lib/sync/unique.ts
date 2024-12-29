import type { IterableResolvable } from './from';
import { union } from './union';

/**
 * Creates an iterable with the unique elements of the input iterable. Under the hood, it calls {@linkcode union} with the iterable itself.
 *
 * @param iterable An iterator to remove duplicates from.
 * @returns An iterator that yields the values of the provided iterator with duplicates removed.
 *
 * @example
 * ```typescript
 * import { unique } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5];
 * console.log([...unique(iterable)]);
 * // Output: [1, 2, 3, 4, 5]
 * ```
 */
export function unique<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	// The union of a single iterator is the iterator itself, with duplicates removed.
	return union(iterable);
}
