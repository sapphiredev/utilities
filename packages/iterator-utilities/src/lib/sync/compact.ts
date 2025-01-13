import { filter } from './filter';
import type { IterableResolvable } from './from';

/**
 * Creates a new iterable that yields all the non-nullish values (`null` and `undefined`) from the iterable.
 *
 * @param iterable An iterator that contains elements to be compacted.
 *
 * @example
 * ```typescript
 * import { compact } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, null, 2, undefined, 3];
 * console.log([...compact(iterable)]);
 * // Output: [1, 2, 3]
 * ```
 */
export function compact<const ElementType>(iterable: IterableResolvable<ElementType | null | undefined>): IterableIterator<ElementType> {
	return filter(iterable, (value): value is ElementType => value !== null && value !== undefined);
}
