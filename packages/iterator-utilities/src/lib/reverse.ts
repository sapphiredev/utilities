import { collect } from './collect';
import type { IterableResolvable } from './from';

/**
 * Consumes the iterable and returns a new iterable with the elements in reverse order.
 *
 * @param iterable The iterator to reverse.
 * @returns An iterator whose element correspond to the elements of the provided iterator in reverse order.
 *
 * @example
 * ```typescript
 * import { reverse } from '@sapphire/iterator-utilities';
 *
 * console.log([...reverse([1, 2, 3, 4, 5])]);
 * // Output: [5, 4, 3, 2, 1]
 *
 * console.log([...reverse('hello')]);
 * // Output: ['o', 'l', 'l', 'e', 'h']
 * ```
 *
 * @remarks
 *
 * This function collects all elements of the provided iterator into an array before yielding them in reverse order.
 */
export function* reverse<const ElementType>(iterable: IterableResolvable<ElementType>): IterableIterator<ElementType> {
	const items = collect(iterable);
	for (let i = items.length - 1; i >= 0; i--) {
		yield items[i];
	}
}
