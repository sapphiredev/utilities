import { chain } from './chain';

/**
 * Appends the values of the provided iterables to the end of the provided iterator.
 *
 * @param iterator The iterator to append values to.
 * @param iterators The iterables to append to the iterator.
 * @returns An iterator that yields the values of the provided iterator followed by the values of the provided iterables.
 */
export function append<const ElementType>(
	iterator: IterableIterator<ElementType>,
	...iterators: IterableIterator<ElementType>[]
): IterableIterator<ElementType> {
	return chain(iterator, ...iterators);
}

export { append as concat };
