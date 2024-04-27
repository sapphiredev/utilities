import { makeIterableIterator } from './shared/makeIterableIterator';

/**
 * Creates a new empty iterator.
 *
 * @returns An empty iterator.
 */
export function empty<const ElementType = never>(): IterableIterator<ElementType> {
	return makeIterableIterator<ElementType>(() => ({ done: true, value: undefined }));
}
