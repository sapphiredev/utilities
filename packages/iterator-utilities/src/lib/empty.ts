import { makeIterableIterator } from './shared/_makeIterableIterator';

/**
 * Creates an empty iterator.
 *
 * @returns An empty iterator.
 *
 * @example
 * ```typescript
 * import { empty } from '@sapphire/iterator-utilities';
 *
 * const iterable = empty();
 * console.log([...iterable]);
 * // Output: []
 * ```
 */
export function empty<const ElementType = never>(): IterableIterator<ElementType> {
	return makeIterableIterator<ElementType>(() => ({ done: true, value: undefined }));
}
