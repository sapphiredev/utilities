import type { IterableResolvable } from './from';
import { toIterableIterator } from './toIterableIterator';

/**
 * Creates an infinite iterable by cycling through the elements of the input iterable.
 *
 * @param iterable An iterator to cycle over.
 *
 * @example
 * ```typescript
 * import { cycle } from '@sapphire/iterator-utilities';
 *
 * const iterable = cycle([1, 2, 3]);
 * for (const element of iterable) {
 * 	console.log(element);
 * 	// Output: 1, 2, 3, 1, 2, 3, 1, 2, 3, ...
 * }
 * ```
 */
export function* cycle<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const results = [] as ElementType[];
	for (const element of toIterableIterator(iterable)) {
		yield element;
		results.push(element);
	}

	while (results.length > 0) {
		for (const element of results) {
			yield element;
		}
	}
}
