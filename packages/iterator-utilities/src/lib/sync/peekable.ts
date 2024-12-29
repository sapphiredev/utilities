import { from, type IterableResolvable } from './from';

/**
 * Creates an iterator that allows you to peek at the next element without advancing the iterator.
 *
 * @template ElementType The type of elements in the iterable.
 * @param iterable The iterable to create a peekable iterator from.
 * @returns A new peekable iterator.
 *
 * @example
 * ```typescript
 * import { peekable } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const peekableIterator = peekable(iterable);
 *
 * console.log(peekableIterator.next());
 * // Output: { value: 1, done: false }
 *
 * console.log(peekableIterator.peek());
 * // Output: { value: 2, done: false }
 *
 * console.log(peekableIterator.next());
 * // Output: { value: 2, done: false }
 *
 * console.log(peekableIterator.next());
 * // Output: { value: 3, done: false }
 * ```
 */
export function peekable<const ElementType>(iterable: IterableResolvable<ElementType>): Peekable<ElementType> {
	const resolvedIterable = from(iterable);
	let peeked: IteratorResult<ElementType> | undefined;
	return {
		next() {
			if (peeked) {
				const value = peeked;
				peeked = undefined;
				return value;
			}

			return resolvedIterable.next();
		},
		peek() {
			return (peeked ??= resolvedIterable.next());
		},
		[Symbol.iterator]() {
			return this as IterableIterator<ElementType>;
		}
	};
}

export interface Peekable<T> extends IterableIterator<T> {
	peek(): IteratorResult<T>;
}
