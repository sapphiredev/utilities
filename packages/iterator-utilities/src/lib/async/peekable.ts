import { fromAsync, type AsyncIterableResolvable } from './from';

/**
 * Creates an iterator that allows you to peek at the next element without advancing the iterator.
 *
 * @template ElementType The type of elements in the iterable.
 * @param iterable The iterable to create a peekable iterator from.
 * @returns A new peekable iterator.
 *
 * @example
 * ```typescript
 * import { peekableAsync } from '@sapphire/iterator-utilities';
 *
 * const iterable = [1, 2, 3, 4, 5];
 * const peekableIterator = peekableAsync(iterable);
 *
 * console.log(await peekableIterator.next());
 * // Output: { value: 1, done: false }
 *
 * console.log(await peekableIterator.peek());
 * // Output: { value: 2, done: false }
 *
 * console.log(await peekableIterator.next());
 * // Output: { value: 2, done: false }
 *
 * console.log(await peekableIterator.next());
 * // Output: { value: 3, done: false }
 * ```
 */
export function peekableAsync<const ElementType>(iterable: AsyncIterableResolvable<ElementType>): AsyncPeekable<ElementType> {
	const resolvedIterable = fromAsync(iterable);
	let peeked: IteratorResult<ElementType> | undefined;
	return {
		async next() {
			if (peeked) {
				const value = peeked;
				peeked = undefined;
				return value;
			}

			return resolvedIterable.next();
		},
		async peek() {
			return (peeked ??= await resolvedIterable.next());
		},
		[Symbol.asyncIterator]() {
			return this as AsyncIterableIterator<ElementType>;
		}
	};
}

export interface AsyncPeekable<T> extends AsyncIterableIterator<T> {
	peek(): Promise<IteratorResult<T>>;
}
